import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { yargsOptions } from "./_CLIOptions";
import { title, Workflows, askAQuestion } from "./utl";

const run = async (): Promise<void> => {
    title("Git Branch\nWorkflow");

    // CLI Arguments
    const args = await yargs(hideBin(process.argv)).options(yargsOptions).argv;

    const settings: ISettings = {
        cwd: process.cwd(),
        workflow: "default",
        auto_push: false
    };
    const workflows = await new Workflows(args.config).init();
    const selectableWorkflows = workflows.getList();

    if (selectableWorkflows.length === 0) {
        throw new Error(`Expected to find enabled workflows at ${args.config}. found 0`);
    }
    if (!args.cwd) {
        settings.cwd = await askAQuestion({
            name: "cwd",
            message: "Working Directory?",
            type: "string",
            default: settings.cwd
        });
    }

    if (!args.workflow) {
        if (selectableWorkflows.length === 1) {
            settings.workflow = selectableWorkflows[0];
        } else {
            settings.workflow = await askAQuestion({
                name: "workflow",
                message: "Which Workflow would like to run?",
                type: "search-list",
                choices: selectableWorkflows
            });
        }
    }

    console.log({ args, settings });

    return Promise.resolve();
};

run()
    .then(() => {
        console.log("Task Complete");
    })
    .catch((error) => {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error Type has Occurred", error);
        }
    })
    .finally(() => {
        console.log("Work Complete");
        process.exit(0);
    });

interface ISettings {
    cwd: string;
    workflow: string;
    auto_push: boolean;
}
