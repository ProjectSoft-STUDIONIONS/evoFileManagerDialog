const fs = require('fs'),
	zip = new require('node-zip')(),
	path = require('path'),
	{ promisify } = require('util'),
	UglifyJS = require("uglify-js"),
	readdir = promisify(fs.readdir),
	stat = promisify(fs.stat),
	pkg = require(path.normalize(__dirname + '/package.json')),
	version = pkg.version || "",
	evoname = pkg.evoname || "",
	category = pkg.category || "Manager and Admin",
	author = pkg.author || "",
	description = pkg.description || "",
	issue = pkg.bugs.url || "",
	homepage = pkg.homepage || "",
	licensePage = (function(){
		let arr = homepage.split('#');
		arr.pop();
		arr.push('blob/master/LICENSE');
		return arr.join('/');
	})(),
	license = pkg.license || "",
	today = new Date().toISOString().split('T')[0],
	DocBlock = `/**
 * ${evoname}
 *
 * ${description}
 *
 * @category     plugin
 * @version      ${version}
 * @package      evo
 * @internal     @events OnManagerMainFrameHeaderHTMLBlock
 * @internal     @modx_category ${category}
 * @internal     @properties &show_buttons=Показать кнопки файлменеджера в ресурсе;list;0,1;1 &show_alert_copy=Показать сообщение о копировании пути в FileManager;list;0,1;0
 * @internal     @installset base
 * @internal     @disabled 0
 * @homepage     ${homepage}
 * @license      ${licensePage} ${license} License (${license})
 * @reportissues ${issue}
 * @author       ${author}
 * @lastupdate   ${today}
 */`,
	tpl = `//<?php\n${DocBlock}\n\n${DocBlock}\nrequire MODX_BASE_PATH.'assets/plugins/filemanageropen/plugin.filemanageropen.php';`,
	readmeHeader = `| Название |  Автор | Дата создания | Дата обновления |
| --- | --- | --- | --- |
| ${evoname} Evolution CMS | ${author} | 2017-11-24  | ${today} |
`;

/**
 * Сборка шаблона установки
 */
let readme = fs.readFileSync(path.normalize(path.join(__dirname, '.readme.md')));
fs.writeFileSync(path.normalize(path.join(__dirname, 'README.md')), `${readmeHeader}\n${readme}`, {encoding: 'utf8'});
fs.writeFileSync(path.normalize(path.join(__dirname, 'install', 'assets', 'plugins', 'filemanageropen.tpl')), tpl, {encoding: 'utf8'});
zip.folder(evoname).file('LICENSE', fs.readFileSync(path.normalize(path.join(__dirname, 'LICENSE'))));
zip.folder(evoname).file('README.md', fs.readFileSync(path.normalize(path.join(__dirname, 'README.md'))));

/**
 * Сборка архива
 */
async function getFiles(dir) {
	const subdirs = await readdir(dir);
	const files = await Promise.all(subdirs.map(async (subdir) => {
		const res = path.resolve(dir, subdir);
		return (await stat(res)).isDirectory() ? getFiles(res) : res;
	}));
	return files.reduce((a, f) => a.concat(f), []).map((sub) => {
		let file = path.normalize(sub).replace(path.normalize(__dirname), "").replace(/\\+/g, '/').replace(/^\//, "");
		return file;
	});
}

function normalizeFiles(arr){
	let arrFile = [];
	for(let a in arr){
		let old = path.parse(arr[a]);
		arrFile.push({
			dir: old.dir,
			name: old.base
		});
	}
	return arrFile;
}

async function buildCss(inputCss, outputCss, commands = []) {
	let command = Array.isArray(commands) ? commands.join(" ") : "";
	const {exec} = require('child_process');
	return new Promise((resolve, reject) => {
		const bat = exec(`lessc "${inputCss}" "${outputCss}" ${command}`, (error, stdout, stderr) => {
			if (stdout) {
				if (!stdout.trim()) {
					reject(`None`);
				} else {
					resolve(stdout.trim())
				}
			} else if (error) {
				reject(error);
			} else if (stderr) {
				reject(stderr);
			} else {
				resolve('compile');
			}
		});
	});
}

/**
 * Архивируем директории assets и install
 */
function buildArhive() {
	getFiles(path.normalize(path.join(__dirname, 'assets'))).then(async function(result){
		normalizeFiles(result).forEach(function(a, b, c){
			let fl = zip.folder(`${pkg.evoname}/${a.dir}`);
			fl.file(a.name, fs.readFileSync(path.normalize(path.join(__dirname, a.dir, a.name))));
		});
		getFiles(path.normalize(path.join(__dirname, 'install'))).then(async function(result){
			normalizeFiles(result).forEach(function(a, b, c){
				let fl = zip.folder(`${pkg.evoname}/${a.dir}`);
				fl.file(a.name, fs.readFileSync(path.normalize(path.join(__dirname, a.dir, a.name))));
			});
			setTimeout(() =>{
				let data = zip.generate({base64:false, compression:'DEFLATE'});
				fs.writeFileSync(`${pkg.evoname}.zip`, data, 'binary');
				console.log(`> SAVE ${pkg.evoname}.zip`);
			}, 500);
		});
	});
}
/**
 * Собираем CSS
 */
buildCss(
	path.normalize(
		path.join(__dirname, "assets/plugins/filemanageropen/css/main-code.less")
	),
	path.normalize(
		path.join(__dirname, "assets/plugins/filemanageropen/css/main.css")
	),
	[
		"-clean-css"
	]
).then(function(resolve){
	/**
	 * Собираем JS
	 */
	let options = {};
	fs.writeFileSync(
		path.normalize(
			path.join(__dirname, "assets/plugins/filemanageropen/js/main.js")
		),
		UglifyJS.minify(
			{
				"main.js": fs.readFileSync(
					path.normalize(
						path.join(__dirname, "assets/plugins/filemanageropen/js/main-code.js")
					),
					"utf8"
				)
			},
			options
		).code,
		"utf8"
	);
	/**
	 * Архивируем
	 */
	buildArhive();
}).catch(function(error){
	console.log(error);
});

