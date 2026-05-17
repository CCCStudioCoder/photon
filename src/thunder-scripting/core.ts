type PreviewPresets = any;
type FeatureFlags  = any;

export abstract class TSDeclaration<T> {

    public readonly builder: TSBuilder<T>;

    public constructor(builder: TSBuilder<T>) {
        this.builder = builder;
    }

    public abstract serialize(): T;
    public abstract writeCode(): string;
    public abstract createPreviewPresets(): PreviewPresets;

}

type ComponentStructure = {
    name: string;
    params: object,
    innerCode: InnerCode.HookCode[],
    content: InnerCode.TSXCode
}
export class ComponentDeclaration extends TSDeclaration<ComponentStructure> {

    public name: string;
    public params: object = {};
    public innerCode: InnerCode.HookCode[] = [];
    public content: InnerCode.TSXCode = {};

    constructor(name: string) {
        super(ComponentBuilder);
        this.name = name;
    }

    public serialize(): ComponentStructure {
        return {
            name: this.name,
            params: this.params,
            innerCode: this.innerCode,
            content: this.content
        };
    }

    public writeCode(): string {
        return `function ${this.name} (${this.params}) {\n ${this.innerCode} \n return (\n ${this.content}\n); \n}`;
    }

    public createPreviewPresets() {
        
    }

    public static extract(json: ComponentStructure) {
        const comp = new ComponentDeclaration(json.name);
        comp.params = json.params;
        comp.innerCode = json.innerCode;
        comp.content = json.content;
        return comp;
    }

    public static parseCode(code: string) {
        const parts = code.match(/function\s+(\w+)\s*\((.*?)\)\s*\{\s*([\s\S]*?)\s*return\s*\(\s*([\s\S]*?)\s*\);\s*\}/);
        return new ComponentDeclaration(""); //TODO: toString and fromString for InnerCode instances
    }

}

export class HookDeclaration extends TSDeclaration<any> {

}

export class ConstDeclaration extends TSDeclaration<any> {

}

export class FunctionDeclaration extends TSDeclaration<any> {

}

export class ClassDeclaration extends TSDeclaration<any> {

}

export class TypeDeclaration extends TSDeclaration<any> {

}

export class EnumDeclaration extends TSDeclaration<any> {

}

export class InterfaceDeclaration extends TSDeclaration<any> {

}

export class NamespaceDeclaration extends  TSDeclaration<any> {

}

export type TSBuilder<T> = {
    name: string;
    features: FeatureFlags;
    extractor: (json: T) => TSDeclaration<T>;
    parser: (code: string) => TSDeclaration<T>;
}
const ComponentBuilder: TSBuilder<ComponentStructure> = {
    name: "Component",
    features: [],
    extractor: ComponentDeclaration.extract,
    parser: ComponentDeclaration.parseCode
};