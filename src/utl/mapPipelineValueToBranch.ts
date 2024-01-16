import { askAQuestion } from "./askAQuestion";
import { txtOrange } from "./colors";

/**
 * Map pipeline values to actual Branches in the CWD
 *
 * @param pipeline Array of Pipeline Values
 * @param branches Array of Current Branches
 * @returns
 */
export const mapPipelineValueToBranch = async (
    pipeline: Array<string>,
    branches: Array<string>
): Promise<Array<string>> => {
    const mappedBranches: Array<string> = [];

    for (const value of pipeline) {
        const found = branches.filter((v) => new RegExp(value, "gi").test(v));

        /**
         * If I didn't find a matching value
         */
        if (found.length === 0) {
            /**
             * Throw an Error
             */
            throw new Error(`No matching branch found for "${value}"`);
        } else if (found.length === 1) {
            /**
             * If there is only 1 value, use that
             */
            mappedBranches.push(found[0]);
        } else {
            /**
             * IF there are multiple values, ask
             */
            mappedBranches.push(
                await askAQuestion({
                    message: `Which branch should we use for "${txtOrange(value)}"`,
                    type: "list",
                    choices: found
                })
            );
        }
    }

    return mappedBranches;
};
