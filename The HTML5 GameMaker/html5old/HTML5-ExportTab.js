function loadExportTab() {
	var code = '';
	code += '<div  style="position:absolute;left:10px;top:10px;right:10px;bottom:10px;">To put your game in web page, copy the code below and paste it in the body of your web page.</p> <textarea id="exportTextArea" style="position:absolute;width:100%; bottom:0px;top:30px;resize: none;"></textarea></div>';

	tabWindow.innerHTML = code;
	$("#exportTextArea").val(compile(false));
}