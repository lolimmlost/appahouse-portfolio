---
title: "Eleven Fixes Nobody Will Notice (That's the Point)"
subtitle: "Two months of AIDJ polish: shuffles that weren't, scrobbles that didn't count, and a radio that deleted good songs"
date: "2026-11-06"
excerpt: "None of these made a changelog headline. Every one of them was AIDJ doing something slightly wrong, quietly, every day. Here's the cause behind each."
tags: ["aidj", "music", "pwa", "ux", "self-hosted", "war-stories"]
author: "Juan"
category: "News"
featuredImage: ""
published: false
readTime: "7 min read"
---

Back in May I wrote about five times the AIDJ UI lied to me. I thought that was a week. It turns out it's a genre.

Polish sounds like rounded corners. Most of mine was the app doing something slightly wrong, quietly, every day, in a way I'd stopped seeing. Here are eleven, with the actual cause, because the cause is always the interesting part.

## 1. Radio after a cold iOS launch deleted a good song

Open the PWA cold, tap a radio station, and sometimes the first song just disappeared from the queue.

The radio fetch takes about 4 seconds. By the time it called `play()`, iOS no longer considered it part of my tap and refused it. Stall recovery saw a song that wouldn't play and tried to rescue it. Its third attempt cleared the audio source with `src = ''`, which fires an error event. The song loader read that error as "this song is unavailable" and **removed a perfectly healthy song.**

Now the tap unlocks audio *before* the fetch. A refused `play()` isn't treated as a stall: it shows "Tap play to start" instead of burning recovery attempts that can't succeed. And recovery reloads with `load()`, so it never fakes an error.

**A "recovery" path that can't succeed shouldn't be allowed to cause damage while it tries.**

## 2. Unpaused, with a frozen clock

After a lock-screen audio blip, the player would say *playing*: not paused, buffered and ready. The clock never moved.

My stall watchdog was blind to it in two ways. Its interval read `isPlaying` once instead of subscribing, so for a whole session it could simply never start. And it stood down whenever the page was hidden, which is exactly when this deadlock happens. Now it subscribes, and it keeps checking for progress in the background.

## 3. Four shuffles

I had four shuffle implementations. The playlist, artist and album pages sorted with a random comparator, which is biased. Liked Songs had its own Fisher–Yates. Only the queue button bothered to separate artists. And radio replayed the same handful of songs.

Now there's one shuffle everywhere. Artists are spread evenly over actual positions, the biggest artist placed first so nobody gets squeezed into a burst. Albums are spread within an artist, and anything heard in the last 14 days goes at the end. On my real Liked Songs (473 tracks), "same artist within 5 songs" went from **9.7 to 0.0**.

Shuffle also stays on now, and keeps the original order so you can turn it off and get your list back.

## 4. Plays that never counted

A play counts for Navidrome after 50%. Except the 50% mark only *flagged* the song. The actual scrobble waited for the song to end or be skipped. So an iOS audio interruption or a killed app after 60% meant **the play never happened.**

Now it scrobbles the moment the threshold is crossed, with the old end-of-song path as a fallback that won't double-count. The threshold is a setting too: Settings → Playback → "Count a Play After", 10–100 %.

## 5. The Liked Songs radio that ignored my likes

"Liked Songs Radio" seeded from the collection's top 5 tracks by play count, then filtered out every track in the collection. With 477 liked songs, that meant the same five seeds every time: John Summit, Fleetwood Mac, and three Sade tracks. The queue had **zero liked songs**, and the station once opened on a Sade track I'd never liked.

Now seeds are sampled fresh each time: by artist, weighted by the square root of plays, one track per artist, 8 seeds for big collections. And playlist radio blends in the playlist's own tracks, 25–70 % depending on how much variety you ask for. Playlist radio sounds like the playlist now. Wild concept.

## 6. Updates that never arrived

The PWA has an update prompt. On iOS it never showed up. Two reasons:

- The server sent `sw.js` with a one-year immutable cache header, so anything in front of it could keep serving the old service worker forever.
- `sw.js` only changed when someone edited it, so app-only deploys never announced themselves.

Now `sw.js` and the manifest are no-cache, and the build stamps the commit SHA into `sw.js`, so every deploy changes its bytes and prompts. **If the update channel depends on a file nobody edits, you don't have an update channel.**

## 7. Links that forgot where you were going

Every protected page bounced logged-out visitors to a bare `/login`, and login always landed on `/dashboard`. So any link I sent someone (an album, a playlist, an invite) was lost the moment they had to sign in.

Now all 22 protected-route guards redirect to `/login?redirect=…`, through one helper instead of copy-pasted redirects. The target survives every login path: password, 2FA, GitHub and Google, signup. And the redirect only accepts same-origin app paths. No `//evil.com`, no backslash tricks, no `/api`, no loops back to the login page.

## 8. "Not in library" for 24 hours

Aurral, the service AIDJ asks about artists, wedges every week or two. When it did, artist search said "not in library", and **kept saying it for 24 hours after Aurral recovered.** A timed-out search was being treated as "no such artist" and cached.

Now only a search that actually answered with zero hits is a cacheable miss. A 3-second health probe runs first, so a wedge fails in about 3 seconds instead of two 10-second timeouts, and the UI says "restarting" instead of pretending the artist doesn't exist. **"I couldn't ask" and "the answer is no" are different answers. Don't cache the first one.**

## 9. No way to like a song on my phone

On phones the heart on a playlist row was hidden ("accessible via the menu on mobile"). The menu had no Like. So on the device I use most, there was **no way to like a song from a playlist.**

Also, only the song title was a play target, and at some widths the artist and album columns squeezed the title away entirely, leaving taps that did nothing. Now the heart is always there on phones (a 36 px target), the whole row plays on tap, and the title keeps a minimum width.

## 10. Tab titles

Small one. Every tab said "AIDJ". Now pages have real titles ("Liked Songs · AIDJ", "*Album* — *Artist* · AIDJ"), and while music plays the tab says **▶ Song · Artist**. It's the most-noticed change on this list, which says something about the rest of it.

## 11. Motion

View Transitions. Navigating fades only the main content: the sidebar, player and tab bar stay put. Tap the mini-player art and it morphs into the full-screen Now Playing artwork, then morphs back when you swipe down. Tap an album and its cover becomes the album header. Typing in search *doesn't* animate, because search-param-only updates are excluded.

This one is pure polish, and I'm not sorry.

## What ties them together

Nine of these eleven are the same bug wearing different clothes: **the app's idea of what happened wasn't what happened.**

- A refused `play()` became "unavailable".
- A frozen clock was "playing".
- Crossing 50% wasn't a play.
- A timeout was "no such artist".
- A deploy wasn't an update.
- A hidden heart counted as "accessible via menu".

None of that shows up in a demo. It shows up on day 40 of using your own app, in the car, on a phone.

Next up: making AI DJ's own plays report honestly too. It turns out I wasn't counting those right either.
