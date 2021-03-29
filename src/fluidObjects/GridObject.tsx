/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    DataObject,
    DataObjectFactory,
} from "@fluidframework/aqueduct";
import { IEvent, } from "@fluidframework/common-definitions";
import { SharedMatrix } from "@fluidframework/matrix";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { GridView } from "../views";
import { IDataCell } from '../contracts';

export class GridObject extends DataObject {
    public static get Name() { return 'GridObject'; }
    public static readonly factory =
        new DataObjectFactory<GridObject, unknown, unknown, IEvent>(
            GridObject.name,
            GridObject,
            [ SharedMatrix.getFactory() ],
            {}
        );

    // private members
    private grid: SharedMatrix<IDataCell>;
    private domElement: HTMLElement | undefined;

    /**
     * Setup for the DataObject
     */
    protected async initializingFirstTime() {
        // create DDS for weather data
        const matrix = SharedMatrix.create<IDataCell>(this.runtime);
        randomGridGenerate(matrix);

        // store the dds under root
        this.root.set("matrixKey", matrix.handle);
    }
    
    /**
     * Useful for stashing away handles and such
     */
    protected async hasInitialized() {
        this.grid = await this.root.get("matrixKey").get();
        this.grid.on("op", () => this.render(this.domElement));
    }

    public render(el: HTMLElement) {
        if (this.domElement != el) {
            this.domElement = el
        }
        if (!this.domElement) {
            return;
        }
        ReactDOM.render(
            <GridView
                data={this.grid}
                onCellClick={this.toggleCell}
                onAddRow={this.addRow}
                onAddCol={this.addCol}
            />,
            el,
        );
        return el;
    }
    private readonly addRow = () => {
        this.grid.insertRows(this.grid.rowCount, 1);
        for (let i = 0; i < this.grid.colCount; i++) {
            this.grid.setCell(this.grid.rowCount - 1, i, 'sunny')
        }
    }
    private readonly addCol = () => {
        this.grid.insertCols(this.grid.colCount, 1);
        for (let i = 0; i < this.grid.rowCount; i++) {
            this.grid.setCell(i, this.grid.colCount - 1, 'sunny')
        }
    }
    private readonly toggleCell = (row: number, column: number, currentData: IDataCell): void => {
        const newData = currentData === 'sunny' ? 'rainy' : currentData === 'rainy' ? 'cloudy' : 'sunny';
        this.grid.setCell(row, column, newData);
        // this.render(this.domElement);
    }
}

function randomGridGenerate(grid: SharedMatrix<IDataCell>): void {
    grid.insertRows(0, 4);
    grid.insertCols(0, 4);
    grid.setCells(0, 0, 4, [
        'sunny', 'sunny', 'sunny', 'sunny',
        'sunny', 'sunny', 'sunny', 'sunny',
        'sunny', 'sunny', 'sunny', 'sunny',
        'sunny', 'sunny', 'sunny', 'sunny',
    ]);
}