<?php

class SmsActivate{
    public static function activate(){
        flush_rewrite_rules();

        //Popular opciones default en la activacion
        // Verificar si existe la opcion (registro) : return 
        $now = new DateTime();
        $date_paid = $now->format('Y-m-d H:i:s');
        $token = md5(get_option('admin_email').$date_paid);

        if(!get_option('sms_plugin_token'))
            add_option('sms_plugin_token',$token);

    }
}