---
title: "I Built a DJ Booth in a Browser Tab. Then I Had to Make It Survive My Phone."
subtitle: "The AIDJ Transition Lab: locking the next song, blind A/B, and a 94-song set that taught me to cut harder"
date: "2026-11-06"
excerpt: "The Transition Lab started as a page for comparing two transitions. A week later it was mixing two-hour sets live, recording them, and re-rendering them offline, and my phone kept killing it."
tags: ["aidj", "music", "web-audio", "dj", "self-hosted", "war-stories"]
author: "Juan"
category: "News"
featuredImage: ""
published: false
readTime: "8 min read"
---

The featured mix on the AIDJ dashboard right now is called **Live Set 2**. Two hours, 94 songs, played live on November 1st from a browser tab.

The sentence I want to be true is "the AI mixed it." The honest one is better. I built a DJ booth into AIDJ, played a two-hour set on it, wrote down everything that sounded wrong while it played, and then made the booth re-render the whole set offline with those mistakes fixed.

This is how a page for comparing two transitions turned into that.

## It started as a test bench

AIDJ already crossfaded songs. What it couldn't do was tell me whether one transition was *better* than another. So I built `/dj/lab`, an admin-only page with two decks, in-browser analysis (tempo, a kick-attack grid, where the drops are), a planner, and blind A/B. Same two songs, two transitions, you don't know which is which, pick one.

Then I added one feature that changed what the page was: **the live decks lock the next song.** While A plays, the Lab picks B, analyses it, plans the transition against A's grid and holds it. When the moment comes, B comes in on its drop. Then B becomes A, and it locks the next one.

That isn't a test bench anymore. It's a continuous mix.

## The bass kill that wasn't

First lie I caught: the bass kill.

A DJ transition lives or dies on the low end. You take A's bass out right before B's drop, so two kick drums don't fight. My band split worked by subtraction: take the full signal, subtract the filtered parts, and what's left is the band. On paper, clean.

In practice, killing the bass took it down about **2 dB**. You can't hear 2 dB in a club. It sounded like nothing happened, because nothing did.

I rebuilt the split as proper Linkwitz-Riley crossovers. Now a kill is about **38 dB down at 50 Hz**, and the bands sum flat when they're open. **If a control sounds like it does nothing, measure it before you tune around it.** I'd been tweaking transition lengths to compensate for a knob that didn't work.

## My phone versus a DJ set

I wanted to DJ from my phone, so the Lab had to survive iOS. It didn't.

Sets died after a while. No error, no crash dialog, the page just reloaded mid-mix. So I wrote a memory test: decode Beethoven (734 seconds at 32 kHz stereo, about 188 MB decoded per load) over and over.

- New decoder per load, never played: **20 out of 20.**
- Same, but played for two seconds through a deck, then disposed: **the page died at round 7.**

iOS keeps the decoded audio of *every deck that has ever played*, even after you've thrown the deck away. A two-hour set is a lot of decks. The fix was one line in spirit: when a deck is disposed, set its source's buffer to `null`, so the browser can actually let go.

That's one fix. Getting sets to survive also took:

- 32 kHz decks
- optional mono
- a new decoder for every load
- pausing the crate scan mid-set
- keeping whole DJ sets out of the crate, so I wasn't decoding two-hour files to preview them
- downloading audio over XHR
- bringing audio back after an interruption

And because "the page just reloaded" is useless as a bug report, I added a **flight recorder**. Lab events and a heartbeat go to the server log as `🎛️ [LAB …]` lines. If a page dies mid-set, the next load reports it. **You can't fix a crash that leaves no body.**

## Auto-lock and the burning crate

