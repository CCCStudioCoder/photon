import { ComponentChild } from "preact";
import { LabObject, ObjectBuilder } from "./objects";
import { TSDeclaration } from "../thunder-scripting/core";
import { Location } from "../main";

type TsJSON = {
    declarations: Array<TSDeclaration<any>>
};
export class TSObject extends LabObject<TsJSON> {

    public declarations: Array<TSDeclaration<any>> = [];

    constructor() {
        super(TSBuilder);
    }

    public wrap() {
        return {
            declarations: this.declarations
        }
    }

    private addDeclaration() { //TODO then re-render

    }

    public renderStructure(locSetter: (newLoc: Location) => void, locGetter: () => Location): ComponentChild {
        return (
            <div className="ts-struct">
                {this.declarations.map((decla, i) => (
                    <div className="decla-block">
                        <div key={i} className="decla-link" onClick={() => locSetter({...locGetter(), struct: decla.builder.name})}>{decla.builder.name}</div>
                        <div className="buttons">
                            <button className="dragger"> {// TODO
                                }<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 14H19M5 10H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </button>
                            <button className="delete" onClick={() => this.declarations.filter(e => e.builder.name != decla.builder.name)}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </button>
                            <button className="rename">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 5H14M14 5H19M14 5V19M9 19H14M14 19H19" stroke="#33363F" stroke-width="2"></path> <path d="M11 9H4C2.89543 9 2 9.89543 2 11V15H11" stroke="#33363F" stroke-width="2"></path> <path d="M17 15H20C21.1046 15 22 14.1046 22 13V9H17" stroke="#33363F" stroke-width="2"></path> </g></svg>
                            </button>
                        </div>                      
                    </div>
                ))}
                <button id="add" onClick={this.addDeclaration}>+  New declaration</button>
            </div>
        );
    }

    public static extract(json: TsJSON): TSObject {
        const extracted = new TSObject();
        extracted.declarations = json.declarations;
        return extracted;
    }
    
}

export const TSBuilder: ObjectBuilder<TsJSON> = {
    name: "TS File",
    ext: ".tsx",
    docs: "",
    extractor: TSObject.extract,
};