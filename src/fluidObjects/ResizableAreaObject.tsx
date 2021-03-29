/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IEvent } from "@fluidframework/common-definitions";
import {
    SyncedDataObject,
    setSyncedObjectConfig,
} from "@fluidframework/react";
import { SharedMap } from "@fluidframework/map";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ResizableAreaView, IDimensions } from "../views";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";

export class ResizableArea extends SyncedDataObject {
    public static get Name() { return "ResizableArea"; }

    public static readonly factory =
        new DataObjectFactory<ResizableArea, unknown, unknown, IEvent>(
            ResizableArea.name,
            ResizableArea,
            [ SharedMap.getFactory() ],
            {},
        );

    constructor(props) {
        super(props);
        // Declare configs for each synced state the view will need
        setSyncedObjectConfig<IDimensions>(
            this,
            "dimensions",
            {w: 100, h: 100}
        );
    }

    public render(el: HTMLElement) {
        ReactDOM.render(
            <ResizableAreaView
                syncedDataObject={this}
            />,
            el,
        );
        return el;
    }

    public deepRender(obj: IFluidHTMLView): void {
        obj.render(document.getElementsByClassName("innerResizeContainer")[0] as HTMLElement)
        console.log('Rendering inner object')
    }
}