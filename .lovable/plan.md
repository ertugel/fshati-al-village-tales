## WHAT WORKS

- **Auth (email/password)** — `src/hooks/useAuth.tsx`, `src/pages/Auth.tsx`, `ResetPassword.tsx`. Signup writes `profiles` + `user_roles` via the `handle_new_user` trigger (role clamped to tourist/owner). 3 profiles, 4 role rows in DB.
- **Role-gated routing** — `ProtectedRoute.tsx` wraps `/dashboard` (owner), `/admin` (admin), `/my-bookings`, `/profile`. `/admin` is protected (the old hole is closed).
- **Destinations listing + detail** — `pages/Destinations.tsx`, `DestinationDetail.tsx`, `components/DestinationsGrid.tsx` all query the `destinations` table. 6 rows live.
- **Tours listing + detail** — `pages/Tours.tsx`, `TourDetail.tsx`, `components/ToursSection.tsx` query `tours`. 12 rows.
- **Events** — `components/EventsSection.tsx` queries `events`. 4 rows.
- **Guides listing/detail pages** — `pages/Guides.tsx`, `GuideDetail.tsx` query `guides`. 6 rows.
- **Booking submission** — `BookingModal.tsx` inserts into `bookings` and invokes the `send-booking-email` function. 2 real rows exist.
- **Owner dashboard** — `pages/OwnerDashboard.tsx`: real CRUD on `accommodations` (7 rows), booking list filtered to owned items, stats.
- **Admin panel** — `pages/AdminPanel.tsx`: CMS over destinations, events, tours, bookings, chat moderation, site settings.
- **Community chat** — `CommunityChat.tsx` with Supabase Realtime, 5 messages persisted.
- **Partner applications** — `BecomePartner.tsx` really inserts into `partner_applications` (0 rows so far — untested by real users).
- **AI assistant** — `supabase/functions/chat` now requires a valid Bearer JWT (`getClaims`) before hitting Lovable AI.
- **i18n SQ/EN** — `useLanguage.tsx`, applied across nav, hero, sections.
- **MCP server** — 5 OAuth-scoped tools in `src/lib/mcp/tools/`, deployed as the `mcp` edge function.

## WHAT IS BROKEN

- **Homepage guides grid is fake** — `components/GuidesGrid.tsx` still hardcodes 8 guides with slug IDs (`mikel-gashi`). Those `<Link to="/guide/mikel-gashi">` links hit `GuideDetail.tsx`, which queries `guides` by UUID → guaranteed "not found" on every homepage guide click. This is the single worst live bug.
- **Contact form does nothing** — `pages/Contact.tsx` fakes success with `setTimeout`. No DB write, no email. Messages are silently discarded.
- **Newsletter does nothing** — `components/Newsletter.tsx` also fakes it with `setTimeout(1200)`. No subscribers table exists. GDPR copy over a no-op.
- **Emails likely undelivered** — `supabase/functions/send-booking-email/index.ts` sends from `onboarding@resend.dev`. Resend only delivers that to the account owner; guest confirmations to real addresses are dropped.
- **Placeholder contact info shown live** — `pages/Contact.tsx` and `hooks/useSiteSettings.ts` display `+355 69 XXX XXXX` as the WhatsApp number.
- **Google Analytics fires nowhere** — `index.html` uses `G-XXXXXXXXXX`.
- **Fake online counter** — `CommunityChat.tsx` `Math.floor(Math.random()*17)+18`, refreshed every 45s. Presentational lie.
- **Services page is static** — `pages/Services.tsx` has a hardcoded `services` array with no backing table.
- **Booking has no ownership on the anon path** — the RLS insert policy for guests requires `user_id IS NULL`; signed-in users' bookings only carry `user_id` if `BookingModal` sets it. Worth verifying end to end before claiming "my bookings" is complete.
- **Reviews unproven** — `reviews` table has 0 rows; `ReviewSection.tsx`'s booking-verification gate has never run against real data.

## WHAT IS MISSING

