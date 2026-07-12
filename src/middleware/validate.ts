import type { ZodType } from "zod";
import type { JSONData } from "../server/types";

export const validate = <Req extends JSONData, Res extends JSONData>(schema: ZodType<Req>, fn: (req: Req) => Promise<Res>): (req: Req) => Promise<Res> => (
    req => fn(schema.parse(req))
)
