module.exports = {

    browserSync: {
        params: {
            // tunnel: "plaifytest",
            proxy: "plaify-test/"
        }
    },

    updateFiles: {
        src: ['./humans.txt'],
        template: 'Last update: {{dd.mm.yyyy}}'
    },

    scripts: {
        watch: 'assets/scripts/**/*.js',
        nameProd: 'project.min.js',
        toConcat: ['./assets/build/dev/svg-sprite.js', './assets/scripts/app.js', './assets/scripts/modules/**/*.js'],
        compileDest: './assets/build/prod',
        modulesPath: './assets/scripts/modules/',
        lint: ['./assets/scripts/app.js', './assets/scripts/modules/**/*.js'],
        eslintrc: "./gulp/tasks/scripts/.eslintrc", // For eslint
        rulePaths: "./gulp/tasks/scripts/eslint-rules/", // For eslint
    },

    sprites: {
        watch: 'assets/sprites/**/*.{png,jpg,jpeg}',
        src: './assets/sprites/',
        imgDest: './assets/build/dev/sprites/',
        imgDestProd: './assets/build/prod/sprites/',
        mapDest: './assets/styles/sprites/',
        mapTemplate: './gulp/tasks/images/stylus-sprite-template.handlebars'
    },

    styles: {
        watch: 'assets/styles/**/*.styl',
        src: './assets/styles/common.styl',
        lintFiles: [
            './assets/styles/**/*.styl',
            '!./assets/styles/print.styl', // TODO этот файл нуждается в доработке
            '!./assets/styles/sprites/*.styl',
            '!./assets/styles/utils/normalize.styl',
            '!./assets/styles/utils/normalize-opentype.styl',
            '!./assets/styles/utils/reset.styl'
        ],
        stylintrc: './gulp/tasks/styles/.stylintrc',
        nameDev: 'project.dev.css',
        nameProd: 'project.min.css',
        dest: './assets/build/dev',
        destProd: './assets/build/prod',
        browsers: ['last 2 version', 'safari 8'] // For autoprefixer
    },

    images: {
        cache: "./.cache/imagemin",
        minify: [
            "./assets/sprites/**/*.{png,jpg,jpeg}",
            "./assets/build/prod/sprites/**/*.{png,jpg,jpeg}",
            "./media/images/**/*.{png,jpg,jpeg}",
        ]
    },

    svg: {
        watch: 'assets/svg/**/*.svg',
        spriteSrc: './assets/svg/sprite/*.svg',
        spriteDest: './assets/build/dev',
        spriteName: 'svg-symbols.svg',
        constName: 'SVG_ICONS',
        fileToJs: './assets/build/dev/svg-symbols.min.svg',
        jsStrDest: './assets/build/dev',
        jsStrDestProd: './assets/build/prod',
        jsFileName: 'svg-sprite.js',
        mapDest: './assets/styles/sprites/'
    },

    php: {
        watch: ["*.php", "assets/**/*.php", "include/**/*.php"]
    },
};
