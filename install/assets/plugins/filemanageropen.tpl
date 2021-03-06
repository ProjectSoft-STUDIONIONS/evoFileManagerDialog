//<?php
/**
 * EvoFileManagerDialog
 *
 * Открыте файлменеджера в окне редактирования документа, а не в новом окне браузера.
 *
 * @category    plugin
 * @version     1.2.1
 * @license     http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @package     modx
 * @author      ProjectSoft<projectsoft2009@yandex.ru> (https://projectsoft.ru/)
 * @internal    @events OnDocFormRender,OnUserFormRender,OnWUsrFormRender
 * @internal    @modx_category Manager and Admin
 * @internal    @properties &show_buttons=Показать кнопки файлменеджера в ресурсе;list;0,1;1 &show_alert_copy=Показать сообщение о копировании пути в FileManager;list;0,1;1
 * @internal    @installset base
 * @internal    @disabled 0
 */
 
require MODX_BASE_PATH.'assets/plugins/filemanageropen/plugin.filemanageropen.php';
