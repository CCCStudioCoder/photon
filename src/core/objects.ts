import { ComponentChild } from "preact";
import { Location } from "../main";

export abstract class LabObject<T> {

    public readonly builder: ObjectBuilder<T>;

    public constructor(builder: ObjectBuilder<T>) {
        this.builder = builder;
    }

    public abstract wrap(): T;
    public abstract renderStructure(locSetter: (newLoc: Location) => void, locGetter: () => Location): ComponentChild;

}

export type ObjectBuilder<T> = {
    name: string;
    ext: string;
    docs: string;
    extractor: (json: T) => LabObject<T>;
}