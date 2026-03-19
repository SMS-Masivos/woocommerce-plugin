<?php

class SMSApiStatus{

	protected $namespace = 'wc/v3';

	protected $rest_base = 'status';

	public function get_details() {
        
        try {
            $timezone = date_default_timezone_get();
            global $wpdb;

            $carts = $wpdb->get_results(
                $wpdb->prepare("SHOW TABLES LIKE %s", $wpdb->prefix . 'ac_abandoned_cart_history_lite')
            );
            $carts_table = $carts ? true : false;

            $options = $wpdb->get_results( $wpdb->prepare("SELECT * FROM {$wpdb->prefix}options where option_name = '%s' OR option_name = '%s' OR option_name = '%s'","home","blogname","sms_plugin_automations"));
            $options_table = $options ? $options : false;

            $user = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT meta_value FROM {$wpdb->prefix}usermeta WHERE meta_key = %s AND user_id = 1",
                    $wpdb->prefix . 'capabilities'
                )
            );
            $user_table = !empty($user);

            $relevant_plugins = [
                'woocommerce/woocommerce.php',
                'woo-abandoned-cart/woocommerce-abandoned-cart.php',
            ];
            $active_plugins = $wpdb->get_results(
                $wpdb->prepare("SELECT option_value FROM {$wpdb->prefix}options WHERE option_name = %s", "active_plugins")
            );
            $all_active = $active_plugins ? maybe_unserialize($active_plugins[0]->option_value) : [];
            $actives    = array_values(array_intersect($relevant_plugins, (array) $all_active));
    
            $response = ["success" => true, "timezone" => $timezone, "wc_admin_exists" => $user_table, "options" => $options_table, "carts" => $carts_table, "custom_prefix" => ($wpdb->prefix !== 'wp_'), "relevant_plugins" => $actives];
            return rest_ensure_response($response);
        } catch (\Throwable $th) {
            return rest_ensure_response(["success" => true, "error" => json_encode($th)]);
        }
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
                                return true;
                            }else $error_message = "Resources not available";
                        }else $error_message = "Invalid Credentials";
                    }else $error_message = "Credentials not found ";
                }else $error_message = "Credentials can`t be empty";
            }else $error_message = "Missing Credentials";

            return new WP_Error( 'T - rest_forbidden', esc_html__( $error_message, '/get_details' ), array( 'status' => 400, "body" => $req->get_params()) );

        } else
            return new WP_Error( 'rest_forbidden', esc_html__( 'SSL missing, you can not view private data.', '/get_details' ), array( 'status' => 401 ) );
    }

	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				'methods' => 'POST',
				'callback' => array( $this, 'get_details' ),
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