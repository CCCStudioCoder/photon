/**
 * Describe one of the ways a CodeInstruction interact with other ones.
 */
type CommunicationProcess = {
    /** The input's name */
    name: string;
    /** The input's type */
    type?: string;
    flow: boolean; // flow/value
    defaultValue?: string;
    /** If set, it write additional code only if the param is present */
    optional?: (value: CommunicationProcess, param: CommunicationProcess) => InstructionCodeFormatter;
    /** If true and optional is set, the user can specify as many time the parameter as he want, each time writing additional code. */
    multiple?: boolean
};

function input(name: string, type: string, defaultValue?: string): CommunicationProcess {
    return {
        name: name,
        type: type,
        flow: false,
        defaultValue: defaultValue
    };
}

function flow(name: string): CommunicationProcess {
    return {
        name: name,
        flow: false
    };
}

function optional(name: string, type: string, 
    ifThere: (value: CommunicationProcess, param: CommunicationProcess) => InstructionCodeFormatter, flow: boolean = true): CommunicationProcess {
    return {
        name: name,
        type: type,
        flow: flow,
        optional: ifThere
    };
}

function multiple(from: CommunicationProcess): CommunicationProcess {
    return {
        ...from,
        multiple: true
    };
}

type InstructionCodeFormatter = (string|CommunicationProcess)[];

export type CodeInstruction = {
    name: string;
    format: InstructionCodeFormatter;
    noCodeAfter?: boolean;
};

const Return: CodeInstruction = {
    name: "Return",
    format: ["return ", input("To return", "any"), ";"],
    noCodeAfter: true
};

const Eval: CodeInstruction = {
    name: "Eval",
    format: ["eval(", input("Code", "string"), ");"]
};

const If: CodeInstruction = {
    name: "If",
    format: ["if(", input("Condition", "bool", "true"),") {\n", flow("Then"), "}", 
        multiple(optional("Else if", "flow+bool", (v, p) => [" else if(", p, ") {\n", v, "}"])),
        optional("Else", "flowOnly", v => [" else {\n", v, "}"])]
};

export const Instructions: CodeInstruction[] = [
    Return,
    If,
    Eval
] as const;

export type CodeLine = {
    mainInstruction: CodeInstruction;
    inputs?: (CodeLine|string)[];
    flowOut?: CodeLine[][];
};

function parseParam(initial: string, type: string): string {
    return initial+type;
}

function writeLine(code: CodeLine, indent: number): string {
    let parsed = "";
    for(let i = 0; i < indent; i++) parsed += "\t"; // Little blush for the parsed code...
    let inputI = 0, flowI = 0;
    for(const element of code.mainInstruction.format) {
        if(typeof element == "string") {
            parsed += element;
        } else {
            if(element.flow) {
                parsed += writeMultiline(code.flowOut![flowI++], ++indent);
            } else {
                const input = code.inputs![inputI++];
                parsed += typeof input == "string" ? input : writeLine(input, indent);
            }
        }
    }
    return parsed;
}

export function writeMultiline(code: CodeLine[], indent = 0) {
    let parsed = "";
    for(const line of code) {
        parsed += writeLine(line, indent);
        parsed += "\n";
    }
    return parsed;
}