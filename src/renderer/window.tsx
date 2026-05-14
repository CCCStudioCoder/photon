import { ComponentChild } from "preact";

export type InnerWindowType<T> = {
    id: string;
    name: string;
    button: undefined| // if T = undefined
        [((getter: (() => T), setter: ((value: T) => void)) => ComponentChild), () => T];
    render: (buttonCtx: T|undefined) => ComponentChild;
};

export const NavWindow: InnerWindowType<undefined> = {
    id: "navigation",
    name: "Navigation",
    button: undefined,
    render: renderNav
};

export type WindowId = "navigation";

export const WINDOW_REGISTRY = {
    [NavWindow.id]: NavWindow
} as const;

function renderNav() {
    return <></>;
}
