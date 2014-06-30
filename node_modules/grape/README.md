grape
=====

## What

A port of Tape that works how I expect it to work

## Why

~~Tape [https://github.com/substack/tape] is an awesome, simple test lib written by @substack, but it doesn't work exactly as I would expect.~~

~~in Tape, if you called t.plan(2), only asserted one thing, then called t.end(), it passes.~~

### NOTE: This is apparently fixed now, so there should be little difference between grape and tape. ###

Grape aims to be fairly swap-out-able in place of Tape (I'm lazy and all my tests are in Tape). The results file is a slightly rewritten copy-pasta of @substack's version.

Currently Grape has the same API as Tape in terms of assersions, but isn't quite the same ata deeper level, as a test instance does not inherrit from EventEmitter at the moment.

## Stability

Grape was whipped up in a few hours, but it seems to work when used normally. Pull requests welcome.
