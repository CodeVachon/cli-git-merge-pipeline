import { glob } from "glob";
import path from "node:path";
import { readJSONFile } from "./readJSONFile";

export class Workflows {
    private _cwd: string = process.cwd();
    private _list: Array<IWorkflowConfig> = [];

    constructor(cwd?: string) {
        if (cwd) {
            this._cwd = cwd;
        }
    }

    public async init() {
        const found = await glob("config/**/*.json", { cwd: this._cwd });

        const fileList: Array<IWorkflowConfig> = [];

        for (const filePath of found) {
            try {
                const record = await readJSONFile<IWorkflowConfig>(
                    path.resolve(this._cwd, filePath),
                    {
                        disabled: false,
                        name: "not named",
                        description: "",
                        pipeline: []
                    }
                );

                fileList.push(record);
            } catch (error) {
                console.error(error);
            }
        }

        this._list = fileList;

        return this;
    }

    public getList(): Array<string> {
        return this._list
            .filter((record) => record.disabled === false)
            .map((record) => record.name);
    }
}

interface IWorkflowConfig {
    disabled: boolean;
    name: string;
    description: string;
    pipeline: Array<string>;
}
