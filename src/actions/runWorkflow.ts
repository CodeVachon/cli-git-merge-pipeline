import { ISettings } from "~";
import { IWorkflowConfig } from "../utl";

/**
 * Run the Workflow
 *
 * @param settings
 * @param workflow
 */
export const runWorkflow = async (
    settings: ISettings,
    workflow: IWorkflowConfig
): Promise<void> => {
    console.log("Run", { settings, workflow });
};
