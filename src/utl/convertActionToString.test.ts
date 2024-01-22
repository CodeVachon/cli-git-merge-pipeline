import { convertActionToString } from "./convertActionToString";

describe("convertActionToString", () => {
    test.each`
        value        | expected
        ${"dry-run"} | ${"Dry Run"}
        ${"dry_run"} | ${"Dry Run"}
        ${"run"}     | ${"Run"}
    `(`returns the expected result for  $value`, ({ value, expected }) => {
        expect(convertActionToString(value)).toMatch(expected);
    });
});
