const gulp = require('gulp');
const requireDir = require('require-dir');

const gulpTasks = requireDir('./gulp');

Object.keys(gulpTasks).forEach((key) => {
    const { name, handler } = gulpTasks[key];
    gulp.task(name, handler);
});
