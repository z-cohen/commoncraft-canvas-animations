function draw(num)
{
	/*  Set Canvas Up  */
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;
		context.scale(1,1);

	/*  Get Number of Triangle  */
	var numTriangles = num;

	function basic(x0,y0,x1,y1) // basic algorithm using y = mx+b
	{
		var dx = x1-x0, // get change in x and change in y
			dy = y1-y0;
		var m = dy/dx; // slope
		
		var i = x0, // set initial values
			j = y0;

		var yintercept = y0 - m*x0;

		if(dx!=0) // make sure it is not a vertical line
		{
			var neg = false;
			if(dy<0) 
				{dy*=-1;
				neg = true;}
			if(dx>dy)
			{
				while(i!=x1)
				{
					context.fillRect(i,j,1,1); // fill in pixel
					i++;
					j = m*i+yintercept;
				}
			}
			else
			{
				while(j!=y1)
				{
					context.fillRect(i,j,1,1); // fill in pixel
					if(neg) {j--;}
					else {j++;}
					i = (j-yintercept)/m;
				}
			}
		}
		else // if it is a vertical line, do this
		{
			while(j!=y1)
			{
				context.fillRect(i,j,1,1);
				j++;
			}
		}
	}
	/*  Draw Triangle with Basic Alg  */
	function drawTriangleBasic(xx0,yy0,xx1,yy1,xx2,yy2)
	{
		basic(xx0,yy0,xx1,yy1);
		basic(xx0,yy0,xx2,yy2);
		basic(xx1,yy1,xx2,yy2);
	}
	/*  Bresenham's Algorithm  */
	function bres(x0,y0,x1,y1)
	{
		var dx = x1 - x0,
			dy = y1 - y0;
		var sx = (x0 < x1) ? 1 : -1,	// check if x/y values should be decremented or incremented
			sy = (y0 < y1) ? 1 : -1;
		var e1 = dx - dy;

		while(true)
		{
			context.fillRect(x0,y0,1,1);
			if ((x0==x1) && (y0==y1)) break;
			var e2 = e1 * 2;
			if(e2 > (dy * -1))
			{
				e1 -= dy;
				x0 += sx;
			}
			if(e2 < dx)
			{
				e1 += dx; 
				y0 += sy;
			}
		}
	}
	/*  Draw Triangle with Bresenham's Alg  */
	function drawTriangleBres(xx0,yy0,xx1,yy1,xx2,yy2)
	{
		bres(xx0,yy0,xx1,yy1);
		bres(xx0,yy0,xx2,yy2);
		bres(xx1,yy1,xx2,yy2);
	}

	/*  Get Random Integers  */
	function getRandomInt(min,max)
	{
		return Math.floor(Math.random() * (max-min-1)) + min;
	}

	/*  Draw triangles  */
	for(var i = 0; i < numTriangles; i++)
	{
		let max = 700,
			min = 0;
		var x0 = getRandomInt(min,max); // get random ints
		var x1 = getRandomInt(min,max);
		var x2 = getRandomInt(min,max);
		var y0 = getRandomInt(min,max);
		var y1 = getRandomInt(min,max);
		var y2 = getRandomInt(min,max);
	
	// make sure x values are in the right order (least to greatest)
		if(x0>x1)
		{
			var temp = x1;
			x1 = x0;
			x0 = temp;
		}
		if(x1>x2)
		{
			var temp = x2;
			x2 = x1;
			x1 = temp;
		}
		if(x0>x1)
		{
			var temp = x1;
			x1 = x0;
			x0 = temp;
		}
		if(x0==x1)
		{
			x1++;
			x2++;
		}
		if(x1==x2)
		{
			x2++;
		}

		/***** Make sure y values are in the correct order for Bresenham only ******/
		/*
		if(y0>y1)
		{
			var temp = y1;
			y1 = y0;
			y0 = temp;
		}
		if(y1>y2)
		{
			var temp = y2;
			y2 = y1;
			y1 = temp;
		}
		if(y0>y1)
		{
			var temp = y1;
			y1 = y0;
			y0 = temp;
		}
		if(y0==y1)
		{
			y1++;
			y2++;
		}
		if(y1==y2)
		{
			y2++;
		}
		*/
		/*basic(100,50,300,150);
		basic(100,50,150,300);
		basic(100,100,300,300);
		basic(50,50,50,300);
		basic(50,50,300,50);*/
		/*bres(100,50,300,150);
		bres(100,50,150,300);
		bres(100,100,300,300);
		bres(50,50,50,300);
		bres(50,50,300,50);*/

		drawTriangleBasic(x0,y0,x1,y1,x2,y2);	// Draw with Basic Algorithm
		//drawTriangleBres(x0,y0,x1,y1,x2,y2);  // Draw with Bres ALgorithm
	}
};
