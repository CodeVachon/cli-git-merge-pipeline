import type { Question, ListQuestionOptions } from "inquirer";
import { inquirer } from "./_inquirer";

/**
 * A Promise Based Question Prompt
 *
 * A Wrapper for Inquirer to allow for 1 Question
 * to be asked at a time
 *
 * @param options
 * @returns the Users Response
 */
export const askAQuestion = async <T = string>(
    options: Question | ListQuestionOptions
): Promise<T> => {
    const resultOfQuestion = await inquirer.prompt([
        {
            ...options,
            name: "answer"
        }
    ]);

    return resultOfQuestion.answer satisfies T;
}; // close askAQuestion
