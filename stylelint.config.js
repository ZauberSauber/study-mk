/** @type {import('stylelint').Config} */
export default {
    extends: [
        "stylelint-stylus/standard",
    ],
    rules: {
        "stylus/semicolon": "never",
        "stylus/declaration-colon": "never"
    },
};
