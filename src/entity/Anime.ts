import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Anime {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    title!: string;

    @Column({ nullable: true })
    episode?: number;
}
