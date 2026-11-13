# Architecture rules

- Initialize browser analytics once in `index.html` using the owner's explicitly public measurement ID and keep custom events in the existing analytics helper; do not load a parallel Tag Manager container, which can duplicate events, or expose stored secret values.
- Enforce pending booking creation and cancellation-only tourist updates in database policies; host/admin approval must not be caller-selected.
- Public profiles are limited to review authors; other profiles require owner/admin access, and only explicitly public site-setting keys are readable anonymously.
- Bind image uploads to the authenticated storage owner while keeping marketplace images publicly readable.
- Validate AI chat history on the server as bounded user/assistant text only; system instructions belong exclusively to the server.