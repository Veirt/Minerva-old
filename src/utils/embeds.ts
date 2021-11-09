import { MessageEmbed } from "discord.js";
import { Anime } from "../entity/Anime";

export function scheduleEmbed(thumbnail: string, anime: Anime) {
    return new MessageEmbed()
        .setColor("#98bcd4")
        .setTitle("New Release")
        .setThumbnail(thumbnail)
        .setTimestamp()
        .addFields(
            { name: "Title", value: anime.title },
            { name: "Episode", value: anime.episode.toString() },
        );
}
