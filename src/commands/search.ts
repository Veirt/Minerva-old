import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { getConnection } from "typeorm";
import { SelectMenuCommand } from "../@types";
import { Anime } from "../entity/Anime";
import { parseAnimeList, parseTitle } from "../utils/parseHtml";

const command: SelectMenuCommand = {
    data: new SlashCommandBuilder()
        .setName("search")
        .addStringOption(option =>
            option.setName("title").setDescription("Enter the anime title"),
        )
        .setDescription("Search anime on gogoanime"),
    async execute(interaction) {
        const title = interaction.options.getString("title");
        if (!title) await interaction.reply("Title cannot be empty.");

        const res = await axios.get(
            `https://gogoanime.cm/search.html?keyword=${title}`,
        );

        const animeList = parseAnimeList(res.data);
        const options = animeList.map(anime => {
            const title = parseTitle(anime);
            return {
                label: title,
                value: title,
            };
        });

        const animeSelectMenu = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("search")
                .setPlaceholder("Nothing selected")
                .setMinValues(1)
                .addOptions(options),
        );

        await interaction.reply({
            content: "Search for anime:",
            components: [animeSelectMenu],
        });
    },
    async respond(interaction) {
        const animeRepository = getConnection().getRepository(Anime);
        const animeList = interaction.values;

        for await (const anime of animeList) {
            const newAnime = animeRepository.create({ title: anime });

            try {
                await animeRepository.save(newAnime);
            } catch (err) {
                await interaction.reply({
                    content: `${anime} already exists.`,
                });

                return;
            }
        }

        await interaction.reply(`${animeList.toString()} saved to database.`);
    },
};

export = command;
