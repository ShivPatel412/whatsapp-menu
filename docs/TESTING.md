# Test before real traffic

## Offline checks

```sh
node --test tests/workflow.test.cjs
```

These are simulated routing, contact-pause and export checks. They do not contact Meta/Google/VGraple,
book a call, create credentials or touch your phone chats.

## Your real-account checks

Use Meta's test number first, then your approved business number. Use a separate
sender you control; do not send tests to customers.

1. Send HI. Expect exactly three first-menu buttons.
2. Choose My Service. Provide a service, requirements and timeline. Expect one
   bold question at each step, a correct summary, then About Us.
3. Choose Get a Quote. Provide a service, budget/currency and timeline. Verify
   the summary and saved flow_state. The latest completed request is retained.
4. Start again and type MENU halfway through. Expect cancellation and the menu.
5. Choose About Us. Expect Portfolio, Social Media, Book a Call, FAQ and navigation.
6. Open all links on the phone. Check they belong to the intended business.
7. Try each FAQ. Confirm there are no invented prices or deadlines.
8. Book a Call must request preferences and require human confirmation.
9. In the AI edition, ask a normal question after the guided flow. Inspect the
   Gemini node and confirm an actual answer, not the fallback.
10. Check delivery webhooks: API acceptance is not delivery. Look for delivered
    or read status and no duplicate replies.
11. Inspect n8n executions for ignored statuses/history/echoes. Use test fixtures
    for group rejection; do not enable group subscriptions to create a test.
12. Recheck provider app subscriptions and the phone app connection.

First-contact greetings, groups, wrong phone IDs, old timestamps and malformed
sender identities should not bypass their guards. Never replay real chat history
to test the bot.

## Troubleshooting

For optional VGraple contact pauses, run the Yes/No checks in
[PAUSE-REPLIES.md](PAUSE-REPLIES.md). A paused sender must output zero items before
state loading, menu building, Gemini, and sends. An unpaused sender must retain
its original message and item pairing. Also check that lookup errors stop replies.
Do not send test messages to friends or customers without their involvement.

| Symptom | Check |
|---|---|
| No execution | Published callback, messages field, correct app/account subscription |
| Execution stops at Normalize | Phone ID, sender format, event type, timestamp |
| Token cannot be parsed | Paste only the Meta token into Bearer Auth, without “Bearer ” |
| Permissions missing | App WhatsApp use case and system-user asset assignments |
| First contact gets no reply | Empty table result must keep Always Output Data enabled |
| Question starts over | Both table nodes point to the same table; flow_state saved |
| Contact still gets menu | Pause field = Yes; both optional nodes enabled; tag alone is insufficient |
| VGraple lookup fails | Read-only credential, API limits and response; do not enable continue-on-error |
| Reply accepted but not delivered | Delivery status error, service window, account restrictions |
| Duplicates | Two active workflows/provider flows, concurrent requests, partial send failure |
| LinkedIn fails in a web checker | Test in the phone browser; automated requests may be blocked |

