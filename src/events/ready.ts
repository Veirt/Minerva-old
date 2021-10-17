import { IEvent } from "../@types";

const event: IEvent = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        // set RPC (Rich Presence)
        client.user.setActivity("idk");
    },
};

export = event;
