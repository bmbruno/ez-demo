(function() {

    window.EZDemo = window.EZDemo || {

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

            // TODO: open model
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

        }

    };

    EZDemo.init();

})();