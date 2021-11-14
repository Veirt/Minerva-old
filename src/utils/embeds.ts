import { MessageEmbed } from "discord.js";

export class BaseEmbed extends MessageEmbed {
    constructor(title: string) {
        super();
        return new MessageEmbed()
            .setTitle(title)
            .setColor("#98bcd4")
            .setTimestamp();
    }
}

export function scheduleEmbed(
    thumbnail: string,
    title: string,
    url: string,
    episode: number,
) {
    return new BaseEmbed("New Release")
        .setThumbnail(thumbnail)
        .setURL(`https://gogoanime.cm${url}`)
        .addFields(
            { name: "Title", value: title },
            { name: "Episode", value: episode.toString() },
        );
}

export function searchEmbed(
    animeList: Array<{ title: string; episode?: number }>,
) {
    const embed = new BaseEmbed("Saved to database");
    let description = "";

    animeList.forEach(anime => {
        description += `- ${anime.title}\n`;
    });

    embed.setDescription(description);

    return embed;
}
