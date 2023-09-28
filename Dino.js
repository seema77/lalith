class Dino {
  constructor(x, y, width, height, dinoPos, dinoAnimation) {
  
    this.animation = dinoAnimation;
    this.speed = 0.05;
    this.body = Bodies.rectangle(x, y, width, height);
    this.width = width;
    this.height = height;

    this.dinoPosition = dinoPos;
    this.isBroken = false;

    World.add(world, this.body);
  }
  animate() {
    this.speed += 0.05;
  }

  remove(index) {
    this.isBroken=true
    setTimeout(() => {
      Matter.World.remove(world, dinos[index].body);
      delete dinos[index];
    }, 2000);
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.dinoPosition, this.width, this.height);
    pop();
  }
}
