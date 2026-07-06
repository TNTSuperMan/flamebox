import type { FlameRoute, FlameRoutes } from "./types";

export type MappedFlameRoutes = Map<string, FlameRoute<any, any> | MappedFlameRoutes>;
export const flameroutesToMap = (routes: FlameRoutes): MappedFlameRoutes => (
    new Map(Object.entries(routes).map(([k, v]: [string, FlameRoute<any, any> | FlameRoutes]) => (
        [k, typeof v === "object" ? flameroutesToMap(v) : v]
    )))
);
