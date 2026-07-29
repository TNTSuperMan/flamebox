import type { FlameRoute, FlameRoutes } from "./types";

export type FlameFetch<R extends FlameRoutes> = (req: Request) => Promise<Response>;

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
    try {
      return Response.json(
        await routes_map.get(
          new URL(req.url).pathname
        )!(
          await req.json()
        )
      );
    } catch {
      return Response.error();
    }
  }
}
