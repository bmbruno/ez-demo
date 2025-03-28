(function() {

    window.EZDemo.TextLibrary = window.EZDemo.TextLibrary || {

        // Library data
        library: [],

        // Keys for extension local storage
        keyTextLibrary: "text-library",
        keyChecklistMode: "checklist-mode",

        // Time (ms) before Copy button resets from "copied" label
        buttonResetTimeout: 2000,

        // Checklist Mode will grey out entires as they are copied
        checklistMode: false,

        init: () => {

            EZDemo.TextLibrary.wireUI();

            chrome.storage.local.get([EZDemo.TextLibrary.keyTextLibrary]).then((result) => {

                if (!result || typeof result === "undefined") {
                    console.log("'keyTextLibrary' is null or undefined! Nothing to load.");
                    return;
                }

                try {

                    EZDemo.TextLibrary.library = JSON.parse(result[EZDemo.TextLibrary.keyTextLibrary]) || [];
                    EZDemo.TextLibrary.updateUI();

                } catch (ex) {
                    console.log(`Error loading library: ${ex}`);
                }
            });

            chrome.storage.local.get([EZDemo.TextLibrary.keyChecklistMode]).then((result) => {

                if (!result || typeof result === "undefined") {
                    console.log("'keyChecklistMode' is null or undefined! Nothing to load.");
                    return;
                }

                EZDemo.TextLibrary.checklistMode = result[EZDemo.TextLibrary.keyChecklistMode];
                EZDemo.TextLibrary.updateUI();
            });

        },

        wireUI: () => {

            console.log("wireUI() called.");

            // Save text and add to library
            let saveTextButton = document.getElementById("SaveTextButton");
            if (saveTextButton)
                saveTextButton.addEventListener("click", EZDemo.TextLibrary.handleSaveTextButtonClick);

            // Wire-up clear all button
            let clearAllButton = document.getElementById("ClearAll");
            if (clearAllButton)
                clearAllButton.addEventListener("click", EZDemo.TextLibrary.handleClearAllClick);

            // Checklist Mode checkbox click
            let checklistModeToggle = document.getElementById("ChecklistMode");
            if (checklistModeToggle)
                checklistModeToggle.addEventListener("click", () => {
                    EZDemo.TextLibrary.checklistMode = checklistModeToggle.checked;

                    chrome.storage.local.set({ [EZDemo.TextLibrary.keyChecklistMode] : EZDemo.TextLibrary.checklistMode });
                    
                    if (!EZDemo.TextLibrary.checklistMode) {
                        EZDemo.TextLibrary.resetChecklist();
                    }
                });
        },

        updateUI: () => {

            //
            // Library list
            //

            let list = document.getElementById("LibraryList");
            let libraryEmptyMessage = document.getElementById("LibraryEmpty");

            list.innerHTML = "";

            let template = `
                <li>
                    <div class="text-item-display-container {{CHECKLIST}}">
                        <span class="button-container">
                            <button class="text-item-copy-button btn" data-text="{{TEXT}}">Copy</button>
                        </span>
                        <span class="text-item" data-text="{{TEXT}}">
                            {{TEXT}}
                        </span>
                    </div>
                    <div class="text-item-edit-container">
                        <input type="text" class="text-item-edit-input" value="{{TEXT}}" data-original="{{TEXT}}" /><button class="btn small text-item-delete" data-text="{{TEXT}}"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                </li>`;

            let output = "";

            if (EZDemo.TextLibrary.library.length > 0) {

                // Hide the "empty library message"
                libraryEmptyMessage.style.display = "none";
                list.style.display = "block";

                EZDemo.TextLibrary.library.forEach((element) => {

                    output += template.replaceAll("{{TEXT}}", element.text).replaceAll("{{CHECKLIST}}", (element.checked) ? "checklist-done" : "");
                    list.innerHTML = output;
                });

                // Click event for Copy button (see existing function)
                document.querySelectorAll(".text-item-copy-button").forEach((element) => {

                    element.addEventListener("click", (e) => { EZDemo.TextLibrary.handleCopyTextClick(e) });

                });

                // Wire-up click event for 'text-item' (go to edit mode)
                document.querySelectorAll(".text-item").forEach((element) => {

                    element.addEventListener("click", (e) => { EZDemo.TextLibrary.handleTextItemClick(e) });

                });

                // Wire-up key event when editing 'text-item'
                document.querySelectorAll(".text-item-edit-input").forEach((element) => {

                    element.addEventListener("keydown", (e) => { EZDemo.TextLibrary.handleTextEditKeydown(e) });

                });

                // Wire-up click event for delete button
                document.querySelectorAll(".text-item-delete").forEach((element) => {

                    element.addEventListener("click", (e) => { EZDemo.TextLibrary.handleTextItemDeleteClick(e) });

                });

            } else {

                // Library is empty
                libraryEmptyMessage.style.display = "block";
                list.style.display = "none";

            }

            //
            // Checklist Mode checkbox
            //

            document.getElementById("ChecklistMode").checked = EZDemo.TextLibrary.checklistMode;

        },

        // Saves data to local extension storage
        saveLibrary: () => {
            
            chrome.storage.local.set({ [EZDemo.TextLibrary.keyTextLibrary] : JSON.stringify(EZDemo.TextLibrary.library) }).then(() => {

                console.log(`Data saved for key '${EZDemo.TextLibrary.keyTextLibrary}; length: ${EZDemo.TextLibrary.library.length}'`);

            });

        },

        // Confirms if the user wants to clear the library; if so, resets library to empty
        handleClearAllClick: () => {

            if (confirm("Are you sure you want to clear all entries?")) {

                EZDemo.TextLibrary.library = [];
                EZDemo.TextLibrary.saveLibrary();
                EZDemo.TextLibrary.updateUI();

            }

        },

        // Adds the new string to the library, if the textbox isn't empty
        handleSaveTextButtonClick: () => {

            let textInput = document.getElementById("AddTextInput");

            if (!textInput || textInput.value == "") {
                console.log("AddTextInput is null or empty!");
                return;
            }

            EZDemo.TextLibrary.library.push({ "checked": false, "text": textInput.value.trim() });
            EZDemo.TextLibrary.saveLibrary();

            // Update page with new value
            EZDemo.TextLibrary.updateUI();

        },

        // Copies the selected string to the clipboard
        handleCopyTextClick: (e) => {

            let button = e.currentTarget;
            let text = button.getAttribute("data-text");
            let originalButtonText = button.innerHTML;
            navigator.clipboard.writeText(text);

            // Show "Copied!" message toast or button change
            button.innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> Copied!`;

            if (EZDemo.TextLibrary.checklistMode) {

                // Update checked value in library and UI
                EZDemo.TextLibrary.updateLibraryChecked(text, true);
                button.parentElement.parentElement.classList.add("checklist-done");
            }

            // After a few moments, reset button to original text.
            window.setTimeout(() => {

                button.innerHTML = originalButtonText;

            }, EZDemo.TextLibrary.buttonResetTimeout);

        },

        // Displays the edit UI for the selected string
        handleTextItemClick: (e) => {

            let textItem = e.currentTarget;
            let displayContainer = textItem.parentNode;
            let editContainer = displayContainer.nextSibling.nextSibling;

            displayContainer.style.display = "none";
            editContainer.style.display = "block";

            // Put focus on the input
            editContainer.children[0].select();

        },

        // Delete button logic: removes the selected string from the text library
        handleTextItemDeleteClick: (e) => {

            let valueToRemove = e.currentTarget.getAttribute("data-text");

            if (valueToRemove) {

                EZDemo.TextLibrary.removeFromLibrary(valueToRemove);
                EZDemo.TextLibrary.updateUI();

            }
        },

        // When "Enter" is pressed during editing, update the current value
        handleTextEditKeydown: (e) => {

            // Cancel with Escape
            if(e.code === "Escape") {
                EZDemo.TextLibrary.updateUI();
            }

            // Save with enter
            if (e.code === "Enter" && e.srcElement.value.length > 0) {

                // Update existing value in library
                let existing = e.srcElement.getAttribute("data-original");

                if (existing !== e.srcElement.value)
                    EZDemo.TextLibrary.updateLibrary(existing, e.srcElement.value);
                
                EZDemo.TextLibrary.updateUI();

            }

        },

        // Uncheck all items in the library
        resetChecklist: () => {

            EZDemo.TextLibrary.library.forEach((element, index) => {
                EZDemo.TextLibrary.library[index].checked = false;
            });

            EZDemo.TextLibrary.saveLibrary();
            EZDemo.TextLibrary.updateUI();

        },

        // Updates the given old value to the given new value; saves the library to storage
        updateLibrary: (oldValue, newValue) => {

            if (oldValue && newValue) {

                let index = EZDemo.TextLibrary.library.findIndex((element) => element.text === oldValue);
                if (index > -1) {

                    EZDemo.TextLibrary.library[index].checked = false;
                    EZDemo.TextLibrary.library[index].text = newValue;
                    EZDemo.TextLibrary.saveLibrary();

                }
            }

        },

        // Updates the checked value in the library for the given text string
        updateLibraryChecked: (textValue, checked) => {

            if (textValue) {

                let index = EZDemo.TextLibrary.library.findIndex((element) => element.text === textValue);
                if (index > -1) {

                    EZDemo.TextLibrary.library[index].checked = checked;
                    EZDemo.TextLibrary.saveLibrary();

                }
            }

        },

        // Removes the given value from the library array; saves the library to storage
        removeFromLibrary: (valueToRemove) => {

            let index = EZDemo.TextLibrary.library.findIndex((element) => element.text === valueToRemove);
            if (index > -1) {
                EZDemo.TextLibrary.library.splice(index, 1);
                EZDemo.TextLibrary.saveLibrary();
            }

        }

    };

    window.EZDemo.TextLibrary.init();

})();