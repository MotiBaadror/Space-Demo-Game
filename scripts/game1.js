// Create the canvas
// var canvas = document.createElement('canvas')
// var ctx = canvas.getContext('2d')
// canvas.width = 512
// canvas.height = 480
// document.body.appendChild(canvas)

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
canvas.height=440
canvas.width=440
ctx.lineWidth = 4;
ctx.strokeStyle="green";
// ctx.rect(0, 0, 150, 100);
// ctx.fillText('Demo', 0 0 , 20 ,20 )
ctx.rect(0, 0, 440, 440);
ctx.font = "30px Arial";
document.body.appendChild(canvas)

// function draw(){
    // ctx.clearRect(0,0,canvas.width, canvas.height)

    // ctx.fillText("sup Bro", textX ,textY )
// }

var FPS =30
var score=0

var enemies =[]
// player.active=true
setInterval(function(){
    update()
    draw()
    ctx.stroke();
    // ctx.fill()
    ctx.fillText("Space Demo", 6, 50);
    handleCollisions()
} , 1000/FPS)

// var textX=50
// var textY=50
function update(){
    // textX+=1
    // textY+=1
    playerBullets.forEach(function(bullet){
        bullet.update()
    })
    playerBullets=playerBullets.filter(function(bullet){
        return bullet.active
    })
    enemies.forEach(function(enemy){
        enemy.update()
    })
    enemies=enemies.filter(function(enemy){
        // console.log('checking the update ')
        return enemy.active
    })
    if(Math.random()<0.1){
        enemies.push(Enemy())
    }
    
}
// console.log(ctx)

var player = {
    color : "#00A",
    active:true,
    x:270,
    y: 400,
    width :32,
    height :32,
    sprite:Sprite("player"),
    explode :function(){
        this.active=false
        score =0
        
        alert('Game Over')
    },
    draw1 :function(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x,this.y,this.width,this.height)
        this.sprite.draw(ctx, this.x,this.y)
    },
    midpoint:function(){
        return {
        x: this.x+this.width/2,
        y:this.y+this.height/2
        }
    },
    shoot:function(){
        Sound.play('shoot')
        var bulletPosition=this.midpoint()
        playerBullets.push(Bullets({
            speed:5,
            x : bulletPosition.x,
            y :bulletPosition.y
        }))
    },
}
function draw(){
    ctx.fillStyle = 'orange';
    ctx.fillStyle = '#FFA500';
    ctx.clearRect(0,0,canvas.width,canvas.height)
    player.draw1()
    playerBullets.forEach(function(bullet){
        bullet.draw()
    })
    enemies.forEach(function(enemy){
        enemy.draw()
    })
}
// $(document).bind( 'keydown','left' , function (){console.log('hii there ')}
// )


// $(document).ready(function(){
$(document).bind('keydown',function update(e){
    if(e.keyCode==37 && player.x>=player.width){
        player.x-=10
    }
    if(e.keyCode==39 && canvas.width>=player.width+player.x){
        player.x+=10
    }
    if(e.keyCode==32){
        player.shoot()
    }
    // player.x=player.x.clamp(0,)
});





var playerBullets=[]

function Bullets(I){
    I.active=true 
    I.xVelocity=0
    I.yVelocity=-I.speed
    I.width=3
    I.height=3
    I.color='red'
    I.inBounds = function(){
        return I.x>= 0 && I.x<= canvas.width && 
        I.y>=0 && I.y<=canvas.height;
    }
    I.draw=function(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.x,this.y, this.width, this.height)
    }
    I.update=function(){
        I.x+=I.xVelocity
        I.y+=I.yVelocity
        I.active=I.active && I.inBounds()
    }
    return I
}


function Enemy(I){
    I=I || {}
    I.active=true
    I.age=Math.floor(Math.random()* 128)
    I.color='A2B'
    I.x=canvas.width/4+Math.random()*canvas.width/2
    I.y=0
    I.xVelocity=0;
    I.yVelocity=2
    I.width=32
    I.height=32
    I.sprite=Sprite('enemy')
    I.explode=function(){
        Sound.play('explosion')
        this.active=false
        score++
    }
    I.inBounds = function(){
        return I.x>= 0 && I.x<= canvas.width && 
        I.y>=0 && I.y<=canvas.height;
    }
    I.draw=function(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.s,this.y, this.width, this.height)
        I.sprite.draw(ctx, this.x, this.y)
    }
    I.update=function(){
        I.x+=I.xVelocity
        I.y+=I.yVelocity
        I.xVelocity=3*Math.sin(I.age*Math.PI/64)
        I.age++
        I.active=I.active && I.inBounds()
    }
    return I
}

function collides(a,b){
    // console.log("collesion check ")
    return a.x<b.x+b.width && 
    a.x+a.width>b.x &&
    a.y<b.y+b.height &&
    a.y+a.height>b.y
}

function handleCollisions(){
    playerBullets.forEach(function(bullet){
        enemies.forEach(function(enemy){
            if(collides(bullet,enemy)){
                enemy.explode()
                bullet.active=false
                // console.log("collision happend")
            }
        })
    })

    enemies.forEach(function(enemy){
        if(collides(enemy, player)){
            player.explode()
            enemy.explode()
        }
    })

}



// function update(e){
//     if(e.keyCode==37){
//         player.x-=2
//     }
//     if(e.keyCode==39){
//         player.x+=2
//     }
// }


