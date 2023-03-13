import tstring from "#lib"
import time from "./time.mjs"

export const test = ({ Section, Assert }) => {
    Section `single times`
    {
        const times = [
            tstring.parse("1ms"),
            tstring.parse("10s"),
            tstring.parse("23m"),
            tstring.parse("31h"),
            tstring.parse("100d"),
            tstring.parse("8w"),
        ]
        Assert(times)
            `0`.eq(1 * time.ms)
            `1`.eq(10 * time.s)
            `2`.eq(23 * time.m)
            `3`.eq(31 * time.h)
            `4`.eq(100 * time.d)
            `5`.eq(8 * time.w)
    }

    Section `mixed times`
    {
        const times = [
            tstring.parse("1m 14s 523ms"),
            tstring.parse("2h 1m"),
            tstring.parse("2d 50m"),
            tstring.parse("4w 1d 6h"),
        ]
        Assert(times)
            `0`.eq(1 * time.m + 14 * time.s + 523 * time.ms)
            `1`.eq(2 * time.h + 1 * time.m)
            `2`.eq(2 * time.d + 50 * time.m)
            `3`.eq(4 * time.w + 1 * time.d + 6 * time.h)
    }

    Section `out of order times`
    {
        const times = [
            tstring.parse("523ms 1m 14s"),
            tstring.parse("15s 2h 1m"),
            tstring.parse("50m 2d"),
            tstring.parse("1d 4w 6h"),
        ]
        Assert(times)
            `0`.eq(1 * time.m + 14 * time.s + 523 * time.ms)
            `1`.eq(2 * time.h + 1 * time.m + 15 * time.s)
            `2`.eq(2 * time.d + 50 * time.m)
            `3`.eq(4 * time.w + 1 * time.d + 6 * time.h)
    }

    Section `duplicate times`
    {
        const times = [
            tstring.parse("1m 2m"),
            tstring.parse("15s 35s"),
            tstring.parse("1d 3h 5h"),
            tstring.parse("2w 4w 3s 1h 15m 5h")
        ]
        Assert(times)
            `0`.eq((1 + 2) * time.m)
            `1`.eq((15 + 35) * time.s)
            `2`.eq(1 * time.d + (3 + 5) * time.h)
            `3`.eq(
                (2 + 4) * time.w
                + 3 * time.s
                + (1 + 5) * time.h
                + 15 * time.m
            )
    }

    Section `ignore non time`
    {
        const times = [
            tstring.parse("duration: 15m"),
            tstring.parse("blep 1s more 4m")
        ]
        Assert(times)
            `0`.eq(15 * time.m)
            `1`.eq(1 * time.s + 4 * time.m)
    }

    Section `no times`
    {
        const time = tstring.parse("nothing valid")
        Assert(time).eq(0)
    }
}
