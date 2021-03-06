////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2019 NVA.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

var s_mySettings = new Settings();
var imgError;
var imgOk;
var showOptions = true;
var saveContacts;
var restoreContacts;
var strContacts;
var s_Timer = null;

////////////////////////////////////////////////////////////////////////////////
//
// SETTING FUNCTIONS
//
////////////////////////////////////////////////////////////////////////////////

function initSetting()
{
	s_mySettings.load();
	System.Gadget.onSettingsClosing = SettingsClosing;

	var oBackground = document.getElementById("imgBackground");
    oBackground.src = "url(images/bgSetting.png)";

	imgOk = imgBackground.addImageObject('images/ok.png', 120, 32);
	imgError = imgBackground.addImageObject('images/error.png', 120, 32);
	imgOk.opacity = 0;
	imgError.opacity = 0;
	
	showSettingsOptions();
	strContacts = System.Gadget.document.getElementById("strPhonebook").value;
}

function SettingsClosing()
{
	clearTimeout(s_Timer);
	if(s_mySettings.readAction() == "restore")
	{
		System.Gadget.document.getElementById("strPhonebook").value = strContacts;
	}
}


////////////////////////////////////////////////////////////////////////////////
//
// Options
//
////////////////////////////////////////////////////////////////////////////////
function showSettingsOptions()
{
	var m;

	saveContacts = imgBackground.addImageObject('images/bSave.png', 25, 10);
	restoreContacts = imgBackground.addImageObject('images/bRestore.png', 25, 57);	

	// create SAVE control
	m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 25;
	m.style.posTop = 10;
	m.style.posHeight = 37;
	m.style.posWidth = 82;
	m.onmouseover = showSave;
	m.onmouseout  = hideSave;
	m.onclick = onClickSave;
	targets.appendChild(m);

	// create RESTORE control
	m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 25;
	m.style.posTop = 57;
	m.style.posHeight = 37;
	m.style.posWidth = 82;
	m.onmouseover = showRestore;
	m.onmouseout  = hideRestore;
	m.onclick = onClickRestore;
	targets.appendChild(m);

	saveContacts.opacity = 60;
	restoreContacts.opacity = 60;
	
}

function showSave() { if (showOptions) saveContacts.opacity = 100; }
function hideSave() { if (showOptions) saveContacts.opacity = 60; }

function showRestore() { if (showOptions) restoreContacts.opacity = 100; }
function hideRestore() { if (showOptions) restoreContacts.opacity = 60; }

////////////////////////////////////////////////////////////////////////////////
//
// writeSetting(string theSettingName, string aSettingValue)- Saves a Setting
// readSetting(string theSettingName)- Reads a Setting
//
////////////////////////////////////////////////////////////////////////////////
function writeSetting(theSettingName, aSettingValue)
{
	try
	{
		System.Gadget.Settings.write(theSettingName, aSettingValue);
	}
	catch (objException)
	{
	}
}

function readSetting(theSettingName)
{
	var retVal = "";
	try
	{
		retVal = System.Gadget.Settings.read(theSettingName);
	}
	catch (objException)
	{
		retVal = null;
	}
	return retVal;
}

