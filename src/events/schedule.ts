import { parseEpisode, parseAnimeList, parseTitle } from "../utils/parseHtml";
import { Anime } from "../entity/Anime";
import { Event } from "../@types";
import { channelId } from "../config";
import { Client, TextChannel } from "discord.js";
import * as cron from "node-cron";
import { getConnection } from "typeorm";
import axios from "axios";

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

                    // find anime in the database
                    // and continue if there isn't match
                    const anime = await animeRepository.findOne({ title });
                    if (!anime) continue;

                    if (anime.episode !== episode) {
                        channel.send(`${anime.title} Episode ${episode}`);

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
