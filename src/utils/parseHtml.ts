import parse, { HTMLElement } from "node-html-parser";

export function parseAnimeList(data: string): Array<HTMLElement> {
    return parse(data).querySelectorAll("ul.items>li");
}

export function parseTitle(element: HTMLElement): string {
    const title = element.querySelector(".name>a");
    if (!title) throw new Error("Can't find the title");

    return title.innerHTML;
}

export function parseEpisode(element: HTMLElement): Promise<number> {
    return new Promise((resolve, reject) => {
        const episodeRaw = element.querySelector(".episode")?.innerHTML;

        // extract episode digit from the string
        if (!episodeRaw) reject("Can't get the episode");
        else {
            const episode = parseInt(episodeRaw?.split(" ")[1]);
            resolve(episode);
        }
    });
}
