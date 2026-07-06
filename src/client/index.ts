import type { FlameFetch } from "../server";

export const flame = <T extends FlameFetch<any>>(url: string): T extends FlameFetch<infer R> ? R : never => (
    new Proxy((arg: any) => (
        fetch(url, { method: "POST", body: JSON.stringify(arg) }).then(res => res.json())
    ), {
        get: (_, p: string) => flame(url + "/" + p)
    }) as any
);
