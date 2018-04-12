const gulp = require('gulp')
const concat = require('gulp-concat')
const watch = require('gulp-watch')
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const beautify = require('gulp-beautify');
const browserify = require('gulp-browserify')
const babel = require('gulp-babel')

function compile_javascript(func) {
	func.pipe(browserify({
		transform: [
			[{ "presets": ["es2015"] }, 'babelify'],
			[{'_flags': {'debug': true}}, 'vueify']
		]
	}))
	.pipe(gulp.dest('../src_chrome/js/'))
	.pipe(gulp.dest('../src_firefox/js/'))
	.pipe(gulp.dest('../src_opera/js/'))
}

gulp.task('default', function(){
	gulp.start('pug')
	gulp.start('sass')
	gulp.start('js')
	gulp.start('vue')
	gulp.start('icon')
	gulp.start('json')
})

gulp.task('pug', function(){
	return watch('pug/**/*.pug', { ignoreInitial: false })
		.pipe(pug())
		.pipe(gulp.dest('../src_chrome/'))
		.pipe(gulp.dest('../src_firefox/'))
		.pipe(gulp.dest('../src_opera/'))
})

gulp.task('sass', function(){
	return watch([
		'sass/main.sass',
		'sass/slider.scss',
		'sass/range.scss',
		'sass/popup.sass'
	], { ignoreInitial: false })
		.pipe(sass())
		.pipe(gulp.dest('../src_chrome/css/'))
		.pipe(gulp.dest('../src_firefox/css/'))
		.pipe(gulp.dest('../src_opera/css/'))
})


gulp.task('js', function(){
	return compile_javascript(
		watch('js/*.js', { ignoreInitial: false })
	)
})

gulp.task('js_once', function(){
	return gulp.src('js/*.js', { ignoreInitial: false })
})

// This triggers javascript to recompile if a Vue file is changed.
gulp.task('vue', function(){
	return watch('./js/components/*.vue', function () {
		compile_javascript(
			gulp.src('js/*.js', { ignoreInitial: false })
		)
	});
})

gulp.task('json', function(){
	return watch('json/*.json', { ignoreInitial: false })
		.pipe(beautify())
		.pipe(gulp.dest('../src_chrome/json/'))
		.pipe(gulp.dest('../src_firefox/json/'))
		.pipe(gulp.dest('../src_opera/json/'))
})

gulp.task('icon', function(){
	return watch('icon/*.png', { ignoreInitial: false })
		.pipe(gulp.dest('../src_chrome/icon/'))
		.pipe(gulp.dest('../src_firefox/icon/'))
		.pipe(gulp.dest('../src_opera/icon/'))
})
