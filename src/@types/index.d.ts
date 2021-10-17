import { CommandInteraction } from "discord.js";

export interface ICommand {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export interface IEvent {
    name: string;
    once: boolean;
    execute(client: Client<boolean>);
}
