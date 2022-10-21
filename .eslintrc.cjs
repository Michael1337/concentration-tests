/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    'extends': [
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        "vue/component-tags-order": [
            "warn",
            {
                order: ["template", "script", "style"],
            },
        ],
        "vue/html-self-closing": [
            "warn",
            {
                html: {
                    void: "always",
                    normal: "always",
                    component: "always",
                },
                svg: "always",
                math: "always",
            },
        ],
        "vue/no-empty-component-block": "warn",
        "linebreak-style": ["warn", "unix"],
        "vue/block-lang": ["error",
            {
                "script": {
                    "lang": "ts"
                }
            }
        ],
        "vue/component-name-in-template-casing": ["error", "PascalCase", {
            "registeredComponentsOnly": true,
            "ignores": []
        }],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        "vue/html-button-has-type": ["error", {
            "button": true,
            "submit": true,
            "reset": true
        }],
        "vue/match-component-file-name": ["error", {
            "extensions": ["jsx"],
            "shouldMatchCase": false
        }],
        "vue/no-bare-strings-in-template": ["error", {
            "allowlist": [
                "(", ")", ",", ".", "&", "+", "-", "=", "*", "/", "#", "%", "!", "?", ":", "[", "]", "{", "}", "<", ">", "\u00b7", "\u2022", "\u2010", "\u2013", "\u2014", "\u2212", "|", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
            ],
            "attributes": {
                "/.+/": ["title", "aria-label", "aria-placeholder", "aria-roledescription", "aria-valuetext"],
                "input": ["placeholder"],
                "img": ["alt"]
            },
            "directives": ["v-text"]
        }],
        "vue/no-static-inline-styles": ["error", {
            "allowBinding": false
        }],
        "vue/no-unused-properties": ["error", {
            "groups": ["props", "data", "computed", "methods", "setup"],
            "deepData": true,
            "ignorePublicMembers": false
        }],
        "vue/no-unused-refs": "error",
        "vue/prefer-separate-static-class": "error"

    },

}
