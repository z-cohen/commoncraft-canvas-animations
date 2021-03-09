var canvas = document.querySelector("canvas");
var ca = canvas.getContext("2d");

ca.fillStyle = 'red';
ca.strokeStyle = 'red';

var guide = document.querySelector('#guide');
canvas.addEventListener('mousemove', function(ev){
  var x = ev.x - canvas.offsetLeft;
  var y = ev.y - canvas.offsetTop;
  guide.innerHTML = "X : " + x + " | Y : " + y;
  
});


var mousePos = [];
canvas.addEventListener('click', getPos);
                        
function getPos(){
  x = event.x - canvas.offsetLeft;
  y = event.y - canvas.offsetTop;
  
  ca.fillRect(x,y,3,3);
  mousePos.push({x:x,y:y});
}

canvas.addEventListener('click', function(){
  if (mousePos.length == 3) {
    canvas.removeEventListener('click', getPos);
    drawTri();
    
    displayData();
    
    
    mousePos = []; // prevent additional data from appearing
  }
});

function drawTri() {
  console.log('Mouse position', mousePos);
  ca.beginPath();
    ca.moveTo(mousePos[0].x, mousePos[0].y);
    ca.lineTo(mousePos[1].x, mousePos[1].y);
    ca.lineTo(mousePos[2].x, mousePos[2].y);
  ca.closePath();
  ca.stroke();
};

function displayABC() {
  ca.font = "30px sans-serif";
  ca.fillStyle = "blue";
  ca.fillText("A", mousePos[0].x, mousePos[0].y - 10);
  ca.fillText("B", mousePos[1].x, mousePos[1].y - 10);
  ca.fillText("C", mousePos[2].x, mousePos[2].y - 10);
}



function reset(){
  ca.clearRect(0, 0, canvas.width, canvas.height);
  mousePos = [];
  canvas.addEventListener('click', getPos);
  
  document.querySelector('#lines').innerHTML = '';
  document.querySelector('#angles').innerHTML = '';
  document.querySelector('#sideType').innerHTML = '';
  document.querySelector('#angType').innerHTML = '';
  document.querySelector('#special').innerHTML = '';
  document.querySelector('#area').innerHTML = '';
  
 }

function lineDist( point1, point2 ){
  var xs = 0;
  var ys = 0;
  xs = point2.x - point1.x;
  xs = xs * xs;
  ys = point2.y - point1.y;
  ys = ys * ys;
  return Math.floor( Math.sqrt( xs + ys ) );
}

// http://stackoverflow.com/a/7505937
// Center point is p1; angle returned in Radians
function findAngle(p0,p1,p2) {
    var b = Math.pow(p1.x-p0.x,2) + Math.pow(p1.y-p0.y,2),
        a = Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),
        c = Math.pow(p2.x-p0.x,2) + Math.pow(p2.y-p0.y,2),
        angle = Math.acos( (a+b-c) / Math.sqrt(4*a*b) );
    return (angle * (180 / Math.PI))
}


function calcLines() {
  var ab = lineDist(mousePos[0], mousePos[1]) ,
  bc = lineDist(mousePos[1], mousePos[2]) ,
  ca = lineDist(mousePos[2], mousePos[0]) ,
  perimeter = ab + bc + ca;
  return {ab: ab, bc: bc, ca: ca, perimeter: perimeter}
}

function calcAngles() {
  var angA = Math.round( findAngle(mousePos[2],mousePos[0], mousePos[1])  );
  var angB = Math.round( findAngle(mousePos[0],mousePos[1], mousePos[2])  );
  var angC = Math.round( findAngle(mousePos[0],mousePos[2], mousePos[1])  );
  return {a: angA, b: angB, c: angC}
}

function displayData() {
  
  displayABC();
  
  var linesData = calcLines();
  var lines = document.querySelector('#lines');
  lines.innerHTML += "<li>A --> B : "+linesData.ab+" px</li>";
  lines.innerHTML += "<li>B --> C : "+linesData.bc+" px</li>";
  lines.innerHTML += "<li>C --> A : "+linesData.ca+" px</li>";
  lines.innerHTML += "<li>Perimeter : "+linesData.perimeter+" px</li>";
  
  var anglesData = calcAngles();
  var angles = document.querySelector('#angles');
  angles.innerHTML += "<li>Angle A : "+anglesData.a+" &deg</li>";
  angles.innerHTML += "<li>Angle B : "+anglesData.b+" &deg</li>";
  angles.innerHTML += "<li>Angle C : "+anglesData.c+" &deg</li>";
  
  var type = triangleType();
  document.querySelector('#sideType').innerHTML = "Side classification: " + type.sideType;
  document.querySelector('#angType').innerHTML = "Angle classification: " + type.angleType;
  if (type.special) document.querySelector('#special').innerHTML = type.special;
  
  var S = area();
  document.querySelector('#area').innerHTML = "Triangle area: " + S + " px<sup>2</sup>" ;
  

}

function area() {
  var line = calcLines();
  var linesDesc = [line.ab, line.bc, line.ca].sort(  (a, b) => b - a );
  // https://en.wikipedia.org/wiki/Heron%27s_formula#Numerical_stability
  var a = linesDesc[0],
      b = linesDesc[1],
      c = linesDesc[2] ;
  
  var area = 0.25 * Math.sqrt(
    (a+ (b+c) )*(c- (a-b) )*(c+ (a-b) )*(a+ (b-c) )
  );
  area = Math.round(area);
  return area;
}

function triangleType() {
  var ang = calcAngles();
  var a = ang.a, 
      b = ang.b, 
      c = ang.c;
  var angleType, sideType, special;
  // three sides
  if ( a === 60 && b === 60 && c === 60) {
    angleType = "Equiangular";
    sideType = "Equilateral";
    alert('Jackpot!  Your accuracy is admired.');
  }
  /* 2 sides equal
  if (  (a==b && b==c) ||
        (a==b && a==c) ||
        (b==c && a==b) ||
        (b==c && a==c) ||
        (a==c && a==b) ||
        (a==c && b==c)   ) {sideType = "Isosceles"}
   */
  var line = calcLines();
  if ( line.ab == line.bc || line.ab == line.ca || line.bc == line.ca ) {
    sideType = "Isosceles";
  } else {
    sideType = "Scalene";
  }
  
  
  //acute
  if ( a < 90 && b < 90 && c < 90  ) {angleType = "Acute"}
  //obtuse
  if ( a > 90 || b > 90 || c > 90  ) {
    angleType = "Obtuse";
    if (a > 90) special = "A";
    if (b > 90) special = "B";
    if (c > 90) special = "C";
    special += " is obtuse angle."
  }
  // right
  if ( a === 90 || b === 90 || c === 90 ) {
    angleType = "Right";
    if (a === 90) special = "A";
    if (b === 90) special = "B";
    if (c === 90) special = "C";
    special += " is eq 90 deg."
    }
  
  /*
  var scalene = true;
  var line = calcLines(), x;
  if ( line.ab == line.bc || line.ab == line.ca || line.bc == line.ca ) {scalene = false}
  */
  
  return {angleType: angleType, 
          sideType: sideType, 
          special: special}
}
