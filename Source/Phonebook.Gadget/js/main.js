////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2019 NVA.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
var g_mySettings = new Settings();
var g_Controls = new Array(6);
var g_SelectLines = new Array(5);
var g_Phonebook = new Array();
var g_Contacts = new Array();
var g_PageControl = 1;
var g_MaxPages = 1;
var g_LineIndex = 0;

// Constant
var MAX_PAGE_ITEM = 5;

////////////////////////////////////////////////////////////////////////////////
//
// Initialize Main
//
////////////////////////////////////////////////////////////////////////////////
function initMain()
{
	// Load image for background
	var oBackground = document.getElementById("imgBackground");
	oBackground.src = "url(images/bgMain.png)";
	
	// Gadget settings page
	g_mySettings.init();
	System.Gadget.settingsUI = "settings.html";
	System.Gadget.onShowSettings = settingsShow;
	System.Gadget.onSettingsClosed = settingsClosed;

	// Specify the flyout root.
	System.Gadget.Flyout.file = "flyout.html";
	System.Gadget.Flyout.onShow = showFlyout;
	System.Gadget.Flyout.onHide = hideFlyout;
	
	// init display objects
	initPhoneBook("init");
	
	// show display objects
	showControls();
	showTextLines();
}

////////////////////////////////////////////////////////////////////////////////
//
// Event Settings
//
////////////////////////////////////////////////////////////////////////////////
function settingsShow()
{
	strPhonebook.value = arrayToString(g_Phonebook);
}

function settingsClosed()
{
	var action = g_mySettings.readAction();
	if(action == "restore")
    {
		initPhoneBook(action);
    }
}

////////////////////////////////////////////////////////////////////////////////
//
// Event Selected Group
//
////////////////////////////////////////////////////////////////////////////////
function selectedGroup()
{
	initContacts("selected");
}

////////////////////////////////////////////////////////////////////////////////
//
// Event Flyout
//
////////////////////////////////////////////////////////////////////////////////
function showFlyout()
{
	selGroup.disabled = true;
}

