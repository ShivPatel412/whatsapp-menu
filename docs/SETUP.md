# Full setup: from download to first reply

## 1. Choose a safe starting point

Start with Meta's test number. Do not use “Add/register a new phone number” for
a phone already in the WhatsApp Business app. Existing numbers need a compatible
coexistence route; read [COEXISTENCE.md](COEXISTENCE.md).

Choose `menu-only.json` first. It does not require Google AI Studio.
Import only one edition for one bot/app callback; publishing two copies can
overwrite the app callback or produce duplicate replies.

## 2. Prepare n8n

Use your own n8n installation with the Data Table, Code, WhatsApp Trigger and
HTTP Request nodes. The AI edition also needs n8n's Gemini, AI Agent and Window
Memory nodes. Compare imported node versions with your installation.

Use n8n's maintained [Docker Compose installation guide](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md)
if self-hosting. Follow its current storage, backup and HTTPS instructions.
Localhost alone cannot receive Meta webhooks. Keep the instance online during
tests. A free software license does not provide a free server or domain.

This repository doesn't bundle a server configuration or ask you to expose a
local admin panel. Configure authentication and HTTPS before receiving real chats.

## 3. Import

In n8n, create a workflow and use its import-from-file action.
Select one JSON from `workflows/`. Keep it **inactive** while configuring it.
Missing credential indicators are expected; exported credential references have
been removed. See [n8n import/export](https://docs.n8n.io/workflows/export-import/).

## 4. Create the conversation table

Create a Data Table named `WhatsApp_Conversation_State`, with:

| Column | Type | Meaning |
|---|---|---|
| sender | String | Numeric sender identity |
| processed_ids | String | JSON array of successful incoming message IDs |
| last_seen | Date | Last processed timestamp |
| welcomed | Boolean | Whether the sender has been greeted |
| flow_state | String | JSON for active step and latest completed request |

Leave the table empty. n8n creates its own system columns.
Open **Load Conversation State** and **Save Conversation State**, and select
this same table in both nodes. Check the Save node's field mapping still contains
all five fields. Do not map to an existing table containing unrelated customer data.

## 5. Configure your public profile

Open **Route and Build**. Edit the `PROFILE` object at the top:

```js
const PROFILE = {
  name: 'Your Business',
  portfolio: 'https://example.com',
  instagram: 'https://www.instagram.com/YOUR_HANDLE/',
  linkedin: 'https://www.linkedin.com/in/YOUR_HANDLE/'
};
```

Use full HTTPS links. Edit the service names, FAQ answers and human-review wording
in the same node. Use factual pricing/availability statements. Change the AI
system prompt to your own services if using the Gemini edition.

## 6. Configure Meta for your own business

Create a Meta developer app with the **Connect with customers through WhatsApp**
use case and use its test phone setup. Record the test phone **ID**, which is
different from the display phone number, Messaging account ID and app ID.

For direct access to your own business, create a system user in Business Settings,
assign your app's Manage app access and the appropriate WhatsApp account and
Messaging account access. Generate a token with the required WhatsApp management
and messaging permissions; Meta's guide also lists business_management.
Use Meta's [access token guide](https://developers.facebook.com/documentation/business-messaging/whatsapp/access-tokens/).
If the permissions are missing, check the app's WhatsApp use case first.

Create the credentials in n8n:
- WhatsApp Trigger: your own Meta app/client ID and app secret, using the fields
  shown by the credential form.
- Send Button or Menu: HTTP Bearer Auth containing **only** your system token.
- Send AI Reply (AI edition): choose the same bearer credential.

Paste secrets directly into n8n credential forms. Never paste them into source
files. Tokens have expiration/rotation requirements; note your chosen lifetime.
A VGraple API key and a Gemini API key are not Meta tokens.

## 7. Set the phone guard and table

In **Normalize Incoming**, replace `REPLACE_PHONE_NUMBER_ID` with your phone ID.
The two send URLs read the validated phone ID dynamically from this node.

Changing the guard to your ID prevents the bot from answering events for some
other number attached to your app. Keep group/history/echo exclusions intact.

## 8. Optional Gemini

Skip this for the menu-only edition.

In **Gemini Chat Model**, select your own Google AI Studio credential and a model
available to your project. Check the model's free-tier status and quota in AI
Studio. Do not assume the template's model or the original project's limits apply
to your account. Review Google's data terms before sending customer text.

## 9. Connect inbound events

The app's `messages` webhook must reach the workflow's **production** callback.
Use the n8n WhatsApp Trigger setup and [current node docs](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.whatsapptrigger/).
Meta also needs your app subscribed to the correct Messaging account.
App webhook configuration and Messaging account subscription are separate checks.

Never replace a provider's app or delete its subscription. See
[COEXISTENCE.md](COEXISTENCE.md) if a provider already owns the onboarding.

## 10. Test and publish

Use [TESTING.md](TESTING.md). Publish only after all identifiers, credentials,
links and table mappings are yours. Have another phone send a fresh message after
the API connection is active, so a customer-service window exists.

Publication enables automatic replies to valid individual messages on that phone.
Imported history is not replayed. It does not send a campaign to old contacts.

