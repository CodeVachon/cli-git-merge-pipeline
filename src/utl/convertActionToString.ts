import { capitalize } from "./capitalize";

export const convertActionToString = (value: string): string => {
    return value
        .split(new RegExp("[_-]{1,}"))
        .map((v) => capitalize(v))
        .join(" ");
};
