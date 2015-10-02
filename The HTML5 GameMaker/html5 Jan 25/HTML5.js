//The clickable tabs
var mainWindow, tabWindow, tabCode, tabMedia, tabSettings, tabRun, tabExport, tabHelp;
//The var that points to the selected tab
var selectedTab;
//The gameID for saving purposes
var gameID;
//Saving timer
var autoSaveTimer;
var saveStatus;

//When the page loads set up the editor
function load() {
	mainWindow = document.getElementById('mainWindow');
	loadMainMenu();
}

function loadMainMenu() {
	mainWindow.className = 'mainWindow';
	mainWindow.innerHTML = '<span style="font-size:40px;position:absolute;text-align:center;top:20px;width:100%;">HTML5 GameMaker</span><button style="font-size:20px;position:absolute;top:100px;width:250px;left:125px;" value="New Game" onClick="gameID=-1;loadGameWindow(true);">New Game</button><button style="font-size:20px;position:absolute;top:160px;width:250px;left:125px;" onClick="chooseGameWindow();" value="Choose Game">Choose Game</button><button style="font-size:20px;position:absolute;top:220px;width:250px;left:125px;" value="Load Game" onClick="loadGameFromFile();">Load Game From File</button><button style="font-size:20px;position:absolute;top:280px;width:250px;left:125px;" value="Game Templates" onClick="chooseTemplateWindow();">Game Templates</button><button style="font-size:20px;position:absolute;top:340px;width:250px;left:125px;" value="Tutorial" onClick="window.open(\'http://gamemakersgarage.com/html5/tutorial.html\',\'open_window\',\'menubar, toolbar, location, directories, status, scrollbars, resizable, dependent, width=640, height=480, left=0, top=0\');">Tutorial</button>';
}

function chooseGameWindow() {
	
	$.post('HTML5-ListGames.php', function(data) {
				mainWindow.className = 'mainWindow';
	var code = '<span style="font-size:40px;position:absolute;text-align:center;top:20px;width:100%;">Choose Game</span><div id="gamePicker">';
	code += data;
	code += '</div><button type="button" onClick="loadMainMenu();" style="position:absolute;left:15px; bottom:10px;">Main Menu</button>';
	code += '<button type="button" onClick="loadGame(selectedGameID);" style="position:absolute;right:15px; bottom:10px;">Go!</button>';
	code += '<button type="button" onClick="deleteGame(selectedGameID);" style="position:absolute;right:55px; bottom:10px;">Delete!</button>';
	code += '<button type="button" onClick="duplicateGame(selectedGameID);" style="position:absolute;right:115px; bottom:10px;">Duplicate!</button>';
	mainWindow.innerHTML = code;
			}
		).error(function() {alert("Error " + data); });
}

