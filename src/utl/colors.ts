import chalk from "chalk";

/**
 * Color constants used for Chalk Output
 */
export enum COLOR {
    ORANGE = "#ff6700",
    CYAN = "#00d5ff"
}

/**
 * String Formate the String as Orange
 *
 * Used in STDOUT
 */
export const txtOrange = chalk.hex(COLOR.ORANGE);
/**
 * String Formate the String as Cyan
 *
 * Used in STDOUT
 */
export const txtCyan = chalk.hex(COLOR.CYAN);
