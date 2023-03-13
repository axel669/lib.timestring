import tstring from "#lib"

import time from "./time.mjs"

export const test = ({ Section, Assert }) => {
    Section `format: short`
    {
        const times = [
            tstring.stringify(5 * time.m),
            tstring.stringify(4 * time.h + 1 * time.d),
            tstring.stringify(5 * time.ms + 3 * time.w + 15 * time.s),
        ]
        Assert(times)
            `0`.eq("5m")
            `1`.eq("1d 4h")
            `2`.eq("3w 15s 5ms")
    }

    Section `format: long`
    {
        const options = { format: "long" }
        const times = [
            tstring.stringify(5 * time.m, options),
            tstring.stringify(4 * time.h + 1 * time.d, options),
            tstring.stringify(5 * time.ms + 3 * time.w + 15 * time.s, options),
        ]
        Assert(times)
            `0`.eq("5 minutes")
            `1`.eq("1 day, 4 hours")
            `2`.eq("3 weeks, 15 seconds, 5 milliseconds")
    }

    Section `show0s: true, format: short`
    {
        const options = { show0s: true }
        const times = [
            tstring.stringify(5 * time.m, options),
            tstring.stringify(4 * time.h + 1 * time.d, options),
            tstring.stringify(5 * time.ms + 3 * time.w + 15 * time.s, options),
        ]
        Assert(times)
            `0`.eq("0w 0d 0h 5m 0s 0ms")
            `1`.eq("0w 1d 4h 0m 0s 0ms")
            `2`.eq("3w 0d 0h 0m 15s 5ms")
    }

    Section `show0s: true, format: long`
    {
        const options = { format: "long", show0s: true }
        const times = [
            tstring.stringify(5 * time.m, options),
            tstring.stringify(4 * time.h + 1 * time.d, options),
            tstring.stringify(5 * time.ms + 3 * time.w + 15 * time.s, options),
        ]
        Assert(times)
            `0`.eq("0 weeks, 0 days, 0 hours, 5 minutes, 0 seconds, 0 milliseconds")
            `1`.eq("0 weeks, 1 day, 4 hours, 0 minutes, 0 seconds, 0 milliseconds")
            `2`.eq("3 weeks, 0 days, 0 hours, 0 minutes, 15 seconds, 5 milliseconds")
    }

    Section `sep: |`
    Section`show0s: true, format: short`
    {
        const options1 = { sep: "|" }
        const options2 = { sep: "|", show0s: true }
        const times = [
            tstring.stringify(5 * time.m, options1),
            tstring.stringify(4 * time.h + 1 * time.d, options1),
            tstring.stringify(5 * time.ms + 3 * time.w + 15 * time.s, options2),
        ]
        Assert(times)
            `0`.eq("5m")
            `1`.eq("1d|4h")
            `2`.eq("3w|0d|0h|0m|15s|5ms")
    }

    const format = tstring.withOptions({
        returnError: true,
    })
    Section `invalid time`
    {
        const timestring = format(-1)
        Assert(timestring)
            (s => s instanceof Error).eq(true)
            `message`.eq("Time must be positive")
    }

    Section `invalid format`
    {
        const timestring = format(100, { format: "invalid" })
        Assert(timestring)
            (s => s instanceof Error).eq(true)
            `message`.eq(`"invalid" is not a valid format`)
    }
}
