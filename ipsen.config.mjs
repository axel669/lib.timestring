export default {
    title: "Timestring Docs",
    source: {
        dir: "lib",
        readme: "main.mjs",
        patterns: [],
    },
    dest: {
        clear: true,
        dir: "site",
        readme: ".."
    },
    site: {
        index: "main.mjs",
        defaultTheme: "dark",
    }
}
