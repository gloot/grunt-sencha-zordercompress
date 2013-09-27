/*
 * Sencha_ZOrderCompress
 * http://www.cmszu.com
 *
 * Copyright (c) 2013 Gloot/ZWD
 * Licensed under the MIT license.
 */

var grunt        = require("grunt"),
    phantomjs    = require("grunt-lib-phantomjs").init(grunt),
    connect      = require("connect"),
    path         = require("path"),
	asset        = path.join.bind(null, __dirname, ".."),
	fs			 = require('fs'),
	sendMessageString = ["<script>",
        "function sendMessage() {",
          "var args = [].slice.call(arguments);",
          "alert(JSON.stringify(args));",
        "}",
        "</script>"
    ].join("");

function senchaDependencies(processHtml, appName, mode, compassAll) {
	this.appJs = 'app.js';
	this.projApp = 'app/';
	this.appJson = 'app.json';
	this.adkJs = 'touch/sencha-touch.js';
	this.senchaDir = 'touch/src/';
	this.processHtml = (processHtml == '') ? 'index.html' : processHtml;
	this.appName = appName;
	this.mode = mode ? mode : 'APP_APPJS_ADK_COMS';
	this.compassAll = compassAll ? compassAll : true;

	///////////////////////////////////////////////////////
	this.randomfile = '.' + path.sep + "random99.html";
	this.rootPath = process.cwd(); //rootPath
	this.appRndJs = '.' + path.sep + 'app' + path.sep + 'view' + path.sep + 'appRndJs.js';
	this.tmppath = '.' + path.sep + Math.floor(Math.random() * 1000000) + ".html";
}

senchaDependencies.prototype.createServer = function(tmpurl) {
	this.app = connect().use(connect.static(this.rootPath)).listen(3000);
	grunt.log.writeln( 'process cwd current cmd path: === ' + this.rootPath);

	var replaceRegex = new RegExp('\\' + path.sep, 'g');
	var virUrl = 'http://localhost:3000/' + this.tmppath.replace(replaceRegex, '/');

	grunt.log.writeln( 'Run tmp Url: ===' + virUrl );

	return virUrl;
}

senchaDependencies.prototype.shutdownServer = function() {
	try
	{
		grunt.file['delete'](this.tmppath);
		grunt.log.writeln('Delete Temp File');
	}
	catch (e)
	{
		grunt.log.error('Delete Temp File Error!');
	}

	try
	{
		this.app.close();
		grunt.log.writeln('Close Server!');
	}
	catch (e)
	{
		grunt.log.error('Close Server Error!');
	}
}

senchaDependencies.prototype.getCoreOrderfiles = function(files) {
	var odrfiles = [];
	odrfiles.push(path.normalize(this.adkJs));

	for (var i=0; i<files.length; i++)
	{
		var jspath = files[i];
		if (jspath.indexOf(path.normalize(this.adkJs)) == 0 || jspath == this.appJs || jspath == 'app\\view\\appRndJs.js')
			continue;

		//debug not Ext.device codes
		if (jspath.indexOf('touch\\src\\device') == 0)
			continue;

		if (fs.existsSync(jspath))
		{
			var stat = fs.statSync(jspath);
			if (!stat.isDirectory())
			{
				odrfiles.push(jspath);
			}
		}
	}

	odrfiles.push(this.appJs);

	return odrfiles;
}

