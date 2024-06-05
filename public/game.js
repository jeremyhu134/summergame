//The configuration of your game that is a parameter of the Phaser.Game function
const config = {
    type: Phaser.AUTO,
    width : 800,
    height: 800,
    backgroundColor: "#999999",
    audio: {
        disableWebAudio: false 
      },
    //allows modification of the games physics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true
            //debug: true
        }
    },
    //subclass scenes 
    scene:[MenuScene,ArenaScene],
    //phasers scale system to fit into the brower
    scale: {
        zoom: 1,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoPause: false,
};

//creats a game game object with the configuration
const game = new Phaser.Game(config);

//create a block-scoped object that stores variables that can be accessed in any scene
let gameState = {
    fireRate: 10,
    rateCooldown: 0,
    gameSpeed: 100,
    createHealthBar: function(scene, object,maxHP){
        object.sprite.hbBG = scene.add.rectangle(object.sprite.x,(object.sprite.y-object.sprite.body.height/2)-20,100,10,0xff0000).setScale(object.sprite.body.width/100).setDepth(window.innerHeight);  
        object.sprite.hb = scene.add.rectangle(object.sprite.x,(object.sprite.y-object.sprite.body.height/2)-20,100,10,0x2ecc71).setScale(object.sprite.body.width/100).setDepth(window.innerHeight);
        object.checkHealth = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                
                if(object.health > 0){
                    object.sprite.hbBG.x = object.sprite.x;
                    object.sprite.hbBG.y = (object.sprite.y-object.sprite.body.height/2)-10;
                    object.sprite.hb.x = object.sprite.x;
                    object.sprite.hb.y = (object.sprite.y-object.sprite.body.height/2)-10;
                    object.sprite.hb.width = object.health/maxHP*100;
                } else {
                    //object.health = 100;
                }
                if(object.health == maxHP){
                    object.sprite.hb.visible = false;
                    object.sprite.hbBG.visible = false;
                }else{
                    object.sprite.hb.visible = true;
                    object.sprite.hbBG.visible = true;
                }
                if(object.sprite.health > maxHP){
                    object.sprite.health = maxHP;
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
        object.destroyHB = function(){
            object.hbBG.destroy();
            object.hb.destroy();
            object.checkHealth.destroy();
        }
    },
}