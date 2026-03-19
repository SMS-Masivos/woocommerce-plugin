<?php
    require_once SMS_PLUGIN_PATH . 'class/sms-history.php';

    class SMSGenerals{
        public static function status_order($order_id, $from, $to, $order){
            $apikey = get_option('sms_plugin_apikey');
            $token = get_option('sms_plugin_token');
            $shop = get_option('home');
            $list = get_option('sms_plugin_automations');
            //$order = json_decode($order,true);
            if($apikey && $token && $shop){
                $list = json_decode($list,true);
                $message = "";

                switch ($to) {
                    case 'processing': $to = "9"; $message = "SMS Enviado / Notificación de nueva orden / orden en proceso"; break; // Cambio de status en la orden 
                    case 'pending': $to = "12"; $message = "SMS Enviado / Notificación / orden pendiente"; break; // Cambio de status en la orden
                    case 'on-hold': $to = "13"; $message = "SMS Enviado / Notificación / orden en espera"; break; // Cambio de status en la orden
                    case 'completed': $to = "14"; $message = "SMS Enviado / Notificación / orden completada o feedback"; break; // Cambio de status en la orden
                    case 'cancelled': $to = "15"; $message = "SMS Enviado / Notificación / orden cancelada"; break; // Cambio de status en la orden
                    default: break;
                }

                if (in_array($to, $list) || ($to == "9") || ($to == "14" && in_array("11", $list))){
                    $status = json_decode($order,true);
                    $curl = curl_init();

                    curl_setopt_array($curl, array(
                    CURLOPT_URL => "https://pluginssandbox.smsmasivos.com.mx/wp/automation/endpoint",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_SSL_VERIFYPEER => true,
                    CURLOPT_SSL_VERIFYHOST => 2,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS =>json_encode($status),
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/json",
                        "cache-control: no-cache",
                        'Authorization: Basic ' . base64_encode($token . ':' . $apikey),
                        "sms_shop_name: {$shop}"
                        ),
                    ));

                    $data = curl_exec($curl);
                    $err = curl_error($curl);
                    curl_close($curl);
                    
                    

                    if($to == "14"){
                        if(in_array("14", $list)) SMSHistory::newrecord($order_id,$message,$data, $err, $to);
                        if(in_array("11", $list)) SMSHistory::newrecord($order_id,"SMS Enviado / Solicitud de retroalimentación al cliente (Feedback)",$data, $err, "11");
                    }else if($to == "9"){
                        if(in_array("9", $list)) SMSHistory::newrecord($order_id,$message,$data, $err, $to);
                        if(in_array("10", $list)) SMSHistory::newrecord($order_id,"SMS Enviado / Notificación de pago contra entrega",$data, $err, "10");
                    }else 
                        SMSHistory::newrecord($order_id,$message,$data, $err, $to);

                    
                }
            }
        }

        public static function fulfillment_created($args){
            $apikey = get_option('sms_plugin_apikey');
            $token = get_option('sms_plugin_token');
            $shop = get_option('home');
            $list = get_option('sms_plugin_automations');

            $response = false;
            //$order = json_decode($order,true);
            if($apikey && $token && $shop){
                $list = json_decode($list,true);

                if (in_array("7", $list)){
                    //$status = json_decode($args,true);
                    $curl = curl_init();

                    curl_setopt_array($curl, array(
                    CURLOPT_URL => "https://pluginssandbox.smsmasivos.com.mx/wp/automation/endpoint",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_SSL_VERIFYPEER => true,
                    CURLOPT_SSL_VERIFYHOST => 2,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => json_encode($args),
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/json",
                        "cache-control: no-cache",
                        'Authorization: Basic ' . base64_encode($token . ':' . $apikey),
                        "sms_shop_name: {$shop}"
                        ),
                    ));

                    $data = curl_exec($curl);
                    $err = curl_error($curl);
                    curl_close($curl);

                    $response = SMSHistory::newrecord($args["order"],"SMS Enviado / Notificación sobre detalles del envío {$args["company"]} / {$args["tracking_number"]}",$data, $err, 7);
                }else $response = ["success" => true, "message" => "Intentaste envíar un mensaje pero esta automatización no esta activa, cambia el estatus e intentalo nuevamente"];
            }else $response = ["success" => true, "message" => "Algo salio mal al momento de enviar el mensaje, inicia sesión nuevamente, te sugerimos recargar la página e intentar nuevamente"];

            return $response;
        }

        public static function set_credentials($args){
            $apikey = get_option('sms_plugin_apikey');
            $token = get_option('sms_plugin_token');
            $shop = get_option('home');

            //$order = json_decode($order,true);
            if($apikey && $token && $shop){
      
                $curl = curl_init();

                curl_setopt_array($curl, array(
                CURLOPT_URL => "https://pluginssandbox.smsmasivos.com.mx/wp/automation/credentials",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($args),
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "cache-control: no-cache",
                    'Authorization: Basic ' . base64_encode($token . ':' . $apikey),
                    "sms_shop_name: {$shop}"
                    ),
                ));

                curl_exec($curl);
                curl_close($curl);
                    
            }

            return;
        }

        public static function reset_shop(){

            $apikey = get_option('sms_plugin_apikey');
            $token = get_option('sms_plugin_token');
            $shop = get_option('home');

            delete_option('sms_plugin_apikey');

            if($token && $shop){
    
                $curl = curl_init();

                curl_setopt_array($curl, array(
                CURLOPT_URL => "https://pluginssandbox.smsmasivos.com.mx/wp/reset",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "cache-control: no-cache",
                    'Authorization: Basic ' . base64_encode($token . ':' . $shop)
                    ),
                ));

                curl_exec($curl);
                curl_close($curl);
                    
            }
        }
    }