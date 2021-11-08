import { Event } from "../@types";
import { channelId } from "../config";
import { Client, TextChannel } from "discord.js";
import axios from "axios";
import { parse } from "node-html-parser";
import * as cron from "node-cron";
import { getConnection } from "typeorm";
import { Anime } from "../entity/Anime";

const event: Event = {
    name: "ready",
    once: true,
    execute(client: Client<true>) {
        const animeRepository = getConnection().getRepository(Anime);
        const channel = client.channels.cache.get(channelId) as TextChannel;

        cron.schedule("* * * * *", async () => {
            const res = await axios.get("https://gogoanime.cm/");
            const releases = parse(res.data).querySelectorAll("ul.items>li");

            releases.forEach(async release => {
                // title of anime
                const title = release.querySelector(".name>a")?.innerHTML;
                // 'Episode <digit>'
                const episodeRaw = release.querySelector(".episode")?.innerHTML;
                // extract episode digit from the string
                if (!episodeRaw) throw new Error("Can't get the episode");
                const episode = parseInt(episodeRaw?.split(" ")[1]);

                // find anime in the database
                // and continue if there isn't match
                const anime = await animeRepository.findOne({ title });
                if (!anime) return;

                if (anime.episode !== episode) {
                    // send message
                    channel.send(`${anime.title} Episode ${episode}`);
                    // update
                    anime.episode = episode;
                    await animeRepository.save(anime);
                }
            });
        });
    },
};

export = event;