function hideFlyout()
{
	selGroup.disabled = false;
	var action = g_mySettings.readAction();
	switch(action)
	{
		case "update":
			updatePhoneBook(action);
			break;
		case "add":
			addPhoneBook(action);
			break;
		case "remove":
			removePhoneBook(action);
			break;
		case "exit":
			break;
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Controls
//
////////////////////////////////////////////////////////////////////////////////
function showControls()
{

	// phonebook page control image
	imgBackground.addImageObject('images/page_control.png', 25, 134);

	// phonebook control buttons
	g_Controls[0] = imgBackground.addImageObject('images/bPlus.png'     , 107, 136);
	g_Controls[1] = imgBackground.addImageObject('images/bPlus-over.png', 107, 136);
	g_Controls[2] = imgBackground.addImageObject('images/bPrev.png'     ,  28, 136);
	g_Controls[3] = imgBackground.addImageObject('images/bPrev-over.png',  28, 136);
	g_Controls[4] = imgBackground.addImageObject('images/bNext.png'     ,  82, 136);
	g_Controls[5] = imgBackground.addImageObject('images/bNext-over.png',  82, 136);

	// controls buttons select effect 
	g_Controls[1].opacity = 0;
	g_Controls[3].opacity = 0;
	g_Controls[5].opacity = 0;

	// create ADD control
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 107;
	m.style.posTop = 136;
	m.style.posHeight = 16;
	m.style.posWidth = 16;
	m.onmouseover = showAdd;
	m.onmouseout  = hideAdd;
	m.onclick = clickAdd;
	targets.appendChild(m);

	// create PREV controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 28;
	m.style.posTop = 136;
	m.style.posHeight = 16;
	m.style.posWidth = 16;
	m.onmouseover = showPrev;
	m.onmouseout  = hidePrev;
	m.onclick = clickPrev;
	targets.appendChild(m);

	// create NEXT controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 82;
	m.style.posTop = 136;
	m.style.posHeight = 16;
	m.style.posWidth = 16;
	m.onmouseover = showNext;
	m.onmouseout  = hideNext;
	m.onclick = clickNext;
	targets.appendChild(m);
	
	// update string control
	updateControl()
}

// control selected effect
function showAdd()  { if (!System.Gadget.Flyout.show) { g_Controls[1].opacity = 100; g_Controls[0].opacity = 0;} }
function showPrev() { if (!System.Gadget.Flyout.show) { g_Controls[3].opacity = 100; g_Controls[2].opacity = 0;} }
function showNext() { if (!System.Gadget.Flyout.show) { g_Controls[5].opacity = 100; g_Controls[4].opacity = 0;} }

function hideAdd()  { g_Controls[0].opacity = 100; g_Controls[1].opacity = 0;}
function hidePrev() { g_Controls[2].opacity = 100; g_Controls[3].opacity = 0;}
function hideNext() { g_Controls[4].opacity = 100; g_Controls[5].opacity = 0;}

// Previous page control function
function clickPrev() 
{ 
	if ((g_PageControl > 1) && !System.Gadget.Flyout.show) 
	{ 
		g_PageControl--;
		showContacts();
	} 
}

// Next page control function
function clickNext() 
{ 
	if ((g_PageControl < g_MaxPages) && !System.Gadget.Flyout.show) 
	{ 
		g_PageControl++;
		showContacts(); 
	} 
}

// control PLUS acction
function clickAdd() 
{ 

	if (!System.Gadget.Flyout.show)
	{	
		// initialize flyout return action
		g_mySettings.saveAction("addContact");
		
		// clean-up variables to send the contacts info to Flyout page
		strContactGroup.value = "";
		strContactName.value  = "";
		strContactPhone.value = "";

		// show flyout page
		System.Gadget.Flyout.show = true;
	}

}

// update string control
function updateControl()
{
	strControl.innerHTML = "" + g_PageControl + "/" + g_MaxPages;
}

////////////////////////////////////////////////////////////////////////////////
//
// Show text lines separatos and mouse select effect
//
////////////////////////////////////////////////////////////////////////////////
function showTextLines()
{
	// contacts lines
	imgBackground.addImageObject('images/line.png', 22, 29);
	imgBackground.addImageObject('images/line.png', 22, 49);
	imgBackground.addImageObject('images/line.png', 22, 69);
	imgBackground.addImageObject('images/line.png', 22, 89);
	imgBackground.addImageObject('images/line.png', 22, 109);
	imgBackground.addImageObject('images/line.png', 22, 129);

	// contacts select effect images
	g_SelectLines[0] = imgBackground.addImageObject('images/selected.png', 22, 31);
	g_SelectLines[1] = imgBackground.addImageObject('images/selected.png', 22, 51);
	g_SelectLines[2] = imgBackground.addImageObject('images/selected.png', 22, 71);
	g_SelectLines[3] = imgBackground.addImageObject('images/selected.png', 22, 91);
	g_SelectLines[4] = imgBackground.addImageObject('images/selected.png', 22, 111);
	
	// contacts select effects images opacity
	g_SelectLines[0].opacity = 0;
	g_SelectLines[1].opacity = 0;
	g_SelectLines[2].opacity = 0;
	g_SelectLines[3].opacity = 0;
	g_SelectLines[4].opacity = 0;

	// create ContactLine 1 controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 22;
	m.style.posTop = 32;
	m.style.posHeight = 15;
	m.style.posWidth = 100;
	m.onmouseover = selectContactLine1;
	m.onmouseout  = hideContactLine1;
	m.onclick = clickContactLine1;
	targets.appendChild(m);

	// create ContactLine 2 controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 22;
	m.style.posTop = 52;
	m.style.posHeight = 15;
	m.style.posWidth = 100;
	m.onmouseover = selectContactLine2;
	m.onmouseout  = hideContactLine2;
	m.onclick = clickContactLine2;
	targets.appendChild(m);

	// create ContactLine 3 controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 22;
	m.style.posTop = 72;
	m.style.posHeight = 15;
	m.style.posWidth = 100;
	m.onmouseover = selectContactLine3;
	m.onmouseout  = hideContactLine3;
	m.onclick = clickContactLine3;
	targets.appendChild(m);

	// create ContactLine 4 controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 22;
	m.style.posTop = 92;
	m.style.posHeight = 15;
	m.style.posWidth = 100;
	m.onmouseover = selectContactLine4;
	m.onmouseout  = hideContactLine4;
	m.onclick = clickContactLine4;
	targets.appendChild(m);

	// create ContactLine 5 controls
	var m = document.createElement('DIV');
	m.className = 'target';
	m.style.posLeft = 22;
	m.style.posTop = 112;
	m.style.posHeight = 15;
	m.style.posWidth = 100;
	m.onmouseover = selectContactLine5;
	m.onmouseout  = hideContactLine5;
	m.onclick = clickContactLine5;
	targets.appendChild(m);

}

// Line select effect
function selectContactLine1() { if (!System.Gadget.Flyout.show) { g_SelectLines[0].opacity = 30; } }
function selectContactLine2() {	if (!System.Gadget.Flyout.show) { g_SelectLines[1].opacity = 30; } }
function selectContactLine3() { if (!System.Gadget.Flyout.show) { g_SelectLines[2].opacity = 30; } }
function selectContactLine4() { if (!System.Gadget.Flyout.show) { g_SelectLines[3].opacity = 30; } }
function selectContactLine5() { if (!System.Gadget.Flyout.show) { g_SelectLines[4].opacity = 30; } }

// Line hide effect
function hideContactLine1() { g_SelectLines[0].opacity = 0; }
function hideContactLine2() { g_SelectLines[1].opacity = 0; }
function hideContactLine3() { g_SelectLines[2].opacity = 0; }
function hideContactLine4() { g_SelectLines[3].opacity = 0; }
function hideContactLine5() { g_SelectLines[4].opacity = 0; }

// Line click functions
function clickContactLine1() { if (!System.Gadget.Flyout.show) { g_LineIndex = 0; clickContactLine(); } }
function clickContactLine2() { if (!System.Gadget.Flyout.show) { g_LineIndex = 1; clickContactLine(); } }
function clickContactLine3() { if (!System.Gadget.Flyout.show) { g_LineIndex = 2; clickContactLine(); } }
function clickContactLine4() { if (!System.Gadget.Flyout.show) { g_LineIndex = 3; clickContactLine(); } }
function clickContactLine5() { if (!System.Gadget.Flyout.show) { g_LineIndex = 4; clickContactLine(); } }

// display contacts info on flyout page
function clickContactLine()
{

	if (!System.Gadget.Flyout.show)
	{
		var str = eval("strName"+(g_LineIndex+1)+".innerText;");

		// verify line length
		if (str.length > 0)
		{
			// initialize flyout return action
			g_mySettings.saveAction("contactSelected");
			
			// put contact values into page variables to send the contacts info to Flyout page
			strContactGroup.value = selGroup.value;
			strContactName.value  = g_Contacts[g_LineIndex + ((g_PageControl - 1) * MAX_PAGE_ITEM)][0];
			strContactPhone.value = g_Contacts[g_LineIndex + ((g_PageControl - 1) * MAX_PAGE_ITEM)][1];
			
			// show the flyout page
			System.Gadget.Flyout.show = true;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Function initialization PhoneBook - ["Group","Name","Phone",ID]
// [0,1,2,...][0] -> Group
// [0,1,2,...][1] -> Name
// [0,1,2,...][2] -> Phone
// [0,1,2,...][3] -> ID -> 0,1,2,...
//
//	g_Phonebook.push(["ABK",  "Опер.",    "32-05", 0]);
//	g_Phonebook.push(["ABK",  "Програм.", "30-03", 1]);
//	g_Phonebook.push(["ABK",  "Програм.", "37-20", 2]);
//	g_Phonebook.push(["ABK",  "Автомат.", "34-35", 3]);
//	g_Phonebook.push(["ABK",  "Дюжев",    "56-25", 4]);
//	g_Phonebook.push(["ABK",  "Мельник",  "46-93", 5]);
//	g_Phonebook.push(["CCM1", "PU1",	  "44-81", 6]);
//	g_Phonebook.push(["CCM1", "PU2",	  "32-19", 7]);
//	g_Phonebook.push(["CCM1", "MICR",	  "32-17", 8]);
//	g_Phonebook.push(["CCM2", "PU1",	  "45-65", 9]);
//	g_Phonebook.push(["CCM2", "PU2",	  "38-30", 10]);
//	g_Phonebook.push(["CCM2", "MICR",	  "31-10", 11]);
//	g_Phonebook.push(["CCM3", "PU1",	  "24-35", 12]);
//	g_Phonebook.push(["CCM3", "PU2",	  "57-07", 13]);
//	g_Phonebook.push(["CCM3", "MICR",	  "57-33", 14]);
//	g_Phonebook.push(["LF2",  "PU1",	  "48-12", 15]);
//
////////////////////////////////////////////////////////////////////////////////
function initPhoneBook(action)
{
	g_Phonebook = stringToArray(strPhonebook.value);
	initGroupList(action);
}

function updatePhoneBook(action)
{
	var data = [];	//["name","phone"]
	var id = g_Contacts[g_LineIndex + ((g_PageControl - 1) * MAX_PAGE_ITEM)][2];
	//
	g_Phonebook[id][1] = strContactName.value;
	g_Phonebook[id][2] = strContactPhone.value;
	//
	initContacts(action);
}

function addPhoneBook(action)
{
	var group, name, phone, length;
	var index = [];	//["first","last"]
	//
	group = strContactGroup.value;
	name = strContactName.value;
	phone = strContactPhone.value;
	length = g_Phonebook.length;
	//
	index = findGroupByName(group);
	if(index[1] === undefined)
	{
		g_Phonebook.push([group, name, phone, length]);
	}
	else
	{
		g_Phonebook.splice(index[1]+1, 0, [group, name, phone, length]);
		updateIndexContacts();
	}
	//	
	initGroupList(action);
}

function removePhoneBook(action)
{
	var id = g_Contacts[g_LineIndex + ((g_PageControl - 1) * MAX_PAGE_ITEM)][2];
	g_Phonebook.splice(id, 1);
	updateIndexContacts();
	initGroupList(action);
}

function findGroupByName(group)
{
	var ret = []; // ["first","last"]
	var first = false, last = false;
	
	for(var i = 0; i < g_Phonebook.length; i++)
	{
		if(g_Phonebook[i][0] == group)
		{
			if(!first){ first = true; ret[0] = i;}
		}
		else
		{
			if(first && !last){ last = true; ret[1] = i-1;}
		}
	}
	if(first && !last) ret[1] = ret[0];
		
	return ret;
}

function updateIndexContacts()
{
	for(var i = 0; i < g_Phonebook.length; i++)
	{
		g_Phonebook[i][3] = i;
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Functions initailization and change selGroup
//
////////////////////////////////////////////////////////////////////////////////
function initGroupList(action)
{
	var select, length, group, tmp, index;

	select = document.getElementById("selGroup");
	clearOptions(select);

	length = g_Phonebook.length || 0;
	group = "";
	
	for(var i = 0; i < length; i++)
	{
		if(i < length) tmp = g_Phonebook[i][0];
		if(group != tmp)
		{
			addOption(select, tmp);		
			group = tmp;
		}
	}

	switch(action)
	{
		case "init":
		case "restore":
			select.focus();	// select first...
			select.blur();	// ...element
			break;
		case "add":
			select.value = strContactGroup.value;
			break;
		case "remove":
			index = getIndexByName(select, strContactGroup.value);
			if(index == -1)
			{
				select.focus();	// select first...
				select.blur();	// ...element
			}
			else
				select.value = strContactGroup.value;
			break;
	}
	
	initContacts(action);
}

////////////////////////////////////////////////////////////////////////////////
//
// Functions initialization Contacts [name, phone, id]
// id -> PhoneBook.ID
////////////////////////////////////////////////////////////////////////////////
function initContacts(action)
{
	var length, tmp, group;
	
	length = g_Phonebook.length || 0;
	group = selGroup.value;
	
	//clear Array
	g_Contacts = [];
	
	for(var i = 0; i < length; i++)
	{
		if(i < length) tmp = g_Phonebook[i][0];
		if(tmp == group)
		{
			g_Contacts.push([g_Phonebook[i][1], g_Phonebook[i][2], g_Phonebook[i][3]]); //[name, phone, id]
		}
	}
	
	// calculate value based on page control
	length = g_Contacts.length || 0;
	g_MaxPages = length <= 5 ? 1 : Math.ceil((length/MAX_PAGE_ITEM));
	switch(action)
	{
		case "init":
		case "restore":
		case "selected":
			g_PageControl = 1;
			break;
		case "update":
			break;
		case "add":
			g_PageControl = g_MaxPages;
			break;
		case "remove":
			if(g_PageControl > g_MaxPages) 
				g_PageControl = (--g_PageControl < 1) ? 1 : g_PageControl;
			break;
	}
	
	showContacts();
}

function showContacts()
{
	var length, start, end, name, phone;

	// calculate value based on page control
	length = g_Contacts.length || 0;
	g_MaxPages = length <= 5 ? 1 : Math.ceil((length/MAX_PAGE_ITEM));
	
	// calculate Start and End array item
	start = (g_PageControl - 1) * MAX_PAGE_ITEM;
	end = length - start > MAX_PAGE_ITEM ? MAX_PAGE_ITEM : length - start;
	
	// clean-up all textlines
	strName1.innerText = "";
	strName2.innerText = "";
	strName3.innerText = "";
	strName4.innerText = "";
	strName5.innerText = "";
	
	strPhone1.innerText = "";
	strPhone2.innerText = "";
	strPhone3.innerText = "";
	strPhone4.innerText = "";
	strPhone5.innerText = "";

	// display contacts based on selected page
	for (var i = 0; i < end; i++)
	{
		name = truncateText(g_Contacts[i+start][0]);
		phone = truncateText(g_Contacts[i+start][1]);
		eval("strName" + (i+1) + ".innerText = name;");
		eval("strPhone" + (i+1) + ".innerText = phone;");
		//eval("strName"+(i+1)+".innerText = g_Contacts["+(i)+"][0];");//name
	}

	// update page control info
	updateControl();
	
	//
	g_mySettings.saveAction("none");
}

// max length charester in string = 8
function truncateText(str)
{
	return str.length > 8 ? str.substr(0, 8) : str;
}

////////////////////////////////////////////////////////////////////////////////
//
// Functions for work Option
//
////////////////////////////////////////////////////////////////////////////////
function addOption(item, name)
{
	var opt = document.createElement("option");
	opt.value = name;
	opt.innerHTML = name;
	//if(name == ip) opt.disabled = true;
	item.appendChild(opt);
}

function clearOptions(item)
{
	var length = item.options.length;
	while(length--)
	{
		item.remove(length);
	}
}

function getIndexByName(select, name)
{
	for(var i = 0; i < select.length; i++)
	{
		if(select.options[i].value == name)
		{
			return i;
		}
	}
	return -1;
}

////////////////////////////////////////////////////////////////////////////////
//
// functions Convert Array and String
//
////////////////////////////////////////////////////////////////////////////////
function arrayToString(array)
{
	var str = "";
	for(var i = 0; i < array.length; i++)
	{
		// "Group;Name;Phone;"
		str += array[i][0] + ";" + array[i][1] + ";" + array[i][2] + ";"  + "\r\n";
	}
	return str;
}

function stringToArray(str)
{
	var array = new Array();
	
	if(str.length != 0)
	{
		var lines = str.split('\n');
		for(var i = 0; i < lines.length; i++)
		{
			var data = lines[i].split(';');
			if(data.length >= 3)
			{
				// [Group,Name,Phone,ID]
				array.push([data[0].replace(/[\r\n]+/gm,""), data[1].replace(/[\r\n]+/gm,""), data[2].replace(/[\r\n]+/gm,""), i]);
			}
		}
	}
	
	return array;
}