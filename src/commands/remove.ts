import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { getConnection, Like } from "typeorm";
import { SelectMenuCommand } from "../@types";
import { Anime } from "../entity/Anime";
import { BaseEmbed } from "../utils/embeds";

const command: SelectMenuCommand = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .addStringOption(option =>
            option.setName("title").setDescription("Enter the anime title"),
        )
        .setDescription("Delte anime in database"),
    async execute(interaction) {
        const title = interaction.options.getString("title");
        const animeRepository = getConnection().getRepository(Anime);
        const animeList = title
            ? await animeRepository.find({
                  title: Like(`%${title}%`),
              })
            : await animeRepository.find();

        if (animeList.length <= 0) {
            await interaction.reply("No anime is found");
            return;
        }

        const options = animeList.map(anime => {
            return {
                label: anime.title,
                value: anime.id?.toString(),
            };
        });

        const animeSelectMenu = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("remove")
                .setPlaceholder("Nothing selected")
                .setMinValues(1)
                .addOptions(options),
        );

        await interaction.reply({
            content: "Select anime:",
            components: [animeSelectMenu],
        });
    },
    async respond(interaction) {
        const animeRepository = getConnection().getRepository(Anime);
        let description = "";

        for await (const id of interaction.values) {
            try {
                const anime = await animeRepository.findOne(id);
                if (!anime) throw Error("Not found");

                description += `- ${anime.title}\n`;
                await animeRepository.delete(anime);
            } catch (err) {
                console.error(`Error when removing anime: ${err}`);
                await interaction.reply(`Can't remove ${id}.`);
            }
        }

        const embed = new BaseEmbed("Remove").setDescription(description);

        await interaction.reply({ embeds: [embed] });
    },
};

export = command;