function chooseTemplateWindow() {
	
	$.post('HTML5-ListTemplates.php', function(data) {
				mainWindow.className = 'mainWindow';
	var code = '<span style="font-size:40px;position:absolute;text-align:center;top:20px;width:100%;">Choose Game Template</span><div id="gamePicker">';
	code += data;
	code += '</div><button type="button" onClick="loadMainMenu();" style="position:absolute;left:15px; bottom:10px;">Main Menu</button>';
	code += '<button type="button" onClick="loadTemplate(selectedGameID,true);" style="position:absolute;right:15px; bottom:10px;">Go!</button>';
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
	mainWindow.innerHTML = '<span style="position:absolute;top:4px;left:0px;width:100%;text-align:center;color:white;">HTML5 GameMaker</span><button type="button" onClick="saveGame();" style="position:absolute;left:15px;top:5px;">Save Game!</button><span id="saveStatus" style="position:absolute;left:100px;width:300px;color:white;">This game hasn\'t been saved yet.</span><div id="topBar"><div class="tab" id="tabCode" onclick="tabHit(\'tabCode\');">Code</div><div class="tab" id ="tabMedia" onclick="tabHit(\'tabMedia\');">Media</div><div class="tab" id ="tabSettings" onclick="tabHit(\'tabSettings\');">Settings</div><div class="tab" id ="tabRun" onclick="tabHit(\'tabRun\');">Run</div><div class="tab" id ="tabExport" onclick="tabHit(\'tabExport\');">Export</div><div class="tab" id ="tabHelp" onclick="tabHit(\'tabHelp\');">Help</div></div><div id="tabWindow"></div>';

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

	//Set up the auto save timer
	saveStatus = document.getElementById('saveStatus');
	autoSaveTimer=setInterval("saveGame()",1000*120);
}

//When a tab is hit this sets up the screen
function tabHit(tabID) {
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
	if (selectedTab == 'tabRun') {StopAllTimers();Game_Close();}

	//Clear window
	tabWindow.innerHTML = "";
	
	if (tabID == 'tabCode') {tabCode.className = "tabSelected";loadCodeTab();}
	if (tabID == 'tabMedia') {tabMedia.className = "tabSelected";loadMediaTab();}
	if (tabID == 'tabSettings') {tabSettings.className = "tabSelected";loadSettingsTab();}
	if (tabID == 'tabRun') {tabRun.className = "tabSelected";loadRunTab();}
	if (tabID == 'tabExport') {tabExport.className = "tabSelected";loadExportTab();}
	if (tabID == 'tabHelp') {tabHelp.className = "tabSelected";loadHelpTab();}

	selectedTab = tabID;
}

function getTime() {
	var now=new Date();
	var hour=now.getHours();
	var min=now.getMinutes();
	var sec=now.getSeconds();

	if (min<=9) { min="0"+min; }
	if (sec<=9) { sec="0"+sec; }
	if (hour>12) { hour=hour-12; add="pm"; }
	else { hour=hour; add="am"; }
	if (hour==12) { add="pm"; }

	return ((hour<=9) ? "0"+hour : hour) + ":" + min + ":" + sec + " " + add;
}
var gameWindow = window;

function saveGame() {
	if (selectedTab == 'tabCode') {
		codeClassArray[selectedCodeClass].methods[selectedCodeMethod].code = codeEditor.getValue();
	}
	$.post('HTML5-Save.php',{ 'name': gameName, 'id': gameID, 'data': JSON.stringify(exportGame()) }, function(data) {
				if (data == -2) {
					$("#saveStatus").text("");
					$("#saveStatus").html("Please Log In: <button onClick='loginButton();'>Login</button>");
				} else {
					if (gameID == -1 || data != gameID) {gameID = data;saveGame();} else { //First save makes the game, second save sets the gameID
						$("#saveStatus").html("");
						$("#saveStatus").text("Game saved at "+getTime());
					}
				}
			}
		).error(function() {$("#saveStatus").text("Error saving: " + data); });
}

function loginButton() {
	gameWindow.open('http://gamemakersgarage.com/html5/HTML5-LoginOnly.html','_blank','width=340, height=280, left=0, top=0');
}

function loadGameFromFile() {
	var t = prompt("Please copy the contents from your game file and paste here:","");
	if (t != "") {
		importGame(t);
		loadGameWindow(false);
	}
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

function deleteGame(gameID) {
	if (gameID > -1) {
		if (confirm("Are you sure you want to delete this awesomely cool creation?")) {
			$.post('HTML5-Delete.php',{ 'id': gameID }, function(data) {
					alert(data);
					chooseGameWindow();
				}
			).error(function() {alert("Error " + data); });
		}
	} else {
		alert("Please select a game.");
	}
}

function duplicateGame(gameID) {
	if (gameID > -1) {
		$.post('HTML5-Duplicate.php',{ 'id': gameID }, function(data) {
				chooseGameWindow();
			}
		).error(function() {alert("Error " + data); });
	} else {
		alert("Please select a game.");
	}
}

function loadTemplate(id) {
	if (id > -1) {
		$.post('HTML5-LoadTemplate.php',{ 'id': id }, function(data) {
				importGame(data);
				gameID = -1;
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