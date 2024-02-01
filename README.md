This is a Tampermonkey JavaScript file that will add Previous and Next buttons to the NYT Crossword Puzzle webpage for easier navigation around the calendar.

It mostly shouldn't let you go to days that don't exist yet but hasn't been thoroughly tested. 

==Parameters==
Most of the parameters are pretty straightforward, but the weirdest section is the archive default URL.

archiveDefaultUrl
If you are like me and want to work through a backlog of previous puzzles, you can set a default for which month to show when you click the new calendar icon button. This default will only override the calendar link behavior if you're on the newest puzzle and if the useArchiveDefaultUrl parameter is set to true.
