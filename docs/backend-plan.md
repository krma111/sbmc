# SBMC Lead Backend Plan

> **Goal:** Never lose a lead. Capture and follow up on every customer — even when they
> abandon the form mid-way, skip WhatsApp, never message back, or say they are not interested.

## 1. The Problem Today

- Leads are stored in `localStorage` → visible only inside the visitor's own browser.
- If the customer does not click WhatsApp (or does not reply), the lead is invisible to SBMC.
- No re-engagement possible for silent customers.

## 2. The Fix — Capture Layers

| Layer | What is captured | When |
|---|---|---|
| L1 — Progressive step saves | Every step answer (name → category → location → challenge → phone + consent) saved server-side as the user advances | Each `Next` click, keyed by a persistent `visitorId` |
| L2 — Final submit | Full lead + recommendation + lead code | Form completed |
| L3 — WhatsApp intent | `whatsapp_click` event + status → `whatsapp_started` | Result screen button click |

A customer who types name + phone but never clicks WhatsApp is already a **full lead** in the dashboard.

## 3. Lead Status Flow

```
form_started ─▶ step_1..5_saved ─▶ completed ─▶ whatsapp_started ─▶ whatsapp_replied ─▶ interested / booked
                                         │                         └─▶ no_response ─▶ silent
                                         └─▶ abandoned (no submit) ─▶ silent
not_interested (owner marks, with reason) ─▶ nurture list
```

## 4. Follow-up Engine

Runs for every lead, **auto-pauses the instant the customer replies**.

| T+ | Action |
|---|---|
| +0 min | Lead appears in `/admin`, high-value lead highlighted |
| +2 hrs | WhatsApp / SMS — reminder with recommendation |
| +24 hrs | WhatsApp — value nudge + free sample offer |
| +3 days | WhatsApp — success example, different angle |
| +7 days | WhatsApp — final, no-pressure |
| +30 days | Silent → **nurture list** (monthly tips) |

### "Did not want the services" handling

- Owner tags lead `not_interested` + reason (price / timing / other need).
- All follow-ups stop immediately.
- Lead moves to **nurture**; monthly value content, easy unsubscribe.
- Weekly summary of `not_interested` reasons.

## 5. Delivery — Two Modes

### Mode A: Manual fallback (works today, zero external setup)
- `/admin` computes "follow-ups due" and provides one-click `wa.me` links with the
  follow-up message pre-filled in the customer's preferred language.
- Sending happens from the owner's WhatsApp; the dashboard records `lastFollowUpAt`.
- Fully functional with no API keys.

### Mode B: WhatsApp Business Cloud API (upgrade later)
- Supabase Edge Function on cron sends follow-ups automatically.
- Verifies delivered/read status; auto-pauses on reply.
- Requires Meta developer account + SBMC WhatsApp business number.

## 6. Admin Dashboard (`/admin`, password-protected)

- **Live queue** — all leads including abandoned-at-step-X.
- **Follow-up inbox** — "who needs a follow-up today" + one-click send.
- **Lead detail** — answers, recommendation, timeline, notes, tags.
- **Hot alerts** — new lead highlighted; (later) WhatsApp/email notification.
- **Status actions** — `replied`, `interested`, `booked`, `not_interested` + reason, `snooze`, `delete`.
- **Exports** — CSV / JSON.
- **Privacy** — delete-on-request, retention notice.

## 7. Data Model (server store)

Stored in `data/leads.json` today (git-ignored); schema mirrors the Supabase tables:

- `leads` — `id, leadCode, visitorId, businessName, businessCategory, cityArea, biggestChallenge,
  whatsappNumber, preferredLanguage, recommendedService, recommendedPrice, recommendationReason,
  consent, status, source, currentStep, createdAt, updatedAt, whatsappClickedAt,
  lastFollowUpAt, followUpCount, notInterestedReason, snoozedUntil, notes, tags`
- `events` — `type, leadId, visitorId, timestamp, data` (step saves, submit, wa click, status changes, follow-ups)
- `settings` — follow-up timeline + message templates (EN/HI)

## 8. Supabase Migration Path

1. Create project (Mumbai region), run schema (see below).
2. Replace `src/lib/server/store.ts` (file store) with Postgres client.
3. Keep `/admin` — swap `ADMIN_PASSWORD` for Supabase Auth.
4. Move follow-up computation into an Edge Function + `pg_cron`.
5. Import existing `data/leads.json` into the database.

### Supabase schema (target)

```sql
create table leads (
  id            text primary key,
  lead_code     text unique not null,
  visitor_id    text,
  business_name text not null,
  business_category text not null,
  city_area     text,
  challenge     text,
  whatsapp      text,
  preferred_language text default 'en',
  recommended_service text,
  recommended_price integer,
  recommendation_reason text,
  consent boolean default false,
  status text default 'form_started',
  source text default 'preview',
  current_step int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  wa_clicked_at timestamptz,
  last_follow_up_at timestamptz,
  follow_up_count int default 0,
  not_follow_reason text,
  snoozed_until timestamptz,
  tags text[]
);

create table lead_events (
  id serial primary key,
  lead_id text references leads(id) on delete cascade,
  visitor_id text,
  type text not null,
  data jsonb,
  created_at timestamptz default now()
);

create table follow_ups (
  id serial primary key,
  lead_id text references leads(id) on delete cascade,
  scheduled_at timestamptz not null,
  step int not null,
  channel text not null default 'whatsapp',
  status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz default now()
);
```

RLS: `select`/`update` only for the admin role.

## 9. Costs

- Current (file store + manual follow-ups): **₹0**.
- Supabase free tier: $0; paid ~$25/mo for 500MB+.
- WhatsApp Cloud API: free tier (1,000 conversations/month); Twilio ~₹0.35–0.5/message.

## 10. Build Phases

1. Write plan doc                      ✅ done
2. Server-side file store + API routes  ✅ done
3. Form/Result wired to API (fallback)  ✅
4. `/admin` dashboard                   ✅
5. Follow-up inbox + statuses           ✅
6. Supabase swap + WhatsApp API         ⬜ later