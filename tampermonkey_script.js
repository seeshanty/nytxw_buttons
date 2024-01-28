// ==UserScript==
// @name         NYTXW Add Prev Next Buttons
// @namespace    http://tampermonkey.net/
// @version      2024-01-28
// @description  https://github.com/seeshanty/nytxw_buttons
// @author       seeshanty
// @match        https://www.nytimes.com/crosswords/game/daily/*
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

    // FUNCTIONALITY PARAMETERS
    var extraTimeout = 200;

    //--------------------------------------------------------------------------
    // THINGS WE CAN DO WHILE WINDOW IS LOADING
    //--------------------------------------------------------------------------

    // Get the current URL
    var currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);

    // Extract the baseUrl, year, month, and day from the URL
    var parts = currentUrl.split('/');
    var baseUrl = parts.slice(0, parts.length - 3).join('/') + '/';
    var year = parseInt(parts[parts.length - 3]);
    var month = parseInt(parts[parts.length - 2]);
    var day = parseInt(parts[parts.length - 1]);

    console.log("Base URL:", baseUrl);
    console.log("Year:", year, "Month:", month, "Day:", day);

    // Create a Date object with the current date
    var currentDate = new Date(year, month - 1, day);
    console.log("Current Date:", currentDate);

    //----------------
    // PREVIOUS
    //----------------

    // Calculate the previous date
    var previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
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
    var nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
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
    var archiveCalendarUrl = archiveBaseUrl + year + '/' + String(month).padStart(2, '0');
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
            // Redirect to the next URL
            window.location.href = archiveCalendarUrl;
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
