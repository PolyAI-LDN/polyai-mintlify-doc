---
name: "Update API docs"
on:
  cron: "0 * * * *"
context:
  - repo: "polyai-ldn/poly_core"
  - repo: "polyai-ldn/polyai-mintlify-doc"
---

Oliver Eisenberg  [4:20 PM]
Hey I think the first half is relevant here?
Although if /status only works for a time period we should probably add that to the docs? (it is 2 hours) (edited) 
Hey, do you maintain the /outbound/status/ endpoint? (semi doc related so maybe for product??)

I’ve noticed in our docs.poly.ai  site we’re showing this endpoint instead of the https://api.us-1.platform.polyai.app/v1/outbound-calling/  one - Is this intentional? The client is trying to use it and we’re getting a 404Not Found.

When I try this via the playground I get an error An error occurred while making the request: Missing required fields to send a playground request even though I have both fields populated.

Also can someone point how long the outbound-calling/OUT-/status endpoint retrieves the status of the call? Seems like it is under 3 hours?Posted in ask-runtime | Mar 6th | View message1 replyOliver Eisenberg  [6:23 PM]
Hey this api endpoint has now changed to https://api.example.com/outbound/status/{call_sid} 
Who owns docs.poly.ai? Not very client friendly
cc @Aaron Forinton

Oliver Eisenberg  [4:10 PM]
Hey, do you maintain the /outbound/status/ endpoint? (Raised in #team-documentation too)

I’ve noticed in our docs.poly.ai  site we’re showing this endpoint instead of the https://api.us-1.platform.polyai.app/v1/outbound-calling/  one - Is this intentional? The client is trying to use it and we’re getting a 404Not Found.

When I try this via the playground I get an error An error occurred while making the request: Missing required fields to send a playground request even though I have both fields populated.

Also can someone point how long the outbound-calling/OUT-/status endpoint retrieves the status of the call? Seems like it is under 2 hours? (edited) 
5 repliesTori Centeno  [3:44 PM]
hello i have a recently live customer wanting to use this endpoint please could we get some help here
Cornel Marck  [6:19 PM]

What is the full URL of the first endpoint you mention? It is likely the difference between the internal and external endpoint
Can you please share a DD log for the error that you encountered?
[6:19 PM]I think that the public API used to be owned by Colman
[6:20 PM]The expiry for the status is 2 hours
https://github.com/PolyAI-LDN/poly_core/blob/4227cfb9afe092f61845f1e79aa06afe64554[…]hannel_handlers/asterisk_outbound_caller/stores/status/store.go
store.go    statusExpiry = 2 * time.Hour
PolyAI-LDN/poly_core | Added by GitHubOliver Eisenberg  [6:21 PM]
I just opened docs.poly.ai and now the url is shown as:
https://api.example.com/outbound/status/{call_sid} lol idk why it was previously https://api.us-1.platform.polyai.app/outbound/status/
