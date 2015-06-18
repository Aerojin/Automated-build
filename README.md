# Automated-build
基于gulp的自动化构建

#安装
1.下载安装node  
2.克隆Automated-build项目  
3.安装项目中所有的插件  
4.配置文件  

#配置
config.json 项目配置文件
'{
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
	
}'