senchaDependencies.prototype.normalizefile = function(fileurl) {
	var regex = /http:\/\/localhost:3000\/([^?]+)(\?.*)*/g;
	var _file = fileurl;
	if (regex.test(fileurl))
	{
		_file = fileurl.replace(regex, '$1');
	} else {
		if (/^(http|https):\//.test(fileurl) == false) //cross url pass
		{
			_file = fileurl.replace(/^(..|.|\/)*?([^?]+)(\?.*)*/g, '$2');
		}
	}
	return path.normalize(_file); // /=>\\
}

senchaDependencies.prototype.normalizefiles = function(files) {
	var normalfiles = [],
		file;
	for (var i=0; i<files.length; i++)
	{
		file = this.normalizefile(files[i]);

		normalfiles.push(file);
	}
	return normalfiles;
}

senchaDependencies.prototype.runVirtualFile = function(alls) {

	var me = this;
	var requires = '';
	
	var comsfile = [];
	for (var i=0; i<alls.length; i++)
	{
		grunt.file.copy('.' + path.sep + alls[i], this.randomfile, {
			process : function(inputString) {
				var classX = 'Ext.' + alls[i].replace(me.senchaDir, '').replace('.js', '').replace(/\//g, '.'); //class

				if (inputString.indexOf(classX) > 0) //get real Ext Components >0 important
				{
					if (requires != '')
					{
						requires += ',';
					}
					requires += '\'' + classX + '\'';
				}
			}
		});
	}

	if (!fs.existsSync(this.appRndJs))
	{
		grunt.file.write(this.appRndJs, [
			'Ext.define(\''+this.appName+'.view.appRndJs\', {\n',
			'	extend : \'Ext.Container\',\n',
			'	config : {\n',
			'	}\n',
			'});'
		].join(''));
	}

	var appJscont = [
			'Ext.Loader.setPath({\n',
			'	\'Ext\': \''+this.senchaDir+'\',\n',
			'	\''+this.appName+'\': \'app\'\n',
			'});\n',
			'Ext.application({\n',
			'	name: \''+this.appName+'\',\n',
			'	requires:['+requires+'],\n',
			'	views : [\'appRndJs\'],\n',
			'	launch: function(){Ext.Viewport.add(Ext.create(\''+this.appName+'.view.appRndJs\'));}\n',
			'});\n'
		].join('');

	var tagScripts = [];

	for (var i=0; i<this.scripts; i++)
	{
		tagScripts.push('<script type=\'text/javascript\' src=\''+this.scripts[i]+'\'></script>');
	}

	var htmlcont = [
			'<html>',
			'<head>',
			sendMessageString,
			'<script type=\'text/javascript\' src=\''+this.adkJs+'\'></script>',
			'<script type=\'text/javascript\'>',
			appJscont,
			'</script>',
			tagScripts.join(''),
			'</head>',
			'<body>',
			'</body>',
			'</html>'
		].join('');

	//grunt.log.writeln('htmlcont:==' + htmlcont);

	grunt.file.write(this.tmppath, htmlcont);
}

senchaDependencies.prototype.getDependencies = function(Fn, alls) {
	var files = null,
		me = this;

	grunt.log.writeln( 'Enter dependencies=======================================' );

	var tmpthml = '';
	if (alls && alls.length > 0)
	{
		me.runVirtualFile(alls);
	}else {
		grunt.file.copy("." + path.sep + this.processHtml, this.tmppath, {
			process : function(inputString) {
				return inputString.replace("<head>", "<head>" + sendMessageString); //use return to save content to tmppath file
			}
		});
	}

	///////////////////////////////////////////////////////////

	phantomjs.on('onResourceRequested', function(response) {
		if (/\.js/.test(response.url))
		{
			//grunt.log.debug cant print out data
			grunt.log.writeln(response.url);
		}
	});

	phantomjs.on('error.onError', function(msg, tracer) {
		grunt.log.error( 'phantomjs Error:===' + msg );
	});

	phantomjs.on('extTask.done', function(findfiles) {
		//var allScripts = me.normalizefiles(findfiles.scriptTags);
		files = me.normalizefiles(findfiles.extfiles);

		grunt.log.writeln( 'Enter mytask Done!' + files.join('\n') );
		phantomjs.halt();
	});

	phantomjs.on('fail.load', function(url) {
		grunt.log.writeln( 'Fail Load:===' + url );
		phantomjs.halt();
	});

	phantomjs.on('fail.timeout', function() {
		grunt.log.writeln( 'Time out' );
		phantomjs.halt();
	});

	phantomjs.spawn(this.createServer(this.tmppath), {
		options: {
            phantomScript: asset("tasks" + path.sep + "phantomjs" + path.sep + "main.js"), //path important!!!
            loadImages: false
        },
		done : function(err) {
			try
			{
				me.shutdownServer();
				Fn(me.getCoreOrderfiles(files), {
					appJs:me.appJs, 
					adkJs: me.adkJs, 
					corePath : path.normalize(me.senchaDir), 
					projApp : path.normalize(me.projApp)
				});
			}
			catch (e)
			{
				grunt.log.error('spawn error: ===' + e);
				me.shutdownServer();
			}
		}
	});
}

senchaDependencies.prototype.setGrunt = function(curGrunt) {
	grunt = curGrunt;
}

module.exports = senchaDependencies;