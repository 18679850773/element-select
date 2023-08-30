var gulp = require("gulp"),
  connect = require("gulp-connect");
// var stripDebug = require('gulp-strip-debug');
const uglify = require("gulp-uglify");
// const rename = require('gulp-rename')

var path = {
  dev: "./src/",
  build: "./lib/",
};

gulp.task("serve", function () {
  connect.server({
    name: "框选页面上任意dom元素",
    port: 8081,
    // root: path.dev,
    // livereload: true
  });
});

gulp.task("build", async function () {
  gulp
    .src(path.dev + "*.js")
    // .pipe(stripDebug())
    .pipe(uglify())
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.build));
});
