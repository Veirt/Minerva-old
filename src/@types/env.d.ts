declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DEPLOY: boolean;
            NODE_ENV: "production" | "development";
            DISCORD_CLIENT_TOKEN: string;
            DISCORD_CLIENT_ID: string;
            DISCORD_GUILD_ID: string;
            DATABASE_URL: string;
        }
    }
}

export {};
