class Graph {
    vertices;

    constructor() {
        this.vertices = new Map();
    }

    addVertex(vertex) {
        if (this.vertices.has(vertex)) return false;
        this.vertices.set(vertex, {
            data: {},
            edges: [],
        });
        return true;
    }

    addEdge(src, dest) {
        if (!this.vertices.has(src) || !this.vertices.has(dest))
            return false;
        this.vertices.get(src).edges.push(dest);
        return true;
    }

    setVertexData(vertex, data) {
        if (!this.vertices.has(vertex)) return false;
        this.vertices.get(vertex).data = data;
        return true;
    }

    getVertexData(vertex) {
        if (!this.vertices.has(vertex)) return false;
        return this.vertices.get(vertex).data;
    }

    deleteVertex(vertex) {
        if (!this.vertices.has(vertex)) return false;
        this.vertices.delete(vertex);
        return true;
    }

    getSize() {
        return this.vertices.size;
    }

    hasVertex(name) {
        return this.vertices.has(name);
    }
}

class Stopwatch {
    ms;
    started;
    curr;
    prev;

    constructor() {
        this.reset();
    }
    
    start() {
        this.curr = 0;
        this.prev = 0;
        this.ms = 0;
        this.started = true;
    }

    reset() {
        this.ms = 0;
        this.started = false;
    }

    stop() {
        this.started = false;
    }

    resume() {
        this.started = true;
    }

    update() {
        this.prev = this.curr || Date.now();
        this.curr = Date.now();
        if (!this.started) return ;
        const deltaTime = this.curr - this.prev;
        this.ms += deltaTime;
    }

    getMs(){
        return this.ms;
    }
}

class AnimationController{
    state;
    animGraph;
    animSwatch;
    framingSwatch;
    params;

    constructor() {
        this.animGraph = new Graph();
        this.state = null;
        this.animSwatch = new Stopwatch();
        this.framingSwatch = new Stopwatch();
        this.initParams();
    }

    initParams() {
        this.params = {
            currFrame: 0,
            getAnimTime: this.animSwatch.getMs.bind(this.animSwatch),
        };
    }

    update() {
        if (!this.state) return;
        this.animSwatch.update();
        this.framingSwatch.update();
        this.updateFrame();
        this.updateAnimationState();
    }
    
    updateFrame() {
        const currAnim = this.animGraph.getVertexData(this.state);
        if (this.framingSwatch.getMs() < currAnim.frameInterval) return ;
        this.framingSwatch.start();
        this.params.currFrame++;
        if (this.params.currFrame < currAnim.sprites.length) return ;
        this.params.currFrame = currAnim.repeatable ? 0 : currAnim.sprites.length - 1;
    }

    updateAnimationState() {
        const currAnim = this.animGraph.getVertexData(this.state);
        for(let trans of currAnim.transitions) {
            if (!trans.isTransitionable(this.params)) continue;
            this.setAnimationState(trans.target);
            break;
        }
    }
    
    addAnimation(name) {
        if (this.animGraph.hasVertex(name)) return false;
        this.animGraph.addVertex(name);
        return true;
    }
    
    /***
     * @frameInterval pausing time between sprites (ms)
     */
    setAnimationData(name, sprites, repeatable=false, frameInterval=1000) {
        if (!this.animGraph.hasVertex(name)) return false;
        this.animGraph.setVertexData(name, {
            sprites: sprites,
            frameInterval: frameInterval,
            repeatable: repeatable,
            transitions: [],
        });
        return true;
    }
    
    connectAnimation(src, dest, isTransitionable) {
        this.animGraph.addEdge(src, dest);
        const srcData = this.animGraph.getVertexData(src);
        srcData.transitions.push({
            target: dest,
            isTransitionable: isTransitionable,
        });
        this.animGraph.setVertexData(src, srcData);
    }
    
    getCurrentSprite() {
        return this.animGraph.getVertexData(this.state).sprites[this.params.currFrame];
    }

    getCurrentFrame() {
        return this.params.currFrame;
    }

    getAnimationState() {
        return this.state;
    }

    setAnimationState(name) {
        if (!this.animGraph.hasVertex(name)) return false;
        this.state = name;
        this.initParams();
        this.animSwatch.start();
        this.framingSwatch.start();
        return true;
    }
}