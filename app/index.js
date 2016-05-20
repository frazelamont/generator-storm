'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);
    },

    initializing: function () {
        this.pkg = require('../package.json');
    },

    writing: {

        gulpfile: function () {
            this.fs.copyTpl(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                {
                    date: (new Date).toISOString().split('T')[0],
                    name: this.pkg.name,
                    version: this.pkg.version
                }
            );
        },

        packageJSON: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
        },

        html: function () {
            var pathLayouts = 'templates/layouts/',
                pathPartials = 'templates/partials/',
                pathViews = 'templates/views/';

            /* layouts */
            this.fs.copyTpl(
                this.templatePath('src/' + pathLayouts + '/default.html'),
                this.destinationPath('src/' + pathLayouts + '/default.html')
            );

            /* partials */
            this.fs.copyTpl(
                this.templatePath('src/' + pathPartials + '/doc-head.html'),
                this.destinationPath('src/' + pathPartials + '/doc-head.html')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathPartials + '/ui-footer.html'),
                this.destinationPath('src/' + pathPartials + '/ui-footer.html')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathPartials + '/ui-header.html'),
                this.destinationPath('src/' + pathPartials + '/ui-header.html')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathPartials + '/ui-navigation.html'),
                this.destinationPath('src/' + pathPartials + '/ui-navigation.html')
            );

            /* views */
            this.fs.copyTpl(
                this.templatePath('src/' + pathViews + '/index.html'),
                this.destinationPath('src/' + pathViews + '/index.html')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathViews + '/form/index.html'),
                this.destinationPath('src/' + pathViews + '/form/index.html')
            );
        },

        sass: function () {
            var pathComponents = 'scss/components/',
                pathGlobals = 'scss/globals/',
                pathShared = 'scss/shared/',
                pathUtils = 'scss/utils/';

            this.fs.copyTpl(
                this.templatePath('src/scss/styles.scss'),
                this.destinationPath('src/scss/styles.scss')
            );

            /* components */
            this.fs.copyTpl(
                this.templatePath('src/' + pathComponents + '/_buttons.scss'),
                this.destinationPath('src/' + pathComponents + '/_buttons.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathComponents + '/_icons.scss'),
                this.destinationPath('src/' + pathComponents + '/_icons.scss')
            );

            /* globals */
            this.fs.copyTpl(
                this.templatePath('src/' + pathGlobals + '/_normalise.scss'),
                this.destinationPath('src/' + pathGlobals + '/_normalise.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathGlobals + '/_typography.scss'),
                this.destinationPath('src/' + pathGlobals + '/_typography.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathGlobals + '/_variables.scss'),
                this.destinationPath('src/' + pathGlobals + '/_variables.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathGlobals + '/_webfonts.scss'),
                this.destinationPath('src/' + pathGlobals + '/_webfonts.scss')
            );

            /* shared */
            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_footer.scss'),
                this.destinationPath('src/' + pathShared + '/_footer.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_forms.scss'),
                this.destinationPath('src/' + pathShared + '/_forms.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_grid.scss'),
                this.destinationPath('src/' + pathShared + '/_grid.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_header.scss'),
                this.destinationPath('src/' + pathShared + '/_header.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_links.scss'),
                this.destinationPath('src/' + pathShared + '/_links.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_lists.scss'),
                this.destinationPath('src/' + pathShared + '/_lists.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_mediaobjects.scss'),
                this.destinationPath('src/' + pathShared + '/_mediaobjects.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathShared + '/_navigation.scss'),
                this.destinationPath('src/' + pathShared + '/_navigation.scss')
            );

            /* utils */
            this.fs.copyTpl(
                this.templatePath('src/' + pathUtils + '/_animations.scss'),
                this.destinationPath('src/' + pathUtils + '/_animations.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathUtils + '/_extends.scss'),
                this.destinationPath('src/' + pathUtils + '/_extends.scss')
            );

            this.fs.copyTpl(
                this.templatePath('src/' + pathUtils + '/_mixins.scss'),
                this.destinationPath('src/' + pathUtils + '/_mixins.scss')
            );

        },

        javascript: function () {
            this.fs.copyTpl(
                this.templatePath('src/js/app.js'),
                this.destinationPath('src/js/app.js')
            );
            this.fs.copyTpl(
                this.templatePath('src/js/async/forrm.js'),
                this.destinationPath('src/js/async/forrm.js')
            );
        },

        readme: function () {
            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath('README.md')
            );
        },

        misc: function () {
            mkdirp('src/img');
            mkdirp('src/fonts');
        }
    }

});