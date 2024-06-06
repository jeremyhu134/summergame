const socket = io();
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
        var inputText = this.add.dom(0, 0, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
        const div = document.createElement('div');
        div.style = 'background-color: rgba(0,255,0,0.2); width: 250px; height: 100px; font: 48px Arial; font-weight: bold';
        div.innerText = 'Phaser 3';
        gameState.input = this.input;
        gameState.mouse = this.input.mousePointer;
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ESC,RIGHT,LEFT');
        gameState.bullets = this.physics.add.group();
        gameState.enemyTanks = this.physics.add.group();
        
        this.cameras.main.setSize(800, 800);
        this.physics.world.setBounds(0, 0, 1600, 1600);
        this.add.sprite(0,0,'bg').setOrigin(0,0).setScale(1600);
        
        this.cameras.main.setFollowOffset(0, 0);
        gameState.tank = {
            sprite: null,
            health: 100,
            x: 300,
            y: 600,
            id: socket.id
        }
        gameState.shootReady = true;

        gameState.playerLoaded = false;
       
        var tanks = [];
        var bullets = [];
        
        function findTank (id,tanks){
            for(var i = 0; i < tanks.length; i++){
                if(tanks[i].id == id){
                    return i;
                }
            }
            return -1;
        }
        function findBullet (id,bullets){
            for(var i = 0; i < bullets.length; i++){
                if(bullets[i].id == id){
                    return i;
                }
            }
            return -1;
        }

        socket.on('connect',()=>{
            console.log("connected");
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server, reloading page...');
            window.location.reload();
        });

        socket.on('newPlayer',(tankdata)=>{
            var tankData = JSON.parse(tankdata);
            if(findTank(tankData.id,tanks) == -1){
                var tank = {
                    sprite: null,
                    health: tankData.health,
                    x: tankData.x,
                    y: tankData.y,
                    angle: tankData.angle,
                    id: tankData.id,
                }
                if(tank.id == socket.id){
                    gameState.tank.sprite = this.physics.add.sprite(tank.x,tank.y,`playerTank`).setDepth(1).setScale(1);
                    tank.sprite = gameState.tank.sprite;
                    this.cameras.main.startFollow(gameState.tank.sprite);
                    gameState.tank.sprite.setCollideWorldBounds(true);
                    gameState.playerLoaded = true;
                }else{
                    tank.sprite = this.physics.add.sprite(tank.x,tank.y,`enemyTank`).setDepth(1).setScale(1);
                }
                gameState.createHealthBar(this,tank,100);
                console.log(`Create player: ${tank.id}`);
                tanks.push(tank);
            }
        });

        socket.on('deletePlayer',(id)=>{
            var player = tanks[findTank(id,tanks)];
            var index = findTank(id,tanks);
            player.destroyHB();
            player.sprite.destroy();
            tanks.splice(index,index+1);
        });

        socket.on('updateTanks',(theTanks)=>{
            var sentTanks = JSON.parse(theTanks);
            for(var i = 0; i < sentTanks.length; i ++){
                var player = tanks[findTank(sentTanks[i].id,tanks)];
                player.health = sentTanks[i].health;
                var target = {
                    x : sentTanks[i].x,
                    y: sentTanks[i].y
                }
                this.physics.moveToObject(player.sprite,target,null,100);
                this.tweens.add({
                    targets: player.sprite,
                    angle: player.sprite.angle+Phaser.Math.Angle.ShortestBetween(player.sprite.angle,sentTanks[i].angle), // target angle
                    duration: 100, // duration in milliseconds
                    ease: 'Linear' // easing function
                });
                /*this.time.addEvent({
                    duration: 10,
                    callback: function () {
                        player.sprite.angle += pieces;
                    },
                    repeat: 10,
                    callbackScope: this
                });*/
            }
        });
        
        socket.on('updateShot',(bullet)=>{
            var sentBullet = JSON.parse(bullet);
            var player = tanks[findTank(sentBullet.tankOwner,tanks)];
            sentBullet.sprite = gameState.bullets.create(sentBullet.x,sentBullet.y,`pellet`).setDepth(0).setScale(1);
            sentBullet.sprite.id = sentBullet.id;
            if(gameState.shootReady == false){
                this.time.addEvent({
                    delay: 300,
                    callback: function () {
                        gameState.shootReady = true;
                    },
                    callbackScope: this
                });
            }
            bullets.push(sentBullet);
            for(var i = 0; i < tanks.length; i++){
                if(tanks[i].id != player.id){
                    function overlapCallback(tankObject,sentBullet){
                        return (bullet, tank)=>{
                            socket.emit('bulletHit',tankObject.id,JSON.stringify(sentBullet));
                            console.log("hit");
                            bullet.destroy();
                        }
                    }
                    this.physics.add.overlap(sentBullet.sprite, tanks[i].sprite,overlapCallback(tanks[i],sentBullet));
                }
            }
            
        });

        socket.on('updateBullets',(parsedBullets)=>{
            var sentBullets = JSON.parse(parsedBullets);
            for(var i = 0 ; i < bullets[i]; i++){
                if(findBullet(bullets[i],sentBullets) == -1){
                    bullets[i].sprite.destroy();
                    bullets.splice(i,i+1);
                }
            }
            for(var i = 0; i < sentBullets.length; i ++){
                var coorelatingBullet = bullets[findBullet(sentBullets[i].id,bullets)];
                var target = {
                    x : sentBullets[i].x,
                    y: sentBullets[i].y
                }
                this.physics.moveToObject(coorelatingBullet.sprite,target,null,100);
            }
        });

        
        gameState.bullets = this.physics.add.group();
        gameState.obstacles = this.physics.add.group();
        for(var i = 0; i < 16; i++){
            this.add.line(i*100,0,i,1600,0,0,0x808080).setOrigin(0,0);
        }
        for(var i = 0; i < 16; i++){
            this.add.line(0,i*100,i,0,1600,0,0x808080).setOrigin(0,0);
        }

        this.scene.launch('ScoreboardScene');

        socket.emit('connectToGame',socket.id);
        socket.on('')
    }
    update(time,delta){
        if(gameState.playerLoaded == true){
            if(gameState.mouse.isDown){
                if(gameState.shootReady == true){
                    gameState.shootReady = false;
                    socket.emit('shotFired',JSON.stringify(gameState.tank));
                }
            }
            if(gameState.keys.W.isDown){
                socket.emit('updateMovement',"w",JSON.stringify(delta));
            }
            else if(gameState.keys.S.isDown){
                socket.emit('updateMovement',"s",JSON.stringify(delta));
            }
            else {
                //socket.emit('updateMovement',JSON.stringify("none"));
            }
            
            if(gameState.keys.A.isDown){   
                socket.emit('updateMovement',"a",JSON.stringify(delta));
            }
            else if(gameState.keys.D.isDown){
                socket.emit('updateMovement',"d",JSON.stringify(delta));
            }    
        }
    }
}



