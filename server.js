const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app,()=>{
    console.log('server created');
});

const io = socketio(server);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

var currentPlayers = [];
function findTankIndex(id){
    for(var i = 0; i < currentPlayers.length;i++){
        if(id == currentPlayers[i].id){
            return i;
        }
    }
    return -1;
}
function findBulletIndex(id){
    for(var i = 0; i < bullets.length;i++){
        if(id == bullets[i].id){
            return i;
        }
    }
    return -1;
}

var bullets = [];
var startID = 0;


io.on('connection',(socket)=>{
    console.log('a user connected', socket.id);
    var newTank = {
        health: 100,
        x: Math.random()*1400+100,
        y: Math.random()*1400+100,
        angle: 0,
        id: socket.id
    }

    currentPlayers.push(newTank);

    socket.on('connectToGame', (id)=>{
        //tell everyone else you join
       
        //get everyone else and they join you
        for(var i = 0; i < currentPlayers.length; i++){
            io.emit('newPlayer', JSON.stringify(currentPlayers[i]));
        }
        for(var i = 0; i < bullets.length; i++){
            io.emit('updateShot',JSON.stringify(bullets[i]));
        }
        console.log(currentPlayers);
    });
    

    socket.on('disconnect',()=>{
        console.log(`Player ${socket.id} has disconnected`);
        
        var index = findTankIndex(socket.id);
        if(index != -1){
            currentPlayers.splice(index,index+1);
        }else{
            console.log("Failed to delete");
        }
        socket.broadcast.emit('deletePlayer', socket.id);
        console.log(currentPlayers);
    });

    socket.on('updateMovement',(key)=>{
        var player = currentPlayers[findTankIndex(socket.id)];
        
        
        if(key == "w"){
            player.x += 5*Math.cos(Math.PI*player.angle/180);
            player.y += 5*Math.sin(Math.PI*player.angle/180);
        }else if (key == "s"){
            player.x -= 5*Math.cos(Math.PI*player.angle/180);
            player.y -= 5*Math.sin(Math.PI*player.angle/180);
        }else if (key == "a"){
            player.angle -= 3;
        }else if (key == "d"){
            player.angle += 3;
        }
        
        if(player.x > 1600){
            player.x = 1580;
        }else if (player.x < 0){
            player.x = 20;
        }

        if(player.y > 1600){
            player.y = 1580;
        }else if (player.y < 0){
            player.y = 20;
        }
    })

    socket.on('updateTanks',(tank)=>{
        var sentTank = JSON.parse(tank);
        var index = findTankIndex(sentTank.id);
        var selectedTank = currentPlayers[index];
        selectedTank.x = sentTank.x;
        selectedTank.y = sentTank.y;
        selectedTank.angle = sentTank.angle;
        
    })

    socket.on('shotFired',(tank)=>{
        var sentTank = JSON.parse(tank);
        var selectedTank = currentPlayers[findTankIndex(sentTank.id)];
        var bullet = {
            tankOwner: sentTank.id,
            id: startID,
            x: selectedTank.x,
            y: selectedTank.y,
            angle: selectedTank.angle
        };
        bullets.push(bullet);
        startID++;
        io.emit('updateShot',JSON.stringify(bullet));
    })

    socket.on('bulletHit',(tankid,bulletid)=>{
        var index = findBulletIndex(bulletid);
        bullets.splice(index,index+1);
        var index2 = findTankIndex(tankid);
        if(index != -1){
            currentPlayers[index2].health -= 20;
            if(currentPlayers[index2].health <= 0){
                currentPlayers[index2].x = Math.random()*1400+100;
                currentPlayers[index2].y = Math.random()*1400+100;
                currentPlayers[index2].health = 100;
            }
        }
    });

});

server.listen(PORT,()=>{
    console.log("Server listening...");
});

function callback(){
    io.emit('updateTanks',JSON.stringify(currentPlayers));
    for(var i = 0; i < bullets.length; i++){
        var bullet = bullets[i];
        bullet.x += 60*Math.cos(Math.PI*bullet.angle/180);
        bullet.y += 60*Math.sin(Math.PI*bullet.angle/180);
    }
    if(bullets.length > 0){
        io.emit('updateBullets',JSON.stringify(bullets));
    }
}

setInterval(callback,100);