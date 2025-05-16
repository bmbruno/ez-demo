/*

default.js

Provides common functionality across all modules.
This script should be included on all module pages.

*/

(function() {

    window.EZDemo = window.EZDemo || {
        
        // Keys for local extension storage
        keyLastUsedTool: "last-used-tool",

        // Initializes this module with setup tasks
        init: () => {

            console.log("EZD init started...");

            EZDemo.wireUI();

            console.log("EZD init complete.");

        },

        // Add event handlers and other setup for app-wide common UI elements
        wireUI: () => {

            // Modal close button
            let modalClose = document.querySelectorAll("a.close-modal");
            modalClose.forEach((element) => { element.addEventListener("click", () => EZDemo.handleModalCloseClick(element) ) });

        },

        // Opens the modal for the given ID
        openModal: (id) => {

            let modal = document.getElementById(id);
            if (!modal)
                return;

            modal.style.display = "block";

        },

        // Closes the modal for the given ID
        closeModal: (id) => {

            let modal = document.getElementById(id);
            if (!modal)
                return;

            modal.style.display = "none";

        },

        // Closes a modal for the given close button
        handleModalCloseClick: (e) => {

            if (!e)
                return;

            let modalID = e.getAttribute("data-id");
            EZDemo.closeModal(modalID);

        },

        // Sets the current tool being used; should be called during init
        setCurrentTool: (tool) => {

            chrome.storage.local.set({ [EZDemo.keyLastUsedTool] : tool }).then(() => {

                console.log(`Data saved for key '${EZDemo.keyLastUsedTool}': ${tool}`);

            });
            
        }

    };

    EZDemo.init();

})();