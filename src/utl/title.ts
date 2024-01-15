import figlet from "figlet";
import { txtOrange } from "./colors";

/**
 * Print a Title to the CLI
 *
 * @param title Title to Display in the CLI
 * @param options Options to Pass to Figlet
 */
export const title = (title: string, options: Partial<figlet.Options> = { font: "Colossal" }) => {
    console.info();
    console.info();
    title
        .split(new RegExp("[\n\r]{1,}"))
        .map((word) => String(word).trim())
        .filter((word) => word.length > 0)
        .forEach((word) => {
            console.info(txtOrange(figlet.textSync(word, options)));
        });
    console.info();
};
