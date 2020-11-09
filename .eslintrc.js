module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "no-use-before-define": [
            "error",
            {
                "functions": true,
                "classes": true,
                "variables": true
            }
        ]
    }
};
