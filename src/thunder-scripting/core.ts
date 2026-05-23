import { CodeInstruction, CodeLine, writeMultiline } from "./code-instructions";

export type PreviewPresets = any;
export type TSXCode = any;

export abstract class TSDeclaration<T> {

    public readonly id96767lwx = null;

    public name: string;
    public readonly builder: TSBuilder<T>;

    public constructor(name: string, builder: TSBuilder<T>) {
        this.name = name;
        this.builder = builder;
    }

    public abstract serialize(): T;
    public abstract writeCode(): string;
    public createPreviewPresets(): PreviewPresets|never {

    };

    public static isTSDecla(object: any): object is TSDeclaration<unknown> {
        return "id96767lwx" in object;
    }

}

type Params = {
    name: string;
    type: string;
    default: string;
    required?: boolean;
}[];

type FunctionLikeStructure = {
    params: Params,
    innerCode: CodeLine[],
}

type ComponentStructure = FunctionLikeStructure & {
    content: TSXCode
}
export class ComponentDeclaration extends TSDeclaration<ComponentStructure> {

    public params: Params = [];
    public innerCode: CodeLine[] = [];
    public content: TSXCode = {};

    constructor(name: string) {
        super(name, ComponentBuilder);
    }

    public serialize(): ComponentStructure {
        return {
            params: this.params,
            innerCode: this.innerCode,
            content: this.content
        };
    }

    public writeCode(): string {
        return `function ${this.name} ({${this.params.map(p => p.name).join(", ")}}: 
            {${this.params.map(p => `${p.name}: ${p.type}`).join(", ")}}) {\n ${writeMultiline(this.innerCode, 1)} \n return (\n ${this.content}\n); \n}`;
    }

    public createPreviewPresets() {
        
    }

    public static extract(json: ComponentStructure & {name: string}) {
        const comp = new ComponentDeclaration(json.name);
        comp.params = json.params;
        comp.innerCode = json.innerCode;
        comp.content = json.content;
        return comp;
    }

}

type ConstStructure = {
    type: string;
    value: string;
    cast: string[];
    satisfaction?: string;
}
export class ConstDeclaration extends TSDeclaration<any> {

    public type: string = "any";
    public value: string = "undefined";
    public cast: string[] = [];
    public satisfaction?: string;

    constructor(name: string) {
        super(name, ConstBuilder);
    }

    public serialize(): ConstStructure {
        return {
            type: this.type,
            value: this.value,
            cast: this.cast,
            satisfaction: this.satisfaction
        };
    }

    public writeCode(): string {
        return `const ${this.name}: ${this.type} = ${this.value}${this.satisfaction ? " satisfies " + this.satisfaction : ""}${this.cast.map(type => " as" + type).join("")};`;
    }

    public static extract(json: ConstStructure & {name: string}): ConstDeclaration {
        const decla = new ConstDeclaration(json.name);
        decla.type = json.type;
        decla.value = json.value;
        decla.cast = json.cast;
        decla.satisfaction = json.satisfaction;
        return decla;
    }

}

type FunctionStructure = FunctionLikeStructure & {type: string};
export class FunctionDeclaration extends TSDeclaration<FunctionStructure> {

    public type: string = "void";
    public params: Params = [];
    public innerCode: CodeLine[] = [];

    constructor(name: string) {
        super(name, FunctionBuilder);
    }

    public serialize(): FunctionStructure {
        return {
            type: this.type,
            params: this.params,
            innerCode: this.innerCode
        };
    }

    public writeCode(): string {
        return `function ${this.name} (${this.params.map(p => `${p.name}${p.required ? "" : "?"}: 
            ${p.type}${p.default ? " = " + p.default : ""}`).join(", ")}): ${this.type} {\n ${writeMultiline(this.innerCode, 1)} \n}`;
    }

    public static extract(json: FunctionStructure & {name: string}): FunctionDeclaration {
        const decla = new FunctionDeclaration(json.name);
        decla.type = json.type;
        decla.params = json.params;
        decla.innerCode = json.innerCode;
        return decla;
    }

}

type ClassObject<T> = {
    value: T;
    isStatic: boolean;
};
type ClassConst = {
    type: string;
    value?: string;
    cast: string[];
    satisfaction?: string;
    isReadonly?: boolean;
    isStatic: boolean;
}
type ClassStructure = {
    generics: string[];
    consts: ClassConst[];
    objects: ClassObject<any>[];
    constructorFunc?: FunctionDeclaration; // Maybe not enough
}
export class ClassDeclaration extends TSDeclaration<any> {

    public generics: string[] = [];
    public consts: ClassConst[] = [];
    public objects: ClassObject<any>[] = [];
    public constructorFunc?: FunctionDeclaration;
    
    constructor(name: string) {
        super(name, ClassBuilder);
    }

    public serialize(): ClassStructure {
        return {
            generics: this.generics,
            consts: this.consts,
            objects: this.objects,
            constructorFunc: this.constructorFunc
        };
    }

    public writeCode(): string {
        return (
            "class " + this.name + (this.generics.length > 0) ? `<${this.generics.map(t => t + ",").join("")}>` : ""  + " {\n" //TODO
            + "}"
        );
    }

    public static extract(json: ClassStructure & {name: string}): ClassDeclaration {
        const decla = new ClassDeclaration(json.name);
        decla.generics = json.generics;
        decla.consts = json.consts;
        decla.objects = json.objects;
        decla.constructorFunc = json.constructorFunc;
        return decla;
    }

}

export class TypeDeclaration extends TSDeclaration<any> {

}

export class EnumDeclaration extends TSDeclaration<any> {

}

export class InterfaceDeclaration extends TSDeclaration<any> {

}

export type TSBuilder<T> = {
    name: string;
    extractor: (json: T & {name: string}) => TSDeclaration<T>;
};

const ComponentBuilder: TSBuilder<ComponentStructure> = {
    name: "Component",
    extractor: ComponentDeclaration.extract,
};

const FunctionBuilder: TSBuilder<FunctionStructure> = {
    name: "Hook",
    extractor: FunctionDeclaration.extract,
};

const ConstBuilder: TSBuilder<ConstStructure> = {
    name: "Constant",
    extractor: ConstDeclaration.extract
};

const ClassBuilder: TSBuilder<ClassStructure> = {
    name: "Class",
    extractor: ClassDeclaration.extract
};