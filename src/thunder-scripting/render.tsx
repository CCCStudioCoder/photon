import { CodeInstruction } from "./code-instructions";
import { TSDeclaration } from "./core";
import styles from "./styles.module.css";

export function CodeZone({declaration}: {declaration: TSDeclaration<unknown>}) {
    return (
        <div style={styles.thunderZone}>

        </div>
    );
}

export function CodeNode({instruction}: {instruction: CodeInstruction}) {

}