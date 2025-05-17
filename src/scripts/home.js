/*

HOME

Provides navigation to other EZDemo modules.
Also provides onload redirection to the last used tool, if applicable.

*/

(function() {

    window.EZDemo.Home = window.EZDemo.Home || {

        // Name of this page/tool; used for remembering last-used tool; should match filename convention
        toolName: "home",

        // Initializes this module with setup tasks
        init: () => {
            
            // If user is navigating to this page from another tool, update current tool to 'home' and skip redirect
            if (EZDemo.Home.isNavigatingToHome()) {

                EZDemo.setCurrentTool(EZDemo.Home.toolName);

            } else {

                EZDemo.Home.redirectToLastUsedTool();

            }
        },

        // Checks if a last-used tool reference is in storage; if so, redirects to that page
        redirectToLastUsedTool: () => {

            chrome.storage.local.get([EZDemo.keyLastUsedTool]).then((result) => {

                try {
                    
                    if (!result || typeof result === "undefined") {
                        console.log("'keyLastUsedTool' is null or undefined! Nothing to load.");
                        return;
                    }

                    // Avoid an unnecessary redirect on first load if the stored tool is 'home'
                    if (result[EZDemo.keyLastUsedTool] === EZDemo.Home.toolName)
                        return;

                    // Redirect; getURL provides the correct absolute path within this extension
                    window.location = chrome.runtime.getURL(`/src/side-${result[EZDemo.keyLastUsedTool]}.html`);
                        
                } catch (ex) {

                    // Exception: just reset the current tool to 'home' for the next reload of the extension
                    console.log(`Error while processing 'keyLastUsed'. Resetting to 'home' page. Exception: ${ex}.`);
                    EZDemo.setCurrentTool(EZDemo.Home.toolName);

                }
            });

        },

        // Determines if the user is purposefully navigating to this page; based on URL param "nav"
        isNavigatingToHome: () => {

            let params = new URLSearchParams(window.location.search);
            return params.has("nav", "true");

        }

    };

    EZDemo.Home.init();

})();