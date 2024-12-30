import { List } from "./types.js";

// Update this with any DIDs you don't want to include in the moderation process. Will apply to all LISTS below until we can change this.
export const IGNORED_DIDS = [
  "did:plc:ugtulcml7ptsivphrwpigrb6", //catturd2.bsky.social - Tom Mckay
];

// Add any new lists here. The label should be a unique keyword that identifies the list, the rkey is the last part of the URL when you visit the list on bluesky, and the test is a regex test that will be used to check if the handle contains the keyword.
export const LISTS: List[] = [
  {
    label: "bicycle", // change this to a unique keyword you can pass to the addToList function in checkHandles
    rkey: "3leis3ujjbz2z", // The rkey is the last part of the URL when you visit the list on bluesky
    test: new RegExp("🚲|🚴🏻|🚴‍♂️|🚴‍♀️", "iu"), // This is the regex test that will be used to check if the handle contains the keyword
  },
];
