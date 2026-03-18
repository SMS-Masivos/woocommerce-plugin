<?php
    require_once SMS_PLUGIN_PATH . 'class/sms-settings.php';
    require_once SMS_PLUGIN_PATH . 'class/sms-templateControl.php';
    require_once SMS_PLUGIN_PATH . 'class/sms-generals.php';

    class Main{

        public $settings;
        public $pages = array();
        public $subpages = array();

        public function __construct(){
            $this->settings = new Settings();
            $this->pages = [
                [
                'page_title' => 'SMS Masivos Plugin',
                'menu_title' => 'SMS Masivos',
                'capability' => 'manage_options',
                'menu_slug' => 'smsmasivos_plugin',
                'callback' =>  function(){Control::Automations();},
                'icon_url' => 'dashicons-email',
                'position' => 30
                ]
            ];

            $this->subpages = [
                [
                    'parent_slug' => 'smsmasivos_plugin',                
                    'page_title' => 'revenue',
                    'menu_title' => 'Ingresos',
                    'capability' => 'manage_options',
                    'callback' =>  function(){Control::Revenue();},
                    'menu_slug' => 'sms_revenue'
                ],
                [
                    'parent_slug' => 'smsmasivos_plugin',                
                    'page_title' => 'reports',
                    'menu_title' => 'Reportes',
                    'capability' => 'manage_options',
                    'callback' =>  function(){Control::Reports();},
                    'menu_slug' => 'sms_reports'
                ],
                [
                    'parent_slug' => 'smsmasivos_plugin',                
                    'page_title' => 'settings',
                    'menu_title' => 'Configuraciones',
                    'capability' => 'manage_options',
                    'callback' =>  function(){Control::GlobalSettings();},
                    'menu_slug' => 'sms_settings'
                ],
                [ 
                    'parent_slug' => 'smsmasivos_plugin',                
                    'page_title' => 'questions',
                    'menu_title' => 'Preguntas frecuentes',
                    'capability' => 'manage_options',
                    'callback' =>  function(){Control::Questions();},
                    'menu_slug' => 'sms_questions'
                ],
                [ 
                    'parent_slug' => 'smsmasivos_plugin',                
                    'page_title' => 'help',
                    'menu_title' => 'Ayuda',
                    'capability' => 'manage_options',
                    'callback' =>  function(){Control::Help();},
                    'menu_slug' => 'sms_help'
                ],
            ];
            
        }

        public function load(){
            add_action( 'admin_enqueue_scripts', array($this,'enqueue'));
            $this->settings->AddPages($this->pages)->withSubPage('Automatizaciones')->AddSubPages($this->subpages)->register();
            add_action("wp_ajax_sms_set_apikey", array($this,'set_apikey'));
            add_action("wp_ajax_sms_set_automations", array($this,'set_automations'));
            add_action("wp_ajax_sms_fulfillment_created", array($this,'fulfillment_created'));
            add_action("wp_ajax_sms_autoedit_automation", array($this,'autoedit_automation'));

            add_action("wp_ajax_sms_proxy_login", array($this,'proxy_login'));
            add_action("wp_ajax_sms_proxy_automation_get", array($this,'proxy_automation_get'));
            add_action("wp_ajax_sms_proxy_automation_create", array($this,'proxy_automation_create'));
            add_action("wp_ajax_sms_proxy_automation_edit_general", array($this,'proxy_automation_edit_general'));
            add_action("wp_ajax_sms_proxy_automation_delete", array($this,'proxy_automation_delete'));
            add_action("wp_ajax_sms_proxy_wp_set", array($this,'proxy_wp_set'));
            add_action("wp_ajax_sms_proxy_wp_load", array($this,'proxy_wp_load'));
            add_action("wp_ajax_sms_proxy_whatsapp_check", array($this,'proxy_whatsapp_check'));
            add_action("wp_ajax_sms_proxy_whatsapp_edit", array($this,'proxy_whatsapp_edit'));
            add_action("wp_ajax_sms_proxy_whatsapp_get", array($this,'proxy_whatsapp_get'));
            add_action("wp_ajax_sms_proxy_whatsapp_set", array($this,'proxy_whatsapp_set'));
            add_action("wp_ajax_sms_proxy_whatsapp_remove", array($this,'proxy_whatsapp_remove'));
            add_action("wp_ajax_sms_proxy_keys_check", array($this,'proxy_keys_check'));
            add_action("wp_ajax_sms_proxy_reports_get", array($this,'proxy_reports_get'));
            add_action("wp_ajax_sms_proxy_revenue_get", array($this,'proxy_revenue_get'));

        }

        public function enqueue(){
            wp_enqueue_script( 'sms_global_edit', SMS_PLUGIN_URL.'assets/js/global_edits.js');
            wp_localize_script( 'sms_global_edit', 'ajax_object', array(
                'ajaxurl'           => admin_url( 'admin-ajax.php' ),
                'fulfillment_nonce' => wp_create_nonce( 'sms_fulfillment_created' ),
            ));
        }

        public function set_apikey(){
            $response = [];

            $nonce = isset($_REQUEST['nonce']) ? sanitize_text_field( $_REQUEST['nonce'] ) : '';
            if ( ! wp_verify_nonce( $nonce, 'my-ajax-nonce' ) ){
                echo json_encode(["success" => false]);
                die();
            }

            if ( ! current_user_can( 'manage_options' ) ) {
                echo json_encode(["success" => false]);
                die();
            }

            $apikey = !empty($_REQUEST["apikey"]) ? sanitize_text_field( $_REQUEST["apikey"] ) : get_option('sms_plugin_apikey');
            if($apikey){
                update_option('sms_plugin_apikey', $apikey);

                if(isset($_REQUEST["cs"]) && $_REQUEST["cs"] != null && isset($_REQUEST["ck"]) && $_REQUEST["ck"] != null){
                    $args = [
                        "cs"     => sanitize_text_field( $_REQUEST["cs"] ),
                        "ck"     => sanitize_text_field( $_REQUEST["ck"] ),
                        "apikey" => $apikey,
                        "token"  => get_option('sms_plugin_token'),
                        "shop"   => get_option('home'),
                    ];
                    SMSGenerals::set_credentials($args);
                }

                echo json_encode(["success" => true]);

            }else echo json_encode($response);

            die();

        }

        public function set_automations(){

            if(isset($_REQUEST) && $_REQUEST["list"]){
                $nonce = sanitize_text_field( $_REQUEST['nonce'] );
                if ( ! wp_verify_nonce( $nonce, 'my-ajax-nonce' ) ){
                    echo json_encode(["success" => false]);
                    die();
                }

                if ( ! current_user_can( 'manage_options' ) ) {
                    echo json_encode(["success" => false]);
                    die();
                }

                $list = [];
                $oldlist = $_REQUEST["list"];
                foreach ($oldlist as $automation) {
                    if($automation["status"])
                        array_push($list, sanitize_text_field( $automation["type"] ));
                }

                $list = json_encode($list);

                update_option('sms_plugin_automations', $list);
                echo json_encode(["success" => true]);

                if ( get_option( 'ac_lite_cart_abandoned_time' ) ) {
					update_option( 'ac_lite_cart_abandoned_time', 5 );
				}

            }else echo json_encode(["success" => false]);

            die();
        }

        public function autoedit_automation(){
            if ( ! isset( $_REQUEST['id'] ) ) {
                echo json_encode(["success" => false, "message" => "Parámetros incompletos"]);
                die();
            }
            SMSGenerals::verify_ajax_request();

            $data = [
                'id'      => sanitize_text_field( $_REQUEST['id'] ),
                'options' => isset( $_REQUEST['options'] ) ? sanitize_text_field( $_REQUEST['options'] ) : null,
            ];
            echo SMSGenerals::proxy_request('/wp/automation/edit', $data);
            die();
        }

        // --- Proxy handlers ---

        public function proxy_login(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'user'  => sanitize_text_field( $_REQUEST['user'] ),
                'pass'  => sanitize_text_field( $_REQUEST['pass'] ),
                'shop'  => get_option('home'),
                'token' => get_option('sms_plugin_token'),
            ];

            $response_raw = SMSGenerals::proxy_request('/wp/login', $data, false);
            $response = json_decode($response_raw, true);

            if ( isset($response['success']) && $response['success'] && isset($response['apikey']) ) {
                update_option('sms_plugin_apikey', sanitize_text_field($response['apikey']));
            }

            echo $response_raw;
            die();
        }

        public function proxy_automation_get(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/wp/automation/get');
            die();
        }

        public function proxy_automation_create(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'name'         => sanitize_text_field( $_REQUEST['name'] ),
                'type'         => sanitize_text_field( $_REQUEST['type'] ),
                'recipient'    => sanitize_text_field( $_REQUEST['recipient'] ),
                'text'         => sanitize_text_field( $_REQUEST['text'] ),
                'text_ws'      => isset($_REQUEST['text_ws']) ? sanitize_text_field( $_REQUEST['text_ws'] ) : '',
                'lapse'        => sanitize_text_field( $_REQUEST['lapse'] ),
                'delay'        => sanitize_text_field( $_REQUEST['delay'] ),
                'limit'        => sanitize_text_field( $_REQUEST['limit'] ),
                'whatsapp'     => isset($_REQUEST['whatsapp']) ? sanitize_text_field( $_REQUEST['whatsapp'] ) : '0',
            ];
            echo SMSGenerals::proxy_request('/wp/automation/create', $data);
            die();
        }

        public function proxy_automation_edit_general(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'automationid' => sanitize_text_field( $_REQUEST['automationid'] ),
                'name'         => sanitize_text_field( $_REQUEST['name'] ),
                'type'         => sanitize_text_field( $_REQUEST['type'] ),
                'recipient'    => sanitize_text_field( $_REQUEST['recipient'] ),
                'text'         => sanitize_text_field( $_REQUEST['text'] ),
                'text_ws'      => isset($_REQUEST['text_ws']) ? sanitize_text_field( $_REQUEST['text_ws'] ) : '',
                'lapse'        => sanitize_text_field( $_REQUEST['lapse'] ),
                'delay'        => sanitize_text_field( $_REQUEST['delay'] ),
                'limit'        => sanitize_text_field( $_REQUEST['limit'] ),
                'whatsapp'     => isset($_REQUEST['whatsapp']) ? sanitize_text_field( $_REQUEST['whatsapp'] ) : '0',
            ];
            echo SMSGenerals::proxy_request('/wp/automation/edit_general', $data);
            die();
        }

        public function proxy_automation_delete(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'id'   => sanitize_text_field( $_REQUEST['id'] ),
                'type' => sanitize_text_field( $_REQUEST['type'] ),
            ];
            echo SMSGenerals::proxy_request('/wp/automation/delete', $data);
            die();
        }

        public function proxy_wp_set(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'country'      => sanitize_text_field( $_REQUEST['country'] ),
                'number'       => sanitize_text_field( $_REQUEST['number'] ),
                'last_credits' => sanitize_text_field( $_REQUEST['last_credits'] ),
                'sync_agenda'  => sanitize_text_field( $_REQUEST['sync_agenda'] ),
            ];
            echo SMSGenerals::proxy_request('/wp/set', $data);
            die();
        }

        public function proxy_wp_load(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/wp');
            die();
        }

        public function proxy_whatsapp_check(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/whatsapp/instances/check');
            die();
        }

        public function proxy_whatsapp_edit(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'id'     => sanitize_text_field( $_REQUEST['id'] ),
                'status' => sanitize_text_field( $_REQUEST['status'] ),
                'shop'   => get_option('home'),
            ];
            echo SMSGenerals::proxy_request('/whatsapp/instances/edit', $data, false);
            die();
        }

        public function proxy_whatsapp_get(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/whatsapp/instances/get');
            die();
        }

        public function proxy_whatsapp_set(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'instance' => sanitize_text_field( $_REQUEST['instance'] ),
            ];
            echo SMSGenerals::proxy_request('/whatsapp/instances/set', $data);
            die();
        }

        public function proxy_whatsapp_remove(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/whatsapp/instances/remove');
            die();
        }

        public function proxy_keys_check(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/wp/keys/check');
            die();
        }

        public function proxy_reports_get(){
            SMSGenerals::verify_ajax_request();

            $data = [
                'rows' => sanitize_text_field( $_REQUEST['rows'] ),
            ];
            echo SMSGenerals::proxy_request('/wp/automation/reports/get', $data);
            die();
        }

        public function proxy_revenue_get(){
            SMSGenerals::verify_ajax_request();
            echo SMSGenerals::proxy_request('/wp/automation/revenue/get');
            die();
        }

        public function fulfillment_created(){
            if(isset($_REQUEST) && $_REQUEST["order"] &&  $_REQUEST["tracking_number"] &&  $_REQUEST["company"]){

                if ( empty( $_REQUEST['nonce'] ) || ! wp_verify_nonce( wp_unslash( $_REQUEST['nonce']), 'sms_fulfillment_created' ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                    echo json_encode(["success" => false, "message" => "f34f3"]);
                    die();
                }

                if ( ! current_user_can( 'manage_options' ) ) {
                    echo json_encode(["success" => false]);
                    die();
                }

                $order           = sanitize_text_field( $_REQUEST["order"] );
                $tracking_number = sanitize_text_field( $_REQUEST["tracking_number"] );
                $company         = sanitize_text_field( $_REQUEST["company"] );
                $address         = $_REQUEST["address"] ? sanitize_text_field( $_REQUEST["address"] ) : null;
                $name            = $_REQUEST["name"]    ? sanitize_text_field( $_REQUEST["name"] )    : null;
                $phone           = $_REQUEST["phone"]   ? sanitize_text_field( $_REQUEST["phone"] )   : null;
                $country         = $_REQUEST["country"] ? sanitize_text_field( $_REQUEST["country"] ) : null;

                $args = ["order" => $order, "tracking_number" => $tracking_number, "company" => $company, "name"=> $name, "address" => $address, "phone" => $phone, "country" => $country, "status" => "f-created"];
                
                $result = SMSGenerals::fulfillment_created($args);
                echo json_encode($result);
               
            }else echo json_encode(["success" => false, "message" => "campos incompletos"]);
            die();
        }

        
    }