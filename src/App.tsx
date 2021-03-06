import { getTinyliciousContainer } from "@fluid-experimental/get-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";

import { GridObject, ResizableArea } from "./fluidObjects";
import { GridContainer, ResizableAreaContainer } from "./container";

// Since this is a single page Fluid application we are generating a new document id
// if one was not provided
let createNew = false;
if (window.location.hash.length === 0) {
    createNew = true;
    window.location.hash = Date.now().toString();
}
const documentId = window.location.hash.substring(1);
/**
 * This is a helper function for loading the page. It's required because getting the Fluid Container
 * requires making async calls.
 */
async function start() {
    // Get the Fluid Container(s) associated with the provided id
    const resizableContainer = await getTinyliciousContainer(documentId, ResizableAreaContainer, createNew);
    const gridContainer = await getTinyliciousContainer(documentId + '1', GridContainer, createNew)
    
    // Get the Default Object from the Container
    const defaultObject = await getDefaultObjectFromContainer<ResizableArea>(resizableContainer);

    const contentDiv = document.getElementById("content");
    if (contentDiv !== null) {
        defaultObject.render(contentDiv);
    }

    console.log("Going to render inner Object now")
    const innerObject = await getDefaultObjectFromContainer<GridObject>(gridContainer);
    defaultObject.deepRender(innerObject as any)

    // // Setting "fluidStarted" is just for our test automation
    // // eslint-disable-next-line @typescript-eslint/dot-notation
    // window["fluidStarted"] = true;
}

start().catch((e) => {
    console.error(e);
    console.log(
        "%cEnsure you are running the Tinylicious Fluid Server",
        "font-size:30px");
});