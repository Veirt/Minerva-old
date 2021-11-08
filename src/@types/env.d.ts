declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_CLIENT_TOKEN: string;
            DISCORD_CLIENT_ID: string;
            DISCORD_GUILD_ID: string;
            DISCORD_CHANNEL_ID: string;
            DB_HOST: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_NAME: string;
            DB_PORT: number;
        }
    }
}

export {};
