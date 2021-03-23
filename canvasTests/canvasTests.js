// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// function debounce(func, wait, immediate) {
// 	var timeout;
// 	return function() {
// 		var context = this, args = arguments;
// 		var later = function() {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};
// 		var callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.apply(context, args);
// 	};
// };

// Square
// c.fillRect(x, y, width, height);
// c.fillStyle = "#99ff00";
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = "#0099ff";
// c.fillRect(400, 100, 100, 100);
// c.fillStyle = "#995599";
// c.fillRect(300, 300, 100, 100);

// // Line
// c.beginPath();
// c.moveTo(50, 300);
// c.lineTo(250, 100);
// c.lineTo(350, 250);
// c.strokeStyle = "#ffff00";
// c.stroke();

// Arc/Circle
// 360 degrees = 2π radians
// c.beginPath();
// c.strokeStyle = "#0000ff";
// c.arc(300, 300, 30, 0, Math.PI * 2);
// c.stroke();

// Lots of circles
// for (let i = 0; i < 4; i++) {
//   const x = Math.random() * window.innerWidth;
//   const y = Math.random() * window.innerHeight;

//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2);
//   c.stroke();
// }

// Animating a Circle
// 360 degrees = 2π radians

// function animate() {
//   requestAnimationFrame(animate);
//   c.clearRect(0, 0, ww, wh);
  
//   c.beginPath();
//   c.arc(circleX, circleY, radius, 0, Math.PI * 2);
//   c.stroke();
//   if (circleX + radius > ww || circleX - radius < 0) {
//     vx = -vx;
//   }
//   if (circleY + radius > wh || circleY - radius < 0) {
//     vy = -vy;
//   }
//   circleX += vx;
//   circleY += vy;
// }

// animate();

// Circles in a grid
// - Divide page into grid
// - In each chunk, put circle somewhere inside it
// - E.g. second row would be between 50px and 100px

// for (let i = 0; i < gridLength; i++) {
//   for (let j = 0; j < gridLength; j++) {
//     const minX = i * (window.innerWidth/gridLength);
//     const maxX = (i + 1) * (window.innerWidth/gridLength);
//     const minY = j * (window.innerHeight/gridLength);
//     const maxY = (j + 1) * (window.innerHeight/gridLength);

//     const x = getRandomInt(minX, maxX);
//     const y = getRandomInt(minY, maxY);

//     console.log(x, y);
//     c.beginPath();
//     c.arc(x, y, 10, 0, Math.PI * 2);
//     c.stroke();
//   }
// }
//
// Animating lots of circles

// // Animating many circles
// function Circle(x, y, vx, vy, radius) {
//   this.x = x;
//   this.y = y;
//   this.vx = vx;
//   this.vy = vy;
//   this.radius = radius;

//   this.draw = () => {
//     c.beginPath();
//     c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//     c.strokeStyle = "#0000ff";

//     c.stroke();
//   }

//   this.update = () => {
//     if (this.x + this.radius > ww || this.x - this.radius < 0) {
//       this.vx = -this.vx;
//     }
//     if (this.y + this.radius > wh || this.y - this.radius < 0) {
//       this.vy = -this.vy;
//     }
//     this.x += this.vx;
//     this.y += this.vy;
//   }

//   this.render = () => {
//     this.update();
//     this.draw();
//   }
// }

// let circleArray = [];
// const circleTotal = 150;

// for (let i = 0; i < circleTotal; i++) {
//   const radius = 30;
//   let circleX = Math.random() * (ww - radius * 2) + radius;
//   let circleY = Math.random() * (wh - radius * 2) + radius;
//   // X velocity
//   let vx = (Math.random() - 0.5) * 20;
//   // Y velocity
//   let vy = (Math.random() - 0.5) * 20;
//   circleArray.push(new Circle(circleX, circleY, vx, vy, radius));
// }

// console.log(circleArray);

// function animate() {
//   requestAnimationFrame(animate);
//   c.clearRect(0, 0, ww, wh);

//   for (let i = 0; i < circleArray.length; i++) {
//     circleArray[i].render();
//   }
// }

// animate();
