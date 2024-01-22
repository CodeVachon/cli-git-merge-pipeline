/**
 * Capitalizes the provided string
 * @param value The value to be Capitalized
 * @returns the value capitalized
 */
export const capitalize = (value: string) => {
    const type = typeof value;
    if (type !== "string") {
        throw new Error(`Expected a string to be passed into capitalize. Got ${type}`);
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
};
