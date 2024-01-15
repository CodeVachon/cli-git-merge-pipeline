/**
 * List of Actions that can be Taken by this CLI Tool
 */
export const actions = ["run", "dry-run", "test"] as const;
export type Action = (typeof actions)[number];

/**
 * List of Options Passed into Yargs for the CLI Interface
 */
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
    },
    action: {
        type: "string",
        alias: "a",
        describe: "what would like to do",
        choices: actions,
        default: "test"
    }
} as const;
export type YargsOptions = typeof yargsOptions;
