;(function($) {
	$.extend($.fn, {
		getIntCss: function(key) {
			var v = parseInt(this.css(key));
			if (isNaN(v))
				return false;
			return v;
		}
	});
	$.fn.Drags = function(opts) {
		var ps = $.extend({
			zIndex: 20,
			opacity: .7,
			handler: null,
			onMove: function() { },
			onDrop: function() { }
		}, opts);
		var dragndrop = {
			drag: function(e) {
				e.preventDefault();
				var dragData = e.data.dragData;
				dragData.target.css({
					left: dragData.left + e.pageX - dragData.offLeft,
					top: dragData.top + e.pageY - dragData.offTop
				});
				dragData.onMove(e);
				return !1;
			},
			drop: function(e) {
				var dragData = e.data.dragData;
				dragData.target.css(dragData.oldCss);
				dragData.onDrop(e);
				$(dragData.target).parent().unbind('mousemove', dragndrop.drag).unbind('mouseup', dragndrop.drop);
			}
		}
		return this.each(function() {
			var me = this,
				handler = null;
			if (typeof ps.handler == 'undefined' || ps.handler == null)
				handler = $(me);
			else
				handler = (typeof ps.handler == 'string' ? $(ps.handler, this) : ps.handle);
			handler.bind('mousedown', { e: me }, function(s) {
				var target = $(s.data.e),
					oldCss = {},
					dragData = {};
				if (target.css('position') != 'absolute') {
					try {
						target.position(oldCss);
					} catch (ex) { }
					target.css('position', 'absolute');
				};
				oldCss.opacity = target.getIntCss('opacity') || 1;
				dragData = {
					left: oldCss.left || target.getIntCss('left') || 0,
					top: oldCss.top || target.getIntCss('top') || 0,
					width: target.width() || target.getIntCss('width'),
					height: target.height() || target.getIntCss('height'),
					offLeft: s.pageX,
					offTop: s.pageY,
					oldCss: oldCss,
					onMove: ps.onMove,
					onDrop: ps.onDrop,
					handler: handler,
					target: target
				}
				target.css({
					'opacity':ps.opacity
				});
				$(me).parent().bind('mousemove', { dragData: dragData }, dragndrop.drag).bind('mouseup', { dragData: dragData }, dragndrop.drop);
			});
		});
	}
})(jQuery);

