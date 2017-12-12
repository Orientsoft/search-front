const pump = require('pump');
const gulp = require('gulp');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const path = require('path');
const packageConfig = require('../package.json');

const filename = 'sf_client';

module.exports = {
    name: 'tar',
    handler: () => {
        return pump(
            gulp.src(path.resolve(__dirname, '../build/**/*')),
            tar(`${filename}_${packageConfig.version}.tar`, { mode: null }),
            gzip(),
            gulp.dest(path.resolve(__dirname, '../')),
            (err) => {
                if (err) { console.log(err); }
            }
        );
    }
};
