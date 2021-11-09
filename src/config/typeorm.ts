import { ConnectionOptions, createConnection } from "typeorm";

const env = process.env;
const production = env.NODE_ENV === "production";

const typeormConfig: ConnectionOptions = {
    type: "postgres",
    url: env.DATABASE_URL,
    host: env.DATABASE_HOST,
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    port: env.DATABASE_PORT || 5432,
    synchronize: true,
    ssl: production,
    extra: { ssl: production ? { rejectUnauthorized: false } : {} },
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
