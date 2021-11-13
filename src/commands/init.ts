import { SlashCommandBuilder } from "@discordjs/builders";
import { getConnection } from "typeorm";
import { Command } from "../@types";
import { Server } from "../entity/Server";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("init")
        .addChannelOption(option =>
            option.setName("channel").setDescription("Select a channel"),
        )
        .setDescription("Init channel"),
    async execute(interaction) {
        const serverRepository = getConnection().getRepository(Server);

        const channel = interaction.options.getChannel("channel");
        if (channel?.type === "GUILD_TEXT") {
            const newServer = serverRepository.create({
                guild_id: channel.guildId,
                channel_id: channel.id,
                channel_name: channel.name,
            });

            serverRepository.save(newServer);
            return await interaction.reply(
                `Initialized in channel <#${channel.id}>`,
            );
        }

        return await interaction.reply("Please select a text channel.");
    },
};

export = command;
