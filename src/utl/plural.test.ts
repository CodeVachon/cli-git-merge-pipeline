import { plural } from "./plural";

describe("plural", () => {
    test.each`
        root      | value | expected
        ${"file"} | ${1}  | ${"file"}
        ${"file"} | ${3}  | ${"files"}
    `(`returns the expected result for $root with value of $value`, ({ root, value, expected }) => {
        expect(plural(root, value)).toMatch(expected);
    });

    test("return the expected value for company with value of 1", () => {
        expect(
            plural("compan", 1, {
                plural: "ies",
                singular: "y"
            })
        ).toMatch("company");
    });
    test("return the expected value for company with value of 5", () => {
        expect(
            plural("compan", 5, {
                plural: "ies",
                singular: "y"
            })
        ).toMatch("companies");
    });
});
