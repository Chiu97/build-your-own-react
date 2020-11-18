const presets = [
    ['@babel/env', {
        targets: {
            browsers: [
                'Chrome 80'
            ]
        }
    },
    '@babel/preset-typescript'
    ]
]

const plugins = [
    '@babel/plugin-transform-react-jsx'
]

module.exports = {
    presets, plugins
}