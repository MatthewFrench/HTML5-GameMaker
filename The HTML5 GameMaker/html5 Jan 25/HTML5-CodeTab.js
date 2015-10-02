//The variables that hold the code, control the editor and the ID for selected code
var codeClassArray, selectedCodeClass, selectedCodeMethod, codeEditor;

function loadCodeTab() {
	var code = '';
		code += '<select id="classPicker" width="202" STYLE="width: 202px" onChange = "classHit(document.getElementById(\'classPicker\').selectedIndex);">';

		code += '</select>';
		
		code += '<div id="classBtnHolder">';
		code += '<button id="addClassBtn" type="button" onClick="newClassBtn();">Add Class</button>';
		code += '<button id="renameClassBtn" type="button" onClick="renameClassBtn();">Rename</button>';
		code += '<button id="deleteClassBtn" type="button" onClick="deleteClassBtn();">Delete Class</button>';
		code += '</div>';
		code += '<div id="methodBtnHolder">';
		code += '<button id="addMethodBtn" type="button" onClick="newMethodBtn();">Add Method</button>';
		code += '<button id="renameMethodBtn" type="button" onClick="renameMethodBtn();">Rename Method</button>';
		code += '<button id="setParametersMethodBtn" type="button" onClick="setMethodParametersBtn();">Set Method Parameters</button>';
		code += '<button id="deleteMethodBtn" type="button" onClick="deleteMethodBtn();">Delete Method</button>';
		code += '</div>';
		code += '<div id="methodPicker">';

		code += '</div><div id="codeView"><textarea id="code" name="code"> </textarea></div>'

		tabWindow.innerHTML = code;

		fillClasses();
		fillMethods();
		
		codeEditor = CodeMirror.fromTextArea(document.getElementById("code"), {
        		lineNumbers: true,
        		matchBrackets: true
    		});
		codeEditor.getScrollerElement().height = "100%";
		codeEditor.refresh();

		//Get code
		codeEditor.setValue(codeClassArray[selectedCodeClass].methods[selectedCodeMethod].code);
}

function CodeClass (name,permanent,special) {
	//Class ID is known by it's position in the class array.
	this.name = name;
	this.methods = new Array();
	//True or false. Determines if it's editable besides code
	this.permanent = permanent;
	//Main class = 1, custom class = 0
	this.special = special;
	if (special == 1) {
		this.methods.push(new CodeMethod('Global Variables',"",1),new CodeMethod('Game Open',"",2),new CodeMethod('Key Down','',3),new CodeMethod('Key Up','',4),new CodeMethod('Mouse Down','',5),new CodeMethod('Mouse Up','',6),new CodeMethod('Mouse Move','',7),new CodeMethod('Game Close','',8));
	}
	if (special == 0) {
		this.methods.push(new CodeMethod('On Construction',"",1));
	}
}

function CodeMethod (name,code,special) {
	//method ID is known by it's position in the method array within the class.
	this.name = name;
	this.code = code;
	// 0 = custom class, 1 = Global Vars/Constructor, 2 = Game Open, 3 = Key Down, 4 = Key Up, 5 = Mouse Down, 6 = Mouse Up, 7 = Mouse Move, 8 = Game Close
	this.special = special;
	this.parameters = "";
}

function fillMethods() {
	var code = '';
	if (codeClassArray[selectedCodeClass].special == 1) {
		//Main
		code += '<div class ="methodCategory">Game Methods</div>';
	} else if (codeClassArray[selectedCodeClass].special == 0) {
		//Custom
		code += '<div class ="methodCategory">Class Methods</div>';
	}
	var inCustom = false;
	for (var i = 0; i < codeClassArray[selectedCodeClass].methods.length; i++) {
		var parameters = "";
		if (codeClassArray[selectedCodeClass].special == 0 || codeClassArray[selectedCodeClass].methods[i].special == 0) {parameters = " ( "+codeClassArray[selectedCodeClass].methods[i].parameters+" )";}		
 
		var methodClass = '"methodTitle"';
		if (selectedCodeMethod == i) {methodClass = '"methodTitleSelected"';}
		if (inCustom == false && codeClassArray[selectedCodeClass].methods[i].special == 0) {
			inCustom = true;
			code += '<div class ="methodCategory">Custom Methods</div>';
		}
		code += '<div class ='+ methodClass + ' onclick="methodHit(' + i  + ')" ' + 'id="method' + i + '" ' +'>'+ codeClassArray[selectedCodeClass].methods[i].name + parameters +'</div>';
	}
	document.getElementById('methodPicker').innerHTML = code;
}
function fillClasses() {
	var code = '';
	for (var i = 0; i < codeClassArray.length; i++) {
		if (codeClassArray[i].special == 0) {
			code += '<option>'+codeClassArray[i].name+' Class</option>';
		} else {
			code += '<option>'+codeClassArray[i].name+'</option>';
		}
	}
	document.getElementById('classPicker').innerHTML = code;
}

