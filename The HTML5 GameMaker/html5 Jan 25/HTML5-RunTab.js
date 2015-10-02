var codeDebug;

function loadRunTab() {
	$('#tabWindow').html(compile(codeDebug));
}
function reportError(err) {
	$('#tabWindow').html(err);
}
function compile(debug) {
	var compiledCode = "";

	compiledCode += "<script src='http://www.gamemakersgarage.com/html5/jquery.min.js'></script>\n";
	compiledCode += "<script src='http://www.gamemakersgarage.com/html5/HTML5-Commands.js'></script>\n";
	compiledCode += "<div style='text-align:center;'>\n<div style='width:100%;height:100%'>\n<canvas id='gameCanvas' width='"+gameWidth+"' height='"+gameHeight+"' style='cursor:default;outline: none;border:1px solid;border-color:#949494;position:relative;margin:auto;top:10px;background:transparent;'>\n<p>\nYour browser does not support canvas.</p>\n</canvas>\n</div>\n</div>";
	compiledCode += "<script type='text/javascript'>\n";

	for (var j = 0; j < codeClassArray.length; j++) {
		if (codeClassArray[j].special == 0) {
			//Custom class, so wrap like a function
			compiledCode += "function " + codeClassArray[j].name.replace(/ /gi, "_") + "("+codeClassArray[j].methods[0].parameters+") {\n";
		}
		for (var i = 0; i < codeClassArray[j].methods.length; i++) {
			if (codeClassArray[j].methods[i].special != 1) {
				compiledCode += "function " + codeClassArray[j].methods[i].name.replace(/ /gi, "_") + "("+codeClassArray[j].methods[i].parameters+") {\n";
			}

			compiledCode += interpret(codeClassArray[j].methods[i].code,codeClassArray[j].methods[i].name,codeClassArray[j].name, debug);

			if (codeClassArray[j].methods[i].special != 1) {
				compiledCode += "}\n";
			}
		}
		if (codeClassArray[j].special == 0) {
			//Custom class, so wrap like a function
			compiledCode += "}\n";
		}
	}

	compiledCode += "var canvas;\n";
	compiledCode += "var imageArray = new Array();\n";
	for (var i = 0; i < mediaArray.length; i++) {
		if (mediaArray[i].isImage) {
			compiledCode += 'imageArray['+'"' + mediaArray[i].name + '"'+']= '+'"' + mediaArray[i].source + '"'+';\n';
		}
	}
	compiledCode += "var soundArray = new Array()\n";
	var f = false;
	for (var i = 0; i < mediaArray.length; i++) {
		if (!mediaArray[i].isImage) {
			compiledCode += 'imageArray['+'"' + mediaArray[i].name + '"'+']= '+'"' + mediaArray[i].source + '"'+';\n';
		}
	}
	compiledCode += "var context;\n"+
	"var mousePressed= false;\n"+
	"var lastKeyPressed = null;\n"+
	"var keyPressedArray = new Array();\n"+
	"for (i = 0; i < 300; i++) {keyPressedArray.push(false);}" +
	"var mouseX = 0;\n"+
	"var mouseY = 0;\n"+
	"$('#gameCanvas').ready(function() {canvas = document.getElementById('gameCanvas');context = canvas.getContext('2d');prepareCommands();Game_Open();});\n" + 
	"$('#gameCanvas').keydown(function(e){ lastKeyPressed = e.keyCode; keyPressedArray[lastKeyPressed] = true; Key_Down(); return false; });\n"+
	"$('#gameCanvas').keyup(function(e){ lastKeyPressed = e.keyCode; keyPressedArray[lastKeyPressed] = false; Key_Up(); return false; });\n"+
	"$('#gameCanvas').mousedown(function(e){ mouseX = getMousePos(canvas,e).x; mouseY = getMousePos(canvas,e).y; mousePressed = true; $(this).focus(); Mouse_Down(); return false; });\n"+
	"$(window).bind('mouseup',function(e){ mouseX = getMousePos(canvas,e).x; mouseY = getMousePos(canvas,e).y; mousePressed = false; Mouse_Up(); return false; });\n"+
	"$('#gameCanvas').mousemove(function(e){ mouseX = getMousePos(canvas,e).x; mouseY = getMousePos(canvas,e).y; Mouse_Move(); return false; });\n"+
	"$('#gameCanvas').attr('tabindex', '0');\n"+
	"jQuery('#gameCanvas').bind('beforeunload', function(){ Game_Close(); })"+
	"</script>";


	return compiledCode;
}
function interpret(string, methodName, className, debug) {
	var codeString = jQuery.trim( string );
		
	var methodToParse = codeString.replace(/\n\n/g,'\n');
	var methodArray = methodToParse.split("\n");
	var parsedMethod = "";
	for (j = 0; j < methodArray.length; j++) {
		methodArray[j]=jQuery.trim(methodArray[j]);
		if (methodArray[j].length > 0) {
			parsedMethod += parse(methodArray[j], methodName, className, j+1, debug) + "\n";
		}
	}

	if (debug) {
		parsedMethod = "try {\n"  + parsedMethod + "\n" + "}catch(err2){\nStopAllTimers();reportError('Error around the "+methodName+" method in "+className+":\\n\\n'+err2.message);\n}\n";
	}
		
	return parsedMethod;
}
function parse(string, methodName, className, index, debug) {
	//If not a comment
	if (string.substring(0, 2) != '//') {

	//Take out all strings from the line of code. Then put them back later
	//Use some special character to denote the position of the string
	//Make sure when looking for strings, do not find \" or \' depending on which is used
	//Only if not a comment
	var stringArray = new Array();
	var endCompilation = false;
	var stringReplacementCharacter = "$";

	var searchCharacter;
	var searching = false;
	var searchStart;
	var searchEnd = 0;
	for (var j = 0; j < string.length; j++) {
		if (!searching && string.substring(j, j+1) == '"') {searchCharacter = string.substring(j, j+1); searchStart = j; searching = true;}else
		if (!searching && string.substring(j, j+1) == "'") {searchCharacter = string.substring(j, j+1); searchStart = j; searching = true;}else
		if (searching) {
			if (string.substring(j, j+1) == searchCharacter && string.substring(j-1,j) != "\\") {
				searchEnd = j+1;
				stringArray.push(string.substring(searchStart,searchEnd));
				//For simplicity sake, replace entire string with a single ' and later replace all of them with the strings
				string = string.substring(0,searchStart) + stringReplacementCharacter + stringArray.length + stringReplacementCharacter  + string.substring(searchEnd,string.length);
				j = searchStart;
				searchStart = 0;
				searching = false;
			} else if (j == string.length-1) {searching = false;endCompilation = true;}
		}
	}

	if (endCompilation) {alert("There was an error regarding strings in the "+methodName+" method of "+className+". Around line: " + index);}





	//Take the string, convert single line into array by separators. Take out trailing white space.
	//Determine type of code, format into appropriate Javascript and return
	
	string = string.replace(/  /g,' '); //Get rid of double spaces
		
	var lineArray = string.split(/([ \W ]| (?:AND|OR) )/).filter(Boolean);
	//Chop out spaces
	for (var i=0; i<lineArray.length; ++i) {
	    if (lineArray[i] == " ") {lineArray.splice(i,1);i-=1;}
	}

	//If not a comment
	
		//Fill with conversion code
		//Should variables and custom methods be converted to have html5_GMG_Game_ in front? No.
		//Wouldn't be too hard, would need to create an array of vars declared, then whenever a token matched one, replace that token No.
		//Maybe I can do this later but for now it's alright. No.

		if (lineArray[0].toLowerCase() == "if" && lineArray[1].toLowerCase() != "(") {
			//If statement - Add parenthesis between if and then. Change then to {
			lineArray[0] = "if (";
			lineArray[lineArray.length - 1] = ") {";
			//Replace all plain = with ==
			for (var i = 1; i < lineArray.length; i++) {
				if (lineArray[i] == "=" && lineArray[i-1] != ">" && lineArray[i-1] != "<"  && lineArray[i+1] != ">" && lineArray[i+1] != "<") {
					lineArray[i] = "==";
				}
			}
		} else
		if (lineArray[0].toLowerCase() == "for"  && lineArray[1].toLowerCase() != "(") {
			//for statement -- for,i,=,1,to,19
			//The first 3 are safe. Though Everything between = and to, and to and the end could be lengthy
			var newArray = new Array("for(",lineArray[1],"=");
			var toLoc = 4;
			for (var i = 0; i < lineArray.length; i++) {
				if (lineArray[i].toLowerCase() == "to") {toLoc = i; i = lineArray.length;}
			}
			for (var i = 3; i < toLoc; i++) {
				newArray.push(lineArray[i]);
			}
			newArray.push(";");
			newArray.push(lineArray[1]);
			newArray.push("<=");
			for (var i = toLoc+1; i < lineArray.length; i++) {
				newArray.push(lineArray[i]);
			}
			newArray.push(";");
			newArray.push(lineArray[1]);
			newArray.push("++) {");
			lineArray = newArray;
		} else
		if (lineArray[0].toLowerCase() == "var") {
			//var declaration
			//The variable will be at index 1
			//Add a ;
			lineArray[0] = "var "
			lineArray.push(";");

			if (debug) {
				lineArray[0] = "try {\n"  + lineArray[0];
				lineArray.push("\n" + "}catch(err){\nStopAllTimers();reportError('Error around line "+ index +" of the "+methodName+" method in "+className+":\\n\\n'+err.message);\n}\n");
			}
		} else
		if (lineArray[0].toLowerCase() == "end" && lineArray[1].toLowerCase() == "if") {
			//Replace with }
			var newArray = new Array();
			newArray.push("}");
			lineArray = newArray;
		} else
		if (lineArray[0].toLowerCase() == "while" && lineArray[1].toLowerCase() != "(") {
			lineArray.splice(1,0,"(");
			for (var i = 1; i < lineArray.length; i++) {
				if (lineArray[i] == "=" && lineArray[i-1] != ">" && lineArray[i-1] != "<"  && lineArray[i+1] != ">" && lineArray[i+1] != "<") {
					lineArray[i] = "==";
				}
			}
			lineArray.push(") {");
		} else
		if (lineArray[0].toLowerCase() == "next") {
			lineArray[0] = "}";
		} else if (lineArray[lineArray.length-1] != "{") {
			//Add a ; to the end of the array
			lineArray.push(";");

			if (debug) {
				lineArray[0] = "try {\n"  + lineArray[0];
				lineArray.push("\n" + "}catch(err){\nStopAllTimers();reportError('Error around line "+ index +" of the "+methodName+" method in "+className+":\\n\\n'+err.message);\n}\n");
			}
		}
		//Replace all Ands and ORs
		for (var i = 0; i < lineArray.length; i++) {
			if (lineArray[i].toLowerCase() == "and") {lineArray[i] = "&&";}
			if (lineArray[i].toLowerCase() == "or") {lineArray[i] = "||";}
		}
		
		string = lineArray.join('');

		//Now put all the strings back in the method
		for (var j = 0; j < stringArray.length; j++) {
			string = string.replace(stringReplacementCharacter+(j+1)+stringReplacementCharacter,stringArray[j]);
		}
		return string;
	}

	return string;
}