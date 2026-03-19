<?php
require_once SMS_PLUGIN_PATH . 'class/sms-generals.php';

class SmsDeactivate{
    public static function deactivate(){
        flush_rewrite_rules();

        SMSGenerals::reset_shop();

    }
}