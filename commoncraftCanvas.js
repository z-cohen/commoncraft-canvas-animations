/* SETUP */
/* ------------------------------------*/

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Detect retina screens and resize to fix correctly
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

const mouse = {
  x: 0,
  y: 0
};

/* MOBILE BREAKPOINT */
/* ------------------------------------*/

const mobileBreakpoint = 600;

// Note: Mobile sizes will be switched out accordingly when drawing the canvas

/* TRIANGLE SETTINGS */
/* ------------------------------------*/

// Max length of each triangle's sides
let triangleLength;
const largeScreenTriangleLength = 9;
const mobileTriangleLength = canvas.getAttribute('mobileTriangleLength') || 7;

// Triangle border color
// #9aab91
const triangleStrokeColor = "#83C382";

// Triangle stroke width
const triangleLineWidth = 3;

// Opaque fill in triangle to match the page background
const triangleFill = "#fff";

// Minimum angle we want any of the triangles to have
const minAngle = 35;

/* GRID AND MOVEMENT SETTINGS */
/* ------------------------------------*/

// Eg. each column/row will be 90px wide & tall
let gridCellSize;
const largeScreenGridCellSize = 75;
const mobileGridCellSize = canvas.getAttribute('mobileGridCellSize') || 55;

// How large a radius to detect mouse movements
let movementRadius;
const largeScreenMovementRadius = 30;
const mobileMovementRadius = 23; // ~44px diameter

// How quickly the objects should move away from the mouse
// Smaller numbers move faster
const relativeSpeed = 13;

// Original friction calculation
// const friction = Math.random()*0.05 + 0.94;
// The smaller the final number, the slower they'll fly away
// const friction = Math.random()*0.05 + 0.91;
// Instead, we can use a plain number. If the effect were more obvious, this
// might look 'robotic', but with all the moving pieces it works alright.
const friction = canvas.getAttribute('friction') || 0.84;

/* DOT SETTINGS */
/* ------------------------------------*/

// Dividing the screen area by 300 results in ~4000 dots for a 1400x900 window
// Higher numbers mean fewer dots
const dotMultiplier = canvas.getAttribute('dotMultiplier') || 600;

// Dot color
const dotFill = "#83C382";

// Dot line 'width'
// We're making small lines with rounded corners and borders, so this really just
// controls how large the dots look on the screen
// This doesn't have to be an integer (e.g. can be 1.5)
let dotLineWidth;
const largeScreenDotLineWidth = parseFloat(canvas.getAttribute('dotLineWidth')) || 1;

// Actual window widths and height, but eventually scaled for the device pixel ratio
let windowWidth;
let windowHeight;

// Scaled canvas size for retina screens
let ww;
let wh;

// Run this on scene init and on window resize
const calculateCanvasSize = () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

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

    // New method: Drawing a single-point "line" to make circles
    // More performant than drawing arcs
    // c.moveTo(this.x, this.y);
    // c.lineTo(this.x, this.y);
    // c.stroke();

    // Old method: Draw rectangles, but can't control dot size as well
    // c.fillRect(this.x, this.y, 2, 2);

    // Using strokeRect instead of fillRect lets us control the size a bit better
    c.strokeRect(this.x, this.y, .75, .75);
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

  if (windowWidth < mobileBreakpoint) {
    triangleLength = mobileTriangleLength;
    gridCellSize = mobileGridCellSize;
    movementRadius = mobileMovementRadius;
    dotLineWidth = largeScreenDotLineWidth / 2;
  } else {
    triangleLength = largeScreenTriangleLength;
    gridCellSize = largeScreenGridCellSize;
    movementRadius = largeScreenMovementRadius;
    dotLineWidth = largeScreenDotLineWidth;
  }

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

      // Randomize the position anywhere within the grid square
      // const minX = i * (ww/gridColumns);
      // const maxX = (i + 1) * (ww/gridColumns);
      // const minY = j * (wh/gridRows);
      // const maxY = (j + 1) * (wh/gridRows);

      // Randomize the position somewhere *near* the center of the grid square
      const reducedRandomness = gridCellSize / 5;
      const minX = (i * (ww/gridColumns)) + reducedRandomness;
      const maxX = ((i + 1) * (ww/gridColumns)) - reducedRandomness;
      const minY = (j * (wh/gridRows)) + reducedRandomness;
      const maxY = ((j + 1) * (wh/gridRows)) - reducedRandomness;

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

  c.lineWidth = dotLineWidth;
  // Rounded corners on 'dot' rectangles
  c.lineJoin = 'bevel';

  // Drawing dots first puts them 'below' the triangles
  for (let j = 0; j < dotsArray.length; j++) {
    dotsArray[j].render();
  }

  c.strokeStyle = triangleStrokeColor;
  c.lineWidth = triangleLineWidth;
  c.fillStyle = triangleFill;
  // Combo of both cap and join to make these look good, esp on mobile
  c.lineCap = 'square';
  c.lineJoin = 'miter';

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
