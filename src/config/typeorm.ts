import { ConnectionOptions, createConnection } from "typeorm";

const env = process.env;
const production = env.NODE_ENV === "production";

const typeormConfig: ConnectionOptions = {
    type: "postgres",
    url: env.DATABASE_URL,
    synchronize: true,
    ssl: production,
    extra: { ssl: production ? { rejectUnauthorized: false } : null },
    entities: ["dist/entity/*{.ts,.js}"],
};

export const connectDatabase = (cb: () => void) => {
    createConnection(typeormConfig)
        .then(() => {
            const { url } = typeormConfig;

            console.log(`Connected to database URL: ${url}.`);
            cb();
        })

        .catch(err => {
            console.error(
                "Something went wrong when connecting to the database.",
            );
            console.error(err);
        });
};
