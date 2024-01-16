import { makeWorkflowSteps } from "./makeWorkflowSteps";

describe("makeWorkflowSteps", () => {
    test("returns an array of objects", () => {
        const data = ["a", "b", "c", "d"];
        const value = makeWorkflowSteps(data);
        expect(value).toHaveLength(data.length - 1);
        expect(value).toMatchObject([
            {
                source: data[0],
                target: data[1]
            },
            {
                source: data[1],
                target: data[2]
            },
            {
                source: data[2],
                target: data[3]
            }
        ]);
    });
});
