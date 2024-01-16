import { ISettings } from "~";
import {
    askAQuestion,
    GitAPI,
    IWorkflowConfig,
    makeWorkflowSteps,
    mapPipelineValueToBranch,
    MergeError,
    plural,
    txtCyan,
    txtOrange
} from "../utl";

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
        await git.checkout(step.source);
        if (await git.branchHasRemote()) {
            await git.pull();
        }
        await git.checkout(step.target);
        if (await git.branchHasRemote()) {
            await git.pull();
        }

        try {
            await git.merge(step.source, step.target);
        } catch (error) {
            const conflictedPaths = await git.getConflictedPaths();
            const errorMessage = `Merge Error: ${step.source} into ${step.target}.`;

            if (conflictedPaths.length > 0) {
                const err = new MergeError(
                    `${errorMessage} ${conflictedPaths.length} conflicted ${plural(
                        "file",
                        conflictedPaths.length
                    )}`
                );
                err.files = conflictedPaths;

                throw err;
            } else {
                const err = new Error(errorMessage);

                if (error instanceof Error) {
                    err.cause = error;
                } else {
                    err.cause = new Error(String(error));
                }

                throw err;
            }
        }

        let push = false;
        if (await git.branchHasRemote()) {
            if (settings.auto_push === false) {
                push = await askAQuestion({
                    message: `Would you like to push ${step.target}`,
                    type: "confirm",
                    default: true
                });
            } else {
                push = true;
            }
        }

        if (push) {
            await git.push();
        }

        console.log();
    }
};
