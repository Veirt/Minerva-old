import { clientId, guildId, token } from "./config";
import getCommands from "./utils/getCommands";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const commands: Array<any> = [];
getCommands().then(async commandFiles => {
    // loop over command files and import
    for (const file of commandFiles) {
        const command = await import(file);
        commands.push(command.data.toJSON());
    }

    // current Discord API version is 9
    const rest = new REST({ version: "9" }).setToken(token);

    // register application commands
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log("Successfully registered application commands.");
        const commandList = commands.map(command => command.name);
        console.log(commandList);
    } catch (err) {
        console.error(err);
    }
});
