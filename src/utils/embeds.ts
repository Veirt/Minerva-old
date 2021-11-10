import { MessageEmbed } from "discord.js";

export class BaseEmbed extends MessageEmbed {
    constructor() {
        super();
        return new MessageEmbed().setColor("#98bcd4").setTimestamp();
    }
}

export function scheduleEmbed(
    thumbnail: string,
    title: string,
    episode: number,
) {
    return new BaseEmbed()
        .setTitle("New Release")
        .setThumbnail(thumbnail)
        .addFields(
            { name: "Title", value: title },
            { name: "Episode", value: episode.toString() },
        );
}

export function searchEmbed(
    animeList: Array<{ title: string; episode?: number }>,
) {
    const embed = new BaseEmbed().setTitle("Saved to database");
    let description = "";

    animeList.forEach(anime => {
        description += `- ${anime.title}\n`;
    });

    embed.setDescription(description);

    return embed;
}
