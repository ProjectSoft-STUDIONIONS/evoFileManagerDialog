<?php
/*
@TODO:
— Открыте файлменеджера в окне редактирования документа, а не в новом окне браузера.
*/
if(!defined('MODX_BASE_PATH')){die('What are you doing? Get out of here!');}
global $manager_language;
$e = &$modx->event;

switch($e->name){
	case "OnDocFormRender":
	case "OnUserFormRender":
	case "OnWUsrFormRender":
	case "OnChunkFormRender":
	case "OnPluginFormRender":
	case "OnSnipFormRender":
		$browser = $modx->getConfig('which_browser');
		$media_browser = MODX_MANAGER_URL . 'media/browser/' . $browser . '/browse.php';
		$js = "assets/plugins/filemanageropen/js/main.js";
		$css = "assets/plugins/filemanageropen/css/main.css";
		$lng = isset($manager_language) ? (is_string($manager_language) ? $manager_language : "english") : "english";
		$lang = array(
			"files" => "Files",
			"media" => "Media",
			"images" => "Images"
		);
		if(is_file(dirname(__FILE__) . "/lang/" . $lng . ".inc.php")):
			$langFile = dirname(__FILE__) . "/lang/" . $lng . ".inc.php";
		else:
			$langFile = dirname(__FILE__) . "/lang/english.inc.php";
		endif;
		if(is_file($langFile)):
			include_once $langFile;
		endif;
		// Версия файла по времени последнего изменения файла
		if(is_file(MODX_BASE_PATH . $js))
		{
			$js = $js."?".filemtime(MODX_BASE_PATH . $js);
		}
		if(is_file(MODX_BASE_PATH . $css))
		{
			$css = $css. "?" . filemtime(MODX_BASE_PATH . $css);
		}
		
		$params = $e->params;
		$showAlert = isset($params["show_alert_copy"]) ? ((int)$params["show_alert_copy"] ? "1" : "0") : "1";
		$showButtons = isset($params["show_buttons"]) ? ((int)$params["show_buttons"] ? "1" : "0") : "1";
		$out = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/{$css}\">
		<script type=\"text/javascript\">
			window.filemanageropen_url = \"{$media_browser}\";
			window.filemanageropen_alert = {$showAlert};
			window.filemanageropen_showbtn = {$showButtons};
			window.fmolang = " . json_encode(array(
				"files"		=> $lang["files"],
				"images"	=> $lang["images"],
				"media"		=> $lang["media"]
			)) . ";
		</script>
		<script type=\"text/javascript\" src=\"/{$js}\"></script>";
		$modx->event->output($out);
		break;
}