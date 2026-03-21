<?php 
    class Control{
        public static function Automations()
        {
            self::Globals();
            wp_enqueue_script( 'sms_md5', SMS_PLUGIN_URL.'assets/js/md5.js');
            wp_enqueue_script( 'sms_automations', SMS_PLUGIN_URL.'assets/js/automations.js', array('sms_request'));

            wp_enqueue_script( 'override', SMS_PLUGIN_URL.'assets/js/override.js');
            return require_once( SMS_PLUGIN_PATH."/templates/automations.php" );
        }
    
        public static function Revenue()
        {
            self::Globals();
            wp_enqueue_script( 'sms_revenue', SMS_PLUGIN_URL.'assets/js/revenue.js', array('sms_request'));
            return require_once( SMS_PLUGIN_PATH."/templates/revenue.php" );
        }

        public static function Reports()
        {
            self::Globals();
            wp_enqueue_script( 'sms_informes', SMS_PLUGIN_URL.'assets/js/informes.js', array('sms_request'));
            return require_once( SMS_PLUGIN_PATH."/templates/reports.php" );
        }

        public static function GlobalSettings()
        {
            self::Globals();
            wp_enqueue_script( 'sms_settings', SMS_PLUGIN_URL.'assets/js/settings.js', array('sms_request'));
            return require_once( SMS_PLUGIN_PATH."/templates/globalsettings.php" );
        }

        public static function Questions()
        {
            self::Globals();
            wp_enqueue_script( 'sms_questions', SMS_PLUGIN_URL.'assets/js/questions.js');
            return require_once( SMS_PLUGIN_PATH."/templates/questions.php" );
        }

        public static function Help()
        {
            self::Globals();
            return require_once( SMS_PLUGIN_PATH."/templates/help.php" );
        }

        public static function Globals(){
            wp_enqueue_style( 'sms_bootstrap_css', SMS_PLUGIN_URL.'assets/css/bootstrap.min.css');
            wp_enqueue_style( 'sms_normalize', SMS_PLUGIN_URL.'assets/css/normalize.css');
            wp_enqueue_style( 'sms_component', SMS_PLUGIN_URL.'assets/css/components.css');
            wp_enqueue_style( 'sms_demo', SMS_PLUGIN_URL.'assets/css/demo.css');
            wp_enqueue_style( 'sms_chart_css', SMS_PLUGIN_URL.'assets/css/chart.css');
            wp_enqueue_script( 'sms_fontawesome', 'https://kit.fontawesome.com/cfccaf738e.js' );
            wp_enqueue_script( 'sms_fontawesome');
            wp_enqueue_script( 'sms_jquery', SMS_PLUGIN_URL.'assets/js/jquery.js');
            wp_register_script( 'sms_swal', 'https://unpkg.com/sweetalert/dist/sweetalert.min.js', null, null, true );
            wp_enqueue_script( 'sms_bootstrap_js', SMS_PLUGIN_URL.'assets/js/bootstrap.min.js');
            wp_enqueue_script( 'sms_nice_select', SMS_PLUGIN_URL.'assets/js/nice-select.js');
            wp_enqueue_script( 'sms_swal');
            wp_enqueue_script( 'sms_chart_js', SMS_PLUGIN_URL.'assets/js/chart.js');
            wp_enqueue_style( 'jquerytoastcss', SMS_PLUGIN_URL.'assets/css/jquery.toast.css');
            wp_enqueue_script( 'jquerytoast', SMS_PLUGIN_URL.'assets/js/jquery.toast.js');
            wp_enqueue_script( 'sms_general', SMS_PLUGIN_URL.'assets/js/sms-general.js', array('jquerytoast'));
            wp_enqueue_script( 'sms_request', SMS_PLUGIN_URL.'assets/js/sms-request.js', array('sms_general'));
            wp_localize_script( 'sms_request', 'ajax_object', array(
                'ajaxurl' => admin_url( 'admin-ajax.php' ),
                'nonce'   => wp_create_nonce( 'my-ajax-nonce' ),
            ));

            return;
        }


    }