////////////////////////////////////////////////////////////////////////////////
//
// Settings object
//
////////////////////////////////////////////////////////////////////////////////
function Settings()
{
	this.Action = readSetting("Action") || "none";
		
	///////////////////////////////////////////////////////////////////////////
	this.readAction = function()
	{
		this.Action = readSetting("Action") || "none";
		return this.Action;
	}
	
	///////////////////////////////////////////////////////////////////////////
	this.saveAction = function(Action)
	{
		writeSetting("Action", Action);
		this.Action = Action;
	}
	
	///////////////////////////////////////////////////////////////////////////
	this.load = function()
	{
		this.Action = readSetting("Action") || "none";
	}
	
	///////////////////////////////////////////////////////////////////////////
	this.init = function()
	{
		this.Action = readSetting("Action") || "none";
		
		strContacts = readContacts();
		var n = strContacts.indexOf("ERROR:");
		if((n == -1) || (n != 0))
		{
			System.Gadget.document.getElementById("strPhonebook").value = strContacts;
			s_mySettings.saveAction("restore");
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Restore and Save Server List form File
//
////////////////////////////////////////////////////////////////////////////////
function onClickSave()
{
	// return "OK" if success or "ERROR" if crash
	var str = writeContacts(strContacts);
	
	if(s_Timer != null) clearTimeout(s_Timer);
	if(str == "OK")
	{
		imgOk.opacity = 100;
		imgError.opacity = 0;
		strInfo.innerHTML = "Contacts saved successfully!";
		s_mySettings.saveAction("save");
	}
	else
	{
		imgOk.opacity = 0;
		imgError.opacity = 100;
		strInfo.innerHTML = "Error saving contacts!";
		s_mySettings.saveAction("error");
	}
	s_Timer = setTimeout("hideInfo()", 3000);
	divInfo.style.visibility = "visible";
}

function onClickRestore()
{
	// return "ERROR: description or name" if crash
	var str = readContacts();
	var n = str.indexOf("ERROR:");
	if(s_Timer != null) clearTimeout(s_Timer);
	if((n == -1) || (n != 0))
	{
		strContacts = str;
		imgOk.opacity = 100;
		imgError.opacity = 0;
		strInfo.innerHTML = "Contacts restore successfully!";
		s_mySettings.saveAction("restore");
	}
	else
	{
		imgOk.opacity = 0;
		imgError.opacity = 100;
		strInfo.innerHTML = str.substring(7);
		s_mySettings.saveAction("error");
	}
	s_Timer = setTimeout("hideInfo()", 3000);
	divInfo.style.visibility = "visible";
}

////////////////////////////////////////////////////////////////////////////////
//
// Hide string Info and images "OK" and "ERROR"
//
////////////////////////////////////////////////////////////////////////////////
function hideInfo()
{
	clearTimeout(s_Timer);
	s_Timer = null;
	imgOk.opacity = 0;
	imgError.opacity = 0;
	strInfo.innerHTML = "";
	divInfo.style.visibility = "hidden";
}

////////////////////////////////////////////////////////////////////////////////
//
// functions Write and Read for file
//
////////////////////////////////////////////////////////////////////////////////
function writeContacts(str)
{
	var strOut = "OK";
	var fileName = "ContactList.txt";
	// "Desktop" or "Favorites" or "Recent" or "Templates" or  System.Gadget.path
	var objShell = new ActiveXObject("WScript.Shell");
	var folderPath = objShell.SpecialFolders("MyDocuments");
	var filePath = folderPath + "\\" + fileName;
	// create object FSO
	var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	try 
	{
   		// Open files for writing
		var file = objFSO.OpenTextFile(filePath, 2, true);
		var lines = str.split('\n');
		for(var i = 0; i < lines.length; i++)
		{
			if(lines[i].length > 4)	file.WriteLine(lines[i].replace(/[\r\n]+/gm, ""));
		}
   		// Close files
		file.Close();
 	}
	catch(e)
	{
		strOut = "ERROR";
	}
	objShell = undefined;
	objFSO = undefined;
	
	return strOut;
}

function readContacts()
{
	var strOut = "";
	var fileName = "ContactList.txt";
	// "Desktop" or "Favorites" or "Recent" or "Templates" or  System.Gadget.path
	var objShell = new ActiveXObject("WScript.Shell");
	var folderPath = objShell.SpecialFolders("MyDocuments"); 
	var filePath = folderPath + "\\" + fileName;
	// create object FSO
	var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	// check file exists
	if(objFSO.FileExists(filePath))
	{
		// Open files for reading
		var file  = objFSO.OpenTextFile(filePath, 1);
		while( !file.AtEndOfStream )
		{
			try 
			{
				strOut += file.ReadLine() + "\r\n";
			}
			catch(e)
			{
				strOut = "ERROR: " + e.name;
			}
		}
		// Close files
		file.Close();
	}
	else
	{
		strOut = "ERROR: Can't find " + fileName;
	}
	objShell = undefined;
	objFSO = undefined;
	
	return strOut;
}
