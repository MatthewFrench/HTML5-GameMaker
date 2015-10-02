function loadExportTab() {
	var code = '';
	code += '<div  style="position:absolute;left:10px;top:10px;right:10px;bottom:10px;">To put your game in web page, copy the code below and paste it in the body of your web page.</p> <textarea id="exportTextArea" style="position:absolute;width:100%; bottom:40px;top:30px;resize: none;"></textarea><button type="button" onClick="location.href=\'HTML5-DownloadGame.php?id='+gameID+'\'" style="position:absolute;left:0px;bottom:5px;">Download Game Source</button><button type="button" onClick="saveCompiled()" style="position:absolute;left:160px;bottom:5px;">Share Compiled Game</button><span id="shareLink" style="position:absolute;left:300px;bottom:7px;"></span></div>';

	tabWindow.innerHTML = code;
	$("#exportTextArea").val(compile(false));
}

function saveCompiled() {
	$.post('HTML5-SaveCompiled.php',{ 'id': gameID, 'compiledData': JSON.stringify(compile(false)) }, function(data) {
		$('#shareLink').html('http://gamemakersgarage.com/html5/HTML5-ShareGame.php?gameID='+gameID);
	}).error(function() {alert("Error :" + data); });
}
