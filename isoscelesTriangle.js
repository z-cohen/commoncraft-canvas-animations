var canvasElement = document.querySelector("#canvas");
var ctx = canvasElement.getContext("2d");
// the width of the canvas
let cw = (canvasElement.width = 300),
  cx = cw / 2;
  //the height of the canvas
let ch = (canvasElement.height = 300),
  cy = ch / 2;
  //your data
let a = 30,
  b = 30,
  c = 59;
  // In this case you have an isosceles triangle since a = b = 30
  // this triangle is circumscribed in a circle with a radius = 30
let R = 80;
// calculate the angle between the two sides of equal length
let angle = Math.asin(.5 * 59 / 30);
console.log(angle);

//draw the circumscribed circle:
ctx.beginPath();
ctx.arc(cx, cy, R, 0, 2 * Math.PI);
ctx.stroke();


var triangle = {
  //the first vertex is in the center of the canvas
  //you may decide to change this.
  x1: cx,
  y1: cy,
  //the second vertex is on the circumscribed circle at 0 radians where R is the radius of the circle ( a = 30, b=30 )
  //you may decide to change this.
  x2: cx + R,
  y2: cy,
  //calculate the 3-rd vertex
  x3: cx + R * Math.cos(angle),
  y3: cy + R * Math.sin(angle)
};

ctx.strokeStyle = "red";

ctx.beginPath();
ctx.moveTo(triangle.x1, triangle.y1);
ctx.lineTo(triangle.x2, triangle.y2);
ctx.lineTo(triangle.x3, triangle.y3);
ctx.lineTo(triangle.x1, triangle.y1);
ctx.closePath();
ctx.stroke();
