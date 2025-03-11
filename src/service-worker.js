import ContentHub from "./contenthub.js"
import OpenAI from "./openai.js"

// Sets the default behavior of the extension action button to open the side panel
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.log(error));

let ch = new ContentHub();
let openai = new OpenAI();