'////////////////////////////////////////////////////////////////////////////////
'//
'//  Copyright (c) 2009 NVA.  All rights reserved.
'//
'////////////////////////////////////////////////////////////////////////////////

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
' Get First Day of Week where 1 is Sunday, 2 is Monday, etc.
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function vbsFirstDayOfWeek()
    Dim MyDate
    MyDate = DateSerial(2002, 9, 1) ' A Sunday
    vbsFirstDayOfWeek = (9 - WeekDay(MyDate, 0))
    if vbsFirstDayOfWeek = 8 then vbsFirstDayOfWeek = 1
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
' Get Day Of Year
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function vbsDayOfYear(year,month,day)
	DIm MyDate
	MyDate = DateSerial(year, month, day)
    vbsDayOfYear = DatePart("y", MyDate)
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
' Get Month Short Name
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function vbsMonthNameShort(i, tf)
    vbsMonthNameShort = MonthName(i,tf)
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
' Get Month Long Name
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function vbsMonthNameLong(i)
    vbsMonthNameLong = MonthName(i)
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
' Get Day of Week Short Name
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''    
Function vbsWeekDayNameShort(i, tf)
    vbsWeekDayNameShort = WeekDayName(i,tf)
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
' Get Day of Week Long Name
'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function vbsWeekDayNameLong(i)
    vbsWeekDayNameLong = WeekDayName(i)
End Function
