import { flame as flameC } from "./client";
import { flame as flameS } from "./server";

const fetch = flameS({
    async login({ username, password }: { username: string, password: string }) {
        if (username === "tnt" && password === "tntn7095110") {
            return {
                type: "success",
                token: crypto.randomUUID(),
            } as const;
        } else {
            return {
                type: "failed",
            } as const;
        }
    }
});

//@ts-ignore
Bun.serve({ fetch, port: 3000 })

const client = flameC<typeof fetch>("http://localhost:3000");

console.log(await client.login({ username: "tnt", password: "tntn7095110" }));
