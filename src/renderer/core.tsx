import { useEffect, useState } from "preact/hooks";
import { Layout, LayoutUpdater } from "./display";
import { InnerWindowType } from "./window";
import { IDEContextManager } from "../main";

export function WindowRenderer({layout, win, updateHook, ideManager}: {layout: Layout, win: number, updateHook: LayoutUpdater, ideManager: IDEContextManager}) {
    const [selected, setSelected] = useState(0);

    const withLayout = <T,>(compute: ((lay: Layout) => T)) => {let temp = layout; return compute(temp);}

    const WIN = layout.windows[win];
    const CURRENT =  WIN instanceof Array ? WIN[selected] : WIN;

    const IS_BELOW = win >= layout.windows.length - layout.belowWindows;
    const WIN_ZONE = withLayout(temp => temp.upperLayout.reduce((a, _, i) => win > i ? ++a : a, 0));
    const CUT_POS = layout.dimensions[3][layout.upperLayout.filter((e, i) => e == 1 && i < WIN_ZONE).length] || 0;
    const UPPER_WINS = withLayout(temp => temp.upperLayout.reduce((a, b) => a + b, 0));
    const IS_MID = win - (withLayout(temp => temp.upperLayout.reduce((a, b) => win <= a + b ? a + b : a, 0))) == 1;
    const BELOW_INDEX = win - UPPER_WINS;

    const prop = (truthy: number, falsy: number) => `${IS_BELOW ? truthy : falsy}%`;
    
    const top = prop(layout.dimensions[0][0], CUT_POS);
    const left = prop(layout.dimensions[2][BELOW_INDEX], layout.dimensions[1][WIN_ZONE]);
    const width = (arr: number[], index: number) => index + 1 == arr.length ? `calc(100vw - ${arr[index - 1]}%)` : `${arr[index + 1] - arr[index]}%`;

    const button = CURRENT.button;
    const [ctx, setCtx] = useState<unknown>(null);
    
    useEffect(() => setCtx(button ? button[1]() : null), [win, selected]);

    function close(){
        const wins = layout.windows;
        if(wins.length == 1) return;
        if(wins[win] instanceof Array) {
            wins[win].splice(selected, 1);
        } else {
            wins.splice(win, 1);
        }
        updateHook.setWindows(wins);
    }

    return (
        <div className="inner-win" style={{
            top: top,
            left: left,
            height: IS_BELOW ? `calc(100vh - ${top})` : 
                (layout.upperLayout[WIN_ZONE] ? (IS_MID ? layout.dimensions[0][0] - CUT_POS : CUT_POS) : layout.dimensions[0][0]),
            width: IS_BELOW ? width(layout.dimensions[2], BELOW_INDEX) : width(layout.dimensions[1], WIN_ZONE)
        }}>
            <div className="head">
                <div className="win-selector">
                    {WIN instanceof Array ? WIN.map((w, i) => <div key={i} className={`win${i == selected ? " focus" : ""}`} onClick={( )=> setSelected(i)}>{w.name}</div>) : WIN.name}
                </div>
                <div className="buttons">
                    <button className="close" onClick={close}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#0F0F0F"></path> </g></svg>
                    </button>
                    <button className="expand" onClick={() => updateHook.setExtended(withLayout(lay => lay.windows.flat()).indexOf(CURRENT))}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#000000"></path> </g></svg>
                    </button>
                    {button && button[0]((() => ctx), setCtx)}
                </div>
            </div>
            <div className="content">{CURRENT.render(ctx)}</div>
        </div>
    );
}

export function AppRenderer({layout, updateHook, ideManager}: {layout: Layout, updateHook: LayoutUpdater, ideManager: IDEContextManager}) {
    return (
        <div className="app">
            {layout.windows.map((_, i) => <WindowRenderer key={i} layout={layout} win={i} updateHook={updateHook} ideManager={ideManager} />)}
        </div>
    );
}

export function FullscreenRenderer<T>({win, updateHook, ideManager}: {win: InnerWindowType<T>, updateHook: LayoutUpdater, ideManager: IDEContextManager}) {
    const [buttonCtx, setCtx] = useState(win.button?.[1]);
    return (
        <div className="fullscreen">
            <div className="buttons">
                <button className="reduce" onClick={() => updateHook.setExtended(-1)}>
                    <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" class="si-glyph si-glyph-reduce" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>143</title> <defs> </defs> <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g fill="#434343"> <path d="M2.329,9.083 C1.949,9.083 1.641,9.393 1.641,9.773 L3.229,11.367 L0.249999984,14.2685692 C0.0579999838,14.4605692 -0.0380000162,14.7115692 -0.0380000162,14.9635692 C-0.0380000162,15.2155692 0.0579999838,15.4665692 0.249999984,15.6585692 C0.632999984,16.0425692 1.25599998,16.0425692 1.64099998,15.6585692 L4.617,12.759 L6.196,14.344 C6.576,14.344 6.883,14.034 6.883,13.654 L6.883,9.773 C6.883,9.393 6.576,9.083 6.196,9.083 L2.329,9.083 Z" class="si-glyph-fill"> </path> <path d="M4.573,3.257 L1.78637696,0.209106431 C1.40137696,-0.175893569 0.779376962,-0.175893569 0.394376962,0.209106431 C0.0103769622,0.593106431 0.0103769498,1.18245993 0.39437695,1.56645993 L3.18,4.645 L1.62,6.199 C1.62,6.579 1.929,6.886 2.31,6.886 L6.191,6.886 C6.572,6.886 6.881,6.579 6.881,6.199 L6.881,2.333 C6.883,1.951 6.573,1.645 6.192,1.645 L4.573,3.257 Z" class="si-glyph-fill"> </path> <path d="M14.342,9.78 C14.342,9.4 14.031,9.093 13.651,9.093 L9.771,9.093 C9.39,9.093 9.081,9.4 9.081,9.78 L9.081,13.646 C9.081,14.027 9.391,14.334 9.771,14.334 L11.366,12.747 L14.333755,15.7230002 C14.525755,15.9160002 14.776755,16.0120002 15.027755,16.0120002 C15.280755,16.0120002 15.530755,15.9160002 15.723755,15.7230002 C16.106755,15.3400002 16.106755,14.7170002 15.723755,14.3340002 L12.758,11.359 L14.342,9.78 Z" class="si-glyph-fill"> </path> <path d="M11.361,3.235 L9.767,1.634 C9.388,1.634 9.079,1.944 9.079,2.324 L9.079,6.205 C9.079,6.586 9.388,6.895 9.767,6.895 L13.634,6.895 C14.013,6.895 14.321,6.585 14.321,6.205 L12.75,4.627 L15.7111816,1.55445214 C16.0961816,1.16945214 16.0961816,0.548452143 15.7111816,0.163452143 C15.3281816,-0.219547857 14.7060001,0.0477627032 14.3210001,0.431762703 L11.361,3.235 Z" class="si-glyph-fill"> </path> </g> </g> </g></svg>
                </button>
                {win.button && win.button[0](() => buttonCtx!, setCtx)}
            </div>
            <div className="render">{win.render(buttonCtx)}</div>
        </div>
    );
}