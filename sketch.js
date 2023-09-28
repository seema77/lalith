const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balls = [];
var dinos = [];
var score = 0;
var dinoAnimation = [];
var dinoSpritedata, dinoSpritesheet;


function preload() {
  backgroundImg = loadImage("background.png"); 
  towerImage = loadImage("tower.png");
  robotSpritedata = loadJSON("dino.json");
  robotSpritesheet = loadImage("dino.png");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
   angleMode(DEGREES)
  angle = 15


  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  var dinoFrames = robotSpritedata.frames;
  for (var i = 0; i < dinoFrames.length; i++) {
    var pos = dinoFrames[i].position;
    var img = robotSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    dinoAnimation.push(img);
  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 310);
  pop();

 

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithDino(i);
  }
  showDinos();
  cannon.display();


}

function collisionWithDino(index) {
  for (var i = 0; i < dinos.length; i++) {
    if (balls[index] !== undefined && dinos[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, dinos[i].body);

      if (collision.collided) {
          dinos[i].remove(i);
        

        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      if (!ball.isSink) {
        ball.remove(index);
      }
    }
  }
}

function showDinos() {
  if (dinos.length > 0) {
    if (
      dinos[dinos.length - 1] === undefined ||
      dinos[dinos.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var dino = new Dino(
        width,
        height - 100,
        170,
        170,
        position,
        dinoAnimation
      );

      dinos.push(dino);
    }

    for (var i = 0; i < dinos.length; i++) {
      if (dinos[i]) {
        Matter.Body.setVelocity(dinos[i].body, {
          x: -0.9,
          y: 0
        });

        dinos[i].display();
        dinos[i].animate();
        
    }
    }
  } else {
    var dino = new Dino(width, height - 60, 170, 170, -60, dinoAnimation);
    dinos.push(dino);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}
