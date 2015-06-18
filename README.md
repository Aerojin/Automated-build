# Automated-build
基于gulp的自动化构建

#安装
1.下载安装node  
2.克隆Automated-build项目  
3.安装项目中所有的插件  
4.配置文件  

#配置
config.json 项目配置文件  
```
/*  
project		-> 项目配置
	name		->项目名称
	out_path	->开发时输出路径
	release_path	->发布时输出路径
	
path		-> 路径配置
	js_path		-> js配置路径
		source		-> 源文件路径
		out		-> 开发模式输出路径
		release		-> 发布时输出路径
		
	css_path	-> css配置路径
	html_path	-> html配置
	img_path	-> image配置路径
	
constant	- 常量配置
*/
{
	"project": {
		"name":	"activity",
		"out_path": "./static/",
		"release_path": "./release/"
	},
	"path": {
		"js_path": [{
			"source": "./js/",
			"out": "./static/js/",
			"release": "./release/js/"
		}],
		"css_path": [{
			"source": "./css/",
			"out": "./static/css/",
			"release": "./release/css/"
		}],
		"html_path": [{
			"source": "./html/",
			"out": "./static/",
			"release": "./release/"
		}],
		"img_path": [{
			"source": "./image/",
			"out": "./static/image/",
			"release": "./release/image/"
		},{
			"source": "./img/",
			"out": "./static/img/",
			"release": "./release/img/"
		}]
	},
	"constant": {
		"JS_COFIG_PATH": "./config_js.json",
		"CSS_COFIG_PATH": "./config_css.json"
	}
	
}
```

config_js.json配置文件
```
merge  		是否合并
compress	是否压缩
name		合并后输出的文件名
src		源文件路径
{
	"libs": {
		"merge": true,
		"compress": false,
		"name": "libs.pack.js",
		"src": [
			"./js/lib/zepto.min.js"
		]
	},
	"base": {
		"merge": true,
		"compress": true,
		"name": "xn.base.pack.js",
		"src": [
			"./js/base/xn.core.js",
			"./js/base/xn.string.js",
			"./js/base/xn.kit.js",
			"./js/base/xn.http.client.js",
			"./js/base/xn.browser.js"
		]
	},
	"api": {
		"merge": true,
		"compress": true,
		"name": "xn.api.pack.js",
		"src": [
			"./js/api/xn.api.js"
		]
	}
}
```
