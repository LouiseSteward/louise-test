function ebMakeTablesMoreAccessible(table) {

    // Add scope="col" to any <th> inside <thead>
    var theadElements = table.querySelectorAll("thead");

    if (theadElements) {
        theadElements.forEach(function (theadElement) {
            var thElements = theadElement.querySelectorAll("th");
            if (thElements) {
                thElements.forEach(function (thElement) {
                    thElement.setAttribute("scope", "col");
                });
            }
        });
    }

    // Sometimes html tables are added in the markdown without <thead>
    // Safe to assume that any <th> that is in the first <tr> of a table
    // is a column header and needs scope="col"
    // Keeping this separate from the previous query just in case
    var headlessThElements = table.querySelectorAll(
        ":not(thead) > tr:first-of-type > th"
    );

    if (headlessThElements) {
        headlessThElements.forEach(function (headlessThElement) {
            headlessThElement.setAttribute("scope", "col");
        });
    }

    // Add scope="row" to any <th> that has a rowspan attribute
    var rowSpanElements = table.querySelectorAll("th[rowspan]");

    if (rowSpanElements) {
        rowSpanElements.forEach(function (rowSpanElement) {
            rowSpanElement.setAttribute("scope", "row");
        });
    }

    // Instances of <td class="table-row-stub"> need to change to
    // <th class="table-row-stub" scope="row">
    var rowStubElements = table.querySelectorAll(".table-row-stub");
    if (rowStubElements) {
        rowStubElements.forEach(function (rowStubElement) {
            var newRowStubElement = document.createElement("th");
            newRowStubElement.setAttribute("scope", "row");
            newRowStubElement.classList.add("table-row-stub");
            newRowStubElement.innerHTML = rowStubElement.innerHTML;

            rowStubElement.insertAdjacentElement("afterend", newRowStubElement);

            rowStubElement.remove();
        });
    }

}


function ebTables() {
    'use strict';

    var supported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== undefined &&
            !!Array.prototype.forEach;

    if (!supported) {
        return;
    }

    var tables = document.querySelectorAll('table');

    tables.forEach(function (table) {
        // make the wrapper and add a class
        var tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-wrapper');

        // add the wrapper to the DOM
        table.parentNode.insertBefore(tableWrapper, table);

        // move the table inside the wrapper
        tableWrapper.appendChild(table);

        // make the tables more accessible
        ebMakeTablesMoreAccessible(table);
    });
}

ebTables();
