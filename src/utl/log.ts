import { txtCyan, txtOrange } from "./colors";

/**
 * Log a message
 * @param args
 * @returns
 */
export const log = (...args: any[]) => console.info(txtOrange("#"), ...args);
/**
 * Log a Command
 * @param args
 * @returns
 */
export const logCmd = (...args: any[]) => console.info(txtCyan(">"), ...args);
