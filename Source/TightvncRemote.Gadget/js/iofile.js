function readServerList()
{
	var strOut = "";
	var fileName = "ServerList.txt";
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
				strOut = "Error: " + e.description;
			}
		}
		// Close files
		file.Close();
	}
	else
	{
		strOut = "Error, can't open: " + fileName;
	}
	objShell = undefined;
	objFSO = undefined;
	
	return strOut;
}

function writeServerList(str)
{
	var strOut = "OK";
	var fileName = "ServerList.txt";
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
		for(var i=0; i<lines.length; i++)
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