import fs from "node:fs/promises";

/**
 * Read and Return a JSON file
 *
 * @param path The Fully Qualified Filepath to Read
 * @param defaults value to use as Default Values
 * @returns contents of a JSON file with Default values applied
 */
export const readJSONFile = async <T = Record<string | number | symbol, unknown>>(
    path: string,
    defaults: Partial<T> = {}
): Promise<T> => {
    const contents = await fs.readFile(path, "utf-8");
    const data = JSON.parse(contents);

    return { ...defaults, ...data };
};
