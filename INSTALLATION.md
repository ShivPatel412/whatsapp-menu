# 🚀 Installation

**[Overview](README.md) &nbsp; · &nbsp; [Installation](INSTALLATION.md) &nbsp; · &nbsp; [Testing](docs/TESTING.md) &nbsp; · &nbsp; [Costs](docs/COSTS.md)**

## From download to your first WhatsApp reply

Start with **Menu only + Meta's test number**. Add Gemini and an existing business
number after the basic menu works.

This guide configures your own accounts. It does not create credentials, host
n8n, approve a Meta business, or migrate a phone number for you.

### Jump to a step

[1. Prepare](#1-prepare-your-accounts) ·
[2. Choose](#2-download-one-workflow) ·
[3. Import](#3-import-into-n8n) ·
[4. Table](#4-create-the-conversation-table) ·
[5. Profile](#5-customize-your-business-profile) ·
[6. Meta](#6-set-up-metas-test-number) ·
[7. Token](#7-create-your-meta-credentials) ·
[8. Phone ID](#8-set-the-phone-number-guard) ·
[9. Webhooks](#9-connect-incoming-messages) ·
[10. Gemini](#10-add-gemini-optional) ·
[11. Test](#11-publish-and-test-on-the-test-number) ·
[12. Existing number](#12-connect-an-existing-business-number-carefully)

---

## 1. Prepare your accounts

You need:

- **n8n**, reachable through a public HTTPS address, with an administrator login.
- **A Meta developer account and business portfolio** for your own business.
- **A second WhatsApp phone** you control, to send test messages.
- **Your business links** for portfolio, Instagram, and LinkedIn.
- **Google AI Studio**, only for the Gemini edition.

Your n8n installation needs the Data Table, Code, WhatsApp Trigger, and HTTP
Request nodes. The Gemini edition also needs AI Agent, Gemini Chat Model, and
Window Memory nodes.

If you already run n8n, keep your current installation. If you self-host from
scratch, follow n8n's maintained
[Docker Compose guide](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md).
Set up persistent storage, backups, authentication, and HTTPS there.
Localhost alone cannot receive Meta's incoming webhooks.

**Check before continuing:** you can open your HTTPS n8n address and sign in.
You understand the [running costs](docs/COSTS.md).

## 2. Download one workflow

| Choose | File |
|---|---|
| Buttons and guided enquiries, without an AI key | [Menu only](workflows/menu-only.json) |
| The menu plus AI answers to other text questions | [Menu + Gemini](workflows/menu-gemini.json) |

Open the file on GitHub and use its **Download raw file** action.
Alternatively, use **Code → Download ZIP** on the repository and extract it.

**Choose one edition for one bot.** Do not publish two copies against the same
Meta app callback. This can replace a callback or create duplicate replies.

**Check:** you have a `.json` workflow file, not a saved GitHub HTML page.

## 3. Import into n8n

1. In n8n, create a new workflow.
2. Open its workflow menu and choose **Import from file**.
3. Select the JSON you downloaded.
4. Give the workflow a recognizable name.
5. Keep it **inactive** while configuring the following steps.

Missing-credential warnings are expected. Public files contain no credentials.
If a node is unavailable, update/check your installation against that node's
version before continuing.

**Check:** you can see WhatsApp Trigger, Normalize Incoming, Route and Build,
table nodes, and a send node on the canvas.

## 4. Create the conversation table

In n8n, open **Data tables**, create a table named
`WhatsApp_Conversation_State`, and add these five columns:

| Exact name | Type | What it saves |
|---|---|---|
| `sender` | String | Numeric sender identity |
| `processed_ids` | String | JSON array of successful incoming message IDs |
| `last_seen` | Date | Last processed timestamp |
| `welcomed` | Boolean | Whether the sender has been greeted |
| `flow_state` | String | Current question, answers, and latest completed request |

Leave the table empty. n8n supplies its own system columns.

Then:
1. Open **Load Conversation State** and select the new table.
2. Keep its sender filter and **Always Output Data** setting.
3. Open **Save Conversation State** and select the **same** table.
4. Verify all five field mappings are present, especially `flow_state`.

Do not use a table containing unrelated customer records.

**Check:** neither table node contains `REPLACE_CONVERSATION_TABLE_ID`.

## 5. Customize your business profile

Open **Route and Build**. At the top of its code, edit:

```js
const PROFILE = {
  name: 'Your Business',
  portfolio: 'https://example.com',
  instagram: 'https://www.instagram.com/YOUR_HANDLE/',
  linkedin: 'https://www.linkedin.com/in/YOUR_HANDLE/'
};
```

Replace every example link with your own full HTTPS link.

In that same node, review:
- Service choices and service names.
- Questions for requirements, budget, and timeline.
- FAQ answers and human-review wording.
- Portfolio/social reply text.

Keep reply-button labels short. Do not insert promises about prices,
availability, project progress, or bookings that the workflow cannot verify.

**Check:** no customer-facing `example.com` or `YOUR_HANDLE` remains.
Try the links yourself in a browser.

## 6. Set up Meta's test number

1. Open [Meta for Developers](https://developers.facebook.com/apps).
2. Create/select your app for this bot.
3. Add **Connect with customers through WhatsApp** if it is not present.
4. Open the WhatsApp use case's API setup.
5. Start with Meta's **test phone number**.
6. Add/verify your separate test-recipient phone where Meta requires it.
7. Record your **Phone number ID** and **Messaging account ID**.

These identifiers are different:

| Value | Used for |
|---|---|
| App ID | App identity and trigger credential setup |
| Phone number ID | Incoming guard and message sends |
| Messaging account ID | WhatsApp account access/subscription |
| Display phone number | The number people message |

**Check:** you have the phone **ID**, not just the phone number.

**Existing phone warning:** do not add/register a number already used in the
WhatsApp Business app through a migration flow. Use step 12 instead.

## 7. Create your Meta credentials

For direct access to your own business, follow Meta's current
[system-user token guide](https://developers.facebook.com/documentation/business-messaging/whatsapp/access-tokens/).

1. In Business Settings, create/select your system user.
2. Assign **Manage app** access for your intended app.
3. Assign appropriate access to both the WhatsApp account and Messaging account.
4. Generate a token for that app with:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - `business_management`, as listed in Meta's guide.
5. Note the token lifetime so you know when it needs replacing.

If a permission is absent from the token form, check the app's WhatsApp use case
and its permission configuration. Do not try an unrelated token or disconnect
the number.

In n8n, configure:

| Node | Credential |
|---|---|
| WhatsApp Trigger | Your app/client ID and app secret, as requested by its form |
| Send Button or Menu | HTTP Bearer Auth using your Meta system token |
| Send AI Reply, Gemini edition | The same HTTP Bearer Auth credential |

Paste **only the token** into the Bearer Token field — no `Bearer ` prefix,
quotes, or spaces around it.

**Check:** every credential picker points to your own credential.
A Gemini key or provider API key is not a Meta token.

Never place tokens in Code nodes, workflow JSON, GitHub, screenshots, or videos.

## 8. Set the phone number guard

Open **Normalize Incoming** and replace:

```text
REPLACE_PHONE_NUMBER_ID
```

with the **Phone number ID** from step 6.

The send URL uses the validated phone ID from this node. Do not paste an access
token into the URL. Keep group, history, echo, status, sender, and timestamp checks.

**Check:** the guard contains the correct phone ID and no placeholder.
Keep the workflow inactive until the next step is ready.

## 9. Connect incoming messages

Your Meta app needs:
1. A verified webhook callback for the n8n WhatsApp Trigger.
2. The **messages** webhook field enabled.
3. A subscription to the correct Messaging account.

Use the trigger's setup instructions and
[n8n's WhatsApp Trigger guide](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.whatsapptrigger/).
Use the **production callback** for a published workflow, not a temporary test
callback. Follow the node's current activation flow to register it.

The callback configuration and Messaging account subscription are separate.
A successful webhook verification alone does not prove that customer messages
will arrive.

**Already connected through a provider?** Record the existing subscriptions.
Do not remove its app, override its callback, revoke its token, or repeat signup.
Follow [coexistence checks](docs/COEXISTENCE.md).

**Check:** Meta's app configuration targets this workflow and has messages enabled.
Do not publish competing copies of the same bot.

## 10. Add Gemini (optional)

Skip this step for **menu-only**.

1. Open [Google AI Studio](https://aistudio.google.com).
2. Create/select your own project and API key.
3. Save the key directly in an n8n Gemini credential.
4. Open **Gemini Chat Model** and choose that credential.
5. Select a model available to your own project.
6. Review **AI Lead Assistant** and change its business instructions to match
   your actual services.
7. Check your project's quotas, billing status, and Google's data-use terms.

The included model selection is an example. A free-tier allowance in someone
else's project does not establish your own quota.

**Check:** a small AI test succeeds using your own key and model.
Do not send real customer information before reviewing the
[cost and privacy notes](docs/COSTS.md).

## 11. Publish and test on the test number

When the phone ID, table, links, and credentials are configured:

1. Publish/activate this single workflow on Meta's test number.
2. From the separate verified test phone, send a fresh **HI**.
3. Expect **My Service · Get a Quote · About Us**.
4. Complete **My Service**: service → details → timeline.
5. Complete **Get a Quote**: service → budget → timeline.
6. Verify the summaries match your answers, then About Us appears.
7. Type **MENU** halfway through a request; verify it returns to the main menu.
8. Try Portfolio, both social links, every FAQ, and Book a Call.
9. Check the table's saved `flow_state`.
10. Inspect execution results and delivery statuses.

**API accepted is not the same as delivered.** Look for delivered/read events.
Calls and quotes must still require human confirmation.

For the Gemini edition, ask a normal text question after a guided flow and verify
the Gemini node answered, rather than the temporary-unavailable fallback.

See the full [testing checklist](docs/TESTING.md).

## 12. Connect an existing business number carefully

Only proceed after the test number works.

Read [COEXISTENCE.md](docs/COEXISTENCE.md) with the owner of the phone.
Use an eligible provider-supported coexistence route if the number is already
in WhatsApp Business. Review chat backup, history import, feature changes, and
linked-device logout/relink warnings before new onboarding.

If the number is **already connected**, keep that connection. Verify access to
the correct phone and Messaging account, and add an authorized app only where
your provider and Meta support it. Do not delete the provider subscription or
register/deregister the number.

Change the workflow's phone guard to the intended business phone ID, confirm
credentials/table ownership again, and test from a separate sender.

**Check:** the provider remains connected, the phone app still works, and the
intended reply is delivered once. Groups remain excluded.

## Before enabling wider replies

- [ ] Your profile, offers, FAQ copy, and links are correct.
- [ ] No credentials or example identifiers are left in public files.
- [ ] Phone guard and table point to the intended business.
- [ ] Test messages arrived and replies were delivered.
- [ ] Guided answers persist between messages.
- [ ] Provider/phone app coexistence is still intact.
- [ ] Someone will review human requests and call preferences.
- [ ] You understand running costs and data handling.

The workflow stores only the latest completed request per sender. Its
deduplication is not atomic; concurrent events and partial multi-message failures
can produce duplicates. Use an atomic request ledger before high-volume use.
There is no automatic human-handoff pause, calendar booking, or attachment analysis.

## Something not working?

| Symptom | First checks |
|---|---|
| No n8n execution | Published callback, messages field, app/account subscription |
| Stops at Normalize | Phone ID, sender format, timestamp, event type |
| Token cannot be parsed | Meta token only, saved in Bearer Auth |
| Token permission missing | App use case and both asset assignments |
| First contact gets nothing | Load node's Always Output Data |
| Questions restart | Same table in both nodes; flow_state mapping |
| Accepted but not delivered | Delivery error, service window, account restrictions |
| Duplicate replies | Competing workflows/provider flows or concurrent events |

**[Back to Overview](README.md)** · [Detailed testing](docs/TESTING.md) · [Costs](docs/COSTS.md)

