import "dotenv/config";

export const DID = process.env.DID ?? "";
export const RELAY = process.env.RELAY ?? "";
export const BSKY_HANDLE = process.env.BSKY_HANDLE ?? "";
export const BSKY_PASSWORD = process.env.BSKY_PASSWORD ?? "";
export const HOST = process.env.HOST ?? "127.0.0.1";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4100;
export const FIREHOSE_URL =
    process.env.FIREHOSE_URL ?? "wss://jetstream.atproto.tools/subscribe";
export const WANTED_COLLECTION = [
    "app.bsky.actor.defs",
    "app.bsky.actor.profile",
];
export const CURSOR_UPDATE_INTERVAL = process.env.CURSOR_UPDATE_INTERVAL
    ? Number(process.env.CURSOR_UPDATE_INTERVAL)
    : 60000;
export const LABEL_LIMIT = process.env.LABEL_LIMIT;
export const LABEL_LIMIT_WAIT = process.env.LABEL_LIMIT_WAIT;
