declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            GOOGLE_ID: string;
            GOOGLE_SECRET: string;
            GITHUB_ID: string;
            GITHUB_SECRET: string;
            DISCORD_ID: string;
            DISCORD_SECRET: string;
            NEXTAUTH_SECRET: string;
            NEXTAUTH_URL: string;
        }
    }
}
export {};
