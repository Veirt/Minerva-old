import { MessageEmbed } from "discord.js";
import { Anime } from "../entity/Anime";

class BaseEmbed extends MessageEmbed {
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

export function searchEmbed(animeList: Anime[]) {
    const embed = new BaseEmbed().setTitle("Saved to database");
    let description = "";

    animeList.forEach(anime => {
        description += `- ${anime.title}\n`;
    });

    embed.setDescription(description);

    return embed;
}
