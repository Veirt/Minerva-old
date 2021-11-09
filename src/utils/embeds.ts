import { MessageEmbed } from "discord.js";

export function scheduleEmbed(
    thumbnail: string,
    title: string,
    episode: number,
) {
    return new MessageEmbed()
        .setColor("#98bcd4")
        .setTitle("New Release")
        .setThumbnail(thumbnail)
        .setTimestamp()
        .addFields(
            { name: "Title", value: title },
            { name: "Episode", value: episode.toString() },
        );
}
