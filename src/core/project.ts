import { Location } from "../main";
import { CompObject } from "./comps";
import { CSSObject } from "./cssFiles";
import { LabObject } from "./objects";
import { PageObject } from "./pages";
import { TSObject } from "./tsFiles";

export type StructuredDirectory<T extends LabObject<any>> = {
    name: string;
    content: Array<T | StructuredDirectory<T>>;
}
export type StructuredList<T extends LabObject<any>> = Array<T | StructuredDirectory<T>>;

export function listToDir<T extends LabObject<any>>(list: StructuredList<T>): StructuredDirectory<T> {
    return {
        name: "",
        content: list
    }
}

type CachedSettings = {
    layout?: PageObject;
    template?: PageObject;
    proxy?: TSObject;
    styles?: CSSObject;
}

type JSONProject = {
    name: string;
    path: string;
    pages: StructuredList<PageObject>;
    components: StructuredList<CompObject>;
    ts: StructuredList<TSObject>;
    css: StructuredList<CSSObject>;
    settings: CachedSettings;
};

export class Project {

    public name: string;
    public path: string;
    
    public pages: StructuredList<PageObject> = [];
    public components: StructuredList<CompObject> = [];
    public ts: StructuredList<TSObject> = [];
    public css: StructuredList<CSSObject> = [];

    public settings: CachedSettings = {};

    private constructor(path: string, name?: string) {
        const pathParts = path.split("/");

        this.name = name || pathParts[pathParts.length - 1];
        this.path = path;
    }

    public fromLocation(loc: Location): LabObject<unknown> {
        let toExplore: StructuredList<LabObject<any>>|StructuredDirectory<LabObject<any>>;

        switch(loc.objType) {
            case "pages": toExplore = this.pages;
                break;
            case "comps": toExplore = this.components;
                break;
            case "ts": toExplore = this.ts;
                break;
            case "css": toExplore = this.css;
                break;
            default: console.error(loc.objType + " is not a valid lab object type.");
        }

        let result: LabObject<unknown>|undefined;
        for(const dir of loc.directories) {
            const computed: LabObject<any>|StructuredDirectory<LabObject<any>>|undefined = 
                "name" in toExplore! ? toExplore.content.find(e => !("name" in e) && e.builder.name == dir) : toExplore!.find(e => !("name" in e) && e.builder.name == dir);
            if("content" in computed!) {
                toExplore = computed!;
            } else {
                result = computed!;
            }
        }
        if(!result && "content" in toExplore!) {
            const temp = toExplore!.content.find((e: LabObject<any> | StructuredDirectory<LabObject<any>>) => !("name" in e) && e.builder.name == loc.file)!;
            result = "name" in temp ? undefined : temp;
        }

        return result!;
    }


    public serialize(): JSONProject {
        return {
            name: this.name,
            path: this.path,
            pages: this.pages,
            components: this.components,
            ts: this.ts,
            css: this.css,
            settings: this.settings
        };
    }

    private static deserialize(json: JSONProject|number): Project {
        let project: Project;
        if(typeof json == "number") {
            project = this.empty();
        } else {
            project = new Project(json.path, json.name);
        }
        return project; //TODO
    }

    public static empty(): Project {
        return new Project("");
    }

    public static create(path: string, name: string) {
        return new Project(path, name);
    }

    public static async imported(path: string): Promise<Project> {
        return this.deserialize(-1);
    }

    public static async open(name: string): Promise<Project> {
        return this.deserialize(await window.ipcRenderer.invoke('project:open', ["cache", `${name}.json`]));
    }

}