Auto-lock picks the next song from the crate: close in tempo, compatible, not played yet. When a lock failed, it tried another song. When that failed, another. With a strict enough tempo window it would chew through the entire crate, re-locking song after song (#371), and the set would end.

The fix was a fallback order instead of a cliff:

1. **Inside the tempo window.** A slider now, ±4 % by default, and it can be asymmetric.
2. **Stretch** up to ±8 %.
3. **Tempo jump.** B plays at its own tempo, and that becomes the new set tempo.

Half- and double-tempo matches count too. A set now gets *weirder* before it ends. That's the right trade.

## Liking a transition

Once the Lab was mixing for real, the most useful button was 👍 on a transition.

A 👍 on A → B means the next time A plays, auto-lock queues B first, as long as it can stretch to it. It never forces a tempo jump for a liked pair. A 👎 means auto-lock never picks B after A again. Liked pairs that chain (A → B, B → C) play as a run.

Liked *songs* get a small head start too: they rank as if they were 1 % closer in tempo. Before that, at 126 BPM an unliked 127 always beat a liked 128, which is technically correct and musically wrong.

## Two hours, 94 songs, and "we need harder"

On November 1st I played a two-hour set on the Lab and left myself notes the whole time.

The 8-bar chains, where B builds for eight bars and drops on the bar, landed every time. My notes say "so clean", "wild", "great".

The 16-bar swaps the tempo window kept picking did not. "Too lax." "Kinda lost energy." "Should not be a slow sweep." And then the note that became a commit: **"we need harder."**

So Hard is now the default. Builds of 8 bars at most, and a 2-bar bass cut before B's drop (4 above 150 BPM). B's drop still lands exactly where it would. Only the build and the cut get shorter.

**A two-hour set told me more than a week of A/B clips.** Blind A/B is great at "which of these two is better". It is useless at "this is getting boring", and that's the thing that actually ruins a set.

## Recording it, then fixing it after the fact

A set that only exists while you're playing it is a rehearsal. So I added **● Rec**.

It records the Lab's master output, after the compressor and soft clip, so it's exactly what you heard. Recording runs through MediaRecorder (AAC on iOS, Opus elsewhere, 192 kbps), uploading in 10-second chunks as it plays, so the phone never holds the set. If the network drops, chunks retry in order. When the set ends, the server joins the chunks and stores the tracklist, with every song at the second it started.

First deploy, I wrote recordings to a path the container didn't persist. A redeploy would have quietly deleted every set. They live on the app's persistent mount now. **Every "it saved!" deserves the question "where?"**

Then the part I'm proudest of. Every saved set keeps the cues the engine decided live: where each build was held, each tempo jump, the beat-lock shift each B was placed with. With those, a tool called `lab-render` drives headless Chromium through **the Lab's own engine** and re-renders the set offline in an `OfflineAudioContext`, a window at a time, joined in the quiet between transitions. A 3-song test rendered 7.3 minutes of audio in 13 seconds, at the live level, with no clicks at the joins.

That's how **Live Set 2** got to the dashboard: rendered offline from the cues the set saved, every song at the second it played live.

And because it's the same engine, I can now fix what I flagged in a re-render. You give the render the number of a song in the tracklist:

- `--hard <n>` gives the transition into that song the new Hard default. That's for spots like 27:00 in Live Set 2, where *Free Your Mind* → *Take You There* was a 16-bar swap I'd called "a low energy transition".
- `--cut <n>` turns it into a hard cut-over on the drop. At 32:00, *Feels Better* → *Welcome Home* left about 7 seconds at −20 dB. My note: "should be a hard cut over."

Everything after a fixed transition keeps its live timing, so one bad blend no longer means re-recording two hours.

My honest review of the offline renders: "still not quite as hot as live." Which is why Rec exists. The recording *is* the live set.

## What ties it together

Every big fix in the Lab came from the same move: **stop trusting the control and listen to the output.**

The bass knob said "killed". The output said 2 dB. The phone said "fine" until it reloaded. Auto-lock said "trying". The crate said "empty". The A/B votes said the transitions were good. Two hours of actually playing said they were boring.

The Lab started as a place to compare two transitions. It turned into a place where the set itself is the test.

Next up: a set that has an arc, building slowly to the drop and cooling down at the end, instead of just the next good song, and a headphone cue so I can preview the next transition without stopping the room.
