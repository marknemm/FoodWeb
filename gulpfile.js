'use strict';

let gulp = require('gulp');
let ts = require('gulp-typescript');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let sourcemaps = require('gulp-sourcemaps');
let gutil = require('gulp-util');

//let clientTsProject = ts.createProject('client/tsconfig.json');
let serverTsProject = ts.createProject('server/tsconfig.json');

// These tasks will be run when you just type "gulp"
gulp.task('default', [ /*'clientscripts',*/ 'serverscripts' ]);

// This task can be run alone with "gulp clientscripts"
/*gulp.task('clientscripts', () => {
  return clientTsProject.src()
                        .pipe(clientTsProject())
                        .js
                        .pipe(babel({
                            presets: ['es2015']
                        }))
                        .pipe(uglify().on('error', function(error) {
                            gutil.log(error);
                        }))
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('client/app'));
});*/

// This task can be run alone with "gulp serverscripts"
gulp.task('serverscripts', () => {
  return serverTsProject.src()
                        .pipe(serverTsProject())
                        .js
                        .pipe(babel({
                            presets: ['es2015']
                        }))
                        .pipe(uglify().on('error', function(error) {
                            gutil.log(error);
                        }))
                        .pipe(sourcemaps.init())
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest('server/app'));
});

// By adding this, we can run "gulp watch" to automatically
// run the build when we change a script
gulp.task('watch', () => {
  //gulp.watch('client/src/**/*.ts', [ 'clientscripts' ]);
  gulp.watch('server/src/**/*.ts', [ 'serverscripts' ]);
});