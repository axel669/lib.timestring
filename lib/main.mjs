/*md
[@] Home
# Timestring

Small library for parsing and generating simple timestrings.

## Installation
```bash
pnpm add @axel669/timestring
```

## Usage
*/

const units = [
    ["w", "week", 604800000],
    ["d", "day", 86400000],
    ["h", "hour", 3600000],
    ["m", "minute", 60000],
    ["s", "second", 1000],
    ["ms", "millisecond", 1],
]
const unitMS = units.reduce(
    (map, [key, _, ms]) => {
        map[key] = ms
        return map
    },
    {}
)
const formatTime = {
    long: (time, unit) => {
        const base = `${time} ${unit[1]}`
        if (time === 1) {
            return base
        }
        return `${base}s`
    },
    short: (time, unit) => `${time}${unit[0]}`,
}
const separator = {
    long: ", ",
    short: " ",
}

/*md
### parse(string)
Returns the number of milliseconds of the combined parsed time parts.\\
Time Part Format: `<time value><unit>` (`"5m"`, `"1w"`, `"150ms"`, etc)\\
The string can have any number of time parts, and time parts with the same unit
will be added together. Any part of the string that isn't a time part will be
ignored.

#### Example
```js
import tstring from "@axel669/timestring"

const duration = tstring.parse("15m 30s")
```
*/
const sum = (total, n) => total + n
const timeValue =
    match => unitMS[match.groups.unit] * parseInt(match.groups.time)
const parse = (str) =>
    [...str.matchAll(/\b(?<time>\d+)(?<unit>ms|s|m|h|d|w)\b/g)]
    .map(timeValue)
    .reduce(sum, 0)

/*md
### stringify(time, options)
Generates a time string from the time given, with options to control the output.

#### options

    #### options.format
    > default: `"short"`.
    The format to use for the units in the time string. Currently accepts
    `"short"` and `"long"`. Long format will use plurals when appropriate.
    ```js
    // "1s 337ms"
    tstring.stringify(1337)
    // "1 second, 337 miliseconds"
    tstring.stringify(1337, { format: "long" })
    ```

    #### options.returnError
    > default: `false`
    If `true`, stringify will return errors instead of throwing them.

    #### options.show0s
    > default: `false`
    If `true`, the output will include every unit the formatter knows, putting
    0s where necessary.
    ```js
    // "0w 0d 0h 0m 1s 337ms"
    tstring.stringify(1337, { show0s: true })
    // "0 weeks, 0 days, 0 hours, 0 minutes, 1 second, 337 miliseconds"
    tstring.stringify(1337, { format: "long", show0s: true })
    ```

    #### options.sep
    If given, will replace the normal separator for different parts in the time
    string (`" "` for short format, `", "` for long format).
    ```js
    // "1s|337ms"
    tstring.stringify(1337, { sep: "|" })
    // "0 weeks/0 days/0 hours/0 minutes/1 second/337 miliseconds"
    tstring.stringify(1337, { format: "long", sep: "/" })
    ```
*/
const stringify = (time, options = {}) => {
    const {
        format = "short",
        returnError = false,
        show0s = false,
        sep = null,
    } = options

    if (time < 0) {
        const error = new Error("Time must be positive")
        if (returnError === true) {
            return error
        }
        throw error
    }

    const formatValue = formatTime[format]
    if (formatValue === undefined) {
        const error = new Error(`"${format}" is not a valid format`)
        if (returnError === true) {
            return error
        }
        throw error
    }
    if (time === 0) {
        return formatValue(0, units[units.length - 1])
    }

    const {parts} = units.reduce(
        ({parts, time}, unit) => {
            const factor = unit[2]
            const value = Math.floor(time / factor)
            const nextTime = time % factor

            if (value === 0 && show0s !== true) {
                return { parts, time: nextTime }
            }
            return {
                parts: [...parts, formatValue(value, unit)],
                time: nextTime,
            }
        },
        { parts: [], time }
    )
    return parts.join(sep ?? separator[format] ?? " ")
}
const withOptions = (options) =>
    (time, passedOptions) => stringify(time, { ...passedOptions, ...options })

export default { parse, stringify, withOptions }
