import { arrayToStringList } from "./arrayToStringList";

describe("arrayToStringList", () => {
    test("returns a string from the Array", () => {
        expect(arrayToStringList(["a", "b", "c"])).toMatch(`"a", "b", "c"`);
    });
});
