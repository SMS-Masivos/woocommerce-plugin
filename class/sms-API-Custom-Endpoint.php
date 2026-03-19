<?php

class SMSApiCustomEndpoint{

	protected $namespace = 'wc/v3';

	protected $rest_base = 'custom_endpoint';

	public function get_custom( $req ) {
        $params = $req->get_params();
        $date = $params["date"];
        $first_day = $params["first_day"];  
        global $wpdb;
        $customers = $wpdb->get_results( $wpdb->prepare( "
        SELECT MAX(date_created), c.user_id as id, user_registered as registered 
        FROM {$wpdb->prefix}wc_order_product_lookup as o INNER JOIN {$wpdb->prefix}wc_customer_lookup as c ON o.customer_id = c.customer_id 
        INNER JOIN {$wpdb->prefix}users as u ON u.ID = c.user_id
        WHERE date_created < '%s' AND date_created > '%s'
        GROUP BY o.customer_id
        ", $date,$first_day ), ARRAY_A );
        
        $list = [];
        if($customers){
            foreach ($customers as $customer) {
                $data = $wpdb->get_results( $wpdb->prepare( "
                    SELECT meta_key, meta_value FROM {$wpdb->prefix}usermeta 
                    WHERE user_id = %d
                ", $customer["id"],ARRAY_A ));

                $helper = [];
                if($data){
                    $helper["id"] = $customer["id"];
                    $helper["date_register"] = $customer["registered"];
                    foreach ($data as $tag) {
                        $helper[$tag->meta_key] = $tag->meta_value;
                    }
                    array_push($list,$helper);
                }
            }

            $response = ["success" => true, "list" => $list, "date" => $date];


        }else $response = ["success" => false, "" => $first_day, "d" => $date];

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
                                if(isset($params["date"]) && strlen($params["date"]) == 10 && DateTime::createFromFormat('Y-m-d', $params["date"]))
                                    if(isset($params["first_day"]) && strlen($params["first_day"]) == 10 && DateTime::createFromFormat('Y-m-d', $params["first_day"]))
                                        
                                        return true;
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
				'callback' => array( $this, 'get_custom' ),
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

}