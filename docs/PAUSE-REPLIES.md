# Keep friends out of the bot

Pause the menu and Gemini replies for selected people while continuing to chat
with them yourself. Your chats and existing WhatsApp/VGraple connection stay in place.

**Optional, in both editions.** The two VGraple nodes import **disabled**, so the
basic menu does not require a VGraple account. Pausing only works after you
configure and enable **both** nodes below.

## 1. Create the field in VGraple

1. Open your existing VGraple workspace. Do not reconnect your WhatsApp number.
2. Go to **Settings → Sales setup → Contact fields → Add field**.
3. Enter the exact name **Pause auto replies**.
4. Check that the generated API key is **`pause_auto_replies`**.
5. Choose **Dropdown**, with these two choices, one per line:

   ```text
   Yes
   No
   ```

6. Leave **Mark as required** off, then save the field.

The `no_auto_reply` tag can remain as a visual label, but **the tag alone does
not pause this bot**. In the API checked for this integration, contact responses
did not include tags and tag query parameters did not filter the results.

## 2. Save a read-only credential in n8n

1. In VGraple, open **Settings → Integrations → API Keys**.
2. Create a key with **Read-only** access for your n8n integration.
3. In n8n, create an **HTTP Bearer Auth** credential named `VGraple Read-only`.
4. Paste the key directly into its token field and save it. Do not add `Bearer `.
5. Open **Read VGraple Reply Preference** and select that credential.

Never put the key in workflow JSON, GitHub, a Code node, screenshots, or a Reel.
This is a separate credential from your Meta access token and Gemini key.

## 3. Enable and test both nodes

The included route is:

```text
Normalize Incoming
  → Read VGraple Reply Preference
  → Skip Paused Contacts
  → Load Conversation State
  → Route and Build
```

1. Use a test sender you control. In its VGraple chat, open **Contact Info →
   Contact Fields** and set **Pause auto replies → Yes**. The field saves automatically.
2. Enable **Read VGraple Reply Preference** and **Skip Paused Contacts** in n8n.
   Do not enable only one. Keep the lookup's default stop-on-error behavior.
3. Publish the updated workflow.
4. From that sender, send a fresh `HI`, a menu selection, and an ordinary question.
   Expect no automatic reply. In n8n, the lookup should find the exact contact
   and the gate should output zero items. Gemini and the send nodes must not run.
5. Set the field to **No**, send another fresh `HI`, and verify the menu returns.
6. Set **Yes** again for anyone you want to keep paused.

Groups are rejected by **Normalize Incoming**, before the lookup. Do not change
the group/history filters, Meta credentials, provider subscriptions, or phone registration.

## Daily use

| VGraple setting | Next valid individual message |
|---|---|
| **Yes** | No menu, guided question, or Gemini reply |
| **No** or blank | Normal automatic replies |
| Only the `no_auto_reply` tag | Normal replies; the field controls the pause |

Manual replies remain available. Asking to speak to a person does not automatically
set this field; you must set it yourself. Resuming preserves the saved guided-flow
state. Send `MENU` to restart the menu after resuming.

## Limits and failure behavior

- Each valid incoming individual message adds one read-only contact lookup.
- API errors, rate limits, malformed preferences, ambiguous results, or a mismatched
  phone identity stop that execution before any menu or AI reply. Inspect n8n errors;
  there is no automatic replay of stopped messages.
- A successful lookup with no contact yet allows the normal first-contact menu.
- The checked Free plan limit is **60 API requests per minute per workspace**, shared
  across keys. Check current limits in [VGraple's API guide](https://vgraple.co.in/help/rest-api-quickstart).
- A reply already in progress can finish when you change a contact's pause field.
- Disabling the two pause nodes bypasses all per-contact pauses. Keep both enabled
  while using this feature; revoke a credential only if you intend to stop lookups.
- This does not pause separate provider flows or other bots. Check those separately
  if another automation is replying.

The original deployment passed read-only live checks with a paused and unpaused
contact. Public exports still require testing on your own accounts.

[Installation](../INSTALLATION.md) · [Testing](TESTING.md) · [Overview](../README.md)
