import { promisify } from "util";
import path from "path";
import glob from "glob";

const globPromise = promisify(glob);

export default async (): Promise<Array<string>> => {
    const commandsPath = path.join(__dirname, "../commands")
    const commands = await globPromise(`${commandsPath}/*{.js, *.ts}`)
    return commands;
};
