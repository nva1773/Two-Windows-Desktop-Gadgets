////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2019 NVA.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

var s_mySettings = new vncSettings();

////////////////////////////////////////////////////////////////////////////////
//
// SETTING FUNCTIONS
//
////////////////////////////////////////////////////////////////////////////////

function initSetting()
{
	s_mySettings.load();
	
	password.value = s_mySettings.Password;
	servers.value = s_mySettings.Servers;

	System.Gadget.onSettingsClosing = SettingsClosing;
}

function SettingsClosing(event)
{
    // Save the settings if the user clicked OK.
    if (event.closeAction == event.Action.commit)
    {
		s_mySettings.savePassword(password.value);
		s_mySettings.saveServers(servers.value);
    }
    // Allow the Settings dialog to close.
    event.cancel = false;
}

////////////////////////////////////////////////////////////////////////////////
//
// writeSetting(string theSettingName, string aSettingValue)- Saves a Setting
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

////////////////////////////////////////////////////////////////////////////////
//
// readSetting(string theSettingName)- Reads a Setting
//
////////////////////////////////////////////////////////////////////////////////
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
function vncSettings()
{
	this.Password = readSetting("Password") || "";	//uit46T@q
	this.Input = readSetting("Input") || ""; 		//10.99.12.27
	this.Servers = readSetting("Servers") || "";	//CM1-MICR-S1-L1;192.168.12.30;&#13;&#10;
	this.Select = new Array();
	
	///////////////////////////////////////////////////////////////////////////
	this.savePassword = function(Password)
	{
		writeSetting("Password", Password);
		this.Password = Password;
	}
	
	this.saveInput = function(Input)
	{
		writeSetting("Input", Input);
		this.Input = Input;
	}
	
	this.saveServers = function(Servers)
	{
		writeSetting("Servers", Servers);
		this.Servers = Servers;
	}
	///////////////////////////////////////////////////////////////////////////
	this.load = function()
	{
		this.Password = readSetting("Password") || "";
		this.Input = readSetting("Input") || "";
		this.Servers = readSetting("Servers") || ""; 
		this.Select = stringToArray(this.Servers);
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Convert TextArrea to Array
//
////////////////////////////////////////////////////////////////////////////////
function stringToArray(str)
{
	var array = new Array();
	
	if(str.length >= 4)
	{
		var lines = str.split('\n');
		for(var i=0; i<lines.length; i++)
		{
			if(lines[i].length >= 4 && lines[i].length <= 33)
			{
				var data = lines[i].split(';');
				if(data.length >= 2)
				{
					array.push([data[0].replace(/[\r\n]+/gm, ""), data[1].replace(/[\r\n]+/gm, "")]);
				}
			}
		}
	}
	
	return array;
}

////////////////////////////////////////////////////////////////////////////////
//
// Event key "Enter" (keyCode = 13) for "Password"
//
////////////////////////////////////////////////////////////////////////////////
function keyPressSetting(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        // to do ...
		SettingsClosing(event.Action.commit);
        return false;
    }
    return true;
}

////////////////////////////////////////////////////////////////////////////////
//
// Restore and Backup Server List form File
//
////////////////////////////////////////////////////////////////////////////////
function onClickRestore()
{
	servers.value = readServerList();
}

function onClickBackup()
{
	writeServerList(servers.value); // return "OK" if success or "ERROR" if crash
}
