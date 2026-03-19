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

            if(isset($_REQUEST) && $_REQUEST["apikey"]){
                $nonce = sanitize_text_field( $_REQUEST['nonce'] );
                if ( ! wp_verify_nonce( $nonce, 'my-ajax-nonce' ) ){
                    echo json_encode(["success" => false]);
                    die();
                }

                if ( ! current_user_can( 'manage_options' ) ) {
                    echo json_encode(["success" => false]);
                    die();
                }

                $apikey = sanitize_text_field( $_REQUEST["apikey"] );
                update_option('sms_plugin_apikey', $apikey);

                if($_REQUEST["cs"] != null && $_REQUEST["ck"] != null){
                    $args = [
                        "cs"     => sanitize_text_field( $_REQUEST["cs"] ),
                        "ck"     => sanitize_text_field( $_REQUEST["ck"] ),
                        "apikey" => $apikey,
                        "token"  => sanitize_text_field( $_REQUEST["token"] ),
                        "shop"   => sanitize_text_field( $_REQUEST["shop"] ),
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