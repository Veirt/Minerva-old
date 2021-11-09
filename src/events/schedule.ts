import axios from "axios";
import { Client, TextChannel } from "discord.js";
import * as cron from "node-cron";
import { getConnection } from "typeorm";
import { Event } from "../@types";
import { channelId } from "../config";
import { Anime } from "../entity/Anime";
import { scheduleEmbed } from "../utils/embeds";
import {
    parseAnimeList,
    parseEpisode,
    parseImage,
    parseTitle,
} from "../utils/parseHtml";

const event: Event = {
    name: "ready",
    once: true,
    execute(client: Client<true>) {
        const animeRepository = getConnection().getRepository(Anime);
        const channel = client.channels.cache.get(channelId) as TextChannel;

        cron.schedule("* * * * *", async () => {
            const res = await axios.get("https://gogoanime.cm/");
            const releases = parseAnimeList(res.data);

            for (const release of releases) {
                try {
                    const title = parseTitle(release);
                    const episode = await parseEpisode(release);
                    const image = await parseImage(release);

                    // find anime in the database
                    // and continue if there isn't match
                    const anime = await animeRepository.findOne({ title });
                    if (!anime) continue;

                    if (anime.episode !== episode) {
                        const embed = scheduleEmbed(image, title, episode);
                        if (anime.episode) channel.send({ embeds: [embed] });

                        anime.episode = episode;
                        await animeRepository.save(anime);
                    }
                } catch (err) {
                    console.error(err);
                    break;
                }
            }
        });
    },
};

export = event;
