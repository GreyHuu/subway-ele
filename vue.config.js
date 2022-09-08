const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            preload: 'src/electron/preload.js',
            builderOptions: {
                asar: false,
                copyright: "Copyright © 2022",
                extraResources: [
                    {
                        from: "./src/utils",
                        to: "app/src/utils",
                        filter: ["**/*"]
                    },
                    {
                        from: "./src/assets",
                        to: "app/src/assets",
                        filter: ["**/*.json"]
                    },
                ],
                includeSubNodeModules: true,
                linux: {
                    // icon: "build/icons", // 包含各种尺寸图标的文件夹
                    target: [
                        "AppImage",
                        "deb"
                    ],
                    // category: "Utility",
                }
            }
        }
    }
})
