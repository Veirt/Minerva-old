import parse, { HTMLElement } from "node-html-parser";

export function parseAnimeList(data: string): Array<HTMLElement> {
    return parse(data).querySelectorAll("ul.items>li");
}

export function parseTitle(element: HTMLElement): {
    url: string;
    title: string;
} {
    const title = element.querySelector(".name>a");
    if (!title) throw new Error("Can't find the title");

    return {
        title: title.innerHTML,
        url: title.getAttribute("href") as string,
    };
}

export function parseEpisode(element: HTMLElement): number {
    const episodeRaw = element.querySelector(".episode")?.innerHTML;

    // extract episode digit from the string
    if (!episodeRaw) throw Error("Can't get the episode");

    const episode = parseInt(episodeRaw?.split(" ")[1]);
    return episode;
}

export function parseImage(element: HTMLElement): string {
    const imageElement = element.querySelector("div.img>a>img");
    if (!imageElement) {
        throw new Error("Can't get the image");
    }
    const image = imageElement.getAttribute("src");

    return image as string;
}
