type PluralOptions = {
    /**
     * Value to Append to Root if Plural
     *
     * @default `"s"`
     */
    plural: string;
    /**
     * Value to Append to Root with NOT Plural
     *
     * @default `""`
     */
    singular: string;
    /**
     * Set How to the Determine if a word should be plural or not
     *
     * @default `(v) => v !== 1`
     *
     * @param value The value to Trigger on
     * @returns if the Word should be Plural or Not
     */
    triggerSingular: (value: number) => boolean;
};
/**
 * Systematically Add Pluralization to a Word
 *
 * @example
 * ```js
 * const v = plural("compan", 1, {
 *   plural: "ies",
 *   singular: "y"
 * })
 * // v = "company"
 *
 * const f = plural("file", 0)
 * // f = "files"
 * ```
 *
 * @param word The Root Word
 * @param value The Value to Trigger Pluralization with
 * @param options Options
 * @returns the Root Word Pluralized if Required
 */
export const plural = (word: string, value: number, options: Partial<PluralOptions> = {}) => {
    const settings: PluralOptions = {
        plural: "s",
        singular: "",
        triggerSingular: (value: number) => value !== 1,
        ...options
    };

    if (settings.triggerSingular(value)) {
        return [word, settings.plural].join("");
    } else {
        return [word, settings.singular].join("");
    }
};
