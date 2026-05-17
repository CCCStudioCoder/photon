import { LabObject, ObjectBuilder } from "./objects";
import { ComponentChild } from "preact";

type Attribute = {
    name: string;
    value: string|true;
}

type Node = {
    tag: string;
    attributes?: Attribute[];
    children?: Node[];
}

type PageJSON = {
    tree: Node
};
export class PageObject extends LabObject<PageJSON> {

    public tree: Node = {tag: ""}; // "" is equal at "fragment" or in tsx <></>

    constructor() {
        super(PageBuilder);
    }

    public wrap(): PageJSON {
        return {
            tree: this.tree
        }
    }

    public renderStructure(): ComponentChild {
        return <></>;
    }

    public static extract(json: PageJSON): PageObject {
        const object = new PageObject();
        object.tree = json.tree;
        return object;
    }

}

export const PageBuilder: ObjectBuilder<PageJSON> = {
    name: "Page",
    ext: ".tsx",
    docs: "",
    extractor: PageObject.extract,
};