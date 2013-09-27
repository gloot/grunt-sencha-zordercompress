/*
 * Sencha_ZOrderCompress
 * http://www.cmszu.com
 *
 * Copyright (c) 2013 Gloot/ZWD
 * Licensed under the MIT license.
 */

module.exports = function(files, grunt, target, mode, sencha, moduFunc) {
	mode = mode ? mode : 'APP_APPJS_ADK_COMS';
	var apps = [],
		file = '',
		adkJs = sencha.adkJs,
		extcores = [];
	if (mode === 'APP_APPJS_ADK_COMS')
	{
		//APP
		for (var i=0; i<files.length; i++)
		{
			file = files[i];
			if (file.indexOf(sencha.projApp) == 0)
			{
				apps.push(file);
			} else if (file.indexOf(sencha.corePath) == 0)
			{
				extcores.push(file)
			}
		}
	} else if (mode == 'APP_APPJS_ADKCOMS')
	{
		//APP
		extcores.push(adkJs);
		for (var i=0; i<files.length; i++)
		{
			file = files[i];
			if (file.indexOf(sencha.projApp) == 0)
			{
				apps.push(file);
			} else if (file.indexOf(sencha.corePath) == 0)
			{
				extcores.push(file)
			}
		}
	}

	moduFunc(apps);

	grunt.config.set(target, files);
	grunt.config.set(target+'_apps', apps);
	grunt.config.set(target+'_ext_core', extcores);

	grunt.log.writeln('grunt apps: ===' + apps.join('\n'));
	grunt.log.writeln('grunt corefiles: ===' + extcores.join('\n'));

	grunt.log.writeln('grunt config End Mode Is: ' + mode);
}