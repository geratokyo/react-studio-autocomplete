const { FuseBox, SassPlugin, CSSPlugin, WebIndexPlugin, EnvPlugin, QuantumPlugin } = require("fuse-box");
const { src, task, context, bumpVersion } = require("fuse-box/sparky");

//load all fusebox stuff, not showing here
const { TypeChecker } = require('fuse-box-typechecker');



task("publish", async context => {
    // await context.clean(); 
    await context.publish();
});

task("watch", async context => {
    // await context.clean(); 
    await context.watch();
})

context(
    class {
        getConfig() {

            let plugins =  [
                [
                    SassPlugin({
                        outputStyle: this.isProduction && "compressed",
                    }),
                    CSSPlugin({
                        outFile: file => "./public/css/" + file,
                        inject: file => `css/${file}`,
                    }),
                    
                ],
                EnvPlugin({ NODE_ENV: this.isProduction ? "production" : "development" }),
                // this.isProduction && WebIndexPlugin(),
                this.isProduction && QuantumPlugin({
                    css: true,
                    uglify: true,
                    bakeApiIntoBundle: "bundle",
                }),
            ]

            return FuseBox.init({
                homeDir: "src",
                cache: true,
                target: "browser@es5",
                useTypescriptCompiler: true,
                output: "public/js/$name.js",
                sourceMaps: !this.isProduction,
                dynamicImportsEnabled: true,
                log: {
                    showBundledFiles: false, // Don't list all the bundled files every time we bundle
                    clearTerminalOnBundle: false, // Clear the terminal window every time we bundle
                },
                plugins,
            });
        }

        async clean() {
            await src("./public/js")
                .clean("public/js/")
                .exec();
        }

        async prepareDistFolder() {
            await bumpVersion("package.json", { type: "patch" });
            await src("./package.json")
                .dest("dist/")
                .exec();
        }

        publish() {
            this.isProduction = true;
            const fuse = this.getConfig();

            fuse.dev({
                root: "public/",
                fallback: "index.html",
            });

            fuse
                .bundle("bundle")
                .instructions(" > index.tsx")
            return fuse.run();
        }

        watch() {
            const fuse = this.getConfig();

            this.isProduction = false;
            fuse.dev({
                root: "public/",
                fallback: "index.html",
            });

            fuse
                .bundle("bundle")
                .instructions(" > index.tsx")
                .hmr()
                .watch()
                .completed((e) => {
                    runTypeChecker();
                });

            return fuse.run();
        }
    }
)

// get typechecker 
const typechecker = TypeChecker({
    tsConfig: './tsconfig.json',
    name: 'src',
    basePath: './',
    yellowOnLint: true,
    shortenFilenames: true
});

// create thread
typechecker.startTreadAndWait();


let runTypeChecker = () => {
    // same color..
    console.log(`\x1b[36m%s\x1b[0m`, `app bundled- running type check`);

    //use thread, tell it to typecheck and print result
    typechecker.useThreadAndTypecheck();

}
