import { agent, isLoggedIn } from "./agent.js";
import { DID } from "./config.js";
import { limit } from "./limits.js";
import logger from "./logger.js";
import { LISTS } from "./constants.js";

export const addToList = async (label: string, id: string) => {
    await isLoggedIn;

    const newList = LISTS.find((list) => list.label === label);
    if (!newList) {
        logger.warn(`List not found for ${label}.`);
        return;
    }
    logger.info(`New user added to list: ${newList.label}`);

    const listUri = `at://${DID!}/app.bsky.graph.list/${newList.rkey}`;

    await limit(async () => {
        try {
            return agent.com.atproto.repo.createRecord({
                collection: "app.bsky.graph.listitem",
                repo: `${DID!}`,
                record: {
                    subject: id,
                    list: listUri,
                    createdAt: new Date().toISOString(),
                },
            });
        } catch (e) {
            console.error(e);
        }
    });
};
