/**
 * Turn an Array of Values into a String Delimited List
 *
 * > Used mostly for Error to display valid options
 * @param array Array of Values
 * @param delimiter delimiter to use
 * @returns String
 */
export const arrayToStringList = (array: Array<unknown>, delimiter = ", "): string => {
    return array
        .map((v) => String(v).trim())
        .filter((v) => v.length > 0)
        .map((v) => `"${v}"`)
        .join(delimiter);
};
