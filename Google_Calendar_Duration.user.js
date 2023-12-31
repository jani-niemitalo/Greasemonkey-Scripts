// ==UserScript==
// @name         Google Calendar Duration (Discontinued / not working)
// @namespace    http://example/greasemonkey
// @version      1.1
// @description  Script to show duration in google calendar
// @match        https://calendar.google.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';
    const custom_styles = `.Jmftzc.RIOtYe.cpCWFd:hover {
        white-space: nowrap !important;
        height: min-content !important;
        max-height: unset !important;
        overflow: unset !important;
      }
      
      .EfQccc:hover {
        width: min-content !important;
        height: unset !important;
        overflow: unset !important;
        flex-wrap: wrap !important;
        z-index: 100 !important;
        border: solid black;
      }
      
      .ayClmf:hover {
       flex-wrap: wrap;
      }`;

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function getTimePair(timedata) {
     console.log(timedata);
     const timeString = timedata.split(",")[0];
     const asd = timedata.split(" - ")
        return ["a", "b"]
    }
    
    function getDurationString(timeRangeString) {
        // Remove the extra text after the first comma
        const [startTime, endTime] = getTimePair(timeRangeString);
        if (!startTime || !endTime) return "";
        console.log(startTime, endTime);
        // Parse the start and end times
        const startHour = parseInt(startTime.split(":")[0]);
        const startMinute = parseInt(startTime.split(":")[1]);
        const endHour = parseInt(endTime.split(":")[0]);
        const endMinute = parseInt(endTime.split(":")[1]);

        // Calculate the duration in minutes
        let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

        // If the duration is negative, it means the time range spans multiple days
        if (durationMinutes < 0) {
            durationMinutes += 24 * 60;
        }

        // Convert the duration to a human-readable string
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h - ${minutes}m`;
        }
    }



    function getDurationFromElement(element) {
        const durationElement = $(element).find(".ynRLnc");
        if (durationElement.length > 0) {
            return durationElement.html();
        }
        const parent = $(element).parent();
        if (parent.length > 0) {
            return getDurationFromElement(parent);
        }
        return "";
    }

    function processElements() {
        const elements = $(".Jmftzc.gVNoLb.EiZ8Dd.TuM9nf");
        const filteredElements = elements.filter((index, element) => {
            return !$(element).parent().has(".duration_element").length;
        });
        filteredElements.each((index, element) => {
            const elementTimeString = $(element).text();
            const timeRangeString = getDurationFromElement(element);
            const durationString = getDurationString(timeRangeString, elementTimeString);
            console.log(durationString);
            const newElement = $(element).clone(true);
            newElement.html(durationString);
            newElement.addClass("duration_element");
            $(element).parent().append(newElement);
        });
    }
    //addGlobalStyle(custom_styles);
    setInterval(processElements, 1000);
})();
