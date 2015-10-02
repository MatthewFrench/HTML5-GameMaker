//The variables that hold the code, control the editor and the ID for selected code
var gameName, gameWidth, gameHeight;

function loadSettingsTab() {
	updateSettings();
}

function updateSettings() {
	var code = '</p>';
	code += '<button id="renameGame" type="button" onClick="renameGameBtn();">Rename Game</button> Game Name: ' + gameName + '</p>';
	code += '<button id="setWidth" type="button" onClick="setWidthBtn();">Set Game Width</button> Game Width: ' + gameWidth + '</p>';
	code += '<button id="setHeight" type="button" onClick="setHeightBtn();">Set Game Height</button> Game Height: ' + gameHeight + '</p>';
	code += '<button id="setDebug" type="button" onClick="setDebugBtn();">'+(codeDebug?'Turn off Debugging':'Turn on Debugging')+'</button>Turning off the debugger will increase game performance when testing.</p>';

	tabWindow.innerHTML = code;
}

function renameGameBtn () {
	var name=prompt("Please enter the new game name:",gameName);
	if (name!=null)
	{
		gameName=name;
		updateSettings();
	}
}
function setWidthBtn () {
	var w=prompt("Please enter the new game width:",gameWidth);
	if (w!=null)
	{
		gameWidth=w;
		updateSettings();
	}
}
function setHeightBtn () {
	var h=prompt("Please enter the new game height:",gameHeight);
	if (h!=null)
	{
		gameHeight=h;
		updateSettings();
	}
}
function setDebugBtn () {
	codeDebug = !codeDebug;
	updateSettings();
}