- **Payments** — no Stripe/Paddle. "Book" produces a pending row and an email; no money moves.
- **Booking status workflow** — owners can see bookings but there is no confirm/reject UI in `OwnerDashboard.tsx`; status never leaves `pending`.
- **Availability calendar** — no blocked dates on accommodations; double-booking is possible.
- **Accommodations have no public surface** — 7 rows, owner-created, but no `/accommodations` route and no listing page. Owners publish into a void.
- **Admin review of partner applications** — rows are written but there's no admin UI reading `partner_applications`.
- **Wishlist, referrals, blog/SEO content** — listed in `.lovable/plan.md`, never started.
- **Code splitting** — `App.tsx` imports all 20 pages eagerly; no `React.lazy`. Every visitor downloads AdminPanel + OwnerDashboard.
- **React Query** — installed and provider-mounted, used for nothing. All fetching is raw `useEffect`.

## DATABASE STATUS

| Table | Rows | Frontend status |
|---|---|---|
| `destinations` | 6 | Connected (list, detail, home grid, admin) |
| `tours` | 12 | Connected (list, detail, home section, admin) |
| `guides` | 6 | Partially — `/guides` and `/guide/:id` connected; **homepage `GuidesGrid.tsx` hardcoded** |
| `events` | 4 | Connected |
| `accommodations` | 7 | Connected in OwnerDashboard only; **no public page reads it** |
| `bookings` | 2 | Connected (create, my-bookings, owner, admin) |
| `reviews` | 0 | Connected in code, never exercised |
| `profiles` | 3 | Connected |
| `profile_contact` | 0 | Connected in `Profile.tsx`, unused in practice |
| `user_roles` | 4 | Connected via `useAuth` |
| `chat_messages` | 5 | Connected + realtime |
| `site_settings` | 8 | Connected via `useSiteSettings`, but defaults still placeholders |
| `partner_applications` | 0 | Write-only; no admin read UI |

## SECURITY ISSUES

- **`bookings` policy sprawl** — 9 overlapping policies, two duplicate admin pairs ("Admin can view all bookings" and "Admins can view all bookings"). Also `Users can view own bookings` includes `OR (user_id IS NULL)`, meaning **any authenticated user can read every guest booking** — names, emails, phone numbers. This is a real PII leak.
- **`send-booking-email` has `verify_jwt = false`** (`supabase/config.toml`) — anyone can POST arbitrary payloads and make your Resend account send mail. No rate limit, no origin check.
- **`chat_messages` publicly readable/writable by `anon`** — accepted by design, but there's no rate limiting or profanity/spam control; a script can flood it.
- **19 `as any` casts in `AdminPanel.tsx`** plus 4 in `CommunityChat.tsx` — these bypass generated types on admin write paths, so a schema change silently breaks writes rather than failing at compile time.
- **`profiles` readable by `anon`** (name/avatar only) — acceptable, PII already split into `profile_contact`.

## NEXT 5 ACTIONS

1. **Fix the guides leak-through**: replace the hardcoded array in `GuidesGrid.tsx` with a `guides` query so homepage links resolve.
2. **Close the bookings PII hole**: drop the `OR (user_id IS NULL)` clause and dedupe the redundant admin policies on `bookings`.
3. **Make Contact and Newsletter real**: add `contact_messages` and `newsletter_subscribers` tables, wire both forms, drop the fake `setTimeout`s.
4. **Ship the owner booking workflow**: confirm/reject buttons in `OwnerDashboard.tsx` with status transitions, so bookings stop dying at `pending`.
5. **Production comms**: verified Resend domain for `send-booking-email` (+ `verify_jwt` or a shared-secret check), real WhatsApp number in `site_settings`, real GA4 ID in `index.html`.

Bottom line: the marketplace content layer got fixed since the last audit — destinations, tours and events are genuinely database-driven now. What remains is that **nothing converts**: no payments, no booking confirmation, no working contact channel, undeliverable email, and a homepage guides section that 404s on click.
