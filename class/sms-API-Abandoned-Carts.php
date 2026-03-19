<?php

class SMSApiAbandonedCarts{

	protected $namespace = 'wc/v3';

	protected $rest_base = 'abandoned_carts';

	public function get_carts( $req ) {
        $params = $req->get_params();
        
        $default = date_default_timezone_get();
        //new time zone
        date_default_timezone_set($params["timezone"]);
        $date = date('d-m-Y H:i:s',$params["date"]);
        $first_day = date('d-m-Y H:i:s',$params["first_day"]);

        $date = strtotime($date);
        $first_day = strtotime($first_day);
        date_default_timezone_set($default);

        global $wpdb;

        $carts = $wpdb->get_results( $wpdb->prepare( "
        SELECT cart_ignored as last_order, id as cart_id, user_id, abandoned_cart_info as body, abandoned_cart_time as date from {$wpdb->prefix}ac_abandoned_cart_history_lite 
        WHERE abandoned_cart_time <= '%s' AND abandoned_cart_time > '%s' AND user_id != 0
        ", $date,$first_day));

        if($carts){    

            $list = [];
            foreach ($carts as $cart){
                $last_order = $wpdb->get_row( $wpdb->prepare( "
                SELECT meta_value FROM {$wpdb->prefix}_usermeta WHERE meta_key = '_last_order' AND user_id = %d
                ", $cart->user_id), ARRAY_A );

                $cart->last_order = $last_order ? $last_order["meta_value"] : null;
                $cart->body = json_decode($cart->body);
                array_push($list,$cart);   
            }

            $response = ["success" => true, "list" => $list,"date"=> $date, "first_day" => $first_day, "tostring" => date('d-m-Y H:i:s',$params["date"]), "timezone" => $default];

        }else 
            $response=  ["success" => false, "" => $first_day, ];

		return rest_ensure_response($response);
	}

    public function authenticate($req){
       
        if ( is_ssl() || $this->wpdocs_maybe_is_ssl()) {
            
            $error_message = 'Invalid credentials';
            $headers = $req->get_headers();
            $params = $req->get_params();
            global $wpdb;

            if (isset($headers["consumer_key"]) && isset($headers["consumer_secret"])) {
                $ck = $headers["consumer_key"][0];
                $cs = $headers["consumer_secret"][0];
                if($ck && $cs){
                    $ck = $this->sms_api_hash( sanitize_text_field( $ck ) );
                    $keys = $wpdb->get_row( $wpdb->prepare( "
                        SELECT permissions, consumer_secret
                        FROM {$wpdb->prefix}woocommerce_api_keys
                        WHERE consumer_key = '%s'
                    ", $ck ), ARRAY_A );

                    if ( !empty( $keys ) ) {
                        if(hash_equals($keys['consumer_secret'],$cs)){
                            if($keys['permissions'] == "read_write"){
                                $params = $req->get_params();
                                if(isset($params["date"]) && strlen($params["date"]) <= 15 && $this->isValidTimeStamp($params["date"]))
                                    if(isset($params["first_day"]) && strlen($params["first_day"])  <= 15 && $this->isValidTimeStamp($params["first_day"]))
                                        if(isset($params["timezone"]) && strlen($params["first_day"])  <= 30)
                                            return true;
                                        else $error_message = "Invalid_timezone";
                                    else $error_message = "Invalid_parameter";
                                else $error_message = "Invalid_parameter";
                            }else $error_message = "Resources not available";
                        }else $error_message = "Invalid Credentials";
                    }else $error_message = "Credentials not found ";
                }else $error_message = "Credentials can`t be empty";
            }else $error_message = "Missing Credentials";

            return new WP_Error( 'TESTrest_forbidden', esc_html__( $error_message, '/custom_endpoint' ), array( 'status' => 400, "body" => $req->get_params()) );

        } else
            return new WP_Error( 'rest_forbidden', esc_html__( 'SSL missing, you can not view private data.', '/custom_endpoint' ), array( 'status' => 401 ) );
    }

	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods' => 'POST',
				'callback' => array( $this, 'get_carts' ),
                'permission_callback' => array($this, 'authenticate')

			)
		);
	}

    public function wpdocs_maybe_is_ssl() {
        // cloudflare
        if ( ! empty( $_SERVER['HTTP_CF_VISITOR'] ) ) {
            $cf_visitor = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CF_VISITOR'] ) );
            $cfo = json_decode( $cf_visitor );
            if ( is_object( $cfo ) && isset( $cfo->scheme ) && 'https' === $cfo->scheme ) {
                return true;
            }
        }

        // other proxy
        if ( ! empty( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && ('https' === $_SERVER['HTTP_X_FORWARDED_PROTO'] || 'https,http' === $_SERVER['HTTP_X_FORWARDED_PROTO'])) {
            return true;
        }

        return function_exists( 'is_ssl' ) ? is_ssl() : false;
    }

    public function sms_api_hash( $data ) {
        return hash_hmac( 'sha256', $data, 'wc-api' );
    }

    function isValidTimeStamp($timestamp){
        return ((string) (int) $timestamp === $timestamp) 
            && ($timestamp <= PHP_INT_MAX)
            && ($timestamp >= ~PHP_INT_MAX);
    }

}

