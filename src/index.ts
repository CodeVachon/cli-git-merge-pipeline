import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Action, actions, yargsOptions } from "./_CLIOptions";
import {
    title,
    Workflows,
    askAQuestion,
    displayError,
    IWorkflowConfig,
    arrayToStringList,
    convertActionToString,
    txtCyan,
    txtOrange
} from "./utl";
import { runWorkflow, testWorkflow } from "./actions";
import { GitAPI } from "./utl/GitApi";
import path from "node:path";

const setup = async (): Promise<{ settings: ISettings; workflow: IWorkflowConfig }> => {
    title("Git Branch\nWorkflow");

    /**
     * Collect an Arguments from the CLI
     */
    const args = await yargs(hideBin(process.argv)).options(yargsOptions).argv;

    /**
     * Set Default Settings Values
     */
    const settings: ISettings = {
        cwd: process.cwd(),
        workflow: "default",
        auto_push: false,
        action: "run"
    };

    let project_folder;
    if (process.pkg) {
        //  It is run as an executable
        project_folder = path.dirname(process.execPath);
    } else {
        //  It is run with nodejs
        project_folder = __dirname;
    }

    const configDir = args.config ?? path.resolve(project_folder, "./../");
    /**
     * Look for Workflows
     */
    const workflows = await new Workflows(configDir).init();

    /**
     * Check that I have Valid ready to use Workflows
     */
    const selectableWorkflows = workflows.getList();
    if (selectableWorkflows.length === 0) {
        throw new Error(`Expected to find enabled workflows at ${configDir}. found 0`);
    }

    /**
     * If not passed, ask for Current Working Directory
     */
    if (!args.cwd) {
        settings.cwd = await askAQuestion({
            name: "cwd",
            message: "Working Directory?",
            type: "string",
            default: settings.cwd
        });
    } else {
        settings.cwd = args.cwd;
    }

    /**
     * Check that Current Working Directory is Clean
     */
    const git = new GitAPI({ cwd: settings.cwd });
    if (await git.isDirty()) {
        throw new Error("Git is in a Dirty State");
    }

    /**
     * If Not Passed, Select a Workflow
     */
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
    } else {
        settings.workflow = args.workflow;
    }

    /**
     * Get the Selected Workflow
     */
    const workflow = workflows.getWorkflow(settings.workflow);

    /**
     * If Not Passed, Select which Action you want to Take
     */
    if (!args.action) {
        settings.action = await askAQuestion({
            name: "action",
            message: "What would you like to do?",
            type: "list",
            choices: actions.map((v) => ({ name: convertActionToString(v), value: v }))
        });
    } else {
        settings.action = args.action;
    }

    /**
     * If Running...
     */
    if (settings.action === "run") {
        /**
         * If Not Passed, ask if I want to Automatically Push Values to Origin
         */
        if (!args.auto_push) {
            settings.auto_push = await askAQuestion({
                name: "auto_push",
                message: "Would you like to Automatically Push to Origin?",
                type: "confirm",
                default: true
            });
        } else {
            settings.auto_push = args.auto_push;
        }
    }

    /**
     * Config Complete, Pass Selected Values
     */
    return { settings, workflow };
};

/**
 * Setup and Run the CLI Application
 */
setup()
    .then(({ settings, workflow }) => {
        console.log("");
        console.log(
            `${txtCyan(convertActionToString(settings.action))}: ${txtOrange(workflow.name)}`
        );
        console.log("");
        switch (settings.action) {
            case "dry-run":
                settings.auto_push = false;
            case "run":
                return runWorkflow(settings, workflow);
            case "test":
                return testWorkflow(settings, workflow);
            default:
                throw new Error(
                    `Unexpected Action "${settings.action}". Expected one of [${arrayToStringList([
                        ...actions
                    ])}]`
                );
        }
    })
    .then(() => {
        /**
         * We have Successfully Complete the Requested Action
         */
        console.log("Task Complete");
    })
    .catch((error) => {
        /**
         * An Handled Error has been thrown or passed up
         *
         * display details...
         */
        displayError(error);
        /**
         * Exit with Error Code
         */
        process.exit(1);
    })
    .finally(() => {
        /**
         * No other actions to Take
         *
         * Exit Gracefully
         */
        console.log("Work Complete");
        process.exit(0);
    });

export interface ISettings {
    cwd: string;
    workflow: string;
    auto_push: boolean;
    action: Action;
}
