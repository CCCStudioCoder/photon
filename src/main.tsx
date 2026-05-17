import './style.css'
import { render } from 'preact'
import { Dispatch, StateUpdater, useEffect, useState } from 'preact/hooks';
import { DEFAULT_LAYOUT, deserializeLayout, LayoutUpdater, serializeLayout, type Layout, type SerializedLayout } from './renderer/display';
import { AppRenderer, FullscreenRenderer } from './renderer/core';
import { Project } from './core/project';

export type Location = {
    objType: string;
    directories: string[];
    file: string;
    struct: string;
}

export type IDEContextManager = {
    getLoc: () => Location;
    setLoc: Dispatch<StateUpdater<Location>>;
    project: Project;
}

function App() {
    const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
    const [loc, setLoc] = useState<Location>({
        objType: "page",
        directories: [],
        file: "home",
        struct: ""
    });
    
    const [project, setProject] = useState(Project.create("", "")); //TODO

    useEffect(() => {
        let cancelled = false;

        window.ipcRenderer.invoke('layout:load').then((storedLayout: SerializedLayout | null) => {
            if (cancelled || !storedLayout) {
                return;
            }

            setLayout(deserializeLayout(storedLayout));
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        window.ipcRenderer.send('layout:update', serializeLayout(layout));
    }, [layout]);

    const DISPATCHER: LayoutUpdater = {
        setBelowWindows: lay => {},
        setUpperLayout: lay => {},
        setWindows: lay => {},
        setExtended: lay => {},
        setDimensions: lay => {}
    };

    const MANAGER: IDEContextManager = {
        getLoc: () => loc,
        setLoc: setLoc,
        project: project
    };
    
    return (
        <main>
            {layout.extended == -1 ? 
                <AppRenderer layout={layout} updateHook={DISPATCHER} ideManager={MANAGER} /> : 
                <FullscreenRenderer win={layout.windows.flat()[layout.extended]} updateHook={DISPATCHER} ideManager={MANAGER} />}
        </main>
    );
}

render(<App/>, document.body);