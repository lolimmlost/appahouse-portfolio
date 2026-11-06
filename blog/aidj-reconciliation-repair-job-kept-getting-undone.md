---
title: "The Repair Job That Kept Getting Undone"
subtitle: "Six weeks of AIDJ's library reconciliation: a background job that didn't run, then ran and fixed nothing, then fixed things that got un-fixed"
date: "2026-11-06"
excerpt: "AIDJ's reconciliation job exists to heal song IDs that Navidrome changes behind my back. Every time I fixed it, it found a new way to do nothing, or to do the wrong thing confidently."
tags: ["aidj", "navidrome", "self-hosted", "debugging", "war-stories"]
author: "Juan"
category: "News"
featuredImage: ""
published: false
readTime: "8 min read"
---

Here's the problem in one sentence: **when a music file gets retagged, Navidrome gives it a new ID, and everything AIDJ knew about the old ID points at nothing.**

Your like, your playlist slot, your plays, the AI DJ's feedback. All attached to an ID that now belongs to a ghost. AIDJ has a job for this called **library reconciliation**. Every 6 hours it finds dead IDs, finds the same song in the library under its new ID, and moves everything over.

It sounds like a chore you write once. It took me six weeks, and the job lied to me at every step. Here's every step.

## Lie 1: "It runs every 6 hours"

It didn't. The 6-hour timer was armed by a Vite plugin, and **Vite plugins only run in dev.** In production nothing ever started it.

For months I'd believed "reconciliation just never runs", and I was right, for the dumbest reason. The fix was a boot hook in `server.ts` that finds the owner account and starts the scheduler, and never blocks startup if it fails.

## Lie 2: "It runs. It's fine."

Once it ran on prod, I looked at the last result:

```
checkedIds: 735, deadIds: 7, notFound: 7, remapped: 0
missingFromLibrary: 7 x { artist: "Unknown", title: "Unknown", source: "playlist_songs" }
```

Seven dead songs. Zero healed. All seven named "Unknown – Unknown".

Here's why. A dead Navidrome ID doesn't resolve anymore, so the only thing left that says what the song *was* is the cached "Artist - Title" string on the row that references it. The feedback query selected that string. The playlist query didn't. It selected only the song ID, and the loop hardcoded empty artist and title for every playlist ghost. Empty strings then failed the "nothing to search with" guard, and the song was reported missing **without a single library lookup**.

The replacement was sitting right there in the library. Nobody asked.

**A job that reports "missing" for things it never looked for isn't reporting. It's guessing.**

## Lie 3: "Artist - Title" is a format

To search, you have to parse "Artist - Title". AIDJ had **three different parsers** for that string, and they disagreed:

- Two of them took everything between the first and second " - ". *Song - Live at Wembley* became *Song*.
- YouTube rips came in doubled: "Blair Muir - Blair Muir - Divine…". The listening charts were proudly showing the artist's name as the song title.
- And rows that couldn't be parsed came out as the word **"Unknown"**, a string, which defeats every `if (!artist)` check downstream.

Now one module owns both directions. One reader keeps a title's own " - " intact, undoubles the YouTube shape only when the title really does repeat the artist, and returns *empty*, never "Unknown". One writer refuses to write the doubled shape in the first place.

Then I pointed reconciliation at it. My library had **35 persistent ghosts**, every one playlist-only, unplayable and recoverable. A dry run found matches for 29 of them, up from zero. The deployed fix healed 28. The rest were stuck on "(Official Video)" style suffixes, which are still a thing.

## Lie 4: "Healed"

Two days later I found out the heal didn't stick.

Ten of my playlists are **mirrored** to Navidrome so they show up in other apps. Reconciliation fixed the song ID in AIDJ's copy of the playlist. Playlist sync, on its next run, treated Navidrome as the source of truth: delete all local rows, re-insert Navidrome's. Navidrome had never heard about the new ID.

So the song either reverted to the dead ID or vanished from the playlist completely. Two subsystems treated opposite sides as the truth for the same rows. **Reconciliation wrote local. Sync overwrote local.** Each one was correct on its own.

## Lie 5: "Dead"

The scariest one was a near-miss.

During a Navidrome library scan, files in a folder being rescanned briefly read as missing. So songs that were in the middle of being retagged, and would *keep* their IDs, looked dead. Reconciliation would have repointed them onto whatever the matcher found.

The example that made my stomach drop: Deep Sea Arcade's *Outlaw*. Liked, in 2 playlists, 7 plays. The duration fallback had a match ready: Terror Reid, *Outlawz*.

On prod, the same day: **165 songs read as dead mid-scan. 8 after it finished.**

So now it never repoints while Navidrome is scanning. And before *each* repoint it re-checks two things: is a scan running now, and does this ID resolve and stream after all? If it streams, leave it alone and count it as revived.

**A reconciliation job that's wrong confidently is worse than one that does nothing.**

## Lie 6: "Navidrome is scanning"

Then every run started skipping.

The new scan check was now the *first* Navidrome call of a run. Navidrome calls are signed with a cached token that stays empty until something logs in. So the very first request got "Wrong username or password", my code read "can't get scan status" as "probably scanning, skip", and it skipped. Every run. Forever.

The safety check was so safe it disabled the job. The fix was logging in first. An idle dry run after that: **4,609 IDs checked, 8 dead, 0 wrongly repointed.**

## The one operation

By now "move a song's references from the old ID to the new one" was written in four places: inside reconciliation's loop, and by hand in SQL everywhere else. Three tables, no transaction. A unique-key clash was handled by catching the error and deleting the row.

Now there's one function, `repointSongId`, and it owns every song-ID move:

- **One transaction** over likes, feedback, playlist rows, listening history and scores. Collisions are detected up front and *merged*, because a unique violation would abort the whole transaction.
- Playlist rows also get their cached "Artist - Title" rewritten, by the one writer.
- After commit, it moves the Navidrome star, unstars the ghost, and **rewrites each mirrored playlist from AIDJ's order**, so the heal from Lie 4 finally sticks on both sides.

And a script, `repoint-song`, wraps it for the times I need to fix one song by hand. It refuses a new ID that isn't a live Navidrome song. Its `--reconcile --dry-run` mode doubles as a drift check across every playlist.

## Lie 7: "Not initialized"

Last one, and it's a classic.

The Tasks page has a button to run reconciliation now. On prod it threw `Not initialized` every time, while the scheduled runs worked fine.

Prod loads the reconciliation module **twice**. `server.ts` imports it from source and starts the scheduler at boot. The API routes run from the bundled server build, which has *its own copy* of the module, and its own singleton manager that nobody ever initialized. Two managers, one asleep, and the button talked to the sleeping one.

The fix: park the manager on `globalThis` so both copies share one, the same trick AIDJ already uses for its WebSocket bridge. The test re-imports the module twice and asserts there's one manager. It fails on the old code.

## What ties them together

Every one of these was the job telling me something comfortable that wasn't true:

- "It runs." It didn't.
- "Missing." It never looked.
- "Healed." It got reverted.
- "Dead." It was mid-scan.
- "Scanning." It wasn't logged in.
- "Not initialized." There were two of it.

The fixes that stuck all have the same shape. **Re-check reality right before you write.** **Have exactly one place that does the dangerous thing.** **Make "I don't know" a loud state, not a skip.**

There's still one open, and it's the nastiest: a retag plus a search miss can make a like silently disappear, with nothing left in any report to say it ever existed. That's the next post.
