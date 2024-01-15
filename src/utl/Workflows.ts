import { glob } from "glob";
import path from "node:path";
import { readJSONFile } from "./readJSONFile";
import { displayError } from "./displayError";
import { arrayToStringList } from "./arrayToStringList";

/**
 * Helper Class for working with Workflow Files
 */
export class Workflows {
    /**
     * Current Working Directory for Config Files
     */
    private _cwd: string = process.cwd();
    /**
     * Found Config Files
     */
    private _list: Array<IWorkflowConfig> = [];

    /**
     * Constructor of Workflow Helper
     *
     * @param cwd Set the Working Directory for Config Files
     */
    constructor(cwd?: string) {
        if (cwd) {
            this._cwd = cwd;
        }
    }

    /**
     * Initialize the List of Config Files
     *
     * @returns this
     */
    public async init() {
        /**
         * Get all Config JSON Files at CWD
         */
        const found = await glob("config/**/*.json", { cwd: this._cwd });

        /**
         * Create an Empty Array for Valid Configs
         */
        const fileList: Array<IWorkflowConfig> = [];

        /**
         * For Each filePath found
         */
        for (const filePath of found) {
            try {
                /**
                 * Read the File, and Set Defaults
                 */
                const record = await readJSONFile<IWorkflowConfig>(
                    path.resolve(this._cwd, filePath),
                    {
                        disabled: false,
                        name: "not named",
                        description: "",
                        pipeline: []
                    }
                );

                // TODO: Validate Configuration File

                /**
                 * Push the Record to Valid List
                 */
                fileList.push(record);
            } catch (error: Error | any) {
                const err = new Error(
                    `An Error occurred while trying to read or parse ${filePath}`
                );

                if (error instanceof Error) {
                    err.cause = error;
                }

                displayError(err);
            }
        }

        /**
         * Set the List to the Current List
         */
        this._list = fileList;

        /**
         * Return Myself to Chaining
         */
        return this;
    }

    /**
     * Get a List of Enabled Configurations
     *
     * @returns Array of Enabled Configs
     */
    public getEnabledValues() {
        return this._list.filter((record) => record.disabled === false);
    }

    /**
     * Get a List of Just the Name of Enabled Configs
     *
     * @returns Array of Config Names
     */
    public getList(): Array<string> {
        return this.getEnabledValues()
            .map((record) => String(record.name).trim())
            .filter((record) => record.length > 0);
    }

    /**
     * Get a Specific Configuration
     *
     * @param name Name of Config
     * @returns Enabled Config
     */
    public getWorkflow(name: string) {
        const workflow = this.getEnabledValues().find((record) => record.name === name);

        if (!workflow) {
            throw new Error(
                `Could not find Workflow named "${name}". Expected one of [${arrayToStringList(
                    this.getList()
                )}]`
            );
        } else {
            return workflow;
        }
    }
}

/**
 * Workflow Configuration
 */
export interface IWorkflowConfig {
    /**
     * Allows for the disabling of Workflows
     */
    disabled: boolean;
    /**
     * Name of the Workflow
     */
    name: string;
    /**
     * Description of the Workflow
     */
    description: string;
    /**
     * Array of String/Regular Expressions to Merge
     */
    pipeline: Array<string>;
}