;(function(document, window, $){
	window.lastImageCtrl = '';
	window.lastFileCtrl = '';
	var $kcfinderWindow = $('<div class=\"kcfinder-window\"><div class=\"kcfinder-header\"><span class=\"kcfinder-header-title\">File Manager</span><span id=\"kcfinder-close\" class=\"kcfinder-header-close\">×</span></div><div class=\"kcfinder-body\"><div id=\"kcfinder-frame\"></div></div></div>'),
		$kcfinderBlock,
		$kcfinderFrameBlock,
		$closeBtn,
		$kcfinderFrame,
		$body,
		$actions,
		rightAction = 0;
		windowloadCallback = function(){
			$body = $("body");
			$actions = $('#actions');
			$kcfinderBlock = $('<div></div>').attr({'id':'kcfinder_div'});
			$kcfinderFrameBlock = $('#kcfinder-frame', $kcfinderWindow);
			$closeBtn = $('#kcfinder-close', $kcfinderWindow);
			$body.append($kcfinderBlock.append($kcfinderWindow));
			$closeBtn.on("click", closeBtnCallback);
		},
		clearBodyStyle = function(body, actions){
			lastFileCtrl = lastFileCtrl = '';
			window.KCFinder = null;
			$kcfinderBlock.removeAttr("style");
			$kcfinderFrameBlock.html("");
			if(body.length){
				body[0].style.overflow = "";
				body[0].style.marginRight = "";
				body[0].style.position = "";
			}
			if(actions.length)
				actions[0].style.right = "";
		},
		closeBtnCallback = function (e){
			e.preventDefault();
			clearBodyStyle($body, $actions);
			return !1;
		},
		openDialogWindow = function(){
			$kcfinderWindow.removeAttr("style");
			if($actions.length){
				rightAction = parseInt($actions.getIntCss('right'));
			}
			$(".kcfinder-window", $kcfinderBlock).Drags({
				handler: '.kcfinder-header',
				left: '30px',
				top: '30px',
				opacity: .85
			});
		},
		window_init = function(){
			windowloadCallback();
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
								clearBodyStyle($body, $actions);
							}
							if(window.KCFinder.callBackMultiple){
								window.KCFinder.callBackMultiple = fn;
							}
							window.KCFinder.callBack = fn;
						})(window.KCFinder.callBackMultiple||window.KCFinder.callBack);
						OpenServerBrowser(arguments[0]);
					}else{
						// Иначе работает метод window.open, как и должно быть.
						return proxied.apply(this, srg);
					}
				};
			})(window.open);
		},
		// Дирректория файла которая указана в input
		directory = function(ctrl){
			var dir = "",
				input = document.getElementById(ctrl),
				value = input.value.replace(/assets\//g, ""),
				path = value.replace(/^(.+?\/)((\.\.\/)?[^\/]+)$/, '$1');
			if(path!=""){
				dir += "&dir="+path;
			}
			return dir;
		};
	// Переопределяем глобальную функию OpenServerBrowser
	window.OpenServerBrowser = function(url) {
		var w1 = $body.outerWidth(true),
			w2,
			w3;
		$body.css({
			"position": "relative",
			"overflow": "hidden"
		});
		w2 = $body.outerWidth(true),
		w3 = w2-w1;
		if(w1 != w2) {
			$body.css({
				"marginRight": w3+'px'
			});
			$actions.css({"right": rightAction+w3+"px"});
		}
		
		$('.kcfinder-header .kcfinder-header-title', $kcfinderBlock).text("FileManager");
		
		$kcfinderFrame = $("<iframe>").attr({
			'class'			: 'kcfinder_iframe',
			'name'			: 'kcfinder_iframe',
			'src'			: url,
			'frameborder'	: 0,
			'scrolling'		: 'no'
			
		});
		$kcfinderFrameBlock.html($kcfinderFrame);
		$kcfinderBlock.css({
			'display':'block'
		});
		$kcfinderFrame = $("iframe", $kcfinderFrameBlock);
		$kcfinderFrame.on('load', function(){
			var iframeDocument = $kcfinderFrame[0].contentWindow.document;
			$('.kcfinder-header .kcfinder-header-title', $kcfinderBlock).text(iframeDocument.title);
			$('a[href="kcact:maximize"]', iframeDocument).hide();
			$("title", iframeDocument)[0].addEventListener("DOMSubtreeModified", function() {
				$('.kcfinder-header .kcfinder-header-title', $kcfinderBlock).text(iframeDocument.title);
			});
		});
	}
	// Переопределяем глобальную функию BrowseServer
	window.BrowseServer = function(ctrl) {
		openDialogWindow();
		lastImageCtrl = ctrl;
		if($kcfinderBlock.length){
			if ($kcfinderBlock[0].style.display == "block") {
				clearBodyStyle($body, $actions);
				return;
			}
		}
		// Переопределяем объект window.KCFinder
		window.KCFinder = {
			callBack: function(url) {
				field = document.getElementById(lastImageCtrl);
				window.KCFinder = null;
				field.value = url;
				SetUrlChange(field);
				clearBodyStyle($body, $actions);
			}
		};
		var dir = directory(ctrl);
		OpenServerBrowser(window.filemanageropen_url + '?type=images' + dir);
	}
	// Переопределяем глобальную функию BrowseFileServer
	window.BrowseFileServer = function(ctrl) {
		openDialogWindow();
		lastFileCtrl = ctrl;
		if($kcfinderBlock.length){
			if ($kcfinderBlock[0].style.display == "block") {
				clearBodyStyle($body, $actions);
				return;
			}
		}
		// Переопределяем объект window.KCFinder
		window.KCFinder = {
			callBack: function(url) {
				field = document.getElementById(lastFileCtrl);
				window.KCFinder = null;
				field.value = url;
				SetUrlChange(field);
				clearBodyStyle($body, $actions);
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
	
})(document, window, jQuery);