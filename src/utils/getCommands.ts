import glob from "glob";
import path from "path";
import { promisify } from "util";

const globPromise = promisify(glob);

export default async (): Promise<Array<string>> => {
    const commandsPath = path.join(__dirname, "../commands");
    const commands = await globPromise(`${commandsPath}/*{.js, *.ts}`);
    return commands;
};
