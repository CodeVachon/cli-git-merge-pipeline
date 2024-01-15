import { txtRed } from "./colors";

/**
 * Helper Function to Display Errors in the Console
 *
 * @param error Error to Dump into the console
 */
export const displayError = (error: Error | unknown) => {
    console.error("");
    console.error(txtRed("Error"));
    console.error(txtRed("=".repeat(20)));
    if (error instanceof Error) {
        console.error(error.message);
        console.error();
        console.error("Error Details");
        console.error("=".repeat(20));
        console.error(error);
    } else {
        console.error(error);
    }
    console.error("");
};
