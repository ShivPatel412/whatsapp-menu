<div align="center">

# 💬 A “Hi” deserves a clear next step.

### WhatsApp menus, guided enquiries, and quotes — built with n8n.

Give customers three useful choices. Ask one question at a time.
Let your business owner confirm the details.

**[Overview](README.md) &nbsp; · &nbsp; [🚀 Installation](INSTALLATION.md) &nbsp; · &nbsp; [Testing](docs/TESTING.md) &nbsp; · &nbsp; [Costs](docs/COSTS.md)**

**Free template · Gemini optional · Groups excluded**

</div>

---

## Meet your new first reply

```text
CUSTOMER
Hi 👋

YOUR BUSINESS
How can I help you today?

┌─────────────────┐
│ 1 My Service    │
├─────────────────┤
│ 2 Get a Quote   │
├─────────────────┤
│ 3 About Us      │
└─────────────────┘
```

*Example conversation preview — customize the business name and wording.*

No long wall of text. No need to open a list to see the three main choices.
Customers tap a button and get the next useful question.

## Three paths. One simple conversation.

| Customer chooses | The workflow asks | What happens next |
|---|---|---|
| **My Service** | Service → requirements → timeline | Request summary → About Us |
| **Get a Quote** | Service → budget → timeline | Request summary → About Us |
| **About Us** | Portfolio, social profiles, call request, or FAQ | The selected link or reply |

### What a quote request feels like

> **Which service do you need?**  
> Web Development
>
> **What is your approximate budget?**  
> USD 500
>
> **When would you like the project completed?**  
> Next month

The workflow saves the answers and shows a summary. **The owner still confirms
the scope, price, and availability.** A request is not an approved quote.

## Start simple. Add AI when you need it.

<table>
<tr>
<th>🟢 Menu only</th>
<th>✨ Menu + Gemini</th>
</tr>
<tr>
<td>
Buttons, guided questions, FAQs, portfolio links, social links, and call requests.
<br><br>
<strong>No AI key needed.</strong> Best place to start.
<br><br>
<a href="workflows/menu-only.json">View workflow JSON</a> ·
<a href="https://github.com/ShivPatel412/whatsapp-menu-n8n/raw/refs/heads/main/workflows/menu-only.json">Download</a>
</td>
<td>
Everything in the menu edition, plus Gemini answers to other text questions.
<br><br>
<strong>Your own Google AI Studio key.</strong> Model availability and quotas apply.
<br><br>
<a href="workflows/menu-gemini.json">View workflow JSON</a> ·
<a href="https://github.com/ShivPatel412/whatsapp-menu-n8n/raw/refs/heads/main/workflows/menu-gemini.json">Download</a>
</td>
</tr>
</table>

Both workflows import **inactive**, with credentials removed and account
identifiers replaced. Configure your own accounts before publishing.

### Friends should get you, not your bot

Already using VGraple? Set **Pause auto replies → Yes** on a contact to stop
their menu and AI replies while you keep chatting normally. Both templates
include the optional checks, **disabled until configured**.

**[Set up contact pauses →](docs/PAUSE-REPLIES.md)**

## 🚀 Your first working menu

1. Download the **menu-only** workflow.
2. Import it into your own n8n installation.
3. Create the conversation table.
4. Add your public links, phone ID, and Meta credentials.
5. Connect Meta's test number and verify a reply from another phone.

### [Open the full Installation guide →](INSTALLATION.md)

The guide walks through each screen and setting, shows what to check after
each step, and explains when to publish.

**Already using WhatsApp Business with existing chats?**
Read [Keep your number and chats](docs/COEXISTENCE.md) before connecting it.
Do not migrate or re-register an existing number to try this template.

## Make it yours

| Edit | Where |
|---|---|
| Business name, portfolio, Instagram, LinkedIn | `PROFILE` in **Route and Build** |
| Services, questions, and FAQ answers | **Route and Build** |
| Phone number ID | **Normalize Incoming** |
| Conversation table | **Load Conversation State** + **Save Conversation State** |
| Meta credentials | WhatsApp Trigger + send-node credential pickers |
| AI instructions and model | Gemini edition only |
| Pause replies for selected contacts | Optional VGraple nodes; [setup guide](docs/PAUSE-REPLIES.md) |

Questions appear **bold and first**. About Us contains Portfolio, Social Media,
Book a Call, and FAQ, across two visible button messages.
A call request collects a preferred date, time, and time zone; it does not
book a calendar event.

## A free template. Clear running costs.

You can download, edit, and share these files for free under MIT.
**Hosting, Meta message delivery, and Gemini usage can still cost money.**
Free allowances depend on the service and your account.

[Read the cost guide →](docs/COSTS.md)

## What it protects — and where it stops

- **Groups stay out.** Group messages, history imports, echoes, delivery statuses,
  wrong phone IDs, and stale messages are filtered.
- **Credentials stay yours.** No original tokens, customer chats, phone numbers,
  or private account identifiers are included.
- **Existing connections are not migrated.** This template does not disconnect a
  coexistence provider or register your number again.
- **A human remains responsible.** No confirmed quotes, calendar bookings,
  project-status lookups, or owner notifications are automated.
- **State is deliberately small.** It stores the active questions, latest
  completed request, and 100 successful message IDs per sender.
- **Low-volume starter.** Deduplication is not atomic; concurrent messages or
  partial multi-message failures can still produce duplicates.
- **Text only.** Voice/image understanding and username-only senders without a
  numeric phone identity are not implemented. AI memory can reset on restart.
- **Manual contact pause.** Optional VGraple checks can stop replies for selected
  contacts. Asking for a person does not automatically set that pause.

The public templates passed local checks. They still need a fresh-account
installation test; the original private deployment was tested live.

## Go deeper

| I want to… | Open |
|---|---|
| Install from scratch | **[Installation](INSTALLATION.md)** |
| Keep an existing number/provider | [Coexistence guide](docs/COEXISTENCE.md) |
| Check costs and free allowances | [Cost guide](docs/COSTS.md) |
| Verify buttons and delivery | [Testing checklist](docs/TESTING.md) |
| Stop automatic replies for friends | [VGraple contact pauses](docs/PAUSE-REPLIES.md) |
| Run offline checks | `node --test tests/workflow.test.cjs` |
| Record a demo Reel | [English script and shot list](reel/REEL.md) |

## Built to share

Made by [Shiv Patel](https://github.com/ShivPatel412).
If you adapt the menu for your business, keep the setup notes with your copy
so the next person can understand it too.

[MIT license](LICENSE) covers this template, documentation, and tests.
n8n, Meta, Google, and providers have their own terms. No affiliation is implied.

