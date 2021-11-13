import { CommandInteraction, SelectMenuInteraction } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
    respond?(interaction: SelectMenuInteraction): Promise<void>;
}

export interface Event {
    name: string;
    once: boolean;
    execute(client: Client<boolean>);
}
