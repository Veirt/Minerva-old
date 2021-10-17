import dotenv from "dotenv";
dotenv.config();

export const {
    DISCORD_CLIENT_TOKEN: token,
    DISCORD_CLIENT_ID: clientId,
    DISCORD_GUILD_ID: guildId,
} = process.env;
