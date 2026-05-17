type CommunicationProcess = {
    name: string;
    type?: string;
    flow: boolean; // flow/value
    defaultValue?: string;
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
    }
}

type InstructionCodeFormatter = (string|CommunicationProcess)[];

export type CodeInstruction = {
    name: string;
    format: InstructionCodeFormatter;
}

const Eval: CodeInstruction = {
    name: "Eval",
    format: ["eval(", input("code", "string"), ")"] // ";\n" should be placed auto between instruction
}

export const Instructions: CodeInstruction[] = [
    Eval
] as const;