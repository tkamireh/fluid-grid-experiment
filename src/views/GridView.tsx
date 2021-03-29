import { SharedMatrix } from '@fluidframework/matrix';
import * as React from "react";

import { IDataCell } from '../contracts';
import { ILayoutBreakPoints, useLayoutBreakPoints } from './useLayoutBreakPoints';

const relativePath = '../public'
const sunnySrc = relativePath + '/sunny.png';
const cloudySrc = relativePath + '/cloud.png';
const rainySrc = relativePath + '/rainy.png';

// Interfaces
export interface IGridViewProps {
    data: SharedMatrix<IDataCell>;
    onCellClick: (row: number, col: number, data: IDataCell) => void;
    onAddRow: () => void;
    onAddCol: () => void;
}

export function GridView(
    props: IGridViewProps
) {
    const defaultTrigger = React.useCallback(() => {
        return {
            minHeight: 30 * props.data.rowCount,
            maxHeight: 10000 * props.data.rowCount, 
            minWidth: 30 * props.data.colCount,
            maxWidth: 10000 * props.data.colCount
        }
    }, [props]);
    const dummyTrigger = React.useCallback(() => {
        return {
            minHeight: 0,
            maxHeight: 300 * props.data.rowCount - 1,
            minWidth: 0,
            maxWidth: 300 * props.data.colCount - 1,
        }
    }, [props]);

    const breakpoints: ILayoutBreakPoints = {
        dummy: {
            trigger: dummyTrigger,
            layoutId: 'dummyLayoutId',
            priority: 0
        },
        default: {
            trigger: defaultTrigger,
            layoutId: 'defaultLayoutId',
            priority: 1000
        }
    }

    const layoutId = useLayoutBreakPoints(breakpoints, 'innerResizeContainer')
    console.log(layoutId + 'is the layout ID')
    if (layoutId === 'dummy') {
        return (
            <div
                style={{height: '100%', width: '100%'}}
            >
                Placeholder
            </div>
        );
    }
    
    let arr: any[] = [];
    for (let i = 0; i < props.data.rowCount; i++) {
        arr.push(
        <GridRow
            row={i}
            numCols={props.data.colCount}
            grid={props.data}
            onCellClick={props.onCellClick}
        />);
    }
    return (
        <div className='gridContainerDiv' style={{flexDirection: 'column', overflow: 'hidden'}}>
            <div style={{flexDirection: 'column'}}>
                <button onClick={props.onAddRow}>Add Row</button>
                <button onClick={props.onAddCol}>Add Col</button>
            </div>
            <table>
                {arr}
            </table>
        </div>
    );
}

interface IRowConfig {}
interface IGridRowProps {
    row: number;
    numCols: number;
    grid: SharedMatrix<IDataCell>
    rowConfig?: IRowConfig;
    onCellClick: (row: number, col: number, data: IDataCell) => void;
}
export function GridRow(props: IGridRowProps) {
    let arr: IDataCell[] = [];
    for (let i = 0; i < props.numCols; i++) {
        arr.push(props.grid.getCell(props.row, i));
    }
    return (
        <tr
            style={{
                // height: '15%',
                flexDirection: 'row'
            }}
        >
            {arr.map((val, index) => {
                return (
                    <GridCell
                        row={props.row}
                        column={index}
                        data={val}
                        onCellClick={props.onCellClick}
                        grid={props.grid}
                    />
                );
            })}
        </tr>
    );
}

interface IGridCellProps {
    row: number;
    column: number;
    data: IDataCell;
    grid: SharedMatrix<IDataCell>
    onCellClick: (row: number, col: number, data: IDataCell) => void;
}
export function GridCell(props: IGridCellProps) {
    let imgSrc = sunnySrc;
    if (props.data === 'rainy') {
        imgSrc = rainySrc;
    } else if (props.data === 'cloudy') {
        imgSrc = cloudySrc;
    }

    return (
        <td>
            <div
                style={{
                    color: 'blue',
                    background: 'white',
                    flexDirection: 'column',
                    width: '30px',
                    height: '30px'
                }}
                onClick={() => {
                    props.onCellClick(props.row, props.column, props.data)
                }}
            >
                <p style={{fontSize: '.4em'}}>{props.row * props.grid.colCount + props.column + 1}</p>
                <img 
                    src={imgSrc}
                    style={{
                        minWidth:'50%',
                        maxWidth: '50%'
                    }}
                />
            </div>
        </td>
    )
}