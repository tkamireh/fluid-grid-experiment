import * as React from 'react';

declare interface ResizeObserverSize {blockSize: number, inlineSize: number};

export interface ILayoutRequirements {
    minHeight: number;
    maxHeight: number;
    minWidth: number;
    maxWidth: number;
}

export type ILayoutRequirementsProducer = () => ILayoutRequirements;

export interface ILayoutBreakPoint {
    trigger: ILayoutRequirements | ILayoutRequirementsProducer;
    priority: number;
    layoutId: string;
}

export interface ILayoutBreakPoints {
    [k: string]: ILayoutBreakPoint;
    default: ILayoutBreakPoint
}

export function extractbreakPointID(
    box: ResizeObserverSize, bps: ILayoutBreakPoints): string {
    // search through breakpoints
    const validBreakpoints = Object.getOwnPropertyNames(bps).filter((val) => {
        let trigger = bps[val] ? bps[val].trigger : undefined;
        if (!trigger) {
            return false;
        } else if (typeof(trigger) === 'function') {
            return meetsCriteria(box, trigger());
        } else if (typeof(trigger) === 'object') {
            return meetsCriteria(box, trigger);
        } else {
            return false;
        }
    });

    console.log(validBreakpoints + ' are the valid breakpoints')
    const val = validBreakpoints.reduce((prev, curr) => {
        return bps[prev].priority < bps[curr].priority ? curr : prev;
    })
    return val || 'default';
}

export function meetsCriteria(box: ResizeObserverSize, reqs: ILayoutRequirements) {
    if (box.inlineSize > reqs.maxWidth || box.inlineSize < reqs.minWidth) {
        return false;
    } else if ( box.blockSize > reqs.maxHeight || box.blockSize < reqs.minHeight) {
        return false;
    }

    return true;
}

export function useLayoutBreakPoints(bps: ILayoutBreakPoints, containerClassName: string): string {
    const [layoutId, setLayoutId] = React.useState(bps.default.layoutId);
    
    // ResizeObserverCallback
    const observerCallback: any = React.useCallback((entries: any[]) => {
        if (entries.length > 1) {
            console.error("Observing too many things");
        } else {
            setLayoutId(extractbreakPointID(entries[0].borderBoxSize[0], bps));
        }
    }, [])

    React.useEffect(() => {
        // @ts-ignore
        const observer = new ResizeObserver(observerCallback);
        const containerComponent = document.getElementsByClassName(containerClassName);
        observer.observe(containerComponent[0]);
        return () => {
          // Clean up the subscription
          observer?.disconnect();
        };
    }, [layoutId, setLayoutId]);

    return layoutId;
}