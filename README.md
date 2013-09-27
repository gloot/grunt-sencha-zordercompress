# grunt-sencha-zordercompress

### English description!
> Compress compile sencha by Loaded order Ext javascript files!

### 中文说明
> 按顺序压缩指定Sencha加载的脚本文件, 可以选择多种模式压缩;  

grunt-sencha-zordercompress分按需压缩与全压缩两种方式;  

每种方式下又可以分： 

1. APP_APPJS_ADKCOMS : 压缩两份: apps/下的文件, 以及 sdk+components的文件  
2. APP_APPJS_ADK_COMS : 压缩三份 : apps/下的文件, 以及 sdk文件 和 components文件三部分.  
3. 每种模式都可以全压缩  

所有配置出来的可压缩项为:   

全压缩: '<%=Sencha_ZOrderCompress_dist%>'  

组件或组件加sdk: '<%=Sencha_ZOrderCompress_dist_ext_core%>'  

apps/下文件压缩: '<%=Sencha_ZOrderCompress_dist_apps%>'  


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sencha-zordercompress --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('Sencha_ZOrderCompress');
```

## The "Sencha_ZOrderCompress" task

### Overview
In your project's Gruntfile, add a section named `Sencha_ZOrderCompress` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  Sencha_ZOrderCompress: {
    dist: {
	options: {
		
	}
    },
    src : 'sencha components path, eg: touch/src/**/*.js '
  },
})
```

### options

#### options.appJs
Ext.application执行所在程序, 一般为 `' app.js '`  
The file where Ext.applicaton performs!  

#### options.processHtml
Sencha touch执行入口, 默认为 `'index.html'`  
The Sencha application perform file!  

### options.appName
在执行全压缩方式时，设置 appJs 脚本内容所需的配置!  
In all compress type, will generates an executable file ,contains appJs content , need to use appName!  

### options.mode
压缩方式  
compress type  

全压缩: `'<%=Sencha_ZOrderCompress_dist%>'`  
组件或组件加sdk: `'<%=Sencha_ZOrderCompress_dist_ext_core%>'`  
apps/下文件压缩: `'<%=Sencha_ZOrderCompress_dist_apps%>'`  

### options.compassAll [true|false]
配置是否全压缩，还是按需压缩;  
config is compress all Sencha components: All:true;  

### options.moduFunc
这个方法有个参数，是 `'app/'` 下所有脚本文件的数组!  
可用于再 这些文件进行再操作，比如如何分隔细分再压缩!  

This method[function] has a parameter, A array from `'app/'` all files!  
You can do what any do you want in here! like split file set to compress!

### Usage Examples

#### Default use
下面的例子是一些基本的设置跟压缩使用方法. `concat`与`uglify`的使用方法可以调整!  
应该根据不同模式，配置`concat`与`uglify`两个任务!  

This Examples is the basic config to compress method, you can config the `concat` and `uglify` task in different mode!  

```js
grunt.initConfig({
	Sencha_ZOrderCompress: {
		dist: {
			options: {
				appJs : 'app.js',
				processHtml : 'index.html',
				appName : 'Rwxf',
				mode : 'APP_APPJS_ADKCOMS' 
					/*
						1. APP_APPJS_ADKCOMS		=>app/, app.js, adk+components
						2. APP_APPJS_ADK_COMS		=>app/, app.js, adk.js, components[touch/src]
						3. ALL				=>app/+app.js+adk.js+components[touch/src]
					*/,
				compassAll : true,
				modeFunc : function(apps) {
					var modus = ['amodu', 'bmodu'];
				}
			}
		},
		src : 'touch/src/**/*.js'
	},	
	concat: {
		dist: {
			src : '<%= Sencha_ZOrderCompress_dist_ext_core %>',
			dest: 'build/components.js'
		},
		foo: {
			src : '<%= Sencha_ZOrderCompress_dist_apps %>',
			dest : 'build/apps.js',
		},
		pall: {
			src : '<%= Sencha_ZOrderCompress_dist %>',
			dest : 'build/alls.js'
		}
	},
	uglify : {
		build : {
			src : 'build/components.js',
			dest : 'build/components.min.js'
		},
		dist : {
			files: {
				'build/sencha.min.js':'touch/sencha-touch.js',
				'build/apps.min.js' : 'build/apps.js',
				'build/alls.min.js' : 'build/alls.js'
			}
		}
	}
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
