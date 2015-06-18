var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var crypto = require('crypto');
var through = require('through2');
var minifycss = require('gulp-minify-css');
var del = require('del');
var zip = require('gulp-zip');


var fs = require('fs');
var path = require('path');


//用来存储文件的md5戳的哈希表
var map = {};
var configPath = "./config.json";
var css_reg= /<link(?:.*?)href=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/>)*/gm;
var js_reg= /<script(?:.*?)src=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/script>)*/gm;


//公共函数类
var common = {
	readFile: function (path) {
		return fs.readFileSync(path, 'utf-8');
	},
	getConfig: function (path) {
		return JSON.parse(this.readFile(path));
	},
	createMd5Str: function (fileContent) {
		return crypto.createHash('md5').update(fileContent).digest('hex');	
	},
	setMap: function (path, name) {
		var context = this.readFile(path + name);
		var md5 = this.getFileMd5Str(context);

		map[name] = md5;
	},
	getFileMD5: function (src) {
		var str = src.indexOf("?") > -1 ? src.substring(0, b.indexOf("?")) : src;
		var	file = str.substring(str.lastIndexOf('/') + 1);
		var md5 = map[file] || new Date().getTime();

		src = src.replace("../static/", "");

		return src + "?v=" + md5;
	},
	getSourceName: function (name) {
		var str = name.substr(0, name.lastIndexOf("."));
		var extend = name.substr(name.lastIndexOf("."));


		return str + ".source" + extend;
	},
	checkTime: function (i) {
		if (i < 10) {
        	i = "0" + i
    	}
        
        return i;
	}
	
};

//打包业务处理
var pack = {
	init: function () {
		
		this.config = common.getConfig(configPath);
		this.path = this.config.path;

		this.jsReg  = this.config.constant["JS_REG"];
		this.cssReg = this.config.constant["CSS_REG"];

		this.jsConfig  =  common.getConfig(this.config.constant["JS_COFIG_PATH"]);
		this.cssConfig = common.getConfig(this.config.constant["CSS_COFIG_PATH"]);
	},
	/*
		*w处理文件压缩合并
        *@param {options} options 初始化参数集
        *@param {String} options.merge 是否合并
        *@param {String} options.compress 是否压缩
        *@param {String} options.name 合并后的文件名
        *@param {String} options.src 文件的路径
        *@param {String} options.outPath 输出路径
        *@param {Function} options.update 处理下级独立业务
        *@param {Boolean} isRelease 是否是发布状态
        
	*/
	createFile: function (options, isRelease) {
		var stream = gulp.src(options.src);
		var source = gulp.src(options.src);
		
		if(options.merge){
			stream =  stream.pipe(concat(options.name));

			source = source.pipe(concat(common.getSourceName(options.name)));
		}

		if(options.compress && isRelease){
			stream = options.update(stream);
		}

		stream.pipe(through.obj(function(file, enc, cb){
			map[options.name] = common.createMd5Str(file.contents);
		}));

		stream.pipe(gulp.dest(options.outPath));

		if(isRelease){
			source.pipe(gulp.dest(options.outPath));
		}
	},
	replaceMD5: function (isRelease) {
		var path = this.path["html_path"];

		for(var i = 0; i < path.length; i++){
			var outPath = isRelease ? path[i].release : path[i].out;

			gulp.src(path[i].source + '*.html')
			.pipe(replace(js_reg, function (a, b){
				return a.replace(b, common.getFileMD5(b));
			}))
			.pipe(replace(css_reg, function (a, b) {
				return a.replace(b, common.getFileMD5(b));
			}))
			.pipe(gulp.dest(outPath));
		}
	},
	createCss: function (isRelease) {
		var path = this.path["css_path"];

		for(var i = 0; i < path.length; i++){
			var outPath = isRelease ? path[i].release : path[i].out;

			for(var key in this.cssConfig){
				var options = this.cssConfig[key];

				options.outPath = outPath;

				options.update = function (stream) {
					return stream.pipe(minifycss());
				};

				this.createFile(options, isRelease);
			}
		}
	},
	createJs: function (isRelease) {
		var path = this.path["js_path"];

		for(var i = 0; i < path.length; i++){
			var outPath = isRelease ? path[i].release : path[i].out;

			for(var key in this.jsConfig){
				var options = this.jsConfig[key];

				options.outPath = outPath;

				options.update = function (stream) {
					return stream.pipe(uglify());
				};

				this.createFile(options, isRelease);
			}
		}
	},
	createImage: function (isRelease) {
		var path = this.path["img_path"];

		for(var i = 0; i < path.length; i++){
			var outPath = isRelease ? path[i].release : path[i].out;

			gulp.src(path[i].source + '*.*')
				.pipe(gulp.dest(outPath));
		}
	}
};


var tack = {
	develop: function () {

		pack.createJs();
		pack.createCss();
		pack.createImage();

		setTimeout(function() {
			pack.replaceMD5();	
		}, 500);
	},
	release: function () {

		pack.createJs(true);
		pack.createCss(true);
		pack.createImage(true);

		setTimeout(function() {
			pack.replaceMD5(true);
		}, 100);

		setTimeout(function() {
			gulp.run("zip");
		}, 500);
	}
};

pack.init();


gulp.task('default', ["clean"], function() {
	tack.develop();
});

gulp.task('release', ["clean"], function () {
	tack.release();

});

gulp.task('clean', function(cb) {
	var outPath = pack.config.project["out_path"];
	var releasePath = pack.config.project["release_path"];

    del([outPath, releasePath], cb)
});

//打包主体build 文件夹并按照时间重命名
gulp.task('zip', function(){
	var project = pack.config.project;

    var d = new Date();
    var year = d.getFullYear();
    var month = common.checkTime(d.getMonth() + 1);
    var day = common.checkTime(d.getDate());
    var hour = common.checkTime(d.getHours());
    var minute = common.checkTime(d.getMinutes());

  	return gulp.src(project["release_path"] + "**")
        .pipe(zip(project["name"] + '-' + year + month + day + hour + minute + '.zip'))
    	.pipe(gulp.dest(project["release_path"]));
});


gulp.task('watch', ["default"], function () {
	gulp.watch(['./html/*.html','./js/**/*.js','./css/*.css'], ['default']);
});







