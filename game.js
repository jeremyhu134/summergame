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
    }
};

//creats a game game object with the configuration
const game = new Phaser.Game(config);

//create a block-scoped object that stores variables that can be accessed in any scene
let gameState = {
    fireRate: 10,
    rateCooldown: 0,
    gameSpeed: 100,
    shoot: function(scene){
        if(gameState.rateCooldown >= gameState.fireRate){
            var bullet = gameState.bullets.create(gameState.tank.x,gameState.tank.y,`bullet`).setDepth(0).setScale(1);
            
            bullet.setVelocityY(-500);
            gameState.rateCooldown = 0;
        }
    },
    generateObstacle: function(scene){
        var check = scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                var rand = Math.ceil(Math.random()*2)
                if(rand == 1){
                    var obstacle = gameState.obstacles.create(Math.ceil(Math.random()*100)+50,-50,`wallObstacle`).setDepth(0).setScale(1.5).setVelocityY(gameState.gameSpeed);
                    obstacle.health = 100;
                    var max = obstacle.health;
                    obstacle.active = scene.physics.add.overlap(obstacle, gameState.bullets,(obstacle, bullet)=>{
                        bullet.destroy();
                        if(obstacle.health > 0.66*max){
                            obstacle.anims.play('wallObstacle1','true');
                        }else if(obstacle.health > 0.33*max){
                            obstacle.anims.play('wallObstacle2','true');
                        }else {
                            obstacle.anims.play('wallObstacle3','true');
                        }
                        obstacle.health -= 10;
                        var check = scene.time.addEvent({
                            delay: 50,
                            callback: ()=>{
                                if(obstacle.health <= 0){
                                    obstacle.anims.play('wallObstacle4','true');
                                    check.destroy();
                                    obstacle.active.destroy();
                                    scene.time.addEvent({
                                        delay: 3000,
                                        callback: ()=>{
                                            obstacle.destroy();
                                        },  
                                        startAt: 0,
                                        timeScale: 1
                                    });
                                }
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                    });
                }else if (rand == 2){
                    var obstacle = gameState.obstacles.create(Math.ceil(Math.random()*200)+50,-50,`wireObstacle`).setDepth(0).setScale(0.7).setVelocityY(gameState.gameSpeed);
                    obstacle.health = 50;
                    var max = obstacle.health;
                    obstacle.active = scene.physics.add.overlap(obstacle, gameState.bullets,(obstacle, bullet)=>{
                        bullet.destroy();
                        obstacle.anims.play('wireObstacle1','true');
                        obstacle.health -= 10;
                        var check = scene.time.addEvent({
                            delay: 50,
                            callback: ()=>{
                                if(obstacle.health <= 0){
                                    obstacle.anims.play('wireObstacle2','true');
                                    check.destroy();
                                    obstacle.active.destroy();
                                    scene.time.addEvent({
                                        delay: 3000,
                                        callback: ()=>{
                                            obstacle.destroy();
                                        },  
                                        startAt: 0,
                                        timeScale: 1
                                    });
                                }
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                    });
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
    }
}