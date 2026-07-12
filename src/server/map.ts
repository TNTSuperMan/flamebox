import type { FlameRoute, FlameRoutes } from "./types";

export const flameroutesToMap = (routes: FlameRoutes): Map<string, FlameRoute<any, any>> => {
    const result = new Map<string, FlameRoute<any, any>>;
    const visited = new WeakSet<FlameRoutes>;

    const visit = (currentRoutes: FlameRoutes, prefix: string): void => {
        for (const [key, value] of Object.entries(currentRoutes)) {
            const path = `${prefix}/${key}`;

            if (typeof value === "function") {
                result.set(path, value);
                continue;
            }

            if (typeof value === "object" && value !== null) {
                if (visited.has(value)) {
                    throw new Error(`Circular route reference detected at "${path}"`);
                }

                visited.add(value);
                visit(value, path);
                visited.delete(value);
                continue;
            }

            throw new Error(`Invalid route value at "${path}"`);
        }
    };

    visit(routes, "");
    return result;
};
