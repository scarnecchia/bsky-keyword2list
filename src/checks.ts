import { LISTS, IGNORED_DIDS } from "./constants.js";
import logger from "./logger.js";
import { Handle } from "./types.js";
import { addToList } from "./moderation.js";

export const checkHandle = async (handle: Handle[]) => {
    if (IGNORED_DIDS.includes(handle[0].did)) {
        return logger.info(`Ignoring DID: ${handle[0].did}`);
    } else {
        const labels: string[] = Array.from(LISTS, (list) => list.label);

        labels.forEach((label) => {
            const listLabel = LISTS.find((list) => list.label === label);

            if (!listLabel) {
                logger.info(`List not found for ${label}.`);
                return;
            } else {
                if (listLabel.test.test(handle[0].handle)) {
                    logger.info(
                        `${listLabel.label} in handle: ${handle[0].handle}`,
                    );

                    addToList(listLabel.label, handle[0].did);
                }
            }
        });
    }
};

export const checkProfile = async (
    did: string,
    displayName: string,
    description: string,
) => {
    if (IGNORED_DIDS.includes(did)) {
        return logger.info(`Ignoring DID: ${did}`);
    } else {
        const labels: string[] = Array.from(LISTS, (list) => list.label);

        labels.forEach((label) => {
            const listLabel = LISTS.find((list) => list.label === label);

            if (!listLabel) {
                logger.info(`List not found for ${label}.`);
                return;
            } else {
                if (
                    listLabel.test.test(displayName) ||
                    listLabel.test.test(description)
                ) {
                    logger.info(`${listLabel.label} for did: ${did}`);

                    addToList(listLabel.label, did);
                }
            }
        });
    }
};
