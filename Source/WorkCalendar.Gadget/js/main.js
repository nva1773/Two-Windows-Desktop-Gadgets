////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2009 NVA.  All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

var g_filter = 1;
var g_calendar_date = new Date().toDateString();
var g_initDate = new Date().toDateString();
var g_currentDate = new Date().toDateString();
var g_view = "month";
var g_curl_img = null;
var g_curl_hitRegion = null;
var g_day_view = null;
var g_newTimeOut = null;
var g_mySettings = new calendarSettings();
var g_offset = null;
var g_monthYearLayout = "MM YY";
var g_userLanguage = "";
var work = new objClass();
 
////////////////////////////////////////////////////////////////////////////////
//
// Initialize
//
////////////////////////////////////////////////////////////////////////////////
function initMain()
{
	g_mySettings.load();
	g_offset = parseInt(g_mySettings.CalendarOffSet);
	
	work.load();
	
	setCalendarReloadInterval(true);
	
	System.Gadget.settingsUI = "settings.html";
	System.Gadget.onSettingsClosed = settingsClosed;
	
	System.Gadget.visibilityChanged = checkVisibility;
	
	settingsChanged();
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
        g_mySettings.load();
		g_offset = parseInt(g_mySettings.CalendarOffSet);
		settingsChanged();
    }
}

////////////////////////////////////////////////////////////////////////////////
//
// Work Calendar Object
//
////////////////////////////////////////////////////////////////////////////////
function objClass()
{
	this.load = function()
	{
		this.day=
		{
			first: null,
			short: null,
			long : null,
			dayofweek: null
		};
		this.month=
		{
			short: null,
			long : null
		};
	};
}

