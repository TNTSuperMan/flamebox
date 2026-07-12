export type ErrorPayloads =
    | { type: "NotFound" }
    | { type: "BadJSON" }
    | { type: "Error", error: any }

export type ErrorHandler = (payload: ErrorPayloads, req: Request) => Promise<Response>

export const defaultHandler: ErrorHandler = async (payload, _req) => {
    switch (payload.type) {
        case "NotFound": return new Response(null, { status: 404 });
        case "BadJSON": return new Response(null, { status: 400 });
        case "Error": return new Response(null, { status: 500 });
    }
}
