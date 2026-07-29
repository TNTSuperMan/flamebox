import type { FlameRoute, FlameRoutes } from "./types";

export type FlameFetch<R extends FlameRoutes> = (req: Request) => Promise<Response>;

const r404 = () => new Response(null, { status: 404 });

export const flame = <T extends FlameRoutes>(routes: T): FlameFetch<T> => {
  const routes_map = new Map<string, FlameRoute<any, any>>;

  const visit = (r: FlameRoutes, prefix: string) => {
    for (const key in r) {
      const path = prefix + "/" + key;
      if (typeof r[key] === "function") {
        routes_map.set(path, r[key]);
      } else {
        visit(r[key]!, path);
      }
    }
  }

  visit(routes, "");

  return async req => {
    const req_json = await req.json().catch(() => undefined);
    if (req_json === undefined) {
      return r404();
    }
    const handler = routes_map.get(new URL(req.url).pathname);
    return handler
      ? Response.json(await handler(req_json))
      : r404();
  }
}
