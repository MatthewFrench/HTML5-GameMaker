//The variables that hold the code, control the editor and the ID for selected code
var helpArray, selectedHelp, helpViewer, helpDocs, commandDocs;

function loadHelpTab() {
	var code = '';
	code += '<div id="helpPicker"></div><textarea id="helpViewer" style="position:absolute;top:8px;left:230px;right:10px;bottom:10px;resize: none;"></textarea>';

	tabWindow.innerHTML = code;

	helpViewer = document.getElementById("helpViewer");
	
	helpArray = new Array(new HelpClass("General Help", helpDocs));
	var c = commandDocs.split("|");
	for (var i = 0;i< c.length; i++) {
		var d = c[i].split("\n");
		var e = new HelpClass(d[0],"");
		e.description += d[0] + "\n";
		for (var j = 1; j < d.length; j++) {
			e.description += d[j] + "\n";
		}
		helpArray.push(e);
	}
		
	fillHelp();
	helpHit(selectedHelp);
}

function HelpClass (name,description) {
	//Method ID is known by it's position in the class array.
	this.name = name;
	this.description = description;
}

function fillHelp() {
	var code = '';
	code += '<div class ="methodCategory">Help</div>';

	for (var i = 0; i < helpArray.length; i++) {
		var methodClass = '"methodTitle"';
		if (selectedHelp == i) {methodClass = '"methodTitleSelected"';}
		code += '<div class ='+ methodClass + ' onclick="helpHit(' + i  + ')" ' + 'id="help' + i + '" ' +'>'+ helpArray[i].name +'</div>';
		if (i == 0) {
			code += '<div class ="methodCategory">Commands</div>';
		}
	}

	document.getElementById('helpPicker').innerHTML = code;
}

function helpHit(helpNum) {
	var oldHelp = document.getElementById('help'+selectedHelp);
	var newHelp = document.getElementById('help'+helpNum);
	
	if (oldHelp != null) {oldHelp.className = "methodTitle";}
	if (newHelp != null) {newHelp.className = "methodTitleSelected";}
	
	selectedHelp = helpNum;

		//Display the media if exists
	if (helpArray.length > 0) {
		helpViewer.innerHTML = helpArray[selectedHelp].description;
	}
}