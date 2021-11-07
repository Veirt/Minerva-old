import { Client } from "discord.js";
import { Event } from "../@types";

const event: Event = {
    name: "ready",
    once: true,
    execute(client: Client<true>) {
        console.log(`Logged in as ${client.user.tag}!`);
        // set RPC (Rich Presence)
        client.user.setActivity("idk");
    },
};

export = event;
