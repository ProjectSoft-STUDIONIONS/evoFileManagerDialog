//<?php
/**
 * EvoFileManagerDialog
 *
 * Плагин открытия файлменеджера не в новом окне браузера, а во всплывающем окне админки Evolution CMS.
 *
 * @category     plugin
 * @version      1.3.3
 * @package      evo
 * @internal     @events OnManagerMainFrameHeaderHTMLBlock,OnManagerTopPrerender
 * @internal     @modx_category Manager and Admin
 * @internal     @properties &show_buttons=Показать кнопки файлменеджера в ресурсе;list;0,1;1 &show_alert_copy=Показать сообщение о копировании пути в FileManager;list;0,1;0 &show_files=Показать кнопку файлов;list;0,1;1 &show_images=Показать кнопку изображений;list;0,1;1 &show_media=Показать кнопку медиа;list;0,1;1
 * @internal     @installset base
 * @internal     @disabled 0
 * @homepage     https://github.com/ProjectSoft-STUDIONIONS/evoFileManagerDialog#readme
 * @license      https://github.com/ProjectSoft-STUDIONIONS/evoFileManagerDialog/blob/master/LICENSE MIT License (MIT)
 * @reportissues https://github.com/ProjectSoft-STUDIONIONS/evoFileManagerDialog/issues
 * @author       Чернышёв Андрей aka ProjectSoft <projectsoft2009@yandex.ru>
 * @lastupdate   2026-06-16
 */

/**
 * EvoFileManagerDialog
 *
 * Плагин открытия файлменеджера не в новом окне браузера, а во всплывающем окне админки Evolution CMS.
 *
 * @category     plugin
 * @version      1.3.3
 * @package      evo
 * @internal     @events OnManagerMainFrameHeaderHTMLBlock,OnManagerTopPrerender
 * @internal     @modx_category Manager and Admin
 * @internal     @properties &show_buttons=Показать кнопки файлменеджера в ресурсе;list;0,1;1 &show_alert_copy=Показать сообщение о копировании пути в FileManager;list;0,1;0 &show_files=Показать кнопку файлов;list;0,1;1 &show_images=Показать кнопку изображений;list;0,1;1 &show_media=Показать кнопку медиа;list;0,1;1
 * @internal     @installset base
 * @internal     @disabled 0
 * @homepage     https://github.com/ProjectSoft-STUDIONIONS/evoFileManagerDialog#readme
 * @license      https://github.com/ProjectSoft-STUDIONIONS/evoFileManagerDialog/blob/master/LICENSE MIT License (MIT)
 * @reportissues https://github.com/ProjectSoft-STUDIONIONS/evoFileManagerDialog/issues
 * @author       Чернышёв Андрей aka ProjectSoft <projectsoft2009@yandex.ru>
 * @lastupdate   2026-06-16
 */
require MODX_BASE_PATH.'assets/plugins/filemanageropen/plugin.filemanageropen.php';