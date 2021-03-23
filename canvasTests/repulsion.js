var canvas = document.querySelector("#scene"),
  ctx = canvas.getContext("2d"),
  particles = [],
  // amount = 0,
  mouse = {x:0,y:0},
  radius = 1;

var colors = ["#468966","#FFF0A5", "#FFB03B","#B64926", "#8E2800"];

var copy = document.querySelector("#copy");

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;

function Particle(x,y){
  // Start it randomly on the canvas
  this.x =  Math.random()*ww;
  this.y =  Math.random()*wh;
  // Start it where it will end (tho they explode outward for some reason)
  // this.x =  x;
  // this.y =  y;
  this.dest = {
    x : x,
    y: y
  };
  // Random radius between ~0 and 2
  this.r =  Math.random()*5 + 2;
  // Random velocity between ~-20 and 20
  // this.vx = (Math.random()-0.5)*20;
  // this.vy = (Math.random()-0.5)*20;
  // Start with zero velocity and they'll be static when painted
  this.vx = 0;
  this.vy = 0;
  // Acceleration & friction
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random()*0.05 + 0.94;

  this.color = colors[Math.floor(Math.random()*6)];

  this.render = function() {

    // How fast to move between where the dot was randomly placed and its final destination,
    // depending on the distance
    // e.g. I'm trying to go to 100px but I'm placed at 900px to start
    // accX = -8
    // this.accX = (this.dest.x - this.x)/1000;
    // this.accY = (this.dest.y - this.y)/1000;
    // This keeps the items from moving back 'home' after being repulsed
    this.accX = 0;
    this.accY = 0;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y +=  this.vy;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx.fill();

    var a = this.x - mouse.x;
    var b = this.y - mouse.y;

    // According to MDN, this calculates the hypotenuse of a right triangle
    // e.g. the 'diagonal' line from where the mouse is to here
    // var distance = Math.sqrt( a*a + b*b );
    // This hypot calc is actually exactly the same
    var distance = Math.hypot(a, b);
    const radiusMultiplier = 50;
    // Smaller numbers move faster
    const relativeSpeed = radiusMultiplier * .75;
    // If the distance from the mouse to here is smaller than the radius, move it away
    if (distance < (radius * radiusMultiplier)){
      // If dot is at 50, 50 and mouse is at 70, 70
      // accX = -.2, accY = -.2
      this.accX = (this.x - mouse.x)/relativeSpeed;
      this.accY = (this.y - mouse.y)/relativeSpeed;
      this.vx += this.accX;
      this.vy += this.accY;
    }

  }
}

// Detect events, we want these
function onMouseMove(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e){
  if(e.touches.length > 0 ){
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}

function onTouchEnd(e){
mouse.x = -9999;
mouse.y = -9999;
}

function initScene(){
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold "+(ww/10)+"px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(copy.value, ww/2, wh/2);

  var data  = ctx.getImageData(0, 0, ww, wh).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Composite or blending mode to draw each shape
  ctx.globalCompositeOperation = "screen";

  // Create the particles to spell out the '#copy' word
  const relativeParticleIncrease = Math.round(ww/150);
  particles = [];
  for(var i=0;i<ww;i+=relativeParticleIncrease){
    // console.log(`Particle ${i}`);
    for(var j=0;j<wh;j+=relativeParticleIncrease){
      // console.log(`Particle ${j}: `, data[((i + j*ww) * 4) + 3]);
      if(data[ ((i + j*ww)*4) + 3] > 150){
        particles.push(new Particle(i,j));
        console.log('Pushing new particle', i, j);
      }
    }
  }
  // amount = particles.length;
  // console.log('Particles amount:', amount);
  console.log('Particles', particles);

}

function onMouseClick(){
  radius++;
  if(radius === 5){
    radius = 0;
  }
  console.log(`Radius updated to ${radius}`);
}

// Render all the particles initially
function render(a) {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < particles.length; i++) {
    particles[i].render();
  }
};

copy.addEventListener("keyup", initScene);
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);
initScene();
requestAnimationFrame(render);
