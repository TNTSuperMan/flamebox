import z from "zod";
import { flame as flameC } from "./client";
import { validate } from "./middleware/validate";
import { flame as flameS } from "./server";

const fetch = flameS({
    login: validate(z.object({
        username: z.string(),
        password: z.string(),
    }), async ({ username, password }): Promise<{ type: "success", token: string } | { type: "failed" }> => {
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
    }),
});

//@ts-ignore
Bun.serve({ fetch, port: 3000 })

const client = flameC<typeof fetch>("http://localhost:3000");

console.log(await client.login({ username: "tnt", password: "tntn7095110" }));
