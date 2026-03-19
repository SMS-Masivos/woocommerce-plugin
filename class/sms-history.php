<?php 

    class SMSHistory{

        public static function newrecord($orderid, $mensaje, $data, $err, $type){
            try {
                date_default_timezone_set('America/Mexico_City');
                if(!$err){
                    global $wpdb;
                    if($data){
                        $data = json_decode($data,true);
                        if($data["success"] && $data["sent"]){
                            $status = 9;
                            $msj = null;
                        
                            foreach ($data["sent"] as $element) {
                                if($element["recipient"] == 0 && $element["type"] == $type){
                                    $status = $element["status"];
                                    $msj = isset($element["message"]) ? $element["message"] : false;
                                }
                            }
                            
                            switch ($status) {
    
                                case 0: break;
        
                                case 1: $mensaje = "Intento de envío fallido, el mensaje final es demasiado largo";  break;
         
                                case 2: $mensaje = "Intento de envío fallido, el destinatario no cuenta con un número de teléfono para su entrega";  break;
        
                                default: $mensaje = $msj ? "Error, algo salio mal al momento de procesar tu mensaje. Reason: ".$msj : "Error, Algo salio mal al intentar procesar tu mensaje, intentalo más tarde";
                            
                            }
        
                            $wpdb->insert("{$wpdb->prefix}comments", array(
                                'comment_post_ID' => $orderid,
                                'comment_author' => 'SMS MASIVOS Plug-In',
                                'comment_date' => date('Y-m-d H:i:s'),
                                'comment_date_gmt' => date('Y-m-d H:i:s'),
                                'comment_content' => $mensaje,
                                'comment_type' => 'order_note'
                            ));
        
                            return ["success" => true, "message" => $mensaje];
                        }
                    } 
                } 

                self::unknown($orderid);
                return ["success" => true, "message" => "Error, algo salio mál y no se pudo procesar tu mensaje"];
                
                
            } catch (\Throwable $th) {
                return ["success" => false, "message" => "Error algo salio mal, intentalo más tarde"];
            }
        }

        private static function unknown($orderid){

            date_default_timezone_set('America/Mexico_City');
            global $wpdb;
            $wpdb->insert("{$wpdb->prefix}comments", array(
                'comment_post_ID' => $orderid,
                'comment_author' => 'SMS MASIVOS Plug-In',
                'comment_date' => date('Y-m-d H:i:s'),
                'comment_date_gmt' => date('Y-m-d H:i:s'),
                'comment_content' => "Error, algo salio mál y no se pudo procesar tu mensaje, intentalo nuevamente",
                'comment_type' => 'order_note'
            ));

            return;
        }
        
    }