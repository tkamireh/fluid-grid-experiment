import {
    ContainerRuntimeFactoryWithDefaultDataStore,
} from "@fluidframework/aqueduct";

import { GridObject, ResizableArea } from "./fluidObjects";

/**
 * This does setup for the Fluid Container.
 *
 * There are two important things here:
 * 1. Default FluidObject name
 * 2. Map of string to factory for all FluidObjects
 *
 * In this example, we are only registering a single FluidObject, but more complex examples will register multiple
 * FluidObjects.
 */
export const ResizableAreaContainer = new ContainerRuntimeFactoryWithDefaultDataStore(
    ResizableArea.factory,
    new Map([ResizableArea.factory.registryEntry]),
);

export const GridContainer = new ContainerRuntimeFactoryWithDefaultDataStore(
    GridObject.factory,
    new Map([GridObject.factory.registryEntry]),
);