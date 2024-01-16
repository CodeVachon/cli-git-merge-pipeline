import { ISettings } from "~";
import {
    GitAPI,
    IWorkflowConfig,
    mapPipelineValueToBranch,
    makeWorkflowSteps,
    txtCyan,
    txtOrange
} from "../utl";

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
    // console.log("Test", { settings, workflow });

    console.log(`Pipeline: ${workflow.pipeline.map((v) => txtOrange(v)).join(txtCyan(` > `))}`);

    const git = new GitAPI({ cwd: settings.cwd, verbose: true });
    await git.fetch();
    const branches = await git.branchList();

    // console.log(branches);
    const mappedBranches = await mapPipelineValueToBranch(workflow.pipeline, branches);
    const steps = makeWorkflowSteps(mappedBranches);

    // console.log(steps);
    console.log();
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(`Step ${i + 1}: Merge ${txtCyan(step.source)} into ${txtOrange(step.target)}`);
    }
    console.log();
};
