module.exports = function(grunt){
	process.removeAllListeners('warning');
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var gc = {},
		pkg = grunt.file.readJSON('package.json'),
		path = require('path'),
		uniqid = function () {
			let result = URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, '');
			return result;
		};
	function getTasks() {
		switch(process.env.GRUNT_TASK){
			default:
				return [
					'imagemin',
					'pug'
				];
		}
	}
	grunt.initConfig({
		globalConfig : gc,
		pkg : pkg,
		imagemin: {
			files: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'pages/images/*.{png,jpg,gif}'
						],
						dest: 'docs/images/',
						filter: 'isFile'
					}
				],
			}
		},
		pug: {
			files: {
				options: {
					pretty: '\t',
					separator:  '\n',
					// https://projectsoft-studionions.github.io/FontMassivePackInstaller/
					data: function(dest, src) {
						return {
							"hash": uniqid(),
							"repo": "projectsoft-studionions.github.io",
							"userName": "ProjectSoft-STUDIONIONS",
							"page": "evoFileManagerDialog",
							"download": "evoFileManagerDialog.zip",
							"title": "Плагин открытия файлменеджера Evolution CMS | ProjectSoft GitHub Pages",
							"h1title": "Плагин открытия файлменеджера Evolution CMS",
							"description": "Плагин открытия файлменеджера не в новом окне браузера, а во всплывающем окне админки Evolution CMS.",
							"keywords": "ProjectSoft, STUDIONIONS, ProjectSoft-STUDIONIONS, evoFileManagerDialog, Evolution CMS, Плагин",
							"nickname": "ProjectSoft",
							"logotype": "projectsoft.png",
							"copyright": "2008 - all right reserved",
							"open_graph": {
								"image_16x9": "evofilemanagerdialog.png",
								"image_16x9_width": "1918",
								"image_16x9_height": "965",
								"image_1x1": "evofilemanagerdialog-400.png",
								"image_1x1_width": "400",
								"image_1x1_height": "201",
							}
						}
					}
				},
				files: {
					"docs/index.html": ['pages/pug/index.pug'],
				}
			}
		},
	});
	grunt.registerTask('default', getTasks());
}