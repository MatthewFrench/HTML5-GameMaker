//The clickable tabs
var mainWindow, tabWindow, tabCode, tabMedia, tabSettings, tabRun, tabExport, tabHelp;
//The var that points to the selected tab
var selectedTab;
//The gameID for saving purposes
var gameID;

//When the page loads set up the editor
function load() {
	mainWindow = document.getElementById('mainWindow');
	loadMainMenu();
}

function loadMainMenu() {
	mainWindow.className = 'mainWindow';
	mainWindow.innerHTML = '<span style="font-size:40px;position:absolute;text-align:center;top:20px;width:100%;">HTML5 GameMaker</span><button style="font-size:20px;position:absolute;top:100px;width:250px;left:125px;" value="New Game" onClick="gameID=-1;loadGameWindow(true);">New Game</button><button style="font-size:20px;position:absolute;top:160px;width:250px;left:125px;" onClick="chooseGameWindow();" value="Choose Game">Choose Game</button><button style="font-size:20px;position:absolute;top:220px;width:250px;left:125px;" value="Load Game">Load Game From File</button><button style="font-size:20px;position:absolute;top:280px;width:250px;left:125px;" value="Game Templates">Game Templates and Demos</button>';
}

function chooseGameWindow() {
	
	$.post('HTML5-ListGames.php', function(data) {
				mainWindow.className = 'mainWindow';
	var code = '<span style="font-size:40px;position:absolute;text-align:center;top:20px;width:100%;">Choose Game</span><div id="gamePicker">';
	code += data;
	code += '</div><button type="button" onClick="loadMainMenu();" style="position:absolute;left:15px; bottom:10px;">Main Menu</button>';
	code += '<button type="button" onClick="loadGame(selectedGameID);" style="position:absolute;right:15px; bottom:10px;">Go!</button>';
	mainWindow.innerHTML = code;
			}
		).error(function() {alert("Error " + data); });
}
var selectedGame = -1;
var selectedGameID = -1;
function gameHit(gameNum, id) {
	var oldGame = document.getElementById('game'+selectedGame);
	var newGame = document.getElementById('game'+gameNum);
	
	if (oldGame != null) {oldGame.className = "methodTitle";}
	if (newGame != null) {newGame.className = "methodTitleSelected";}
	
	selectedGame = gameNum;
	selectedGameID = id;
}

function loadGameWindow(newGame) {
	mainWindow.className = 'invisWindow';
	mainWindow.innerHTML = '<span style="position:absolute;top:4px;left:0px;width:100%;text-align:center;color:white;">HTML5 GameMaker</span><button type="button" onClick="saveGame();" style="position:absolute;left:15px;">Save Game!</button><div id="topBar"><div class="tab" id="tabCode" onclick="tabHit(\'tabCode\');">Code</div><div class="tab" id ="tabMedia" onclick="tabHit(\'tabMedia\');">Media</div><div class="tab" id ="tabSettings" onclick="tabHit(\'tabSettings\');">Settings</div><div class="tab" id ="tabRun" onclick="tabHit(\'tabRun\');">Run</div><div class="tab" id ="tabExport" onclick="tabHit(\'tabExport\');">Export</div><div class="tab" id ="tabHelp" onclick="tabHit(\'tabHelp\');">Help</div></div><div id="tabWindow"></div>';

	tabWindow = document.getElementById('tabWindow');
	tabCode = document.getElementById('tabCode');
	tabMedia = document.getElementById('tabMedia');
	tabSettings = document.getElementById('tabSettings');
	tabRun = document.getElementById('tabRun');
	tabExport = document.getElementById('tabExport');
	tabHelp = document.getElementById('tabHelp');

	//Code Tab Loading
	if (newGame) {
		codeClassArray = new Array(new CodeClass("Main", true, 1));
	}
	selectedCodeClass = 0;
	selectedCodeMethod = 0;
	selectedTab = 'tabCode';
	tabHit(selectedTab);

	//Media Loading
	if (newGame) {
		mediaArray = new Array();
	}
	selectedMedia = 0;

	//Settings Loading
	if (newGame) {
		gameName = "My Game";
		gameWidth = "500px";
		gameHeight = "500px";
	}

	//Run Loading
	if (newGame) {
		codeDebug = true;
	}

	//Help Loading
	selectedHelp = 0;
	$.get("generalhelp.txt", function(data) {
		helpDocs = data;
 	 }).error(function() { helpDocs = "Unable to load the HTML5 GameMaker general documentation.";})

	$.get("commandhelp.txt", function(data) {
		commandDocs = data;
 	 }).error(function() { commandDocs = "Unable to load the HTML5 GameMaker command documentation.";})
}

//When a tab is hit this sets up the screen
function tabHit(tabID) {
	//Clear window
	tabWindow.innerHTML = "";
	if (tabID != 'tabCode') {tabCode.className = "tab";}
	if (tabID != 'tabMedia') {tabMedia.className = "tab";}
	if (tabID != 'tabSettings') {tabSettings.className = "tab";}
	if (tabID != 'tabRun') {tabRun.className = "tab";}
	if (tabID != 'tabExport') {tabExport.className = "tab";}
	if (tabID != 'tabHelp') {tabHelp.className = "tab";}

	//Save code if switching tabs
	if (selectedTab == 'tabCode' && tabID != 'tabCode') {
		codeClassArray[selectedCodeClass].methods[selectedCodeMethod].code = codeEditor.getValue();
	}
	if (selectedTab == 'tabRun') {StopAllTimers();}
	
	if (tabID == 'tabCode') {tabCode.className = "tabSelected";loadCodeTab();}
	if (tabID == 'tabMedia') {tabMedia.className = "tabSelected";loadMediaTab();}
	if (tabID == 'tabSettings') {tabSettings.className = "tabSelected";loadSettingsTab();}
	if (tabID == 'tabRun') {tabRun.className = "tabSelected";loadRunTab();}
	if (tabID == 'tabExport') {tabExport.className = "tabSelected";loadExportTab();}
	if (tabID == 'tabHelp') {tabHelp.className = "tabSelected";loadHelpTab();}

	selectedTab = tabID;
}

function saveGame() {
	if (selectedTab == 'tabCode') {
		codeClassArray[selectedCodeClass].methods[selectedCodeMethod].code = codeEditor.getValue();
	}
	alert(JSON.stringify(exportGame()));
	$.post('HTML5-Save.php',{ 'name': gameName, 'id': gameID, 'data': JSON.stringify(exportGame()) }, function(data) {
				if (gameID == -1) {gameID = data;saveGame();} else {alert("Saved!");} //First save makes the game, second save sets the gameID
			}
		).error(function() {alert("Error " + data); });
}

function loadGame(gameID) {
	if (gameID > -1) {
		$.post('HTML5-Load.php',{ 'id': gameID }, function(data) {
				importGame(data);
				loadGameWindow(false);
			}
		).error(function() {alert("Error " + data); });
	} else {
		alert("Please select a game.");
	}
}

function exportGame() {
	return new Array("1.0" ,gameID, gameName, gameWidth, gameHeight, codeDebug, codeClassArray, mediaArray);
}

function importGame(data) {
	var dataArray = JSON.parse(data);
	if (dataArray[0] == "1.0") {
		gameID = dataArray[1];
		gameName = dataArray[2];
		gameWidth = dataArray[3];
		gameHeight = dataArray[4];	
		codeDebug = dataArray[5];
		codeClassArray = dataArray[6];
		mediaArray = dataArray[7];
	}
}