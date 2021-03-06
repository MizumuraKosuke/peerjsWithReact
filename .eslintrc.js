module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
  },
  "extends": "airbnb",
  "plugins": [ "react", "jsx-a11y", "import", "flowtype" ],
  "rules": {
    "brace-style": ["warn", "stroustrup", { "allowSingleLine": true }],
    "class-methods-use-this": [ "warn" ],
    "indent": [ "error", 2 ],
    "linebreak-style": [ "error", "unix" ],
    "max-len": [ "warn" , 100],
    "quotes": [ "error", "single" ],
    "semi": [ "error", "never" ],
    "no-console": [ "warn" ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/no-unused-state": [ "warn" ],
    "jsx-a11y/anchor-is-valid": [ "off" ],
    "import/no-unresolved": ["warn", {
      ignore: ['@static', '@styles', '@components', '@data', '@utils', '@hocs', '@universal', '@pages']
    }],
    "no-unused-vars": [ "warn" ],
    "react/jsx-one-expression-per-line": "off",
    "react/destructuring-assignment": [ "warn" ],
    'react/sort-comp': ["warn", {
      order: [
        'static-methods',
        'instance-variables',
        'lifecycle',
        '/^on.+$/',
        'getters',
        'setters',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        'instance-methods',
        'everything-else',
        'rendering',
      ],
      groups: {
        lifecycle: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'state',
          'constructor',
          'getDefaultProps',
          'getInitialState',
          'getChildContext',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
        ],
        rendering: [
          '/^render.+$/',
          'render'
        ],
      },
    }],
  }
}