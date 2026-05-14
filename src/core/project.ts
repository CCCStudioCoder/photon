import { CompObject, CSSObject, LabObject, PageObject, TSObject } from "./objects";

type StructuredList<T extends LabObject> = Array<T | StructuredList<T>>;

type CachedSettings = {
    layout?: PageObject;
    template?: PageObject;
    proxy?: TSObject;
    styles?: CSSObject;
}

type JSONProject = {};

export class Project {

    public name: string;
    public path: string;
    
    public readonly pages: StructuredList<PageObject> = [];
    public readonly components: StructuredList<CompObject> = [];
    public readonly ts: StructuredList<TSObject> = [];
    public readonly css: StructuredList<CSSObject> = [];

    public readonly settings: CachedSettings = {};

    private constructor(path: string, name?: string) {
        const pathParts = path.split("/");

        this.name = name || pathParts[pathParts.length - 1];
        this.path = path;
    }

    public serialize(): JSONProject {
        return {};
    }

    private static deserialize(json: JSONProject): Project {
        return new Project(""); //TODO
    }

    public static empty(): Project {
        return new Project("");
    }

    public static create(path: string, name: string) {
        return new Project(path, name);
    }

    public static imported(path: string): Project {
        return this.deserialize({}); //TODO
    }

    public static open(name: string): Project {
        return this.deserialize({}); //TODO ... PATH = "<root>/cache/${name}.json".path
    }

}