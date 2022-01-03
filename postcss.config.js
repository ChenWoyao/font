module.exports = {
    plugins: [
        require("postcss-flexbugs-fixes"),
        require("postcss-preset-env")({
            autoprefixer: {
                overrideBrowderslist: "andoroid >= 4.3",
            },
            stage: 3,
        }),
        require("postcss-plugin-px2rem")({
            rootValue: 75,
            minPixelValue: 2,
        })
    ],
}
