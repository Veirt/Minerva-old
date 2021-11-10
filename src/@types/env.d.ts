declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DEPLOY: boolean;
            NODE_ENV: "production" | "development";
            DISCORD_CLIENT_TOKEN: string;
            DISCORD_CLIENT_ID: string;
            DISCORD_GUILD_ID: string;
            DISCORD_CHANNEL_ID: string;
            DATABASE_HOST: string;
            DATABASE_URL: string;
            DATABASE_USERNAME: string;
            DATABASE_PASSWORD: string;
            DATABASE_NAME: string;
            DATABASE_PORT: number;
        }
    }
}

export {};
