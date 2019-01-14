var canvas, c;
var borderLeft, borderRight, borderTop, borderBottom;
var circlesArray = [];
var mouse = {
	x: undefined,
	y: undefined
};
var clicked = false;
var bgRed, bgGreen, bgBlue, bgCounter;
var bgRedTarget, bgGreenTarget, bgBlueTarget;
var bgRedDelta, bgGreenDelta, bgBlueDelta;


function init() {
	canvas = document.querySelector('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	borderLeft = 10;
	borderTop = 10;
	borderRight = canvas.width - borderLeft;
	borderBottom = canvas.height - borderTop;
	c = canvas.getContext('2d');
	
	spawnCircles();

	canvas.addEventListener('mousemove', 
		function(event) {
			mouse.x = event.x;
			mouse.y = event.y;
			//console.log(mouse);
		});
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mouseup', mouseUp, false);
	window.addEventListener('resize', function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		borderRight = canvas.width - borderLeft;
		borderBottom = canvas.height - borderTop;
	});
	bgCounter = 0;
	bgRed = 40;
	bgGreen = 40;
	bgBlue = 40;
	bgRedTarget	= 60;
	bgGreenTarget = 60;
	bgBlueTarget = 60;
	bgRedDelta = 0.25;
	bgGreenDelta = 0.25;
	bgBlueDelta = 0.25;
}

function mouseDown(event) {
	clicked = true;
	//console.log(event);
}
function mouseUp(event) {
	clicked = false;
}

function update() {
	for (var i = 0; i < circlesArray.length; i++) {
		circlesArray[i].update();
	}
}

function draw() {
	backgroundFill();
	for (var i = 0; i < circlesArray.length; i++) {
		circlesArray[i].draw();
	}
}

function tick() {
	update();
	draw();
	requestAnimationFrame(tick);
}

function Circle(xInp, yInp, dxInp, dyInp, radiusInp) {
	var x = xInp;
	var y = yInp;
	var dx = dxInp;
	var dy = dyInp;
	var radius = radiusInp;
	var maxRadius = Math.random() * 50 + 70;
	var minRadius = Math.random() * 12 + 4;
	var fillRedColor = Math.floor(Math.random() * 32) + 224;
	var minRed = Math.floor(Math.random() * 54) + 10;
	var maxRed = Math.floor(Math.random() * 32) + 224;
	var hitMouse = false, growing = false;
	
	this.draw = function() {
		c.beginPath();
		c.arc(x, y, radius, 0, Math.PI * 2, false);
		c.fillStyle = 'rgb(' + fillRedColor + ', 0, 0)';
		c.fill();
		//c.strokeStyle = 'rgb(' + (fillRedColor - 10) + ', 0, 0)';;
		//c.stroke();
	}
	
	this.update = function() {
		if (!clicked) {
			dy += 0.03;
			dy *= 0.996;
			dx *= 0.999;
			
			if (x - radius < borderLeft) dx += 1;
			if (x + radius > borderRight) dx -= 1;
			if (y - radius < borderTop) dy += 1;
			if (y + radius > borderBottom) dy -= 1;
			
			x += dx;
			y += dy;
			
			// mouse interaction
			if (x - mouse.x < 50 && x - mouse.x > -50
				&& y - mouse.y < 50 && y - mouse.y > -50)
			{
				//if (radius < maxRadius) radius += 15;
				growing = true;
				if (!hitMouse) {
					if (x < mouse.x) { dx = (Math.random() * 5) - 5; }
					if (x > mouse.x) { dx = (Math.random() * 5); }
					//dx = (Math.random() * 10) - 5;
					hitMouse = true;
				}
				dy -= 1.5;
				fillRedColor = maxRed;
			} else {
				//if (radius > minRadius) radius -= 0.4;
				if (fillRedColor > minRed) fillRedColor -= 0.5;
				hitMouse = false;
			}
			if (growing) {
				if (radius < maxRadius) radius += 4;
				else growing = false;
			} else {
				if (radius > minRadius) radius -= 0.5;
			}
			
		}
	}
}

function spawnCircles() {
	var num = (canvas.width + canvas.height) / 2;
	for (var i = 0; i < num; i++) {
		var radius = Math.random() * 50 + 20;
		var x = Math.random() * (window.innerWidth - (radius * 4)) + (radius * 2);
		var y = Math.random() * (window.innerHeight - (radius * 4)) + (radius * 2);
		var dx = Math.random() * 6 - 3;
		var dy = Math.random() * 8 - 4;
		circlesArray.push(new Circle(x, y, dx, dy, radius));
	}
	//console.log(circlesArray);
}

function backgroundFill() {
	if (!clicked) {
		bgCounter++;
		if (bgCounter >= 100) {
			bgRedTarget = (Math.random() * 30) + 80;
			bgGreenTarget = (Math.random() * 30) + 60;
			bgBlueTarget = (Math.random() * 30) + 60;
			bgRedDelta = (bgRedTarget - bgRed) / 100;
			bgGreenDelta = (bgGreenTarget - bgGreen) / 100;
			bgBlueDelta = (bgBlueTarget - bgBlue) / 100;
			bgCounter = 0;
		}
	
		bgRed += bgRedDelta;
		bgGreen += bgGreenDelta;
		bgBlue += bgBlueDelta;
	
	}
	canvas.style.backgroundColor = 'rgb(' + bgRed + ', ' + bgGreen + ', ' + bgBlue + ')';
	c.clearRect(0, 0, innerWidth, innerHeight);
}

// Program starts here
init();
tick();



