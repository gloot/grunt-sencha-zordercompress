/*
 * Sencha_ZOrderCompress
 * http://www.cmszu.com
 *
 * Copyright (c) 2013 Gloot/ZWD
 * Licensed under the MIT license.
 */

'use strict';

var path = require("path"),
	depenconfig = require(__dirname + path.sep + 'sencha_grunt_set.js'),
	depenHolder = require(__dirname + path.sep + 'sencha_phantomjs_holder.js'),
	allcomponents = [];

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  function getOptions(instance) {
	  return instance.options({});
  }

  function setOtherComponentsInOrder(files) {
	  for (var i=0; i<allcomponents.length; i++)
	  {
		  var hasIn = false;
		  var jspath = allcomponents[i];
		  for (var j=0; j<files.length; j++)
		  {
			  if (jspath.toLowerCase() == files[j].toLowerCase())
			  {
				  hasIn = true;
				  break;
			  }
		  }

		  if (hasIn == false)
		  {
			  //grunt.log.writeln('Else files: ' + jspath);
			  files.push(jspath);
		  }
	  }

	  return files;
  }

  grunt.registerMultiTask('Sencha_ZOrderCompress', 'Compress compile sencha by order Loaded javascript files!', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var me = this,
		options = getOptions(me),
		done = me.async();

	grunt.log.writeln( 'Start Task: === Sencha_ZOrderCompress' );
	
	var holder = new depenHolder(options.processHtml, options.appName, options.mode, options.compassAll);
	holder.setGrunt(grunt);

	me.files.forEach(function(f) { //important
		var coms = f.src.filter(function(filepath) {
			//grunt.log.writeln('component files: ' + filepath);
			allcomponents.push(filepath);
		});
	});
	var usecoms = options.compassAll ? allcomponents : [];
	
	holder.getDependencies(function(files, sencha) {
		
		grunt.log.writeln( 'Task Target:===================================' + me.target); //out dist

		depenconfig(files, grunt, 'Sencha_ZOrderCompress_'+me.target, options.mode, sencha, options.moduFunc);
		done();
	}, usecoms);
  });

};
