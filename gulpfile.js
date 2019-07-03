'use strict';

var pathProd = 'app',
	gulp = require('gulp'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	sass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	prefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	del = require('del'),
	cache = require('gulp-cache'),
	concat = require('gulp-concat');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('clean', function() {
	return del(pathProd);
});

gulp.task('clearCache', function() {
	return cache.clearAll();
});

gulp.task('json', function() {
	return gulp.src([
		'dev/*.json'
	])
	.pipe(gulp.dest(pathProd))
	.pipe(reload({ stream: true }));
});

gulp.task('html', function() {
	return gulp.src('dev/*.html')
	.pipe(gulp.dest(pathProd))
	.pipe(reload({ stream: true }));
});

gulp.task('sass', function() {
	return gulp.src('dev/scss/main.scss')
	.pipe(sass({outputStyle: 'compressed'}))
		.on('error', notify.onError(function (err) {
			return {
				title: 'scss',
				message: err.message
			}
		}))
	.pipe(prefixer(['last 15 versions', '> 1%'], {cascade: true}))
	.pipe(cleanCSS({ compatibility: 'ie9' }))
	.pipe(rename('css/styles.min.css'))
	.pipe(gulp.dest(pathProd))
	.pipe(reload({ stream: true }));
});

gulp.task('js', function() {
	return gulp.src([
			'./dev/scripts/accordion.js',
			'./dev/scripts/onoffswitch.js',
			'./dev/scripts/layout-collector.js'
		])
		.pipe(concat('js/all-scripts.js'))
		.pipe(gulp.dest(pathProd))
		.pipe(reload({ stream: true }));
});

gulp.task('server', function() {
	browserSync({
		server: {
			baseDir: pathProd
		},
		notify: false
	});
});

gulp.task('build', ['clean', 'sass', 'js', 'html', 'json']);

gulp.task('watch', ['server', 'sass', 'js', 'html', 'json'], function() {
	gulp.watch(['dev/scss/*.scss', 'dev/scss/**/*.scss'], ['sass'],function(event, cb) {
        setTimeout(function(){gulp.start('sass');}, 50) // задача выполниться через 50 миллисекунд и файл успеет сохраниться на диске
    });
	gulp.watch('dev/scripts/*.js', ['js']);
	gulp.watch('dev/*.html', ['html']);
	gulp.watch('dev/*.json', ['json']);
});

gulp.task('dev', ['build', 'watch']);