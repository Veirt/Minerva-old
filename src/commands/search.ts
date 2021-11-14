import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { getConnection } from "typeorm";
import { Command } from "../@types";
import { Anime } from "../entity/Anime";
import { searchEmbed } from "../utils/embeds";
import { parseAnimeList, parseEpisode, parseTitle } from "../utils/parseHtml";

const command: Command = {
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
        const options = animeList.flatMap(anime => {
            const { title } = parseTitle(anime);

            // because i hate dub.
            if (title.includes("(Dub)")) return [];

            return {
                label: title.substr(0, 100),
                value: title.substr(0, 100),
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

        const res = await axios.get("https://gogoanime.cm/");
        const newReleases = parseAnimeList(res.data);

        const animeList: Array<{ title: string; episode?: number }> = [];

        for await (const release of newReleases) {
            const { title } = parseTitle(release);
            const episode = parseEpisode(release);

            if (interaction.values.includes(title)) {
                animeList.push({ title, episode });
            }
        }

        for (const anime of interaction.values) {
            for (const release of animeList) {
                if (release.title === anime) {
                    continue;
                }

                animeList.push({ title: anime });
            }
        }

        for await (const anime of animeList) {
            const newAnime = animeRepository.create(anime);

            try {
                await animeRepository.save(newAnime);
            } catch (err) {
                await interaction.reply({
                    content: `${anime.title} already exists.`,
                });

                return;
            }
        }

        await interaction.reply({ embeds: [searchEmbed(animeList)] });
    },
};

export = command;
