<?php 

/**
* Plugin Name: SMS Masivos
* Plugin URI: https://app.smsmasivos.com.mx/api
* Description: Plugin de envio de mensajes SMS y WhatsApp para WooCommerce integrado con la plataforma SMS Masivos.
* Version: 6.0.3
* Author: SMS Masivos / Erick González O.
* Author URI: https://www.smsmasivos.com.mx/
* Developer: SMSMASIVOS / Erick González O.
* Developer URI: http://smsmasivos.com.mx/
* Text Domain: woocommerce-extension
* Domain Path: /languages
*
* Requires at least: 4.4
* Tested up to: 6.7
* Requires PHP: 7.2
* WC requires at least: 3.5
*
* License: GNU General Public License v3.0
* License URI: http://www.gnu.org/licenses/gpl-3.0.html

*/

defined( 'ABSPATH' ) || exit;
define('SMS_PLUGIN_PATH',plugin_dir_path( __FILE__ ) );
define('SMS_PLUGIN_URL',plugin_dir_url( __FILE__ ));
define('SMS_PLUGIN',plugin_basename( __FILE__ ));

require_once SMS_PLUGIN_PATH. 'class/sms-activate.php';
require_once SMS_PLUGIN_PATH . 'class/sms-deactivate.php';
require_once SMS_PLUGIN_PATH . 'class/sms-main.php';
require_once SMS_PLUGIN_PATH . 'class/sms-generals.php';
require_once SMS_PLUGIN_PATH . 'class/sms-API-Custom-Endpoint.php';
require_once SMS_PLUGIN_PATH . 'class/sms-API-Abandoned-Carts.php';
require_once SMS_PLUGIN_PATH . 'class/sms-API-Customers.php';
require_once SMS_PLUGIN_PATH . 'class/sms-API-Status.php';
require_once SMS_PLUGIN_PATH . 'plugin-update-checker-master/plugin-update-checker.php';



if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
    if (is_admin()) {

        register_activation_hook(__FILE__,array('SmsActivate','activate'));
        register_deactivation_hook(__FILE__,array('SmsDeactivate','deactivate'));

        $myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
            'https://github.com/SMS-Masivos/woocommerce-plugin',
            __FILE__,
            SMS_PLUGIN
        );
        
        //Optional: Set the branch that contains the stable release.
        $myUpdateChecker->setBranch('master');
        
        $main = new Main();
        $main->load();

    }
    //El estado de la orden cambia puede ser pago pendiente, procesando, en espara, completado, cancelado
    add_action('woocommerce_order_status_changed','SMSGenerals::status_order', 10, 4);    
    add_filter( 'woocommerce_rest_api_get_rest_namespaces', 'woo_custom_api' );
    add_filter( 'woocommerce_rest_api_get_rest_namespaces', 'woo_custom_api_carts' );
    add_filter( 'woocommerce_rest_api_get_rest_namespaces', 'woo_custom_api_last_order' );
    add_filter( 'woocommerce_rest_api_get_rest_namespaces', 'woo_custom_api_status' );

    // Fire before the WC_Form_Handler::add_to_cart_action callback.
    add_action( 'wp_loaded',        'woocommerce_maybe_add_multiple_products_to_cart', 15 );
    add_filter( 'wc_add_to_cart_message_html', '__return_false' );

    function woo_custom_api( $controllers ) {
        $controllers['wc/v3']['custom_endpoint'] = 'SMSApiCustomEndpoint';
        return $controllers;
    }

    function woo_custom_api_carts( $controllers ) {
        $controllers['wc/v3']['abandoned_carts'] = 'SMSApiAbandonedCarts';
        return $controllers;
    }

    function woo_custom_api_last_order( $controllers ) {
        $controllers['wc/v3']['last_order'] = 'SMSApiCustomers';
        return $controllers;
    }

    function woo_custom_api_status( $controllers ) {
        $controllers['wc/v3']['status'] = 'SMSApiStatus';
        return $controllers;
    }

    function woocommerce_maybe_add_multiple_products_to_cart() {
        // Make sure WC is installed, and add-to-cart query arg exists, and contains at least one comma.
        if ( ! class_exists( 'WC_Form_Handler' ) || empty( $_REQUEST['add-to-cart'] ) || false === strpos( $_REQUEST['add-to-cart'], ',' ) ) {
            return;
        }
        
        // Remove WooCommerce's hook, as it's useless (doesn't handle multiple products).
        remove_action( 'wp_loaded', array( 'WC_Form_Handler', 'add_to_cart_action' ), 20 );
        
        $product_ids = explode( ',', $_REQUEST['add-to-cart'] );
        $quantities = explode( ',', $_REQUEST['quantities'] );
        
        $count       = count( $product_ids );
        $number      = 0;
        
        foreach ( $product_ids as $product_id ) {
            if ( ++$number === $count ) {
                // Ok, final item, let's send it back to woocommerce's add_to_cart_action method for handling.
                $_REQUEST['add-to-cart'] = $product_id;
        
                return WC_Form_Handler::add_to_cart_action();
            }
        
            $product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $product_id ) );
            $was_added_to_cart = false;
            $adding_to_cart    = wc_get_product( $product_id );
        
            if ( ! $adding_to_cart ) {
                continue;
            }
        
            $add_to_cart_handler = apply_filters( 'woocommerce_add_to_cart_handler', $adding_to_cart->product_type, $adding_to_cart );
        
            /*
             * Sorry.. if you want non-simple products, you're on your own.
             *
             * Related: WooCommerce has set the following methods as private:
             * WC_Form_Handler::add_to_cart_handler_variable(),
             * WC_Form_Handler::add_to_cart_handler_grouped(),
             * WC_Form_Handler::add_to_cart_handler_simple()
             *
             * Why you gotta be like that WooCommerce?
             */
            if ( 'simple' !== $add_to_cart_handler ) {
                continue;
            }
        //         $_REQUEST['quantity'] = ! empty( $id_and_quantity[1] ) ? absint( $id_and_quantity[1] ) : 1;
        $_REQUEST['quantity'] = ! empty( $quantities[$number] ) ? absint( $quantities[$number] ) : 1;
            $quantity          = empty( $quantities[$number - 1] ) ? 1 : wc_stock_amount(  $quantities[$number - 1] );
        //     $quantity          = empty( $_REQUEST['quantity'] ) ? 1 : wc_stock_amount( $_REQUEST['quantity'] );
            $passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
        
            if ( $passed_validation && false !== WC()->cart->add_to_cart( $product_id, $quantity ) ) {
                wc_add_to_cart_message( array( $product_id => $quantity ), true );
            }
        }
    }
    
}
