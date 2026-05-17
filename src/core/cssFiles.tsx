import { ComponentChild } from "preact";
import { LabObject, ObjectBuilder } from "./objects";

class SelectorBlock {

}

class AtRuleBlock {

}

type CSSDeclaration = SelectorBlock|AtRuleBlock;

type CssJSON = {declarations: CSSDeclaration[]};
export class CSSObject extends LabObject<CssJSON> {

    public declarations: CSSDeclaration[] = [];

    constructor() {
        super(CSSBuilder);
    }

    public wrap() {
        return {
            declarations: this.declarations
        };
    }

    public renderStructure(): ComponentChild {
        return <></>;
    }

    public static extract(json: CssJSON): CSSObject {
        const object = new CSSObject();
        object.declarations = json.declarations;
        return object;
    }
    
}

export const CSSBuilder: ObjectBuilder<CssJSON> = {
    name: "CSS File",
    ext: ".css",
    docs: "",
    extractor: CSSObject.extract,
};