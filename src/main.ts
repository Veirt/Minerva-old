import "reflect-metadata";
import { token } from "./config";
import { connectDatabase } from "./config/typeorm";
import getCommands from "./utils/getCommands";
import getEvents from "./utils/getEvents";
import { Client, Collection, Intents } from "discord.js";
import "./deploy";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

connectDatabase(() => {
    // set events
    getEvents().then(async eventFiles => {
        for (const file of eventFiles) {
            const event = await import(file);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    });

    // set commands
    client.commands = new Collection();
    getCommands().then(async commandFiles => {
        for (const file of commandFiles) {
            const command = await import(file);
            client.commands.set(command.data.name, command);
        }
    });

    // execute commands
    client.on("interactionCreate", async interaction => {
        // handler for command
        if (interaction.isCommand()) {
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
        }
        //handler for select menu
        if (interaction.isSelectMenu()) {
            const selectMenu = client.commands.get(interaction.customId);

            if (!selectMenu) return;

            try {
                await selectMenu.respond(interaction);
            } catch (error) {
                console.error(error);

                await interaction.reply({
                    content:
                        "There was an error while executing responding the select menu!",
                    ephemeral: true,
                });
            }
        }
    });

    client.login(token);
});
