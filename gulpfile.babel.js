import { task, parallel, src, dest, watch, series } from 'gulp';
import babel from 'gulp-babel';
import sourceMap from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import fileinclude from 'gulp-file-include';

const DIST = './dist';
const SRC = './src';

task('build:js', () =>
    src(SRC+'/js/ES6/main.js')
	    .pipe(sourceMap.init())
        .pipe(babel({presets: ['@babel/env']}))
	    .pipe(sourceMap.write())
        .pipe(dest(DIST+'/js'))
        .pipe(browserSync.stream())
);
task('build:scss', () =>
    src(SRC+'/scss/**/*.scss')
        .pipe(sourceMap.init())
        .pipe(sass().on('error', sass.logError))
	    .pipe(sourceMap.write())
        .pipe(dest(DIST+'/style'))
        .pipe(browserSync.stream())
);
task('build:html', ()=>
    src(SRC+'/**/*.html')
        .pipe(sourceMap.init())
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(dest(DIST))
        .pipe(browserSync.stream())
)
task('server:start',function(){
    browserSync.init({
        server: DIST,
        directory: true
    });
});

task('default', series('build:js','build:scss','build:html','server:start'));

watch(SRC+'/js/**/*.js', series('build:js'));
watch(SRC+'/scss/**/*.scss', series('build:scss'));
watch(SRC+'/**/*.html', series('build:html'));




