
# Timestring

Small library for parsing and generating simple timestrings.

## Installation
```bash
pnpm add @axel669/timestring
```

## Usage

### parse(string)
Returns the number of milliseconds of the combined parsed time parts.  
Time Part Format: `<time value><unit>` (`"5m"`, `"1w"`, `"150ms"`, etc)  
The string can have any number of time parts, and time parts with the same unit
will be added together. Any part of the string that isn't a time part will be
ignored.

#### Supported Units
- `w` - Weeks
- `d` - Days
- `h` - Hours
- `m` - Minutes
- `s` - Seconds
- `ms` - Milliseconds

#### Example
```js
import tstring from "@axel669/timestring"

const duration = tstring.parse("15m 30s")
```

### stringify(time, options)
Generates a time string from the time given, with options to control the output.

#### options
- #### options.format
    > default: `"short"`.
    The format to use for the units in the time string. Currently accepts
    `"short"` and `"long"`. Long format will use plurals when appropriate.
    ```js
    // "1s 337ms"
    tstring.stringify(1337)
    // "1 second, 337 miliseconds"
    tstring.stringify(1337, { format: "long" })
    ```

- #### options.returnError
    > default: `false`
    If `true`, stringify will return errors instead of throwing them.

- #### options.show0s
    > default: `false`
    If `true`, the output will include every unit the formatter knows, putting
    0s where necessary.
    ```js
    // "0w 0d 0h 0m 1s 337ms"
    tstring.stringify(1337, { show0s: true })
    // "0 weeks, 0 days, 0 hours, 0 minutes, 1 second, 337 miliseconds"
    tstring.stringify(1337, { format: "long", show0s: true })
    ```

- #### options.sep
    If given, will replace the normal separator for different parts in the time
    string (`" "` for short format, `", "` for long format).
    ```js
    // "1s|337ms"
    tstring.stringify(1337, { sep: "|" })
    // "0 weeks/0 days/0 hours/0 minutes/1 second/337 miliseconds"
    tstring.stringify(1337, { format: "long", sep: "/" })
    ```