class ScoreboardScene extends Phaser.Scene{
    constructor(){
        super({key: "ScoreboardScene"})
    }
    preload(){

    }
    create(){
        const rect = this.add.graphics();

        // Set the fill style and line style for the rectangle
        rect.fillStyle(0x000000, 1);

        // Draw the rounded rectangle
        const cornerRadius = 20; // Adjust the corner radius as needed
        rect.fillRoundedRect(20, 20, 210, 300, cornerRadius);
        rect.setAlpha(0.4);
        const text = this.add.text(30, 30, 'Killstreak ScoreBoard', {
            fontFamily: 'Helvetica', // Use the font-family name you used in preload
            fontSize: '20px',
            fill: '#ffffff'
        });

        var playerText = this.add.text(30, 70, '', {
            fontFamily: 'Helvetica', // Use the font-family name you used in preload
            fontSize: '15px',
            fill: '#ffffff'
        });
        var leaderBoard = [];

        socket.on("updateScoreboard",(tanks)=>{
            leaderBoard = [];
            playerText.setText('');
            var sentTanks = JSON.parse(tanks);
            //console.log(sentTanks.length);
            var killList = [];
            for(var i = 0; i < sentTanks.length;i++){
                killList.push(sentTanks[i].kills);
            }
            while(sentTanks.length > 0){
                var index = killList.indexOf(Math.max.apply(null,killList));
                leaderBoard.push(sentTanks[index]);
                sentTanks.splice(index,index+1);
                killList.splice(index,index+1);
            }

            for(var i = 0; i < leaderBoard.length; i++){
                var isyou = '';
                if(socket.id == leaderBoard[i].id){
                    isyou = "(YOU)";
                }
                playerText.setText(playerText.text+(i+1)+". "+leaderBoard[i].id.substring(0,10)+` ${isyou}  Kills: `+leaderBoard[i].kills+"\n");
            }
        });

    }
    update(){

    }
}