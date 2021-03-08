const canvas = document.querySelector('canvas');

var ww = canvas.width = window.innerWidth;
var wh = canvas.height = window.innerHeight;

// c = context
const c = canvas.getContext('2d');

// Animating many circles
function Circle(x, y, vx, vy, radius) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.radius = radius;

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.strokeStyle = "#0000ff";

    c.stroke();
  }

  this.update = () => {
    if (this.x + this.radius > ww || this.x - this.radius < 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.radius > wh || this.y - this.radius < 0) {
      this.vy = -this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  this.render = () => {
    this.update();
    this.draw();
  }
}

let circleArray = [];
const circleTotal = 150;

for (let i = 0; i < circleTotal; i++) {
  const radius = 30;
  let circleX = Math.random() * (ww - radius * 2) + radius;
  let circleY = Math.random() * (wh - radius * 2) + radius;
  // X velocity
  let vx = (Math.random() - 0.5) * 20;
  // Y velocity
  let vy = (Math.random() - 0.5) * 20;
  circleArray.push(new Circle(circleX, circleY, vx, vy, radius));
}

console.log(circleArray);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, ww, wh);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].render();
  }
}

animate();

function getRandomInt(min, max) {
  const value = Math.floor(Math.random() * (max - min) + min);
  // console.log(value);
  return value;
}

const gridLength = 13;
c.strokeStyle = "#009999";

const triangleLength = 14;
c.fillStyle = "#ddd";

// Random triangles in a grid
for (let i = 0; i < gridLength; i++) {
  for (let j = 0; j < gridLength; j++) {
    const minX = i * (window.innerWidth/gridLength);
    const maxX = (i + 1) * (window.innerWidth/gridLength);
    const minY = j * (window.innerHeight/gridLength);
    const maxY = (j + 1) * (window.innerHeight/gridLength);

    const x = getRandomInt(minX, maxX);
    const y = getRandomInt(minY, maxY);

    const x2 = x + getRandomInt(-triangleLength, triangleLength);
    const y2 = y + getRandomInt(-triangleLength, triangleLength);
    const x3 = x + getRandomInt(-triangleLength, triangleLength);
    const y3 = y + getRandomInt(-triangleLength, triangleLength);

    c.beginPath();
    c.moveTo(x, y);
    // To prevent these from being lines, you could calculate a number between a certain number of degrees, e.g. 30
    // c.lineTo(x + getRandomInt(3, 14), y + getRandomInt(12, 14));
    // c.lineTo(x + getRandomInt(0, 14), y + getRandomInt(0, 14));
    c.lineTo(x2, y2);
    c.lineTo(x3, y3);
    c.lineTo(x, y);
    c.stroke();
    c.fill();
    c.closePath();
  }
}

c.fillStyle = "#000";
// Randomized dots
// TODO: Make more efficient using this: https://hacks.mozilla.org/2009/06/pushing-pixels-with-canvas/
for (let i = 0; i < 600; i++) {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  c.beginPath();
  c.fillRect(x, y, 1, 1);
  c.closePath();
}

canvas.addEventListener("mousemove", (e) => {
  // console.log(e.clientX, e.clientY);
});
