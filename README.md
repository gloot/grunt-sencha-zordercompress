# grunt-sencha-zordercompress

### English description!
> Compress compile sencha by order Loaded javascript files!

### 中文说明
> 按顺序压缩指定Sencha加载的脚本文件, 可以选择多种模式压缩;  

grunt-sencha-zordercompress分按需压缩与全压缩两种方式;  

每种方式下又可以分：  
1. APP_APPJS_ADKCOMS : 压缩两份: apps/下的文件, 以及 sdk+components的文件  

2. APP_APPJS_ADK_COMS : 压缩三份 : apps/下的文件, 以及 sdk文件 和 components文件三部分.  

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
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  Sencha_ZOrderCompress: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  Sencha_ZOrderCompress: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
