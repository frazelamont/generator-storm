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