import { ComponentChild, ComponentChildren } from "preact";
import { IDEContextManager } from "../main";
import { listToDir, Project, StructuredDirectory, StructuredList } from "../core/project";
import { LabObject } from "../core/objects";
import { useState } from "preact/hooks";

export type InnerWindowType<T> = {
    id: string;
    name: string;
    button: undefined| // if T = undefined
        [((getter: (() => T), setter: ((value: T) => void)) => ComponentChild), () => T];
    render: (ideManager: IDEContextManager, buttonCtx: T|undefined) => ComponentChild;
};

export const NavWindow: InnerWindowType<undefined> = {
    id: "navigation",
    name: "Navigation",
    button: undefined,
    render: renderNav
};

export const StructWindow: InnerWindowType<undefined> = {
    id: "struct",
    name: "Structure",
    button: undefined,
    render: renderStruct
}

export type WindowId = "navigation"|"struct";

export const WINDOW_REGISTRY = {
    [NavWindow.id]: NavWindow
} as const;

function Wrapper({children, title}: {children: ComponentChildren, title: string}) {
    const [isOpen, setOpened] = useState(true);
    return (
        <div className="wrapper">
            <div className="title" onClick={() => setOpened(!isOpen)}>{title}</div>
            {isOpen && <div className="content">{children}</div>}
        </div>
    );
}

function wrapDir<T extends LabObject<any>>(dir: StructuredDirectory<T>, action: (name: string) => void) {
    return (
        <Wrapper title={dir.name}>
            {dir.content.map((e, i) => "nameT" in e ? wrapDir(e, name => action(name + "/" + e.nameT)) : <div key={i} className="file-block" onClick={() => action(e.name)}>{e.name}</div>)}
        </Wrapper>
    );
}

function renderNav(ideManager: IDEContextManager) {
    function setLoc(loc: string) {
        const parts = loc.split("/");
        ideManager.setLoc({
            objType: parts[0],
            directories: parts.slice(1, parts.length - 2),
            file: parts[parts.length - 1],
            struct: ""
        });
    }

    function NavWrapper<T extends LabObject<any>>({objType, name}: {objType: (project: Project) => StructuredList<T>, name: string}) {
        return (
            <div className="nav-wrapper">
                <Wrapper title={name}>
                    {listToDir(objType(ideManager.project)).content
                        .map((e, i) => "name" in e ? wrapDir(e, name => setLoc(name)) : <div key={i} className="file-block">{e.name}</div>)}
                </Wrapper>
            </div>
        );
    }

    return (
        <div className="nav win">
            <NavWrapper objType={p => p.pages} name="Pages" />
            <NavWrapper objType={p => p.components} name="Components" />
            <NavWrapper objType={p => p.ts} name="TS Files" />
            <NavWrapper objType={p => p.css} name="CSS Files" />
        </div>
    );
}

function renderStruct(ideManager: IDEContextManager) {
    return (
        <div className="struct win">
            {ideManager.project.fromLocation(ideManager.getLoc()).renderStructure(ideManager.setLoc, ideManager.getLoc)}
        </div>
    );
}