////////////////////////////////////////////////////////////////////////////////
//
// Initialize work calendar to user locale settings
//
////////////////////////////////////////////////////////////////////////////////
function reLoadSettings()
{
	clearTimeout(g_newTimeOut);
	setCalendarReloadInterval(true);

	if (g_userLanguage != navigator.userLanguage )
	{
		g_userLanguage = navigator.userLanguage;
		if(g_userLanguage == "ru-RU")
		{
			btnPrevious.alt = "Предыдущий";
			btnNext.alt	= "Следующий";
		}
		else
		{
			btnPrevious.alt = "Previous";
			btnNext.alt	= "Next";
		}

		work.day.first = vbsFirstDayOfWeek()-1;

		if (work.day.short != null)
		{
			work.day.short.splice();
			work.day.long.splice();
			work.month.short.splice();
			work.month.long.splice();
		}

		work.day.short = buildWeekDayNameShort();
		work.day.long = buildWeekDayNameLong();
		work.month.short = buildMonthNameShort();
		work.month.long = buildMonthNameLong();

		work.day.dayofweek = null;
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// Initialize Long Name Day of Week Array
//
////////////////////////////////////////////////////////////////////////////////
function buildWeekDayNameLong()
{
	var arr = [];
	for (var i = 0 ; i < 7 ; i++)
	{
		arr[i] = vbsWeekDayNameLong(i+1);
	}
	return arr;
}

////////////////////////////////////////////////////////////////////////////////
//
// Initialize Short Name Day of Week Array
//
////////////////////////////////////////////////////////////////////////////////
function buildWeekDayNameShort()
{
	var arr = [];
	for (var i = 0 ; i < 7 ; i++)
	{
		arr[i] = vbsWeekDayNameShort(i+1,true);
	}
	return arr;
}

////////////////////////////////////////////////////////////////////////////////
//
// Initialize Short Month Name Array
//
////////////////////////////////////////////////////////////////////////////////
function buildMonthNameShort()
{
	var arr = [];

	for (var i = 0 ; i < 12 ; i++)
	{
		arr[i] = vbsMonthNameShort(i+1,true);
	}
	return arr;
}

////////////////////////////////////////////////////////////////////////////////
//
// Initialize Long Month Name Array
//
////////////////////////////////////////////////////////////////////////////////
function buildMonthNameLong()
{
	var arr = [];
	for (var i = 0 ; i < 12 ; i++)
	{
		arr[i] = vbsMonthNameLong(i+1);
	}
	return arr;
}

////////////////////////////////////////////////////////////////////////////////
//
// determine if gadget is visible
//
////////////////////////////////////////////////////////////////////////////////
function checkVisibility()
{
	var isVisible = System.Gadget.visible;
	var now = new Date().toDateString();
	var initDtd = new Date(g_initDate).toDateString();

	if (g_userLanguage != navigator.userLanguage)
	{
		settingsChanged();
	}
	
	if (isVisible)
	{
		setCalendarReloadInterval(false);
	}
	else
	{
		clearTimeout(g_newTimeOut);
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// calculate calendar reLoadSettings time interval
//
////////////////////////////////////////////////////////////////////////////////
function setCalendarReloadInterval(isFirst)
{
	var delta = 0;
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	var MilliSecondsPerDay = (24 * 60 * 60 * 1000);
	var today = null;
	var now = new Date();

	hours = now.getHours();
	minutes = now.getMinutes();
	seconds = now.getSeconds();

	delta = MilliSecondsPerDay - (hours * 60 * 60 * 1000) - (minutes * 60 * 1000) - (seconds * 1000);

	g_calendar_date = now.toDateString();

	if (! isFirst)
	{
		today = new Date(DAY.d);
		if (today.toDateString() != DAY.d)
		today.setDate(today.getDate()+1);

		isToday = today.toDateString() == new Date().toDateString();

		if ( isToday
			|| today.toDateString() == new Date(now.getYear(),now.getMonth(),now.getDate()-1).toDateString()
			|| today.toDateString() == g_currentDate )
		{
				g_currentDate = g_initDate = DAY.d = new Date().toDateString();
				Calendar(DAY).day.initDay(new Date());
		}

		settingsChanged();
	}

	g_newTimeOut = setTimeout("setCalendarReloadInterval(false)",delta);
}

////////////////////////////////////////////////////////////////////////////////
//
// if you switch backgrounds on the fly, you must set the style size to zero
// so it dynamically refreshes
//
////////////////////////////////////////////////////////////////////////////////
function setBackground(path)
{
	calendarbackground.style.width = 0;
	calendarbackground.style.height = 0;
	calendarbackground.src = path;
}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
function swapBackgrounds()
{
	divPrevNext.style.visibility = "visible";
	setBackground("url(images/calendar_single.png)");
}

////////////////////////////////////////////////////////////////////////////////
//
// Set work calendar to the new settings
//
////////////////////////////////////////////////////////////////////////////////
function settingsChanged(){
	reLoadSettings();
	g_view = "month";
	g_curl_img = curl;
	g_curl_hitRegion = HitRegion;

	g_day_view = DAY;

	divPrevNext.className = "prevnext";

	with(document.body.style)
	{
		width = 130,
		height = 141,
		backgroundRepeat = "no-repeat";
	}
	setBackground(checkBackground());

	var today = new Date(g_initDate);
	if (today.toDateString() != g_initDate)
		today.setDate(today.getDate()+1)
	Calendar(YEAR).year.initYear(today);
	Calendar(MONTH).month.initMonth(today);
	Calendar(DAY).day.initDay(today);

	MONTH.style.visibility = "hidden";
	DAY.style.visibility	= "hidden";
	YEAR.style.visibility	= "hidden";
	divPrevNext.style.visibility	= "hidden";
	g_mySettings.load();

	eval( g_mySettings.CalendarView + ".divType = g_mySettings.CalendarDivType");
	swap( eval( g_mySettings.CalendarView ) );
};

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
function checkBackground()
{
	var sRetVal = "";
	var initDate = new Date(g_initDate);
	if (initDate.toDateString() != g_initDate)
		initDate.setDate(initDate.getDate()+1);
	var isToday = ( initDate.toDateString()== new Date().toDateString() );

	if ( isToday )
	{
		sRetVal = "url(images/calendar_single_color.png)";
		divBgImage.style.backgroundImage = "url(images/calendar_single_color.png)";
		CalendarRing.style.visibility = "hidden";
		g_curl_img.style.visibility	= "hidden";
		g_curl_hitRegion.style.visibility = "hidden";
	}
	else
	{
		sRetVal = "url(images/calendar_single.png)";
		divBgImage.style.backgroundImage = "url(images/calendar_single.png)";
		g_curl_img.style.visibility	= "visible";
		g_curl_hitRegion.style.visibility = "visible";
		CalendarRing.style.visibility = "visible";
	}

	return sRetVal;
}

////////////////////////////////////////////////////////////////////////////////
//
// Calendar object
//
////////////////////////////////////////////////////////////////////////////////
function Calendar(o)
{
////////////////////////////////////////////////////////////////////////////////
//
// Day view
//
////////////////////////////////////////////////////////////////////////////////
	o.day={
		d:new Date(),

		html:function(d)
		{
			divPrevNext.style.visibility = "hidden";
			
			this.d = new Date(d);
			if (this.d.toDateString() != d.toDateString())
				this.d.setDate(this.d.getDate()+1);

			g_day_view.d = d.toDateString();

			var isToday=d.toDateString() == new Date().toDateString();
			var layout = g_monthYearLayout;

			g_initDate = d.toDateString();
			
			if (isToday)
			{
				g_curl_img.style.visibility = "hidden";
				g_curl_hitRegion.style.visibility = "hidden";
			}
			else
			{
				g_curl_img.style.visibility = "visible";
				g_curl_hitRegion.style.visibility = "visible";
				g_curl_img.d = ( new Date().toDateString() );
			}

			layout = layout.replace("YY",d.getFullYear());
			layout = layout.replace("MM",work.month.long[d.getMonth()]);

		return "<table id='dowId' valign=center width='100%' cellpadding=0 cellspacing=0><tr><td align=center style='"+(isToday?"color:white;":"color:black;")+"'><span id='ellipsisHeadingTop'>"+work.day.long[d.getDay()]+"</span></td></tr><tr><td align=center><div id='ellipsisMiddle' style='"+ (isToday?"color:white;":"color:black;") +"'>"+d.getDate()+"</div></td></tr><tr><td align=center valign=top style='"+(isToday?"color:white;":"color:black;")+"'><span id='ellipsisHeadingBottom'>"+layout+"</span></td></tr></table>";
		},

		initDay:function(d)
		{
			o.innerHTML = this.html(d);
		}

	};

////////////////////////////////////////////////////////////////////////////////
//
// Month view
//
////////////////////////////////////////////////////////////////////////////////
	o.month=
	{
		html:function(d)
		{
			var layout = g_monthYearLayout;
			if(d)
			{
				this.d=new Date(d);
				if (this.d.toDateString() != d.toDateString())
					this.d.setDate(this.d.getDate()+1);
			}
			else
			{
				d=this.d;
			}
			layout = layout.replace("YY",d.getFullYear().toString());
			layout = layout.replace("MM",work.month.long[d.getMonth()]);

			return "<span UNSELECTABLE='on'>"+prevNext(layout,monthGrid(d.getYear(),d.getMonth()) )+"</span>";
		},

		initMonth:function(d)
		{
			tID.omo = "";
			o.innerHTML=this.html(d);
		}
	};
////////////////////////////////////////////////////////////////////////////////
//
// Year view
//
////////////////////////////////////////////////////////////////////////////////
	o.year=
	{
		html:function(d){
			if(d)
			{
				this.d=new Date(d);
				if (this.d.toDateString() != d.toDateString())
					this.d.setDate(this.d.getDate()+1);
			}
			else
			{
				d=this.d;
			}
			var s="<div UNSELECTABLE='on' style='margin:5 0 0 5'>",m=0,y,x;
			var currentMonthElement = "";
			var currentMonthRow = "";

			for(y=0; y<3; y++, s+="<br>")
			{
				currentMonthRow = "";
				for(x=0; x<4; x++, m++)
				{
				currentMonthElement = "<var omo tabindex=" + ( m + 1 ) + " divType='zoomMonth' onkeypress='swap(this);' onmouseup='swap(this)' m='"+m+"'>"+work.month.short[m]+"</var>";
				
				currentMonthRow = currentMonthRow + currentMonthElement;
				}
				s += currentMonthRow;
			}
			s+="</div>";
			return "<span >"+
				prevNext(this.d.getFullYear(),s)+
				"</span>";
		},
		initYear:function(d){
		tID.removeAttribute("omo");
		tID.className = "";
		o.innerHTML = this.html(d);
		}
	};
    ////////////////////////////////////////////////////////////////////////////////
	function prevNext(tIDle,body)
	{
	tID.innerHTML = tIDle;

	return "<div UNSELECTABLE='on' class='divMonthView'>"+ body + "</div>";
	};
    ////////////////////////////////////////////////////////////////////////////////
	function monthGrid(year,month)
	{
		var d = new Date(year,month,1-new Date(year,month,1).getDay()+work.day.first);
		var d2 = new Date(d.getYear(),d.getMonth(),d.getDate(),d.getHours()+1);
		if(d.getDate() != d2.getDate())
			d.setDate(d.getDate()+1);
		var dateString = d.toDateString();
		
		if(d.getMonth()==month && d.getDate()>1)
			d.setDate(d.getDate()-7);
		
		var countDay = calcOffSet(d.getYear(), d.getMonth()+1, d.getDate());
		
		var s="", today = new Date().toDateString();
		var currentWeekRow = "";
		var currentDayElement = "";

		for(var y=0; y<7 && (d.getMonth()<=month || d.getYear()<year); y++)
		{
			currentWeekRow = "";
			for(var x=0; x<7; x++)
			{
				currentDayElement = "";
				currentDayElement += "<q divType='dow' class='day"+(x?" lb":"") ;
				if(y)
				{
					// Day In Mohth
					if(d.getMonth()!=month)
					{
						if(countDay == 0) currentDayElement += " dim_morning'";
						else if(countDay == 1) currentDayElement += " dim_night'";
						else currentDayElement += " dim'";
					}
					else if(d.toDateString()==today)
					{
						currentDayElement += " today' tabindex=" + d.getDate() + "";
					}
					else
					{
						if(countDay == 0) currentDayElement += " morning' tabindex=" + d.getDate() + "";
						else if(countDay == 1) currentDayElement += " night' tabindex=" + d.getDate() + "";
						else currentDayElement += "' omo tabindex=" + d.getDate() + "";
					}

					currentDayElement += " d='"+d.toDateString()+"' onkeypress='swap(this);' onmouseup='swap(this);' >"+d.getDate()+"</q>";
					dateString = d.toDateString();
					d.setDate(d.getDate()+1);
					if(d.toDateString() == dateString)
						d.setDate(d.getDate()+1);
					//
					countDay++;
					if(countDay >= 4) countDay = 0;
				}
				else
				{
					// Day Of Week
					if(x < 5)
						currentDayElement += " name";
					else if(x == 5) 
						currentDayElement += " sat";
					else 
						currentDayElement += " sun";
					
					currentDayElement += "' title='"+work.day.long[(x+work.day.first)%7]+"'>"+(work.day.dayofweek != null ? work.day.dayofweek[(x+work.day.first)%7] : work.day.short[(x+work.day.first)%7].substr(0,1))+"</q>";
				}

				currentWeekRow = currentWeekRow + currentDayElement;
			}
			currentWeekRow += "<br>";
			s += currentWeekRow;
		}

		return s;
	};
    ////////////////////////////////////////////////////////////////////////////////
	function dayPos(d){
		var x=(d.getDay()-work.day.first)%7,
			y=parseInt((d.getDate()+6+work.day.first-d.getDay())/7);
		if(x<0)x+=7,y--;
		return {x:2+x*17,y:39+y*13}
	};
    ////////////////////////////////////////////////////////////////////////////////
	function monthPos(d){
		var x=d.getMonth()%4,
			y=parseInt(d.getMonth()/4);
		return {x:7+x*28,y:27+y*28}
	};

	o.tabIndex=1;
	return o;
}

////////////////////////////////////////////////////////////////////////////////
//
// Calculate offset for work days begin with 01.01.2015 - I am after night.
//
////////////////////////////////////////////////////////////////////////////////
function calcOffSet(year, month, day)
{
    var ret = 0;
    var leapYear = 0;
	var yearFirst = 2015;
	var doy = vbsDayOfYear(year, month, day);
	var days = 0;
    //
	if(year < yearFirst) return ret;
	//
	for(var i = 0; i < year - yearFirst; i++)
	{
		leapYear = yearFirst + i;
		leapYear %= 4;
		if(leapYear == 0) days += 366;
		else days += 365;
	}
	days += doy
	days += g_offset;
	// 
	days %= 4;
	switch(days)
	{
		case 0:
			ret = 1;
			break;
		case 1:
			ret = 2;
			break;
		case 2:
			ret = 3;
			break;
		case 3:
			ret = 0;
			break;
	}
    //
    return ret;
}

////////////////////////////////////////////////////////////////////////////////
//
// Event onkeypress for btn
//
////////////////////////////////////////////////////////////////////////////////
function evalPrevNext(direction,o)
{
	var oDate = new Date(g_initDate);
	if (oDate.toDateString() != g_initDate)
		oDate.setDate(oDate.getDate()+1);

	switch (g_view)
	{
		case "month":
				o.divType = "changeMonth";
				oDate.setMonth(oDate.getMonth()+ direction);

				break;
		case "year":
				o.divType = "changeYear";
				oDate.setFullYear(oDate.getFullYear()+ direction);
				break;
	}

	g_initDate = oDate.toDateString();

	if (event.button == 2)
	{
		if (direction == -1)
		{
			o.src = 'images/bprev.png';
		}
		else
		{
			o.src = 'images/bnext-hot.png';
		}
	}
	swap(o);
}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
function swap(o)
{
	if (event)
	{
		if (event.button == 2)
		{
			return;
		}
	}

	calcRedraw(o);
	g_filter = 1;
}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
function setInitDate(o)
{
	g_filter = 0;
	oDate = new Date(g_initDate);
	if (oDate.toDateString() != g_initDate)
		oDate.setDate(oDate.getDate()+1);

	oDOW = new Date(o.d);
	if (oDOW.toDateString() != o.d)
		oDOW.setDate(oDOW.getDate()+1);

	if (oDate.getMonth() != oDOW.getMonth() | oDate.getFullYear() != oDOW.getFullYear() | g_view == "year" )
	{
		g_initDate = oDOW.toDateString();
		swap(o);
	}
}

////////////////////////////////////////////////////////////////////////////////
//
// render
//
////////////////////////////////////////////////////////////////////////////////
function calcRedraw(o)
{
 var sType = o.divType;
 var today = null;
 var isToday = null;
 var oDate = null;

 g_mySettings.save(o.id,o.divType, g_offset.toString());

 switch (sType)
	{
		case "changeMonth":
				o.divType = 'day';
				g_filter = 1;
				swap(o);
				break;

		case "changeYear":
				o.divType = 'year';
				g_filter = 1;
				swap(o);
				break;

		case "zoomMonth":
				oDate = new Date(g_initDate);
				if (g_initDate != oDate.toDateString())
					oDate.setDate(oDate.getDate()+1);
				oDate.setMonth(o.m);
				g_initDate = oDate.toDateString();
				o.divType = 'day';
				g_filter = 0;
				swap(o);
				break;

		case "resetMonth":
				g_initDate = new Date().toDateString();
				o.divType = 'day';
				swap(o);
				break;

		case "dow":
				g_view = "dow";
				if (o.id != "curl")
				{
					o.divType = "day";
				}
				divFilter.filters[g_filter].enabled = true;
				divFilter.filters[g_filter].Apply();
				today=new Date(o.d);
				if (o.d != today.toDateString())
					today.setDate(today.getDate()+1);
				Calendar(DAY).day.initDay(today);
				DAY.style.visibility = "visible";
				MONTH.style.visibility = "hidden";
				isToday=today.toDateString()==new Date().toDateString();

				if (isToday)
				{
					divBgImage.style.backgroundImage = "url(images/calendar_single_color.png)";
					showBackground(0);
				}
				else
				{
					divBgImage.style.backgroundImage = "url(images/calendar_single.png)";
					showBackground(1);
				}
				divFilter.filters[g_filter].Play();
				showControls(false);
				break;

		case "day":
				g_curl_img.style.visibility = "hidden";
				g_curl_hitRegion.style.visibility = "hidden";
				g_view = "month";
				today=new Date(g_initDate);
				if (g_initDate != today.toDateString())
					today.setDate(today.getDate()+1);
				MONTH.month.initMonth(today);
				divFilter.filters[g_filter].enabled = true;
				divFilter.filters[g_filter].Apply();
				YEAR.style.visibility = "hidden";
				DAY.style.visibility = "hidden";
				MONTH.style.visibility = "visible";
				divBgImage.style.backgroundImage = "url(images/calendar_single.png)";
				divFilter.filters[g_filter].Play();
				showControls(true);
				showBackground(1);
				tID.divType="year";
				break;

		case "year":
				g_view = "year";

				g_curl_img.style.visibility = "hidden";
				g_curl_hitRegion.style.visibility = "hidden";
				divFilter.filters[0].enabled = true;
				divFilter.filters[0].Apply();
				today=new Date(g_initDate);
				if (g_initDate != today.toDateString())
					today.setDate(today.getDate()+1);
				YEAR.year.initYear(today);
				YEAR.style.visibility = "visible";
				MONTH.style.visibility = "hidden";
				divBgImage.style.backgroundImage = "url(images/calendar_single.png)";
				divFilter.filters[0].Play();
				showBackground(1);
				showControls(true);
				tID.divType="reset";
				break;
	}


}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
function showBackground(skin)
{
	var bgFile = "url(images/calendar_single.png)";

	switch (skin)
	{
		case 0 :
			bgFile = "url(images/calendar_single_color.png)";
			break;

		case 1 :
			bgFile = "url(images/calendar_single.png)";
			break;
	}

	setBackground(bgFile);
}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
function showControls(show)
{
	var showHide = "hidden";

	if (show)
	{
		showHide = "visible";
	}

	CalendarRing.style.visibility = showHide;
	divPrevNext.style.visibility = showHide;
}

////////////////////////////////////////////////////////////////////////////////
//
//
//
////////////////////////////////////////////////////////////////////////////////
document.onmouseover=document.onmouseout=function(){
	var e=event.srcElement;
	if(e.omo!=null)
		e.className=event.type=="mouseout"?e.className.replace(/ hot/,""):e.className+" hot";
}
