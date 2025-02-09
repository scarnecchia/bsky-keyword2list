import {
    CommitUpdateEvent,
    IdentityEvent,
    Jetstream,
} from "@skyware/jetstream";
import fs from "node:fs";

import {
    CURSOR_UPDATE_INTERVAL,
    FIREHOSE_URL,
    WANTED_COLLECTION,
} from "./config.js";
import logger from "./logger.js";
import { Handle } from "./types.js";
import { checkHandle, checkProfile } from "./checks.js";

let cursor = 0;
let cursorUpdateInterval: NodeJS.Timeout;

function epochUsToDateTime(cursor: number): string {
    return new Date(cursor / 1000).toISOString();
}

try {
    logger.info("Trying to read cursor from cursor.txt...");
    cursor = Number(fs.readFileSync("cursor.txt", "utf8"));
    logger.info(`Cursor found: ${cursor} (${epochUsToDateTime(cursor)})`);
} catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        cursor = Math.floor(Date.now() * 1000);
        logger.info(
            `Cursor not found in cursor.txt, setting cursor to: ${cursor} (${epochUsToDateTime(cursor)})`,
        );
        fs.writeFileSync("cursor.txt", cursor.toString(), "utf8");
    } else {
        logger.error(error);
        process.exit(1);
    }
}

const jetstream = new Jetstream({
    wantedCollections: WANTED_COLLECTION,
    endpoint: FIREHOSE_URL,
    cursor: cursor,
});

jetstream.on("open", () => {
    logger.info(
        `Connected to Jetstream at ${FIREHOSE_URL} with cursor ${jetstream.cursor} (${epochUsToDateTime(jetstream.cursor!)})`,
    );
    cursorUpdateInterval = setInterval(() => {
        if (jetstream.cursor) {
            logger.info(
                `Cursor updated to: ${jetstream.cursor} (${epochUsToDateTime(jetstream.cursor)})`,
            );
            fs.writeFile("cursor.txt", jetstream.cursor.toString(), (err) => {
                if (err) logger.error(err);
            });
        }
    }, CURSOR_UPDATE_INTERVAL);
});

jetstream.on("close", () => {
    clearInterval(cursorUpdateInterval);
    logger.info("Jetstream connection closed.");
});

jetstream.on("error", (error) => {
    logger.error(`Jetstream error: ${error.message}`);
});

// Check for profile updates
jetstream.onUpdate(
    "app.bsky.actor.profile",
    (event: CommitUpdateEvent<typeof WANTED_COLLECTION>) => {
        const promise = checkProfile(
            event.did,
            event.commit.record.displayName,
            event.commit.record.description,
        );

        try {
            promise.then(() => {});
        } catch (error) {
            logger.error(`Error checking profile:  ${error}`);
        }
    },
);

// Check for handle updates
jetstream.on("identity", (event: IdentityEvent) => {
    const handle: Handle[] = [
        { did: event.did, handle: event.identity.handle, time: event.time_us },
    ];
    const promise = checkHandle(handle);

    try {
        promise.then(() => {});
    } catch (error) {
        logger.error(`Error checking handle: ${error}`);
    }
});

jetstream.start();

function shutdown() {
    try {
        logger.info("Shutting down gracefully...");
        fs.writeFileSync("cursor.txt", jetstream.cursor!.toString(), "utf8");
        jetstream.close();
    } catch (error) {
        logger.error(`Error shutting down gracefully: ${error}`);
        process.exit(1);
    }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
