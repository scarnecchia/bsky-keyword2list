# keyword2list

This program watches the bluesky firehose and adds accounts to lists based on keywords. This works for both moderation and curated lists. I suggest running one instance for moderation lists and one for curated lists, until I can refine whitelisting.

## Installation and Setup

Requires Node 22.11.0

To install dependencies:

```bash
bun i
```

### Setup

1. Modify .env.example with your own values and rename it to .env.
2. Modify constants.ts to include your own lists and keywords.

```bash
bun run start
```

To run in docker:

```bash
docker build -pull -t keyword2list .
docker run -d --restart unless-stopped keyword2list
```

**Please note**: Be cautious with regular expressions because they can genenerate a lot of false positives without careful consideration.

## Credits

- [scarnecchia](https://bsky.app/profile/did:plc:uyqnubfj3qlho6psy6uvvt6u)
- [alice](https://bsky.app/profile/did:plc:by3jhwdqgbtrcc7q4tkkv3cf), creator of the [labeler-starter-kit-bsky](https://github.com/aliceisjustplaying/labeler-starter-kit-bsky/tree/main), whose code I've deconstructed and derived large swaths of this from.
- [futur](https://bsky.app/profile/did:plc:uu5axsmbm2or2dngy4gwchec), creator of the [skyware libraries](https://skyware.js.org/) which make it easier to build things for Bluesky
