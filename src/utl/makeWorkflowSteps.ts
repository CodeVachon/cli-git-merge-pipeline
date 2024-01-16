export type WorkflowStep = {
    source: string;
    target: string;
};
export type WorkflowSteps = Array<WorkflowStep>;

/**
 * Create an Array of Steps
 *
 * @param workflow Array of String
 * @returns
 */
export const makeWorkflowSteps = (workflow: Array<string>): WorkflowSteps => {
    const steps: WorkflowSteps = [];

    for (let i = 0; i < workflow.length - 1; i++) {
        steps.push({
            source: workflow[i],
            target: workflow[i + 1]
        });
    }

    return steps;
};