function methodHit(methodNum) {
	codeClassArray[selectedCodeClass].methods[selectedCodeMethod].code = codeEditor.getValue();
	codeEditor.setValue(codeClassArray[selectedCodeClass].methods[methodNum].code);


	var oldMethod = document.getElementById('method'+selectedCodeMethod);
	var newMethod = document.getElementById('method'+methodNum);
	
	oldMethod.className = "methodTitle";
	newMethod.className = "methodTitleSelected";
	
	selectedCodeMethod = methodNum;
}
function classHit(classNum) {
	document.getElementById('classPicker').selectedIndex = classNum;

	//Save the previous code
	codeClassArray[selectedCodeClass].methods[selectedCodeMethod].code = codeEditor.getValue();

	//Set new stufferoonies
	selectedCodeMethod = 0;
	codeEditor.setValue(codeClassArray[classNum].methods[selectedCodeMethod].code);
	
	selectedCodeClass = classNum;

	fillMethods();
}
function newClassBtn () {
	var name=prompt("Please enter the new class name:","");
	if (name!=null && name!="")
	{
		codeClassArray.push(new CodeClass(name.replace(/ /gi, "_"), false, 0));
		fillClasses();
		classHit(codeClassArray.length-1);
	}
}
function renameClassBtn () {
	if (codeClassArray[selectedCodeClass].permanent) {
		alert("Cannot rename this class.");
	}else{
		var name=prompt("Please enter the new class name:",codeClassArray[selectedCodeClass].name);
		if (name!=null && name!="")
		{
			codeClassArray[selectedCodeClass].name=name.replace(/ /gi, "_");
			fillClasses();
			document.getElementById('classPicker').selectedIndex = selectedCodeClass;
			//classHit(codeClassArray.length-1);
		}
	}
}
function deleteClassBtn () {
	if (codeClassArray[selectedCodeClass].permanent == false && confirm("Are you sure you want to delete this class?"))
	{
		var toDelete = selectedCodeClass;
		classHit(0);
		
		codeClassArray.splice(toDelete, 1);
		fillClasses();
	} else {
		alert("Cannot delete this class.");
	}
}
function newMethodBtn () {
	var name=prompt("Please enter the new method name:","");
	if (name!=null && name!="")
	{
		codeClassArray[selectedCodeClass].methods.push(new CodeMethod(name.replace(/ /gi, "_"), "", 0));
		fillMethods();
		methodHit(codeClassArray[selectedCodeClass].methods.length-1);
	}
}
function renameMethodBtn () {
	if (codeClassArray[selectedCodeClass].methods[selectedCodeMethod].special != 0) {
		alert("Cannot rename this method.");
	}else{
		var name=prompt("Please enter the new method name:",codeClassArray[selectedCodeClass].methods[selectedCodeMethod].name);
		if (name!=null && name!="")
		{
			codeClassArray[selectedCodeClass].methods[selectedCodeMethod].name=name.replace(/ /gi, "_");
			fillMethods();
		}
	}
}
function setMethodParametersBtn () {
	if (!(codeClassArray[selectedCodeClass].special == 0 || codeClassArray[selectedCodeClass].methods[selectedCodeMethod].special == 0)) {
		alert("Cannot set parameters this method.");
	}else{
		var name=prompt("Please enter the new parameters:",codeClassArray[selectedCodeClass].methods[selectedCodeMethod].parameters);
		if (name!=null)
		{
			codeClassArray[selectedCodeClass].methods[selectedCodeMethod].parameters=name;
			fillMethods();
		}
	}
}
function deleteMethodBtn () {
	if (codeClassArray[selectedCodeClass].methods[selectedCodeMethod].special == 0 && confirm("Are you sure you want to delete this method?"))
	{
		var toDelete = selectedCodeMethod;
		methodHit(0);
		
		codeClassArray[selectedCodeClass].methods.splice(toDelete, 1);
		fillMethods();
	} else {
		alert("Cannot delete this method.");
	}
}