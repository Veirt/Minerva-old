import { Client } from "discord.js";

export default (client: Client<boolean>) => {
    client.once("ready", (client) => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity("idk");
    });
};
