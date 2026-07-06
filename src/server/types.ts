export type JSONData = null | string | number | boolean | JSONData[] | { [key: string]: JSONData };

export type FlameRoute<Req extends JSONData, Res extends JSONData> = (req: Req) => Promise<Res>;

export type FlameRoutes = {
    [key: string]: FlameRoutes | FlameRoute<any, any>
};
