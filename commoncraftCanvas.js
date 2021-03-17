const canvas = document.querySelector('canvas');

// c = context
const c = canvas.getContext('2d');

// Detect retina screens and resize to fix correctly
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

const mouse = {
  x: 0,
  y: 0
};

// Max length of each triangle's sides
const triangleLength = 13;

// Triangle border color
// #9aab91
const triangleStrokeColor = "#9aab91";

// Triangle stroke width
const triangleLineWidth = 2;

// Opaque fill in triangle to match the page background
const triangleFill = "#f9f9f9";

// Minimum angle we want any of the triangles to have
const minAngle = 35;

// Eg. each column/row will be 100px wide & tall
const gridCellSize = 90;

// How large a radius to detect mouse movements
const movementRadius = 65;

// How quickly the objects should move away from the mouse
// Smaller numbers move faster
const relativeSpeed = 60;

// Original friction calculation
// const friction = Math.random()*0.05 + 0.94;
// The smaller the final number, the slower they'll fly away
// const friction = Math.random()*0.05 + 0.91;
// Instead, we can use a plain number. If the effect were more obvious, this
// might look 'robotic', but with all the moving pieces it works alright.
const friction = canvas.getAttribute('friction') || 0.93;

// Dividing the screen area by 300 results in ~4000 dots for a 1400x900 window
// Higher numbers mean fewer dots
const dotMultiplier = 500;

// Dot color
const dotFill = "#999";

// Window widths and height, but eventually scaled for the device pixel ratio
let ww;
let wh;

// Run this on scene init and on window resize
const calculateCanvasSize = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  ww = canvas.width = Math.floor(windowWidth * scale);
  wh = canvas.height = Math.floor(windowHeight * scale);

  canvas.style.width = windowWidth + "px";
  canvas.style.height = windowHeight + "pk";

  c.scale(scale, scale);
  // console.log('Canvas size etc', ww, wh, scale);
};

// How many triangle grid columns & rows to have
const getGridDimensions = (ww, wh) => {
  const gridColumns = ww / gridCellSize;
  const gridRows = wh / gridCellSize;

  return {
    gridColumns: gridColumns,
    gridRows: gridRows,
  }
};

