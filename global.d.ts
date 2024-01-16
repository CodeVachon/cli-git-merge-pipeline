declare namespace NodeJS {
    interface Process {
        pkg?: {
            mount: () => void;
            entrypoint: string;
            defaultEntrypoint: string;
            path: { resolve: Promise<string> };
        };
    }
}
