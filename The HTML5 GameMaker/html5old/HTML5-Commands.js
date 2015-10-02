function Timer(name, method, interval) {
	this.name = name;
	this.method = method;
	this.interval = interval;
	this.timer = setInterval(method,interval*1000);
}
var timerArray;
function CreateTimer(name,method,interval) {
	var t = new Timer(name,method,interval);
	if (!timerArray) {timerArray = new Array();}
	timerArray.push(t);
}
function StopTimer(name) {
	if (timerArray) {
	for (i = 0; i < timerArray.length; i++) {
		var t = timerArray[i];
		if (t.name == name) {
			clearInterval(timersArray[name].timer);
			timerArray.splice(i,1);
			i = timerArray.length;
		}
	}
	}
}
function StopAllTimers() {
	if (timerArray) {
	for (i = 0; i < timerArray.length; i++) {
		var t = timerArray[i];
		clearInterval(t.timer);
	}
	}
	timerArray = new Array();
}
function KeyIsPressedByChar(char) {
	return keyPressedArray[char.charCodeAt(0)];
}
function keyIsPressedByKeycode(keycode) {
	return keyPressedArray[keycode];
}
function Key() {
	return lastKeyPressed;
}
function MouseX() {
	return mouseX;
}
function MouseY() {
	return mouseY;
}
function MousePressed() {
	return mousePressed;
}
function PlaySound(name) {
	var snd = new Audio(soundArray[name]);
	snd.play();
}
var audioArray = new Array();
function PlaySound(name, id, loop) {
	var snd = new Audio(soundArray[name]);
	audioArray[id] = snd;
	snd.addEventListener('ended', function() {
   	 this.currentTime = 0;
   	 this.play();
	}, false);
	snd.play();
}
function StopSound(id) {
	audioArray[id].pause();
}
var loadedImageArray = new Array();
function LoadImage(name) {
	var img = new Image();
	img.src = imageArray[name];
	loadedImageArray[name] = img;
} 
function LoadImageWithSource(name,source) {
	var img = new Image();
	img.src = source;
	loadedImageArray[name] = img;
}
var TO_RADIANS = Math.PI/180;
function DrawImage(name, x, y, rotation) {
	var img = loadedImageArray[name];
	if (img == undefined) {LoadImage(name);} else {
		// save the current co-ordinate system 
		// before we screw with it
		context.save(); 
 
		// move to the middle of where we want to draw our image
		context.translate(x, y);
 
		// rotate around that point, converting our 
		// angle from degrees to radians 
		context.rotate(rotation * TO_RADIANS);
 
		// draw it up and to the left by half the width
		// and height of the image 
		context.drawImage(img, -(img.width/2), -(img.height/2));
 
		// and restore the co-ords to how they were when we began
		context.restore(); 
	}
}
function GetImageSource(name) {
	return imageArray[name];
}
function GetImageData(name) {
	if (loadedImageArray[name] != undefined) {LoadImage(name);}
	return loadedImageArray[name];
}
function DrawLine(x1,y1,x2,y2) {
	context.begiinPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
}
function DrawOval (x,y,width,height) {
var kappa = .5522848;
      var ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  context.beginPath();
  context.moveTo(x, ym);
  context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  context.closePath();
  context.stroke();
}
function DrawPixel(x,y, r, g, b, a) {
	var id = context.createImageData(1,1);
	var d = id.data;
	d[0] = r
	d[1] = g;
	d[2] = b;
	d[3] = a;
	context.putImageDaa(id,x,y);
}
function DrawRect(x,y,width,height) {
	context.strokeRect(x,y,width,height);
}
function FillRect(x,y,width,height) {
	context.fillRect(x,y,width,height);
}
function SetStringAlign(align) {
	context.textAlight = align;
}
function SetStringBaseline(baseline) {
	context.textBaseline = baseline;
}
function SetStringFont(font) {
	context.font = font;
}
function DrawString(string, x, y) {
	context.fillText(string,x,y);
}
function ClearScreen() {
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
	context.restore();
}
function ScaleContext(x,y) {
	context.scale(x,y);
}
function RotateContext(rot) {
	context.rotate(rot);
}
function TranslateContext(x,y) {
	context.translate(x,y);
}
function SetStrokeColor(color) {
	context.strokeStyle = color;
}
function SetFillColor(color) {
	context.fillStyle = color;
}
function Abs(num) {
	return Math.abs(num);
}
function Arccos(num) {
	return Math.acos(num);
}
function Arcsin(num) {
	return Math.asin(num);
}
function Arctan(num) {
	return Math.atan(num);
}
function Arctan2(y,x) {
	return Math.atan2(y,x);
}
function Ceil(num) {
	return Math.ceil(num);
}
function Cos(num) {
	return Math.cos(num);
}
function Sin(num) {
	return Math.sin(num);
}
function Tan(num) {
	return Math.tan(num);
}
function Floor(num) {
	return Math.floor(num);
}
function Pi() {
	return Math.PI;
}
function Random(num1,num2) {
	return num1+(Math.random()*(num2-num1));
}
function Round(num) {
	return Math.round(num);
}
function Sqrt(num) {
	return Math.sqrt(num);
}
function Pow(base, exponent) {
	return Math.pow(base,exponent);
}
function Distance(x1,y1,x2,y2) {
	return Sqrt(Pow(x2-x1,2)+Pow(y2-y1,2));
}