// Total number of dots on the page
const calculateDots = (ww, wh) => {
  return (ww * wh) / dotMultiplier;
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// These 2 functions from this pen:
// https://codepen.io/testing3912/pen/xOpajQ?editors=1111
//
// Center point is p1; angle returned in Radians
function findAngle(p0x, p0y, p1x, p1y, p2x, p2y) {
  const b = Math.pow(p1x-p0x, 2) + Math.pow(p1y-p0y, 2);
  const a = Math.pow(p1x-p2x, 2) + Math.pow(p1y-p2y, 2);
  const c = Math.pow(p2x-p0x, 2) + Math.pow(p2y-p0y, 2);
  const angle = Math.acos((a + b - c) / Math.sqrt(4 * a * b));
  return Math.round(angle * (180 / Math.PI))
}

function calcAngles(x, y, x2, y2, x3, y3) {
  const angA = findAngle(x3, y3, x, y, x2, y2);
  const angB = findAngle(x, y, x2, y2, x3, y3);
  const angC = findAngle(x, y, x3, y3, x2, y2);
  return {a: angA, b: angB, c: angC}
}

// This is just to track how many extra calculations we're doing to
// get nicely-shaped triangles
let totalTriangleCalculations = 0;

function generatePoints(x, y) {
  totalTriangleCalculations++;
  const px = x;
  const py = y;
  const px2 = x + getRandomInt(-triangleLength, triangleLength);
  const py2 = y + getRandomInt(-triangleLength, triangleLength);

  const px3 = x + getRandomInt(-triangleLength, triangleLength);
  const py3 = y + getRandomInt(-triangleLength, triangleLength);

  // Check points to make sure they're not too pointy
  // Rerun the calculation if they are
  let anglesData = calcAngles(px, py, px2, py2, px3, py3);
  if (anglesData.a < minAngle || anglesData.b < minAngle || anglesData.c < minAngle) {
    return generatePoints(x, y);
  } else {
    return {
      x: px,
      y: py,
      x2: px2,
      y2: py2,
      x3: px3,
      y3: py3,
    }
  }
}

function Triangle(x, y) {
  // All points of the triangle
  this.points = generatePoints(x, y);

  // Velocity & acceleration
  this.vx = 0;
  this.vy = 0;
  this.accX = 0;
  this.accY = 0;

  this.render = () => {
    this.accX = 0;
    this.accY = 0;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= friction;
    this.vy *= friction;

    this.points.x += this.vx;
    this.points.y +=  this.vy;
    this.points.x2 += this.vx;
    this.points.y2 += this.vy;
    this.points.x3 += this.vx;
    this.points.y3 += this.vy;

    c.beginPath();
    c.moveTo(this.points.x, this.points.y);
    c.lineTo(this.points.x2, this.points.y2);
    c.lineTo(this.points.x3, this.points.y3);
    // For thicker lines, this is where we'd need to change the end point
    // so they fully 'line up'
    c.lineTo(this.points.x, this.points.y);
    c.stroke();
    c.fill();
    c.closePath();

    const a = this.points.x - mouse.x;
    const b = this.points.y - mouse.y;

    const distance = Math.hypot(a, b);

    // If the distance from the mouse to here is smaller than the radius, move it away
    if (distance < movementRadius){
      // If dot is at 50, 50 and mouse is at 70, 70
      // accX = -.2, accY = -.2
      this.accX = (this.points.x - mouse.x)/relativeSpeed;
      this.accY = (this.points.y - mouse.y)/relativeSpeed;
      this.vx += this.accX;
      this.vy += this.accY;
    }
  }
}

function Dot(x, y) {
  this.x = x;
  this.y = y;

  // Velocity & acceleration
  this.vx = 0;
  this.vy = 0;
  this.accX = 0;
  this.accY = 0;

  this.render = () => {
    this.accX = 0;
    this.accY = 0;
    this.vx += this.accX;
    this.vy += this.accY;
    this.vx *= friction;
    this.vy *= friction;

    this.x += this.vx;
    this.y +=  this.vy;

    c.beginPath();
    c.fillRect(this.x, this.y, 1, 1);
    c.closePath();

    const a = this.x - mouse.x;
    const b = this.y - mouse.y;

    const distance = Math.hypot(a, b);

    // If the distance from the mouse to here is smaller than the radius, move it away
    if (distance < movementRadius){
      // If dot is at 50, 50 and mouse is at 70, 70
      // accX = -.2, accY = -.2
      this.accX = (this.x - mouse.x)/relativeSpeed;
      this.accY = (this.y - mouse.y)/relativeSpeed;
      this.vx += this.accX;
      this.vy += this.accY;
    }
  }
}

let trianglesArray = [];
let dotsArray = [];

function clearScene() {
  c.clearRect(0, 0, ww, wh);
}

// Draw initial triangles and dots on the page
function initScene() {
  calculateCanvasSize();
  clearScene();

  // Draw triangles on a grid
  trianglesArray = [];
  totalTriangleCalculations = 0;

  const { gridColumns, gridRows } = getGridDimensions(ww, wh);

  for (let i = 0; i < gridColumns; i++) {
    for (let j = 0; j < gridRows; j++) {
      // If we want it to be truly random, we can use this
      // But I think mine looks better, it's more evenly spaced
      // const radius = triangleLength;
      // let x = Math.random() * (ww - radius * 2) + radius;
      // let y = Math.random() * (wh - radius * 2) + radius;

      const minX = i * (ww/gridColumns);
      const maxX = (i + 1) * (ww/gridColumns);
      const minY = j * (wh/gridRows);
      const maxY = (j + 1) * (wh/gridRows);

      const x = getRandomInt(minX, maxX);
      const y = getRandomInt(minY, maxY);

      trianglesArray.push(new Triangle(x, y));
    }
  }

  // Draw randomized dots
  dotsArray = [];
  c.fillStyle = "#000";
  const totalDots = calculateDots(ww, wh);
  // TODO: Make more efficient using this: https://hacks.mozilla.org/2009/06/pushing-pixels-with-canvas/
  for (let i = 0; i < totalDots; i++) {
    const x = Math.random() * ww;
    const y = Math.random() * wh;

    dotsArray.push(new Dot(x, y));
  }

  // console.log(trianglesArray);
  // console.log(dotsArray);

  console.log('Total number of triangles', trianglesArray.length);
  console.log('Total times calculated to get correct triangle angles', totalTriangleCalculations);
}

function render() {
  requestAnimationFrame(render);
  clearScene();

  c.fillStyle = dotFill;

  // Drawing dots first puts them 'below' the triangles
  for (let j = 0; j < dotsArray.length; j++) {
    dotsArray[j].render();
  }

  c.strokeStyle = triangleStrokeColor;
  c.lineWidth = triangleLineWidth;
  c.fillStyle = triangleFill;

  for (let i = 0; i < trianglesArray.length; i++) {
    trianglesArray[i].render();
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

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("touchend", onTouchEnd);
window.addEventListener("resize", initScene);

initScene();
requestAnimationFrame(render);
