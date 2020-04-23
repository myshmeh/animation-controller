const spritesheet = new Image();
let sprites;
const spritesheetCol = 7;
const spritesheetRow = 2;
const spriteSize = 48;
let hp = 300;
spritesheet.onload = () => {
    const cib = [];
    for(let i = 0; i < spritesheetRow; i++)
        for(let j = 0; j < spritesheetCol; j++)
            cib.push(createImageBitmap(spritesheet, j * spriteSize, i * spriteSize, spriteSize, spriteSize));
    Promise.all(cib)
    .then(res => {
        sprites = res;

        animController.addAnimation('idle');
        animController.addAnimation('attack');
        animController.addAnimation('damaged');
        animController.addAnimation('dead');
        animController.setAnimationData('idle', sprites.slice(7, 12), true, 45);
        animController.setAnimationData('attack', sprites.slice(12, 13));
        animController.setAnimationData('damaged', sprites.slice(13, 14));
        animController.setAnimationData('dead', sprites.slice(13, 14));
        animController.connectAnimation('idle', 'attack', (params) => params.getAnimTime() > 1000);
        animController.connectAnimation('attack', 'idle', (params) => params.getAnimTime() > 600);
        animController.connectAnimation('damaged', 'idle', (params) => params.getAnimTime() > 600);
        animController.connectAnimation('idle', 'dead', (params) => hp <= 0);
        animController.connectAnimation('attack', 'dead', (params) => hp <= 0);
        animController.setAnimationState('damaged');

        animController2.addAnimation('idle');
        animController2.addAnimation('attack');
        animController2.addAnimation('damaged');
        animController2.addAnimation('dead');
        animController2.setAnimationData('idle', sprites.slice(0, 5), true, 45);
        animController2.setAnimationData('attack', sprites.slice(5, 6));
        animController2.setAnimationData('damaged', sprites.slice(6, 7));
        animController2.setAnimationData('dead', sprites.slice(6, 7));
        animController2.connectAnimation('idle', 'damaged', (params) => params.getAnimTime() > 1000);
        animController2.connectAnimation('damaged', 'attack', (params) => params.getAnimTime() > 600);
        animController2.connectAnimation('attack', 'idle', (params) => params.getAnimTime() > 600);
        animController2.connectAnimation('idle', 'dead', (params) => hp <= 0);
        animController2.connectAnimation('damaged', 'dead', (params) => hp <= 0);
        animController2.connectAnimation('attack', 'dead', (params) => hp <= 0);
        animController2.setAnimationState('idle');
    });
};
spritesheet.src = "spritesheet.png";
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const animController = new AnimationController();
const animController2 = new AnimationController();

setInterval(() => {
    /**
     * UPDATE
     */
    hp--;
    animController.update();
    animController2.update();
    /**
     * DRAW
     */
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 300, 300);
    if (!sprites) return ;
    ctx.drawImage(animController.getCurrentSprite(), 0, 0);
    ctx.drawImage(animController2.getCurrentSprite(), 48, 0);
    ctx.fillStyle = 'white';
    ctx.fillText(`${animController.getAnimationState()}`, 5, 60);
    ctx.fillText(`${animController2.getAnimationState()}`, 60, 60);
}, 17);