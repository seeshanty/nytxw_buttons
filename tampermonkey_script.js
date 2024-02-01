// ==UserScript==
// @name         NYTXW Add Prev Next Buttons
// @namespace    http://tampermonkey.net/
// @version      2024-02-01
// @description  https://github.com/seeshanty/nytxw_buttons
// @author       seeshanty
// @match        https://www.nytimes.com/crosswords/game/daily*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // STYLE PARAMETERS
    var navBtnWidth = "100px";
    var navBtnSpacing = "10px";
    var navBtnBorder = "1px solid black";
    var calBtnWidth = "40px";
    var calBtnBorder = "1px solid white";
    var btnColor = "white";
    var btnHoverColor = "lightgray";
    var btnLocation = "navBar"; //  Options: navBar, crosswordDate

    // HARDCODED BASE URLS
    var archiveBaseUrl = "https://www.nytimes.com/crosswords/archive/daily/";

    // CONVENIENCE URL FOR WORKING THROUGH THE ARCHIVE FROM MAIN /daily PUZZLE
    var useArchiveDefaultUrl = true; // whether or not to use the Archive Default URL from the newest daily puzzle
    var archiveDefaultUrl = "https://www.nytimes.com/crosswords/archive/daily/2023/06"; // update YYYY/MM as needed

    // FUNCTIONALITY PARAMETERS
    var extraTimeout = 200;

    //--------------------------------------------------------------------------
    // THINGS WE CAN DO WHILE WINDOW IS LOADING
    //--------------------------------------------------------------------------

    // Get the current URL
    var currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);
    if (currentUrl.endsWith('/')) {
        currentUrl = currentUrl.slice(0, -1);
        console.log("Removed trailing slash in URL.\nUpdated URL:", currentUrl);
    }

    // initialize variables
    var baseUrl = "https://www.nytimes.com/crosswords/game/daily/"; // default puzzle page
    var URL_YYYY = "";
    var URL_MM = "";
    var URL_DD = "";
    var puzzleDate = new Date(); // default to today; parse from URL later
    var puzzleDateIsToday = false;
    var puzzleDateIsFuture = false;
    var isNewestPuzzle = false;

    // set variables for the current date/time in NY
    const currentDate = new Date();
    const NY_YYYY = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'America/New_York' }).format(currentDate);
    const NY_MM = new Intl.DateTimeFormat('en-US', { month: '2-digit', timeZone: 'America/New_York' }).format(currentDate);
    const NY_DD = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'America/New_York' }).format(currentDate);
    const dateInNY = new Date(NY_YYYY, NY_MM - 1, NY_DD);
    console.log("dateInNY: ",NY_YYYY,"/",NY_MM,"/",NY_DD,"\n",dateInNY);
    const NY_HH24 = new Intl.DateTimeFormat('en-US', { hourcycle: 'h23', hour12: false, hour: '2-digit', timeZone: 'America/New_York' }).format(currentDate);
    const NY_DAY = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(currentDate);
    const NY_isWeekend = ['Fri', 'Sat', 'Sun'].includes(NY_DAY);

    // Puzzle date parsing
    if (currentUrl == baseUrl.slice(0, -1)) {
        //There is no YYYY/MM/DD in the URL; assume it's today's puzzle
        URL_YYYY = NY_YYYY;
        URL_MM = NY_MM;
        URL_DD = NY_DD;
        puzzleDate = dateInNY;
        puzzleDateIsToday = true;
        console.log("No date in URL. Assuming puzzle date is today.\n",puzzleDate);
    } else {
        // Extract the baseUrl, year, month, and day from the URL
        // Assumption: puzzle URLs end in /YYYY/MM/DD
        var parts = currentUrl.split('/');
        baseUrl = parts.slice(0, parts.length - 3).join('/') + '/';
        URL_YYYY = parts[parts.length - 3];
        URL_MM = parts[parts.length - 2];
        URL_DD = parts[parts.length - 1];
        puzzleDate = new Date(URL_YYYY, URL_MM - 1, URL_DD);
        console.log("URL Date: ",URL_YYYY,"/",URL_MM,"/",URL_DD,"\n",puzzleDate);
    } // puzzle date parsing

    // compare puzzle date to the date in NY
    if (puzzleDate > dateInNY) {
        puzzleDateIsFuture = true;
        console.log("puzzleDateIsFuture: ",puzzleDateIsFuture);
        isNewestPuzzle = true;
    } else if (puzzleDate >= dateInNY) {
        puzzleDateIsToday = true;
        console.log("puzzleDateIsToday: ",puzzleDateIsToday);

        // Check if the puzzle is the current puzzle
        // New puzzles are available at 10 PM ET M-Th and 6 PM F/S/S

        if (NY_isWeekend && NY_HH24 >= 18 && NY_HH24 < 24) { // it's a weekend and it's between 6 PM and midnight
            isNewestPuzzle = false;
            console.log("New weekend puzzle should be available.");
        } else if (NY_HH24 >= 22 && NY_HH24 < 24) { // not a weekend; between 10 PM and midnight
            isNewestPuzzle = false;
            console.log("New weekday puzzle should be available.");
        } else {
            isNewestPuzzle = true;
        }

    } // compare puzzle date to the date in NY

    console.log("isNewestPuzzle:",isNewestPuzzle);

    //----------------
    // PREVIOUS
    //----------------

    // Calculate the previous date
    var previousDate = new Date(puzzleDate);
    previousDate.setDate(puzzleDate.getDate() - 1);
    console.log("Previous Date:", previousDate);

    // Format the previous date as YYYY/MM/DD
    var previousUrlDate = previousDate.getFullYear() + '/' +
        String(previousDate.getMonth() + 1).padStart(2, '0') + '/' +
        String(previousDate.getDate()).padStart(2, '0');

    // Concatenate previousUrl
    var previousUrl = baseUrl+ previousUrlDate;
    console.log("Previous URL:", previousUrl);


    //----------------
    // NEXT
    //----------------

    // Calculate the next date
    var nextDate = new Date(puzzleDate);
    nextDate.setDate(puzzleDate.getDate() + 1);
    console.log("Next Date:", nextDate);

    // Format the next date as YYYY/MM/DD
    var nextUrlDate = nextDate.getFullYear() + '/' +
        String(nextDate.getMonth() + 1).padStart(2, '0') + '/' +
        String(nextDate.getDate()).padStart(2, '0');

    // Concatenate nextUrl
    var nextUrl = baseUrl+ nextUrlDate;
    console.log("Next URL:", nextUrl);

    //-------------------
    //  ARCHIVE CALENDAR
    //-------------------

    // Archive Calendar URL
    var archiveCalendarUrl = archiveBaseUrl + URL_YYYY + '/' + String(URL_MM).padStart(2, '0');
    console.log("Archive Calendar URL:", archiveCalendarUrl);

    //--------------------------------------------------------------------------
    // FUNCTIONS TO CREATE THE BUTTONS
    //--------------------------------------------------------------------------
    // Function to create the "Previous" button
    function createPreviousButton() {
        console.log("Creating the 'Previous' button...");

        var previousBtn = document.createElement("button");
        previousBtn.textContent = "Previous";
        previousBtn.id = "previousBtn";
        previousBtn.style.backgroundColor = btnColor;
        previousBtn.style.width = navBtnWidth;
        previousBtn.style.border= navBtnBorder;
        previousBtn.addEventListener("mouseenter", function() {
            previousBtn.style.backgroundColor = btnHoverColor;
        });

        previousBtn.addEventListener("mouseleave", function() {
            previousBtn.style.backgroundColor = btnColor;
        });
        previousBtn.addEventListener("click", function() {
            console.log("Previous button clicked...");
            // Redirect to the previous URL
            window.location.href = previousUrl;
        });

        console.log("Returning the 'Previous' button...");
        return previousBtn;
    }

    // Function to create the "Next" button
    function createNextButton() {
        console.log("Creating the 'Next' button...");

        var nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.id = "nextBtn";
        nextBtn.style.backgroundColor = btnColor;
        nextBtn.style.width = navBtnWidth;
        nextBtn.style.marginLeft = navBtnSpacing;
        nextBtn.style.border= navBtnBorder;
        if (isNewestPuzzle) {
            nextBtn.disabled = true;
            nextBtn.style.borderColor = "lightgray";
        } else {
            nextBtn.addEventListener("mouseenter", function() {
                nextBtn.style.backgroundColor = btnHoverColor;
            });

            nextBtn.addEventListener("mouseleave", function() {
                nextBtn.style.backgroundColor = btnColor;
            });
            nextBtn.addEventListener("click", function() {
                console.log("Next button clicked...");
                // Redirect to the next URL
                window.location.href = nextUrl;
            });
        }

        console.log("Returning the 'Next' button...");
        return nextBtn;
    }

    function createArchiveCalendarButton() {

        console.log("Creating the 'Archive Calendar' button...");

        var archiveCalBtn = document.createElement("button");
        archiveCalBtn.textContent = "📆";
        archiveCalBtn.id = "archiveCalBtn";
        archiveCalBtn.style.backgroundColor = btnColor;
        archiveCalBtn.style.width = calBtnWidth;
        archiveCalBtn.style.border= calBtnBorder;
        archiveCalBtn.style.marginLeft = navBtnSpacing;
        archiveCalBtn.addEventListener("mouseenter", function() {
            archiveCalBtn.style.backgroundColor = btnHoverColor;
        });

        archiveCalBtn.addEventListener("mouseleave", function() {
            archiveCalBtn.style.backgroundColor = btnColor;
        });
        archiveCalBtn.addEventListener("click", function() {
            console.log("Archive Calendar button clicked...");
            // Redirect to the archive calendar URL
            if (isNewestPuzzle && useArchiveDefaultUrl) {
                window.location.href = archiveDefaultUrl;
            } else {
                window.location.href = archiveCalendarUrl;
            }
        });

        console.log("Returning the 'Archive Calendar' button...");
        return archiveCalBtn;
    }

    //--------------------------------------------------------------------------
    // FUNCTION TO APPEND THE BUTTONS
    //--------------------------------------------------------------------------
    // Function to append the new navigation buttons to the specified element
    function appendExtraNavButtons() {
        var previousButton = createPreviousButton();
        console.log("Previous Button:", previousButton);

        var archiveCalButton = createArchiveCalendarButton();
        console.log("Archive Calendar button:", archiveCalButton);

        var nextButton = createNextButton();
        console.log("Next Button:", nextButton);

        // Possible targets:
        // Crossword Date
        var dateContainer = document.querySelector("div.xwd__details--date")
        console.log("Date Container:", dateContainer);
        // Nav bar
        var navContainer = document.querySelector("#js-global-nav")
        console.log("Nav Container:", navContainer);

        // Set the target
        var targetContainer = navContainer;
        if (btnLocation == "crosswordDate") {
            targetContainer = dateContainer;
        }
        console.log("Target Container:", targetContainer);

        // Append the buttons
        targetContainer.appendChild(previousButton);
        console.log("Appended the 'Previous' button to the target container.");
        targetContainer.appendChild(archiveCalButton);
        console.log("Appended the 'Archive Calendar' button to the target container.");
        targetContainer.appendChild(nextButton);
        console.log("Appended the 'Next' button to the target container.");
    }

    //--------------------------------------------------------------------------
    // WAIT FOR THE WINDOW TO FINISH LOADING BEFORE ATTEMPTING TO APPEND BUTTONS
    //--------------------------------------------------------------------------
    window.addEventListener('load', function() {

        // need to give it a small timeout to make it work more reliably
        setTimeout(function(){
            appendExtraNavButtons();
        }, extraTimeout);

    }, false); // window load listener

})(); // main wrapper
