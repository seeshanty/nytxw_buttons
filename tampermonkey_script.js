// ==UserScript==
// @name         NYTXW Add Prev Next Buttons
// @namespace    http://tampermonkey.net/
// @version      2024-01-28
// @description  try to take over the world!
// @author       You
// @match        https://www.nytimes.com/crosswords/game/daily/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Calculate previous and next URLs while window is loading

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
        ('0' + (previousDate.getMonth() + 1)).slice(-2) + '/' +
        ('0' + previousDate.getDate()).slice(-2);

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
        ('0' + (nextDate.getMonth() + 1)).slice(-2) + '/' +
        ('0' + nextDate.getDate()).slice(-2);

    // Concatenate nextUrl
    var nextUrl = baseUrl+ nextUrlDate;
    console.log("Next URL:", nextUrl);

    // wait for the window to finish loading before attempting anything else
    window.addEventListener('load', function() {

        // Function to create the "Previous" button
        function createPreviousButton() {
            console.log("Creating the 'Previous' button...");

            var previousBtn = document.createElement("button");
            previousBtn.textContent = "Previous";
            previousBtn.id = "previousBtn";
            previousBtn.style.backgroundColor = "white";
            previousBtn.style.width = "100px";
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
            nextBtn.style.backgroundColor = "white";
            nextBtn.style.width = "100px";
            nextBtn.style.marginLeft = "20px";
            nextBtn.addEventListener("click", function() {
                console.log("Next button clicked...");
                // Redirect to the next URL
                window.location.href = nextUrl;
            });

            console.log("Returning the 'Next' button...");
            return nextBtn;
        }

        // Function to append the "Previous" and "Next" buttons to the specified element
        function appendPreviousNextButtons() {
            var previousButton = createPreviousButton();
            console.log("Previous Button:", previousButton);

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
            console.log("Target Container:", targetContainer);
            targetContainer.appendChild(previousButton);
            console.log("Appended the 'Previous' button to the target container.");
            targetContainer.appendChild(nextButton);
            console.log("Appended the 'Next' button to the target container.");
        }

        // need to give it a small timeout to make it more more reliably
        setTimeout(function(){
            appendPreviousNextButtons();
        }, 200);

    }, false); // window load listener

})(); // main wrapper
