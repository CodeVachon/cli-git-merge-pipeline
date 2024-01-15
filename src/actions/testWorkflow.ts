import { ISettings } from "~";
import { IWorkflowConfig } from "../utl";

/**
 * Test the Workflow with Values in CWD
 *
 * @param settings
 * @param workflow
 */
export const testWorkflow = async (
    settings: ISettings,
    workflow: IWorkflowConfig
): Promise<void> => {
    console.log("Test", { settings, workflow });
};
