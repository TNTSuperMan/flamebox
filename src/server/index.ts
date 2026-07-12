import { flameroutesToMap } from "./map";
import type { FlameRoutes } from "./types";

export type FlameFetch<R extends FlameRoutes> = (req: Request) => Promise<Response>;

const r404 = () => new Response(null, { status: 404 });

export const flame = <T extends FlameRoutes>(routes: T): FlameFetch<T> => {
    const routes_map = flameroutesToMap(routes);

    return async req => {
        const req_json = await req.json().catch(() => undefined);
        if (req_json === undefined) {
            return r404();
        }
        const { pathname } = new URL(req.url);
        const route = routes_map.get(pathname);
        return route
            ? new Response(JSON.stringify(await route(req_json)))
            : r404();
    }
}
