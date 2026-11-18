# WhatsApp Menu + Guided Quotes for n8n

A free, editable workflow template for WhatsApp Business menus.
Start with the **menu-only** edition. Add Gemini only if you want AI answers.

**Free template does not mean free unlimited hosting, AI or WhatsApp messages.**
See [current cost boundaries](docs/COSTS.md). No token, customer chat, phone number,
private account ID or credential from the original setup is included.

## What people see

```text
How can I help you today?
[1 My Service] [2 Get a Quote] [3 About Us]

My Service → service → requirements → timeline → summary → About Us
Get a Quote → service → budget → timeline → summary → About Us

About Us
[1 View Portfolio] [2 Social Media] [3 Book a Call]
[4 FAQ] [Main Menu]
```

The question appears first in **bold**. Questions arrive one at a time.
About Us uses two visible button messages because a reply message supports
at most three buttons. FAQ topics use a list picker.

- Portfolio, Instagram and LinkedIn links are editable.
- Call requests collect preferences; a person must confirm the appointment.
- Latest completed request and active question are saved per sender.
- Groups, history imports, echoes, status updates and stale messages are ignored.
- No bulk messaging, chat migration, calendar booking or human notification.
- This is a website/AI-service business example. Edit the offer and FAQs for yours.

## Download the right workflow

| File | AI key needed? | Behavior |
|---|---|---|
| [menu-only.json](workflows/menu-only.json) | No | Buttons, forms, FAQs and human-review response |
| [menu-gemini.json](workflows/menu-gemini.json) | Yes | Same menu, plus Gemini for other text questions |

Both import **inactive**, with credentials removed and account IDs replaced.
The Gemini edition needs a model available to your own project; the included
model selection is an example, not a guarantee of free-tier access.

## Full setup

Follow [SETUP.md](docs/SETUP.md) in order:

1. Run n8n on an HTTPS-accessible installation.
2. Use Meta's test phone number first.
3. Import **one** workflow and create its conversation table.
4. Configure your phone ID, links and credentials.
5. Check webhook delivery and test menus from another phone.
6. For an existing WhatsApp Business app number, read
   [COEXISTENCE.md](docs/COEXISTENCE.md) **before connecting it**.

Already connected through a provider? Keep that connection. This template does
not require deleting, transferring or registering that number again.

## Customize

In **Normalize Incoming**, replace `REPLACE_PHONE_NUMBER_ID`.
In **Route and Build**, edit the `PROFILE` object, service choices and FAQ copy.
In both table nodes, select your new conversation table.
In credential pickers, choose your own Meta credentials and optional Gemini key.

The table ID and phone ID are identifiers, not tokens. **Never put access tokens
inside Code nodes, workflow JSON, GitHub issues, screenshots or videos.**

## Test without sending messages

Install a current supported Node.js release, then run:

```sh
node --test tests/workflow.test.cjs
```

These tests cover routing, guided request state, group rejection, safe export
structure and button limits. They make no network requests.

Use [TESTING.md](docs/TESTING.md) for real phone tests. Local checks do not prove
that your credentials, Meta permissions, provider setup or webhook work.

## Boundaries

- Not an end-to-end one-click installer. Each person needs their own accounts.
- The menu workflow can run without Gemini. The Gemini edition sends new text
  questions and limited conversation context to Google.
- Only the latest completed request is retained per sender; this is not a CRM
  request history. Add your own reviewed lead store if you need every request.
- Deduplication retains 100 successful message IDs per sender and is not atomic.
  Concurrent messages, or a partial multi-message send followed by retry, can
  produce duplicate replies. Use low-volume tests before any wider rollout.
- Memory is temporary. There is no pause/handoff lock after “Talk to…” requests.
- Voice, image and attachment understanding are not implemented.
- A phone-number-based sender is currently required. Username-only webhook events
  without a numeric sender are ignored.
- Public templates have passed local checks, but have not been deployed into a
  new independent account. The original private installation was tested live.

## Share it

Use the [English Reel package](reel/REEL.md) to show a short demo.
The full tutorial lives in these docs; a short Reel cannot teach every onboarding
screen. Add the real public repository link before recording the final CTA.

## License

MIT for this template and documentation. n8n and connected services have separate
licenses and terms. See [LICENSE](LICENSE). No affiliation with Meta, Google, n8n
or a coexistence provider.

