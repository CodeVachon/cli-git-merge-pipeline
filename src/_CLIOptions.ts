export const yargsOptions = {
    cwd: {
        type: "string",
        alias: "c",
        describe: "Working Directory"
    },
    workflow: {
        type: "string",
        alias: "w",
        describe: "Select a Workflow"
    },
    auto_push: {
        type: "boolean",
        alias: "p",
        describe: "Automatically push each branch to origin"
    },
    config: {
        type: "string",
        alias: "f",
        describe: "configuration path"
    }
} as const;
export type YargsOptions = typeof yargsOptions;
