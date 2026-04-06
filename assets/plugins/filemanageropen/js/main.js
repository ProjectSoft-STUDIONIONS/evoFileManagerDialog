;(function(document, window, $){
	window.lastImageCtrl = '';
	window.lastFileCtrl = '';
	var currentWin = window,
		$actions,
		showAlert = window.filemanageropen_alert || 0,
		showButtons = window.filemanageropen_showbtn || 0;
		window_init = function(){
			// Переопределяем метод window.open
			(function(proxied) {
				window.open = function() {
					var srg = arguments;
					// Если заданы имена окон Файл Менеджера
					if(arguments[1] == 'FileManager' || arguments[1] == 'FCKBrowseWindow'){
						// Переопределяем KCFinder от Файл Менеджера
						(function(px){
							var fn = function(){
								px.apply(this, arguments);
							}
							if(window.KCFinder.callBackMultiple){
								window.KCFinder.callBackMultiple = fn;
							}
							window.KCFinder.callBack = fn;
						})(window.KCFinder.callBackMultiple || window.KCFinder.callBack);
						OpenServerBrowser(arguments[0]);
					}else{
						if(arguments[1] == 'gener') {
							// Вырубаем открытие в новом окне шаблоны, тв-параметры, чанки, сниппеты, плагины, модули.
							let evoMod = window.modx || window.parent.modx;
							// Открываеи через API modx
							evoMod.popup(
								{
									url: window.location.origin + window.location.pathname + srg[0],
									title: "gener",
									icon: 'fa fa-external-link',
									iframe: 'iframe',
									position: 'center center',
									width: '99%',
									height: '99%',
									hide: 0,
									hover: 0,
									resize: !0,
									overlay: 1,
									overlayclose: 1,
									onclose: function() {
										if(typeof reloadElementsInTree == 'function'){
											setTimeout(reloadElementsInTree, 400);
										}
									},
									wrap: document.body
								}
							);
						}else{
							// Иначе работает метод window.open, как и должно быть.
							return proxied.apply(this, srg);
						}
					}
				};
			})(window.open);
		},
		// Дирректория файла которая указана в input
		directory = function(ctrl){
			var dir = "",
				value = "",
				path = "",
				input = ctrl ? document.getElementById(ctrl) : document.getElementsByName('photo')[0];
			if(input){
				value = input.value.replace(/assets\//g, "");
				path = value.replace(/^(.+?\/)((\.\.\/)?[^\/]+)$/, '$1');
			}
			if(path!=""){
				dir += "&dir="+path;
			}
			return dir;
		},
		copyFilePath = function(file_path){
			var fl = window.fmolang;
			file_path = file_path.join("\n");
			if(currentWin.navigator.clipboard){
				currentWin.navigator.clipboard.writeText(file_path).then(function(){
					if(showAlert){
						currentWin.alert(fl["copy"] + "\n" + file_path);
					}
				}, function(err){
					alternativeCopyFilePath(file_path);
				});
			}else{
				alternativeCopyFilePath(file_path);
			}
			function alternativeCopyFilePath(path) {
				var fl = window.fmolang;
				try {
					var input =  currentWin.document.createElement("textarea");
					input.value = path;
					currentWin.document.body.appendChild(input);
					input.style.cssText = 'opacity: 0px; position: fixed; top: 0px; left: 0px';
					input.focus();
					input.select();
					if(!currentWin.document.execCommand('copy')) {
						currentWin.alert(fl["nocopy"]);
					}
					currentWin.document.body.removeChild(input);
					if(showAlert){
						currentWin.alert(fl["copy"] + "\n" + path);
					}
				} catch (err) {
					currentWin.alert(fl["nocopy"]);
				}
			}
		};
	window.SetUrlChange = function(el) {
		if('createEvent' in document) {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent('change', false, true);
			el.dispatchEvent(evt);
		} else {
			el.fireEvent('onchange');
		}
	}
	// Переопределяем глобальную функию OpenServerBrowser
	window.OpenServerBrowser = function(url) {
		let evoMod = window.modx || window.parent.modx;
		let evoPopupHeader;
		let popup;
		let pWidth;
		let pHeight;
		let myReq;
		const eventHandler = (event) => {
			//
			let data = typeof event.data == "string" ? JSON.parse(event.data) : event.data;
			switch(data.type){
				case "kcfinder:change-title":
					if(evoPopupHeader) {
						evoPopupHeader.innerHTML = data.title;
					}
					break;
			}
		};
		const eventResizeHandler = function() {
			if ( popup ) {
				let w,
					h,
					cw = Cookies.get('KCFINDER_popup_width') || '99%',
					ch = Cookies.get('KCFINDER_popup_height') || '99%';
				w = parseInt(100 * popup.el.offsetWidth / window.innerWidth) + "%";
				h = parseInt(100 * popup.el.offsetHeight / window.innerHeight) + "%";
				if ( w != parseInt(cw) + "%" ) {
					Cookies.set('KCFINDER_popup_width', parseInt(w), { expires: 7, path: '' });
				}
				if ( h != parseInt(ch) + "%" ) {
					Cookies.set('KCFINDER_popup_height', parseInt(h), { expires: 7, path: '' });
				}
				myReq = requestAnimationFrame(eventResizeHandler);
			} else {
				cancelAnimationFrame(myReq);
			}
		};
		pWidth = Cookies.get('KCFINDER_popup_width') || '99%';
		pHeight = Cookies.get('KCFINDER_popup_height') || '99%';
		// Открываеи через API modx
		popup = evoMod.popup(
			{
				url: url,
				title: "File Manager Dialog",
				icon: 'fa fa-external-link',
				iframe: 'iframe',
				position: 'center center',
				width: parseInt(pWidth) + "%",
				height: parseInt(pHeight) + "%",
				hide: 0,
				hover: 0,
				resize: !0,
				overlay: 1,
				overlayclose: 1,
				onclose: function() {
					if(typeof reloadElementsInTree == 'function'){
						setTimeout(reloadElementsInTree, 400);
					}
					// Удалить
					evoPopupHeader = null;
					window.removeEventListener('message', eventHandler);
					// остановка
					cancelAnimationFrame(myReq);
					popup = null;
				},
				wrap: document.body
			}
		);
		setTimeout(() => {
			let popupEl = popup.el;
			evoPopupHeader = popupEl.querySelector('.evo-popup-header');
			window.addEventListener('message', eventHandler);
			// старт
			myReq = requestAnimationFrame(eventResizeHandler);
		}, 100);
	}
	// Переопределяем глобальную функию BrowseServer
	window.BrowseServer = function(ctrl) {
		//openDialogWindow();
		var dir = "";
		if(ctrl){
			lastImageCtrl = ctrl;
			// Переопределяем объект window.KCFinder
			window.KCFinder = {
				callBack: function(url) {
					var field = document.getElementById(lastImageCtrl);
					window.KCFinder = null;
					field.value = url;
					SetUrlChange(field);
				}
			};
			dir = directory(ctrl);
		}else{
			// По сути нужно попытаться найти соседний input.
			window.KCFinder = {
				callBack: function(url) {
					var field = $('input[name="photo"]'),
						img = $('img[name=iphoto]');
					window.KCFinder = null;
					if(field.length){
						field.val(url);
						img.attr({
							src: "/" + url
						})
						SetUrlChange(field[0]);
					}
				}
			};
			dir = directory();
		}
		OpenServerBrowser(window.filemanageropen_url + '?type=images' + dir);
	}
	// Переопределяем глобальную функию BrowseFileServer
	window.BrowseFileServer = function(ctrl) {
		//openDialogWindow();
		lastFileCtrl = ctrl;
		// Переопределяем объект window.KCFinder
		window.KCFinder = {
			callBack: function(url) {
				field = document.getElementById(lastFileCtrl);
				window.KCFinder = null;
				field.value = url;
				SetUrlChange(field);
			}
		};
		var dir = directory(ctrl);
		OpenServerBrowser(window.filemanageropen_url + '?type=files' + dir);
	}
	if (window.addEventListener) {
		window.addEventListener('load', window_init, false);
	} else if (window.attachEvent)  {
		window.attachEvent('onload', window_init);
	}

	/**
	 ** Добавим кнопки к контенту
	**/
	if(showButtons){
		var $td = $('#actions');
		if($td.length){
			var fl = window.fmolang;
			var html = `<div class="evoflbw_wrapper btn-group">`;
			html += `<a href="evoflbw:button" data-type="images" class="btn btn-secondary"><i class="fas fa-file-image fa"></i><span>` + fl["images"] + `</span></a>`;
			html += `<a href="evoflbw:button" data-type="media" class="btn btn-secondary"><i class="fas fa-file-video fa"></i><span>` + fl["media"] + `</span></a>`;
			html += `<a href="evoflbw:button" data-type="files" class="btn btn-secondary"><i class="fas fa-file-alt fa"></i><span>` + fl["files"] + `</span></a>`;
			html += `</div>`;
			$td.append(html);
			$('a[href*="evoflbw:"]').on('click', function(e){
				e.preventDefault();
				var attr = $(this).attr("data-type");
				window.KCFinder = {
					callBackMultiple: function(url) {
						copyFilePath(url);
					}
				};
				//openDialogWindow();
				OpenServerBrowser(window.filemanageropen_url + '?type=' + attr);
				return !1;
			});
		}
	}
})(document, window, jQuery);
