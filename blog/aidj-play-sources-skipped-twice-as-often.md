---
title: "AI DJ's Picks Get Skipped Twice as Often as Mine. That's the Useful Part."
subtitle: "Six months of tagging every AIDJ play with where it came from, and the month the data told me something I didn't want to hear"
date: "2026-11-06"
excerpt: "Since May, every play in AIDJ carries a source: manual, AI DJ or radio. The skip rates were what I expected. The month-by-month chart was not."
tags: ["aidj", "music", "analytics", "recommendations", "self-hosted", "war-stories"]
author: "Juan"
category: "News"
featuredImage: ""
published: false
readTime: "6 min read"
---

In May I added one column to AIDJ's listening history: `source`. Every play now says where it came from. **manual** means I picked it, from a playlist, an album or search. **ai_dj** means the AI DJ put it in the queue. **radio** means a radio station.

It's the most boring migration I've shipped, an `ADD COLUMN IF NOT EXISTS`. It's also the only reason I can answer "is the AI DJ any good?" with something other than vibes.

## Why one column

Before the tag, every play looked the same. The feedback charts couldn't tell a song I chose from a song the AI DJ chose from a song a library sync replayed in the background. Library-sync plays were polluting the charts I used to judge recommendations.

So: tag every play at scrobble time, and leave library sync out of the feedback charts. Since May 13, AIDJ has recorded **6,160 tagged plays**. Here's what they say.

## The numbers

| Source | Plays | Finished | Skipped | Distinct songs | Distinct artists |
|---|---|---|---|---|---|
| manual | 4,996 | 82.9 % | 17.0 % | 1,318 | 773 |
| radio | 356 | 78.1 % | 21.9 % | 258 | 150 |
| AI DJ | 808 | 66.6 % | **33.4 %** | 424 | 244 |

**I skip the AI DJ's picks about twice as often as my own.** One in three.

My first reaction was mild offence on its behalf. My second was: good. That's the point.

## Skips are the signal

When I pick a song, I already know I want it. A 17 % skip rate on my own choices is mostly me changing my mind. When the AI DJ picks a song, it's *guessing*, and the skip is the answer to the guess.

AIDJ uses that answer directly. Skip an AI DJ pick and it fires a `thumbs_down` with source `ai_dj_skip`, and bumps a consecutive-skip counter the DJ adapts to. Listen through one and it fires a `thumbs_up` with source `ai_dj_listen_through` and resets the counter. A DJ with a 0 % skip rate would be playing my favourites back at me, and I don't need software for that.

The other column I like is how wide it goes:

- **Manual:** 4,996 plays over 1,318 songs. About 3.8 plays per song. I replay my favourites.
- **AI DJ:** 808 plays over 424 songs. About **1.9 plays per song.** It digs.

**A recommender that never gets skipped isn't recommending. It's repeating.**

Radio sits in between on both: skipped more than my picks, less than the DJ's, and narrower. That's about right for "more of this, please".

## The chart I didn't want

Then I split it by month and looked at the AI DJ's share of plays:

| Month | AI DJ share |
|---|---|
| June | 23.6 % |
| July | 21.4 % |
| August | 18.0 % |
| September | **2.4 %** |
| October | **1.8 %** |

From about one play in four to one in forty. Week by week it's starker. The AI DJ's last busy day was **August 26th** (41 plays). From September 28th to October 18th it logged **zero**. That's three weeks, including my single busiest week of listening on record: 686 plays, every one of them manual.

My first assumption was a bug. AIDJ decides a play is `ai_dj` by checking whether the song ID is in the queue the AI DJ built, or among the songs it recommended in the last 8 hours. If either of those broke, AI DJ plays would quietly turn into "manual" ones.

So I went looking. Neither of those checks changed between August and October. The on/off setting is saved and survives a reload, and that code hadn't been touched since August 21st. I couldn't find a single commit in that window that would make the AI DJ stop adding songs, or stop being counted.

Which leaves the boring explanation, and I think it's the right one: **I stopped turning it on.** I honestly don't remember deciding to. The data can't tell me why, only that from late August my listening went through playlists, albums and shuffle instead. As far as I can tell, the DJ didn't break. I just wasn't using it.

## And then I started using something it can't see

October has a second twist. I played the AIDJ mixes and live sets a lot, and from October 29th I was mixing in the DJ Lab itself.

The listening history barely knows. Only 13 October plays match a "Live Set" title, all logged as manual, and **the Lab doesn't write to listening history at all.** My logged plays fell from hundreds a week to a few dozen, not because I stopped listening, but because I moved to the parts of the app the instrument wasn't pointed at.

**The data was measuring the feature I'd stopped using, and was blind to the one I'd started using.**

## The tag isn't honest enough yet

Even when I *am* using the AI DJ, the attribution has a known hole (#252). It works by song ID, not by how the song got into the queue:

- **False positives.** A song the AI DJ recommended in the last 8 hours, which I then play from a playlist, counts as `ai_dj` and feeds the DJ feedback it didn't earn.
- **False negatives.** An AI DJ pick still sitting in the queue after a reload, or more than 8 hours later, counts as `manual`.
- **Mixed queues.** The AI DJ inserts into playlist, radio and shuffle queues, and the history can't say which one.

The fix is to tag the *queue entry* when the AI DJ inserts it, carry that tag through queue sync and reloads, and record the context it was inserted into. Then a skip on an AI DJ pick inside a playlist and a skip on one inside radio stop being the same number.

## What ties it together

One column turned "is the AI DJ any good?" into numbers: a one-in-three skip rate that's doing its job, and a DJ that digs twice as wide as I do.

It also showed me the limits of a tag. It tells you *what* happened, not *why*. When the chart fell off a cliff, the tag couldn't tell "broken" from "unused". I had to go and read the code to find out it was me. And the tag can only describe the places it's recorded. The moment I moved somewhere it isn't, it reported silence and called it a trend.

Next up: tag the queue entry instead of the song ID, and let the Lab's sets count as plays, so the next time this chart moves, it's because I did.
