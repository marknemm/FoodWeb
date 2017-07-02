'use strict';

let gulp = require('gulp');
let ts = require('gulp-typescript');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');
//let gutil = require('gulp-util');
//let exec = require('child_process').exec;

//let clientTsProject = ts.createProject('client/tsconfig.json');
let serverTsProject = ts.createProject('server/tsconfig.json');

// These tasks will be run when you just type "gulp"
gulp.task('default', [ /*'clientscripts',*/ 'serverscripts' ]);

// This task can be run alone with "gulp clientscripts"
/*gulp.task('clientscripts', () => {
  exec('ng build', function (err, stdout, stderr) {
    gutil.log(stdout);
    gutil.log(stderr);
    gutil.log(err);
  });
});*/

// This task can be run alone with "gulp serverscripts"
gulp.task('serverscripts', () => {
  return serverTsProject.src()
                        .pipe(serverTsProject())
                        .js
                        // This basically translate es6 to es5 so that uglify can run correctly.
                        .pipe(babel({
                            presets: ['es2015']
                        }))
                        // This will take the javascript and compact it.
                        .pipe(uglify().on('error', function(error) {
                            gutil.log(error);
                        }))
                        // Source maps basically provide a mapping from typescript to javascript so that you can debug the typescript directly.
                        .pipe(sourcemaps.init())
                        .pipe(sourcemaps.write('.'))
                        // This is where we are going to put the compiled code.
                        .pipe(gulp.dest('server/dist'));
});

// By adding this, we can run "gulp watch" to automatically run the build when we change a script
gulp.task('watch', () => {
  //gulp.watch('client/src/**/*.ts', [ 'clientscripts' ]);
  gulp.watch('server/src/**/*.ts', [ 'serverscripts' ]);
});