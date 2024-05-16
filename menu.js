//menu subclass
class MenuScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'MenuScene' })
	}
    //functions preloads sprites, images, and audio
    preload(){
        this.load.image('playerTank','images/playerTank.png');
        this.load.image('enemyTank','images/enemyTank.png');
        this.load.image('pellet','images/pellet.png');
        this.load.image('bg','images/whitePixel1x1.png');
        /*
        this.load.audio('click', 'audio/click.mp3');*/
    }
    create() {
        var scene = this;
        //set current scene to variable
        
    //audio
        //config for keeping sound loop
        gameState.loopSound = {
            loop: true,
            volume: .5
        }
        
        this.scene.start('ArenaScene');
        /*gameState.bgM = this.sound.add('menuBgMusic');
        gameState.bgM.setMute(false);
        gameState.bgM.play(gameState.loopSound,true);*/
        
        
        //Loading Animation
        
        /*this.anims.create({
            key: 'defaultTankRoll',
            frameRate: 30,
            repeat: -1,
            frames:this.anims.generateFrameNames('defaultTank',{start: 0,end: 3})
        });anims.generateFrameNames('wireObstacle',{start: 3,end: 3})*/
     
        
        /*
        //sets global scene to variable for inside local functions
        gameState.globalScene = this;
        //create and animate background
        var bg = this.physics.add.sprite(0,0,'background').setOrigin(0,0).setScale(window.innerHeight/675).setDepth(-100);
        bg.anims.play('bganimate','true');
        
        //add title
        var title = this.add.sprite(window.innerWidth/2,120,'titleImage').setScale(1);
        this.time.addEvent({
            delay: 3000,
            callback: ()=>{
                title.anims.play('moveTitle');
            },  
            startAt: 0,
            repeat: -1,
            timeScale: 1
        });
        
        
        var Ubutton = this.add.image(window.innerWidth/2+60,window.innerHeight/2+280,'upgradeButton').setInteractive();
        Ubutton.on('pointerdown', function(pointer){
            gameState.globalScene.scene.start('UpgradeScene');
        });
        Ubutton.on('pointerover', function(pointer){
            scene.sound.play('click',{volume: 5});
            Ubutton.setFrame(1);
        });
        Ubutton.on('pointerout', function(pointer){
            Ubutton.setFrame(0);
        });
        */
	}
    update(){
        //game loop that constantly runs (not needed for menu)
    }
}