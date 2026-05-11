# Webchat widget

The embeddable JavaScript widget that puts the agent on a customer's website. The agent runs the same way it does on voice — same Topics, Flows, Tools, Rules — only the channel and rendering change.

## Where it lives

- **Studio:** `Channels > Chat > Widget`. The `Embed` tab generates the JS snippet.
- **API:** [Chat API](https://docs.poly.ai/api-reference/chat/introduction) for programmatic chat sessions; [Conversations API v3](https://docs.poly.ai/api-reference/conversations/introduction) for chat history.

## Common failure modes

Most webchat issues are environment problems on the customer's site, not bugs in the widget itself. The [widget troubleshooting page](https://docs.poly.ai/webchat/widget-troubleshooting) is the canonical reference; the patterns below summarise it.

- **Widget doesn't appear at all.**
  - Snippet missing from page source. View source and grep for the widget script URL.
  - Content Security Policy (CSP) blocks the widget CDN. Add the widget domain to the site's `script-src` and `connect-src` allowlists.
  - Ad blocker or privacy extension is blocking. Reproduce in incognito with extensions disabled.
  - Tag Manager has a syntax error in the snippet (missing quote, unclosed tag). Validate the GTM container.
- **Widget appears but is partially hidden / overlapped by cookie banner.** `z-index` mismatch on the consent banner. Adjust banner z-index or the widget container CSS (`#poly-ai-chat`).
- **`tel:` links don't launch a call.** Desktop browsers without a default calling app, or a managed device with `tel:` links blocked. Verify numbers are valid E.164.
- **QR code doesn't scan.** Low contrast, too small on mobile, camera permissions denied. Test on the actual target device.
- **Performance dragging on a slow site.** The widget loads asynchronously by default; if the snippet is duplicated or the site already loads many third-party scripts, it adds up. Consider loading the widget only on high-intent pages.
- **iframe restrictions blocking the widget.** Test on a top-level page first to rule that out; check `sandbox` attributes for `allow-scripts` and `allow-top-navigation`.

## Multi-site deployments

Use [Variants](../entities/variant.md) to deploy one agent across many sites. Pass site context via `conv.metadata` in the widget configuration so the start function can pick the right variant.

## Related

- [Agent](../entities/agent.md), [Variant](../entities/variant.md), [Multilingual](../entities/multilingual.md).

## Authoritative docs

- [Multichannel](https://docs.poly.ai/webchat/multichannel)
- [Webchat introduction](https://docs.poly.ai/webchat/introduction)
- [Chat configuration](https://docs.poly.ai/webchat/chat-configuration)
- [Widget](https://docs.poly.ai/webchat/widget)
- [Widget installation](https://docs.poly.ai/webchat/widget-installation)
- [Widget troubleshooting](https://docs.poly.ai/webchat/widget-troubleshooting) — the gold reference
