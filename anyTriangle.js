var canvasElement = document.querySelector("#canvas");
var ctx = canvasElement.getContext("2d");
let cw = (canvasElement.width = 150),
  cx = cw / 2;
let ch = (canvasElement.height = 150),
  cy = ch / 2;
  
// all sides are different
// Side lengths
let a = 55,
  b = 35,
  c = 55;

let angleC = Math.acos((c*c - a*a - b*b) / (2*a*b) );

 var triangle = {
 //the first vertex is in the center of the canvas
 //you can change this.
        x1: cx, 
        y1: cy, 
 // the second vertex 
        x2: cx + a, 
        y2: cy, 
 // the 3-rd vertex       
        x3: cx + b*Math.cos(angleC), 
        y3: cy + b*Math.sin(angleC),
    }



ctx.strokeStyle = "red";

ctx.beginPath();
ctx.moveTo(triangle.x1, triangle.y1);
ctx.lineTo(triangle.x2, triangle.y2);
ctx.lineTo(triangle.x3, triangle.y3);
ctx.lineTo(triangle.x1, triangle.y1);
ctx.closePath();
ctx.stroke();
