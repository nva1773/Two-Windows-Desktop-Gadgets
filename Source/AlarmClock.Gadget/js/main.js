////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2009 NVA.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

var g_secondTick = false;
var g_hour = null;
var g_minute = null;
var g_hourAlarm = "";
var g_minuteAlarm = "";
var g_activeAlarm = false;
var g_signalName = "";
var g_repeatPlay = "";
var g_alarmRepeat = false;
var g_swapBell = false;
var g_oneTick = false;
var g_gadgetPath = System.Gadget.path;
var t_id = null;
// Constants
LIST_NAME = "AlarmClockGadget";
MEDIA_PATH = "\\media\\alarm";
EXT_FILE = ".mp3";

////////////////////////////////////////////////////////////////////////////////
//
// Initialize Main
//
////////////////////////////////////////////////////////////////////////////////
function Main()
{
	readTime();
	readSettings();
	checkAlarm();

	System.Gadget.settingsUI = "settings.html";
	System.Gadget.onSettingsClosed = settingsClosed;

	initPlayer();
	
	window.onunload = closeMain;
	
	setInterval("oneTick()", 1000);
}

////////////////////////////////////////////////////////////////////////////////
//
// Dispose Main
//
////////////////////////////////////////////////////////////////////////////////
function closeMain()
{
	stopPlayer();
	deletePlayList();
}

////////////////////////////////////////////////////////////////////////////////
//
// Event closed settings
//
////////////////////////////////////////////////////////////////////////////////
function settingsClosed(event)
{
    if(event.closeAction == event.Action.commit)
    {
		readSettings()
		initPlayer();
    }
}

////////////////////////////////////////////////////////////////////////////////
//
// Event every one second
//
////////////////////////////////////////////////////////////////////////////////
function oneTick()
{
	readTime();
	checkAlarm();
	g_oneTick = !g_oneTick;
	if(g_alarmRepeat) swapBell();
}

function swapBell()
{
	if(g_swapBell) 
		bell.src="images/bell_red.png"
	else
		bell.src="images/bell_yellow.png"
	g_swapBell = !g_swapBell;
}

////////////////////////////////////////////////////////////////////////////////
//
// Event on click "bell"
//
////////////////////////////////////////////////////////////////////////////////
function onClickBell()
{
	if(g_alarmRepeat){
		g_alarmRepeat = false;
		g_swapBell = false;
		stopPlayer();
		bell.src="images/bell_yellow.png"
		bell.style.visibility = "hidden";
		clearTimeout(t_id);
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Read settings
//
////////////////////////////////////////////////////////////////////////////////
function readSettings()
{
	var temp;
	
	temp = System.Gadget.Settings.read("Second");
	if(temp != "") g_secondTick = temp == "true";
		
	g_hourAlarm = System.Gadget.Settings.read("Hour");
	g_minuteAlarm = System.Gadget.Settings.read("Minute");
	
	temp = System.Gadget.Settings.read("Active");
	if(temp != "") g_activeAlarm = temp == "true";
	
	g_signalName = System.Gadget.Settings.read("Signal");
	
	g_repeatPlay = System.Gadget.Settings.read("Repeat");
	if(g_repeatPlay == "") g_repeatPlay = "false";
		
	if( g_hourAlarm == "" )
		g_hourAlarm = 0;
	if( g_minuteAlarm == "" )
		g_minuteAlarm = 0;
		
	if( g_minuteAlarm < 10 ) 
		g_minuteAlarm = '0' + g_minuteAlarm;
	if( g_hourAlarm < 10 )
		g_hourAlarm = '0' + g_hourAlarm;
	document.getElementById("alarm").innerHTML = g_hourAlarm + ':' + g_minuteAlarm;
	
	if( g_activeAlarm )
		bell.style.visibility = "visible";
	else
		bell.style.visibility = "hidden";
}

////////////////////////////////////////////////////////////////////////////////
//
// Read system time
//
////////////////////////////////////////////////////////////////////////////////
function readTime()
{
	d = new Date;
	
	g_hour = d.getHours();
	g_minute = d.getMinutes();
	
	if( g_minute < 10 ) 
		g_minute = '0' + g_minute;
	if( g_hour < 10 )
		g_hour = '0' + g_hour;

	if(g_secondTick)
	{
		if(g_oneTick) second.style.color = "#DDDDDD";
		else second.style.color = "#AAAAAA";
	}
	else
	{
		second.style.color = "#DDDDDD";
	}	
		
	document.getElementById("hour").innerHTML = g_hour;
	document.getElementById("second").innerHTML = ':';
	document.getElementById("minute").innerHTML = g_minute;
}

////////////////////////////////////////////////////////////////////////////////
//
// Check current time and alarm
//
////////////////////////////////////////////////////////////////////////////////
function checkAlarm()
{
	// On Player
	if( g_minuteAlarm == g_minute && g_hourAlarm == g_hour && g_activeAlarm )
	{
		g_activeAlarm = false;
		System.Gadget.Settings.write("Active", "false");
		
		if(g_repeatPlay == "false")
			bell.style.visibility = "hidden";
		else
		{
			// if repaet, auto stop after 3 minute (180000 ms)
			g_alarmRepeat = true;
			t_id = setTimeout("onClickBell()", 180000);
		}
		
		runPlayer();
	}
}


////////////////////////////////////////////////////////////////////////////////
//
// Player functions
//
////////////////////////////////////////////////////////////////////////////////
function initPlayer()
{
	g_player.uiMode = "none";
	g_player.settings.setMode( "loop", g_repeatPlay );
    g_player.settings.autoStart = false;
    g_player.settings.volume = 100;
    g_player.settings.mute = "false";
	stopPlayer();
	addPlayList();
}

function runPlayer()
{
	var playlist = g_player.playlistCollection.getByName(LIST_NAME);

	if(playlist.count > 0 && playlist.item(0).count > 0)
	{
		g_player.currentPlaylist = playlist.item(0);
		g_player.controls.play();
	}
}

function stopPlayer()
{
	// Stopped State = 1; Paused State = 2; Playing State = 3;
	if(g_player.playState != 1){
		g_player.controls.stop();
	}
	g_player.currentPlaylist = g_player.newPlaylist("","");
}

function addPlayList()
{
	var playlist = null;
	var media = null;
	var path = g_gadgetPath + MEDIA_PATH + g_signalName + EXT_FILE;
	var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	
	if (objFSO.FileExists(path))
    {
		deletePlayList();
		if(g_player.playlistCollection.getByName(LIST_NAME).count == 0)
		{
			playlist = g_player.playlistCollection.newPlaylist(LIST_NAME);
			try
			{
				media = g_player.newMedia(path);
			}
			catch(e)
			{
			}
		
			try
			{
				playlist.appendItem(media);
			}
			catch(e)
			{
			}
		}
	}
}

function deletePlayList()
{
	var playlist = g_player.playlistCollection.getByName(LIST_NAME);
	var count = playlist.count;
	for(i=0;i<count;i++)
	{
		g_player.playlistCollection.remove(playlist.item(0));
	}
}


