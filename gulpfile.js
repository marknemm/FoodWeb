'use strict';

let gulp = require('gulp');
let ts = require('gulp-typescript');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');
let gutil = require('gulp-util');
//let browserify = require('gulp-browserify');
//let tsify = require('tsify');
//let babelify = require('babelify');
//let exec = require('child_process').exec;

//let clientTsProject = ts.createProject(__dirname + '/client/tsconfig.json');
let serverTsProject = ts.createProject(__dirname + '/server/tsconfig.json');

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

// This task can be run alone with "gulp serverscripts". This seems to break sourcemaps right now (doesn't generate them correctly). Instead, will use tsc.
gulp.task('serverscripts', () => {
  return serverTsProject.src()
                        .pipe(sourcemaps.init())
                        .pipe(serverTsProject()).js
                        // This basically translate es6 to es5 so that uglify can run correctly.
                        .pipe(babel({
                            presets: ['es2015']
                        }))
                        // This will take the javascript and compact it.
                        .pipe(uglify().on('error', function(error) {
                            gutil.log(error);
                        }))
                        // Source maps basically provide a mapping from typescript to javascript so that you can debug the typescript directly.
                        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: __dirname + '/server/src/', mapRoot: __dirname + '/server/dist/' }))
                        // This is where we are going to put the compiled code.
                        .pipe(gulp.dest(__dirname + '/server/dist'));
});

// By adding this, we can run "gulp watch" to automatically run the build when we change a script
gulp.task('watch', () => {
  //gulp.watch('client/src/**/*.ts', [ 'clientscripts' ]);
  gulp.watch('server/src/**/*.ts', [ 'serverscripts' ]);
});
