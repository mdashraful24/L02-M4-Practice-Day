import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});

const config = {
    databaseUrl: process.env.DATABASE_URL as string,
    port: process.env.PORT as string,
    appUrl: process.env.APP_URL as string,

    security: {
        bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS as string,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET as string,
        refreshSecret: process.env.JWT_REFRESH_SECRET as string,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
    },
};

export default config;