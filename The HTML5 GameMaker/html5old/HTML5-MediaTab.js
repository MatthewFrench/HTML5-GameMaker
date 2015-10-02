//The variables that hold the code, control the editor and the ID for selected code
var mediaArray, selectedMedia, mediaViewer;

function loadMediaTab() {
	var code = '';
		code += '<div id="mediaBtnHolder">';
		code += '<button id="addImageBtn" type="button" onClick="newImageBtn();">Add Image</button>';
		code += '<button id="addSoundBtn" type="button" onClick="newSoundBtn();">Add Sound</button>';
		code += '<button id="renameMediaBtn" type="button" onClick="renameMediaBtn();">Rename Media</button>';
		code += '<button id="setMediaSourceBtn" type="button" onClick="setMediaSourceBtn();">Set Media Source</button>';
		code += '<button id="deleteMediaBtn" type="button" onClick="deleteMediaBtn();">Delete Media</button>';
		code += '</div>';
		code += '<div id="mediaPicker">';

		code += '</div><div id="mediaViewer"></div>'

		tabWindow.innerHTML = code;

		mediaViewer = document.getElementById("mediaViewer");

		fillMedia();
		mediaHit(selectedMedia);
}

function MediaClass (name,source,isImage) {
	//Method ID is known by it's position in the class array.
	this.name = name;
	this.source = source;
	this.isImage = isImage;
}

function fillMedia() {
	var code = '';
	code += '<div class ="methodCategory">Images</div>';
	for (var i = 0; i < mediaArray.length; i++) {
		if (mediaArray[i].isImage) {
			var methodClass = '"methodTitle"';
			if (selectedMedia == i) {methodClass = '"methodTitleSelected"';}
			code += '<div class ='+ methodClass + ' onclick="mediaHit(' + i  + ')" ' + 'id="media' + i + '" ' +'>'+ mediaArray[i].name +'</div>';
		}
	}


	code += '<div class ="methodCategory">Sounds</div>';
	for (var i = 0; i < mediaArray.length; i++) {
		if (!mediaArray[i].isImage) {
			var methodClass = '"methodTitle"';
			if (selectedMedia == i) {methodClass = '"methodTitleSelected"';}
			code += '<div class ='+ methodClass + ' onclick="mediaHit(' + i  + ')" ' + 'id="media' + i + '" ' +'>'+ mediaArray[i].name +'</div>';
		}
	}

	document.getElementById('mediaPicker').innerHTML = code;
}

function mediaHit(mediaNum) {
	var oldMedia = document.getElementById('media'+selectedMedia);
	var newMedia = document.getElementById('media'+mediaNum);
	
	if (oldMedia != null) {oldMedia.className = "methodTitle";}
	if (newMedia != null) {newMedia.className = "methodTitleSelected";}
	
	selectedMedia = mediaNum;

		//Display the media if exists
	if (mediaArray.length > 0) {
		if (mediaArray[selectedMedia].isImage) {
			mediaViewer.innerHTML = "Name: " + mediaArray[selectedMedia].name+"</br>" + "Src: " + mediaArray[selectedMedia].source + '<img src="'+ mediaArray[selectedMedia].source +'" alt="Your Image" />';
		} else {
			mediaViewer.innerHTML = "Name: " + mediaArray[selectedMedia].name+"</br>" + "Src: " + mediaArray[selectedMedia].source + '</p><audio src="'+mediaArray[selectedMedia].source+'" controls preload="auto" autobuffer>Your browser does not support the audio element.</audio>';
		}
	} else {mediaViewer.innerHTML ='';}
}

function newImageBtn () {
	var source=prompt("Please enter the source of this new media:","http://");
	if (source!=null && source!="")
	{
		var name=prompt("Please enter the name of this new media:","");
		if (name!=null && name!="")
		{
			mediaArray.push(new MediaClass(name, source, true));
			fillMedia();
			mediaHit(mediaArray.length-1);
		}
	}	
}
function newSoundBtn () {
	var source=prompt("Please enter the source of this new media:","http://");
	if (source!=null && source!="")
	{
		var name=prompt("Please enter the name of this new media:","");
		if (name!=null && name!="")
		{
			mediaArray.push(new MediaClass(name, source, false));
			fillMedia();
			mediaHit(mediaArray.length-1);
		}
	}	
}
function renameMediaBtn () {
	var name=prompt("Please enter the new class name:","");
	if (name!=null && name!="")
	{
		mediaArray[selectedMedia].name=name;
		fillMedia();
	}
}
function deleteMediaBtn () {
	if (confirm("Are you sure you want to delete this media?"))
	{
		var toDelete = selectedMedia;
		mediaArray.splice(toDelete, 1);
		mediaViewer.innerHTML ='';
		fillMedia();
	}
}

function setMediaSourceBtn () {
	var name=prompt("Please enter the new source:",mediaArray[selectedMedia].source);
	if (name!=null)
	{
		mediaArray[selectedMedia].source=name;
		mediaHit(selectedMedia);
	}
}