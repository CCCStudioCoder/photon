import { ComponentChild } from "preact";
import { LabObject, ObjectBuilder } from "./objects";
import { ComponentDeclaration } from "../thunder-scripting/core";

type CompJSON = {
    component: ComponentDeclaration
};
export class CompObject extends LabObject<CompJSON> {

    public component: ComponentDeclaration;

    constructor(comp: ComponentDeclaration) {
        super(CompBuilder);
        this.component = comp;
    }

    public wrap() {
        return {
            component: this.component
        };
    }

    public renderStructure(): ComponentChild {
        return <></>;
    }

    public static extract(json: CompJSON): CompObject {
        return new CompObject(json.component);
    }

}

export const CompBuilder: ObjectBuilder<CompJSON> = {
    name: "Component",
    ext: ".tsx",
    docs: "",
    extractor: CompObject.extract,
};