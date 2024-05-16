//Create ArenaScene Phaser SubClass
class ArenaScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'ArenaScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create(){
        gameState.input = this.input;
        gameState.mouse = this.input.mousePointer;
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ESC,RIGHT,LEFT');
        
        this.cameras.main.setSize(800, 800);
        this.physics.world.setBounds(0, 0, 1600, 1600);
        this.add.sprite(0,0,'bg').setOrigin(0,0).setScale(1600);
        
        this.cameras.main.setFollowOffset(0, 0);
        gameState.tank = this.physics.add.sprite(600,300,`playerTank`).setDepth(1).setScale(1);
        this.cameras.main.startFollow(gameState.tank);
        //gameState.character.setSize(60,100);
        gameState.tank.anims.play('defaultTankRoll',true);
        gameState.tank.setCollideWorldBounds(true);
        gameState.bullets = this.physics.add.group();
        gameState.obstacles = this.physics.add.group();
        for(var i = 0; i < 16; i++){
            this.add.line(i*100,0,i*100,1600,0,0,0x808080).setOrigin(0,0);
        }
    }
    update(){
        if(gameState.keys.W.isDown){
            gameState.tank.setVelocityX(200*Math.cos(Math.PI*gameState.tank.angle/180));
            gameState.tank.setVelocityY(200*Math.sin(Math.PI*gameState.tank.angle/180));
        }
        else if(gameState.keys.S.isDown){
            gameState.tank.setVelocityX(-200*Math.cos(Math.PI*gameState.tank.angle/180));
            gameState.tank.setVelocityY(-200*Math.sin(Math.PI*gameState.tank.angle/180));
        }
        else {
            gameState.tank.setVelocityX(0);
            gameState.tank.setVelocityY(0);
        }
        
        if(gameState.keys.A.isDown){   
            gameState.tank.angle -= 3;
        }
        else if(gameState.keys.D.isDown){
            gameState.tank.angle += 3;
        }
        
    }
}
