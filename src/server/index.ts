import { flameroutesToMap, type MappedFlameRoutes } from "./map";
import type { FlameRoute, FlameRoutes } from "./types";

export type FlameFetch<R extends FlameRoutes> = (req: Request) => Promise<Response>;

const r404 = () => new Response(null, { status: 404 });

export const flame = <T extends FlameRoutes>(routes: T): FlameFetch<T> => {
    const routes_map = flameroutesToMap(routes);

    return async req => {
        const req_json = await req.json().catch(() => undefined);
        if (req_json === undefined) {
            return r404();
        }
        let curr_route: MappedFlameRoutes | FlameRoute<any, any> = routes_map;
        for (const r of new URL(req.url).pathname.slice(1).split("/")) {
            if (typeof curr_route === "object") {
                curr_route = curr_route.get(r)!;
                if (!curr_route) {
                    return r404();
                }
            }
        }
        return typeof curr_route === "object"
            ? r404()
            : new Response(JSON.stringify(await curr_route(req_json)))
    }
}
