import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, ServerApiVersion } from "mongodb";
import { jwt } from "better-auth/plugins";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

let client;
let db;

async function getDatabase() {
    if (!client) {
        client = new MongoClient(process.env.DATABASE_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
            retryWrites: true,
            retryReads: true,
        });

        await client.connect();
        console.log("✅ MongoDB Connected");
    }

    return client.db();
}

db = await getDatabase();

export const auth = betterAuth({
    database: mongodbAdapter(db),

    secret: process.env.BETTER_AUTH_SECRET,

    baseURL: process.env.BETTER_AUTH_URL,

    trustedOrigins: [
        "https://ele-books-9vdfvsr5q-sagorsaha00s-projects.vercel.app",
    ],

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    plugins: [jwt()],

    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 60 * 60 * 24 * 7,
        },
    },

    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: true,
        },
    },
});