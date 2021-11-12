import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { getConnection, Like } from "typeorm";
import { SelectMenuCommand } from "../@types";
import { Anime } from "../entity/Anime";
import { BaseEmbed } from "../utils/embeds";

const command: SelectMenuCommand = {
    data: new SlashCommandBuilder()
        .setName("list")
        .addStringOption(option =>
            option.setName("title").setDescription("Enter the anime title"),
        )
        .setDescription("Get anime info in database"),
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
                .setCustomId("list")
                .setPlaceholder("Nothing selected")
                .setMaxValues(1)
                .addOptions(options),
        );

        await interaction.reply({
            content: "Select anime:",
            components: [animeSelectMenu],
        });
    },
    async respond(interaction) {
        const animeRepository = getConnection().getRepository(Anime);
        const anime = await animeRepository.findOne(interaction.values[0]);

        if (!anime) {
            await interaction.reply("Anime is not found");
            return;
        }

        const episode = anime.episode ? anime.episode.toString() : "-";

        const embed = new BaseEmbed("Anime List").addFields(
            {
                name: "Title",
                value: anime.title,
            },
            { name: "Episode", value: episode },
        );

        await interaction.reply({ embeds: [embed] });
    },
};

export = command;
