/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    SyncedDataObject,
    useSyncedObject
} from "@fluidframework/react";
import * as React from "react";

// Context
export const ResizableAreaContext = React.createContext<IDimensions>( {
        h: 0,
        w: 0,
});



export interface IDimensions {
    h: number;
    w: number;
}

type IResizableAreaViewProps = React.PropsWithChildren< {
    syncedDataObject: SyncedDataObject,
} >

// ---- Fluid Object w/ a Functional React view using a mixture of DDSes and local state ----
const divClassNameString = 'ResizableAreaDiv'
export function ResizableAreaView(
    props: IResizableAreaViewProps,
) {
    // Use synced states
    const [dimensions, setDimensions] = useSyncedObject<IDimensions>(props.syncedDataObject, "dimensions", {h: 100, w: 100})

    // Use local state
    const observerCallback: any = React.useCallback((entries) => {
        if (entries.length > 1) {
            console.error("Observing too many things")
        } else {
            if (entries[0].contentRect.height !== dimensions.h || entries[0].contentRect.width !== dimensions.w){
                setDimensions({
                    h: entries[0].contentRect.height,
                    w: entries[0].contentRect.width,
                })
            }
        }
    }, [dimensions, setDimensions])

    React.useEffect(() => {
        // @ts-ignore
        const observer = new ResizeObserver(observerCallback);
        const containerComponent = document.getElementsByClassName(divClassNameString);
        observer.observe(containerComponent[0]);
        return () => {
          // Clean up the subscription
          observer?.disconnect();
        };
    });

    // Render
    return (
        <ResizableAreaContext.Provider value={dimensions}>
            <div
                className = {divClassNameString}
                style = {{
                    minWidth: 50,
                    minHeight: 50,
                    maxHeight: 1000,
                    maxWidth: 1000,
                    width: dimensions.w,
                    height: dimensions.h,
                    backgroundColor: '#eee',
                    resize: 'both',
                    overflow: 'hidden'
                }}
            >
                <div className='innerResizeContainer'
                    style={{
                        width: dimensions.w,
                        height: dimensions.h,
                    }}
                />
            </div>
        </ResizableAreaContext.Provider>
        );
}