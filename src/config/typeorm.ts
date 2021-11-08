import { ConnectionOptions, createConnection } from "typeorm";

const env = process.env;

const typeormConfig: ConnectionOptions = {
    type: "postgres",
    host: env.DB_HOST,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT || 5432,
    synchronize: true,
    entities: ["dist/entity/*{.ts,.js}"],
};

export const connectDatabase = (cb: () => void) => {
    createConnection(typeormConfig)
        .then(() => {
            const { database, username } = typeormConfig;
            console.log(`Connected to database ${database} as ${username}.`);
            cb();
        })

        .catch(err => {
            console.error(
                "Something went wrong when connecting to the database.",
            );
            console.error(err);
        });
};
