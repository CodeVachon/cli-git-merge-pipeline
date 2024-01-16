import execa, { ExecaError } from "execa";
import { logCmd } from "./log";

interface IGitAPIOptions {
    cwd: string;
    verbose: boolean;
}

/**
 * Helper Application for working with GIT in the CLI
 */
export class GitAPI {
    /**
     * Current Working Directory
     */
    private cwd: string = process.cwd();
    /**
     * Dump Values into the Console as they are used
     */
    private verbose = false;

    /**
     * Setup the Git API Instance
     * @param options
     */
    constructor(options: Partial<IGitAPIOptions>) {
        if (options.cwd !== undefined) {
            this.cwd = options.cwd.trim();
        }
        if (options.verbose !== undefined) {
            this.verbose = options.verbose;
        }
    }

    /**
     * Call a Git Command
     *
     * @param command
     * @returns
     */
    protected async call(command: string | string[]) {
        const { stdout, escapedCommand } = await execa(
            "git",
            command instanceof Array
                ? command
                : command
                      .split(new RegExp("\\s{1,}", "g"))
                      .map((v) => v.trim())
                      .filter((v) => v.length > 0),
            { cwd: this.cwd }
        );

        if (this.verbose) {
            logCmd(escapedCommand);
        }

        return stdout;
    }

    /**
     * Call Fetch on CWD
     *
     * @returns list of fetched data
     */
    public async fetch() {
        return this.call("fetch");
    }

    /**
     * Get a List of Git Branches in CWD
     *
     * @returns Array of Branch Names
     */
    public async branchList() {
        const list = await this.call("branch");

        return list
            .split(new RegExp("[\n\r]{1,}", "g"))
            .map((v) => v.replace(new RegExp("^\\*"), "").trim())
            .filter((v) => v.length > 0 && v !== "*");
    }

    /**
     * Get the name of the Current Branch in CWD
     *
     * @returns the Name of the Current Branch
     */
    public currentBranch() {
        return this.call("rev-parse --abbrev-ref HEAD");
    }

    /**
     * Checkout a new Branch in Git CWD
     *
     * @param branch Branch name to Checkout
     * @param createNew Create If Not Found
     * @returns
     */
    public async checkout(branch: string, createNew = false) {
        if (createNew) {
            const currentList = await this.branchList();

            if (currentList.some((v) => v === branch)) {
                throw new Error(`A branch name "${branch}" already exists`);
            }

            return this.call(`checkout -b ${branch}`);
        } else {
            return this.call(`checkout ${branch}`);
        }
    }

    /**
     * Get the current Git Status in CWD
     *
     * @returns Git Status
     */
    public status() {
        return this.call("status -s");
    }

    /**
     * Check if Git CWD is in a Dirty State
     *
     * @returns Boolean if the Git has un committed changed
     */
    public async isDirty() {
        const state = await this.call("diff --stat");
        return state !== "";
    }

    /**
     * Pull the Current Branch
     * @returns
     */
    public pull() {
        return this.call("pull");
    }

    /**
     * Merge one branch into another in Git CWD
     *
     * @param source Branch to Merge
     * @param target Branch to Merge Into
     * @returns
     */
    public merge(source: string, target: string) {
        return this.call(["merge", source, target, "--no-verify"]);
    }

    /**
     * Get a List of Remotes in Git CWD
     *
     * @returns Array of Remotes
     */
    public async getRemotes() {
        const remotesRaw = await this.call(["remote", "-v"]);
        const remotes = remotesRaw
            .split(new RegExp("[\n\r]{1,}"))
            .map((v) => v.trim())
            .filter((v) => v.length > 0)
            .map((v) => v.split(new RegExp("\\s{1,}"))[0]);

        return remotes.filter((elem, index, self) => index === self.indexOf(elem));
    }

    /**
     * Check if a Git Branch has a Remote in CWD
     *
     * @param branch name of the branch to check - uses current is not passed
     * @returns
     */
    public async branchHasRemote(branch?: string) {
        if (branch) {
            this.checkout(branch);
        }

        try {
            const result = await this.call([
                "rev-parse",
                "--abbrev-ref",
                "--symbolic-full-name",
                "@{u}"
            ]);

            if (String(result).length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (
                new RegExp("no upstream configured", "gi").test(
                    (error as ExecaError).stderr || (error as Error).message
                )
            ) {
                return false;
            }

            throw error;
        }
    }

    /**
     * Push a Git Branch to Remote in CWD
     *
     * @param branch Branch to Push - uses Current if not passed
     * @param toUpStream
     * @returns
     */
    public async push(branch?: string, toUpStream?: string) {
        if (branch) {
            this.checkout(branch);
        }

        if (toUpStream) {
            return this.call(["push", "-u", toUpStream, await this.currentBranch(), "--no-verify"]);
        } else {
            return this.call(["push", "--no-verify"]);
        }
    }

    /**
     * Get a List of Conflicted File Paths in CWD
     *
     * @returns Array of Conflicted File Paths
     */
    public async getConflictedPaths() {
        const conflictedPaths = new Set<string>();
        const paths = await this.call(["ls-files", "--unmerged"]);

        for (const unformattedPath of paths.split("\n")) {
            const path = unformattedPath.split(new RegExp("\\s{1,}", "g"))[3];
            conflictedPaths.add(path);
        }

        return Array.from(conflictedPaths);
    }

    /**
     * Git Commit a Merge Request
     *
     * @returns
     */
    public async commitMerge() {
        return this.call(["commit", "--no-edit"]);
    }
}
