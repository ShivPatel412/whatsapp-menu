# Keep an existing WhatsApp Business app number

A downloadable n8n workflow does not perform coexistence onboarding.
Start on a test number, then use a provider-supported coexistence flow for an
eligible existing WhatsApp Business app number.

Meta's [coexistence guide](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
describes using the app and Cloud API together and synchronizing supported
one-to-one history. Groups are not synchronized. Some app features change, and
linked-device behavior must be reviewed before onboarding.

## Before connecting

1. Back up your phone chats using WhatsApp's supported backup flow.
2. Read the provider's current coexistence instructions and linked-device warning.
3. Verify the phone, business portfolio and Messaging account you are selecting.
4. Choose coexistence, not migration, deletion or fresh registration.
5. Check the provider's history-import status if you request an import. Do not
   equate a connected badge with a completed history import.

Business verification, documents and eligibility depend on Meta and the provider.
This repository does not promise that every account can onboard without documents.

## If you are already connected

Leave the provider and phone app connected. Do not repeat signup just to install
this workflow. The original working deployment used VGraple plus a separately
authorized business-owned Meta app. Other accounts/providers must verify their
own asset access.

Before adding an n8n app, list the account's existing app subscriptions and record
the provider app ID. Confirm you can read the correct phone ID using your own
token. Where Meta permits adding your app, add it **alongside** the provider,
not with a DELETE or callback override affecting that provider.

Afterward, verify:
- Your provider remains listed.
- Your own app is listed and its callback receives messages.
- The phone remains available in WhatsApp Business.
- A new individual message receives only the intended bot reply.
- Provider automations are not also answering the same message.

Do not revoke provider tokens, disconnect linked accounts, delete apps, transfer
numbers or call register/deregister endpoints as a troubleshooting shortcut.
If the provider cannot confirm compatible access, stop with the test number.
This repo does not automate subscription changes.

No historical messages are sent to Gemini. The workflow handles only new,
eligible incoming messages. Its own group checks stay in place even when the
provider also excludes groups.

## Linked devices

Before new onboarding, explain the current Meta/provider warning to the phone
owner, including any logout and relinking steps and supported device types.
For an already-connected number, installing this workflow is not a reason to
relink devices or repeat onboarding.

