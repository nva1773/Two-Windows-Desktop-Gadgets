////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2009 NVA.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
var s_gadgetPath = System.Gadget.path;
// Constants
LIST_NAME = "AlarmClockSettings";
MEDIA_PATH = "\\media\\alarm";
EXT_FILE = ".mp3";

////////////////////////////////////////////////////////////////////////////////
//
// SETTING FUNCTIONS
//
////////////////////////////////////////////////////////////////////////////////
function Init() 
{
	var temp;
	
	temp = System.Gadget.Settings.read("Second");
	if(temp != "") cbSecond.checked = temp == "true";
	
	temp = System.Gadget.Settings.read("Hour");
	if ( temp  != "" )
	{
		if( temp < 10 )
			txtHour.value = '0' + temp ;
		else
			txtHour.value = temp ;
	}
	else
		txtHour.value = "00";
		
	temp = System.Gadget.Settings.read("Minute");
	if ( temp  != "" )
	{
		if( temp < 10 )
			txtMinute.value = '0' + temp ;
		else
			txtMinute.value = temp ;
	}
	else
		txtMinute.value = "00";

	temp = System.Gadget.Settings.read("Active");
	if(temp != "") cbActive.checked = temp == "true";
	
	temp = System.Gadget.Settings.read("Repeat");
	if(temp != "") cbRepeat.checked = temp == "true";
		
	temp = System.Gadget.Settings.read("Signal");
	if(temp == "") temp = "1";
	selSignal.selectedIndex = parseInt(temp)-1;
	selSignal.focus(); // переводим фокус на элемент
	selSignal.blur(); // убераем фокус с элемента

	System.Gadget.onSettingsClosing = SettingsClosing;
	
	initPlayer();
}

function Save() 
{	
	hour = parseInt( txtHour.value );
	if( hour < 0 || hour > 23 )
		hour = 0;
	
	minute = parseInt( txtMinute.value );
	if( minute < 0 || minute > 59 )
		minute = 0;
	
	System.Gadget.Settings.write("Second", cbSecond.checked ? "true" : "false");
	System.Gadget.Settings.write("Hour", hour);
	System.Gadget.Settings.write("Minute", minute);
	System.Gadget.Settings.write("Active", cbActive.checked ? "true" : "false");
	System.Gadget.Settings.write("Signal", selSignal.value);
	System.Gadget.Settings.write("Repeat", cbRepeat.checked ? "true" : "false");
}

function SettingsClosing(event)
{
	if (event.closeAction == event.Action.commit) {
		Save();
	}
	stopPlayer();
	deletePlayList();
	event.cancel = false;
}

////////////////////////////////////////////////////////////////////////////////
//
// Event windows
//
////////////////////////////////////////////////////////////////////////////////
function onClickPlay()
{
	initPlayer();
	runPlayer();
}

function onClickStop()
{
	stopPlayer();
}

////////////////////////////////////////////////////////////////////////////////
//
// Player functions
//
////////////////////////////////////////////////////////////////////////////////
function initPlayer()
{
	s_player.uiMode = "none";
	s_player.settings.setMode( "loop", cbRepeat.checked ? "true" : "false" );
    s_player.settings.autoStart = false;
    s_player.settings.volume = 100;
    s_player.settings.mute = "false";
	stopPlayer();
	addPlayList();
}

function runPlayer()
{
	var playlist = s_player.playlistCollection.getByName(LIST_NAME);

	if(playlist.count > 0 && playlist.item(0).count > 0)
	{
		s_player.currentPlaylist = playlist.item(0);
		s_player.controls.play();
	}
	else
	{
	}
}

function stopPlayer()
{
	// Stopped State = 1; Paused State = 2; Playing State = 3;
	if(s_player.playState != 1){
		s_player.controls.stop();
	}
	s_player.currentPlaylist = s_player.newPlaylist("","");
}

function addPlayList()
{
	var playlist = null;
	var media = null;
	var path = s_gadgetPath + MEDIA_PATH + selSignal.value + EXT_FILE;
	var objFSO = new ActiveXObject("Scripting.FileSystemObject");
	
	if (objFSO.FileExists(path))
    {
		deletePlayList();
		if(s_player.playlistCollection.getByName(LIST_NAME).count == 0)
		{
			playlist = s_player.playlistCollection.newPlaylist(LIST_NAME);
			try
			{
				media = s_player.newMedia(path);
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
	var playlist = s_player.playlistCollection.getByName(LIST_NAME);
	var count = playlist.count;
	for(i=0;i<count;i++)
	{
		s_player.playlistCollection.remove(playlist.item(0));
	}
} 


