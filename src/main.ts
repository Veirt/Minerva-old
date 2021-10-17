import { token } from "./config";
import getCommands from "./utils/getCommands";
import onReady from "./events/ready";
import { Client, Collection, Intents } from "discord.js";
import "./events/deploy";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
onReady(client);

// set commands
client.commands = new Collection();
getCommands().then(async (commandFiles) => {
    for (const file of commandFiles) {
        const command = await import(file);
        client.commands.set(command.data.name, command);
    }
});

// execute commands
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.login(token);
