import { Command } from ".";

declare module "discord.js" {
    export interface Client {
        commands: Collection<unknown, Command>;
    }
}
