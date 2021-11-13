import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "servers" })
export class Server {
    @PrimaryColumn({ length: 20 })
    guild_id!: string;

    @Column({ length: 20 })
    channel_id!: string;

    @Column({ length: 20 })
    channel_name!: string;
}
