module.exports = {
  root: true,

  env: {
      node: true
  },

  extends: ["plugin:vue/recommended", "airbnb-base"],

  parserOptions: {
      parser: "babel-eslint"
  },

  rules: {
      "no-console": "off",
      "no-debugger": "off",
      semi: ["error", "never"],
      indent: ["error", 4],
      "no-param-reassign": "off",
      "max-len": "off",
      "consistent-return": "off",
      "import/prefer-default-export": "off",
      "import/no-unresolved": [
          "error",
          {
              ignore: ["^@/"]
          }
      ],
      "vue/html-indent": ["error", 4],
      "vue/require-default-prop": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/max-attributes-per-line": [
          "warn",
          {
              singleline: 4,
              multiline: {
                  allowFirstLine: true,
                  max: 2
              }
          }
      ],
      "vue/html-closing-bracket-newline": [
          "warn",
          {
              singleline: "never",
              multiline: "never"
          }
      ],
      "vue/no-confusing-v-for-v-if": "warn",
      "vue/no-v-html": "warn",
      "vue/this-in-template": "warn",
      "vue/eqeqeq": "error",
      "linebreak-style":"off"
  }
};
