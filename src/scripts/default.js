(function() {

    window.EZDemo = window.EZDemo || {

        init: () => {

            console.log("EZD init started...");

            console.log("EZD init complete.");

        },

        saveData: (key, data) => {

            console.log(`saveData [${key}] started...`);

            chrome.storage.local.set({ key: data }).then(() => {

                console.log(`saveData completed.`);

            });

        },

        loadData: (key) => {

            console.log(`loadData [${key}] started...`);

            return chrome.storage.local.get([key]);

        }

    };

    EZDemo.init();

})();