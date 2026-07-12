import { defaultHandler, type ErrorHandler } from "./error";
import { flameroutesToMap } from "./map";
import type { FlameRoutes } from "./types";

export type FlameFetch<R extends FlameRoutes> = (req: Request) => Promise<Response>;

export const flame = <T extends FlameRoutes>(
    routes: T,
    onError: ErrorHandler = defaultHandler
): FlameFetch<T> => {
    const routes_map = flameroutesToMap(routes);

    return async req => {
        const req_json = await req.json().catch(() => undefined);
        if (req_json === undefined) {
            return await onError({ type: "BadJSON" }, req);
        }
        const { pathname } = new URL(req.url);
        const route = routes_map.get(pathname);
        return route
            ? new Response(JSON.stringify(await route(req_json)))
            : await onError({ type: "NotFound" }, req);
    }
}
