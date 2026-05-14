import { Dispatch } from "preact/hooks";
import { InnerWindowType, WINDOW_REGISTRY, WindowId } from "./window";

export type Layout = {
    /** The amount of inner windows in the below part of the layout. */
    belowWindows: number;
    /** Define for each zone of the above part if there's zero, one, or two inner windows */
    upperLayout: number[];
    /** Define which window is in each zone, from top left to bottom right. */
    windows: Array<InnerWindowType<unknown>|InnerWindowType<unknown>[]>;
    /** If not -1, the "extended" index of windows.flat is on fullscreen */
    extended: number;
    /**
     * [0][0]: the distance between the large horizontal mid cut and  the top of the screen.
     * [1]: the distances between each zone of the above part (even if not present) and the left of the screen
     * [2]: the distances between each zone of the below part and the left of the screen
     * [3]: the distances between each horizontal cut of the above parts and the top of the screen
     */
    dimensions: number[][];
};

export type LayoutUpdater = {
    setBelowWindows: Dispatch<number>;
    setUpperLayout: Dispatch<number[]>;
    setWindows: Dispatch<Array<InnerWindowType<unknown>|InnerWindowType<unknown>[]>>;
    setExtended: Dispatch<number>;
    setDimensions: Dispatch<number[][]>;
}

export type SerializedLayout = Omit<Layout, "windows"> & {
    windows: Array<WindowId|WindowId[]>;
};

export const DEFAULT_LAYOUT: Layout = {
    belowWindows: 1,
    upperLayout: [1, 1, 1],
    windows: [], //TODO
    extended: -1,
    dimensions: [
        [60],
        [0, 25, 75],
        [0],
        []
    ]
};

function isKnownWindowId(value: string): value is WindowId {
    return value in WINDOW_REGISTRY;
}

function deserializeWindow(windowId: WindowId): InnerWindowType<unknown> {
    return WINDOW_REGISTRY[windowId] as InnerWindowType<unknown>;
}

export function serializeLayout(layout: Layout): SerializedLayout {
    return {
        ...layout,
        windows: layout.windows.map((windowEntry) =>
            windowEntry instanceof Array ? windowEntry.map((win) => win.id as WindowId) : windowEntry.id as WindowId
        )
    };
}

export function deserializeLayout(layout: SerializedLayout): Layout {
    return {
        ...layout,
        windows: layout.windows.map((windowEntry) => {
            if (windowEntry instanceof Array) {
                return windowEntry.filter(isKnownWindowId).map(deserializeWindow);
            }

            return isKnownWindowId(windowEntry) ? deserializeWindow(windowEntry) : deserializeWindow("navigation");
        })
    };
}
