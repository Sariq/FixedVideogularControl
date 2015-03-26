var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');

var plugins = require("gulp-load-plugins")({lazy: false});
var BaseTarget = 'tests/';
var jsBuildTarget = BaseTarget + 'js/app';
var cssBuildTarget = BaseTarget + 'css';
var tempBuild = 'app/Build';
var fontsBuildTarget = BaseTarget + 'css/fonts';
var imagesBuildTarget=BaseTarget+'images/angular';
console.log(plugins);
gulp.task('scripts', function () {
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js', './app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.ngconcat('app.js'))
        .pipe(plugins.ngAnnotate()).pipe(uglify())
        .pipe(gulp.dest(jsBuildTarget));
});


gulp.task('minify-html', function() {
    var opts = {comments:true,spare:true};

  gulp.src(['./app/views/**/*.html'])
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(tempBuild+"/html"))
});

gulp.task('templates', function () {
    //combine all template files of the app into a js file
    gulp.src(tempBuild+'/html/**/*.html')
        .pipe(plugins.angularTemplatecache('templates.js', {standalone: true, module: 'vc.templates'}))
        .pipe(gulp.dest(jsBuildTarget));
});

gulp.task('css', function () {
    gulp.src('./app/app.less')
        .pipe(plugins.less())
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest(cssBuildTarget));
});



gulp.task('vendorJS', function () {
    //concatenate vendor JS files
    gulp.src(mainBowerFiles())
        .pipe(plugins.filter('**/*.js')).pipe(uglify())
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest(jsBuildTarget));
});

gulp.task('vendorCSS', function () {
    //concatenate vendor CSS files
    gulp.src(['!./bower_components/**/*.min.css',
            './bower_components/**/*.css'])
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest(cssBuildTarget));
});
gulp.task('copyImages', function () {
    gulp.src('app/images/*')
        .pipe(gulp.dest(fontsBuildTarget));
});

gulp.task('copyFonts', function () {
    gulp.src('bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest(fontsBuildTarget));
});

gulp.task('watch', function () {
    gulp.watch([
        'build/**/*.html',
        'build/**/*.js',
        'build/**/*.css'
    ], function (event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js', '!./app/**/*test.js'], ['scripts']);
    gulp.watch(['./app/**/*.html'], ['templates']);
    gulp.watch(['./app/**/*.css', './app/**/*.less'], ['css']);
    // gulp.watch('./app/index.html', ['copy-index']);

});

gulp.task('connect', function () {
    plugins.connect.server({
        root: ['build'],
        port: 9000,
        livereload: true
    });
});

gulp.task('default', ['minify-html','scripts', 'copyFonts', 'copyImages',//'templates',
     'css', 'vendorJS', 'vendorCSS']);