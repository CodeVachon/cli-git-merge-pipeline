import { capitalize } from "./capitalize";

describe("capitalize", () => {
    test("throws an error if a none string is passed in", () => {
        expect(() => {
            // @ts-ignore
            capitalize(true);
        }).toThrowError(new RegExp("boolean", "i"));
    });
    test.each`
        value        | expected
        ${"foo"}     | ${"Foo"}
        ${"foo bar"} | ${"Foo bar"}
    `(`returns the expected result for "$value"`, ({ value, expected }) => {
        expect(capitalize(value)).toMatch(expected);
    });
});
