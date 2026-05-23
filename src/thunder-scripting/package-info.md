# Thunder Scripting documentation

## Layers

### TS file
A TS file is represented as a list of Declaration.
### Declaration
A declaration is a part of a TS file, it can be a function, a class, a const...
Each declaration is made of different code blocks.
### Code block
A code block is a list of code lines with some restrictions,
e.g. the single code block of the constants has the restriction `const`, so it can be only a const instruction.
### Code line
A code instruction is a line of code, with it's main instruction, and the incoming instructions used for things like parameters.
### Code instruction
A code instruction is somethings like a variable declaration, or a function execution.