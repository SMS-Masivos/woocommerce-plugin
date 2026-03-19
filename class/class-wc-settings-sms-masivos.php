<?php
/**
 * Sms-masivos General Settings
 *
 * @package sms-masivos/Admin
 */

defined( 'ABSPATH' ) || exit;

if ( !class_exists( 'WC_Settings_Page' ) ) {
	include WP_PLUGIN_DIR . '/woocommerce/includes/admin/settings/class-wc-settings-page.php';
}

/**
 * WC_Admin_Settings_General.
 */
class WC_Settings_Sms_Masivos extends WC_Settings_Page {

	/**
	 * Constructor.
	 */
	public function __construct( $credits = 0 ) {
		$this->id    = 'smsmasivos';
		$this->label = __( 'Sms Masivos', 'sms-masivos' );
		$this->credits = $credits;
		parent::__construct( );
	}

	/**
	 * Get settings array.
	 *
	 * @return array
	 */
	public function get_settings() {
		echo '<div><a href="https://www.smsmasivos.com.mx" target="_blank"><img src="https://cdn-smsmasivos.sfo2.digitaloceanspaces.com/app/logo-users/sms-01.svg" style="height: 50px;width: 165px;" alt="SMSMasivos"><img src="https://cdn-smsmasivos.sfo2.digitaloceanspaces.com/app/logo-users/sms-02.svg" alt="Logo SMSMasivos" style="height: 50px;width: 50px;"></a></div>';
		$settings = apply_filters(
			'woocommerce_smsmasivos_settings',
			array(

				array(
					'title' => __( 'SMS Masivos configuration', 'sms-masivos' ),
					'type'  => 'title',
					'id'    => 'smsmasivos_configuration'
				),

				array(
					'title'    => __( 'Server Api Key', 'sms-masivos' ),
					'desc'     => __( 'To see in', 'sms-masivos' ) . ' <a href="https://app.smsmasivos.com.mx/api" target="_blank">https://app.smsmasivos.com.mx/api</a>',
					'id'       => 'wc_sms_smsmasivos_apikey',
					'default'  => '',
					'type'     => 'text'
				),

				array(
					'title'    => __('Credits', 'sms-masivos') . " {$this->credits}",
					'type'     => 'title'
				),

				array(
					'title'           => __( 'Send me an email when credits ended', 'sms-masivos' ),
					'id'              => 'wc_sms_enable_email_notification',
					'default'         => 'yes',
					'type'            => 'checkbox',
					'checkboxgroup'   => 'start',
					'show_if_checked' => 'option'
				),

				array(
					'type' => 'sectionend',
					'id'   => 'smsmasivos_configuration',
				),

				array(
					'title' => __( 'Admin Notifications', 'sms-masivos' ),
					'type'  => 'title',
					'id'    => 'admin_notifications'
				),

				array(
					'title'           => __( 'Enable new order SMS admin notifications', 'sms-masivos' ),
					'id'              => 'wc_sms_enable_admin_notification',
					'default'         => 'yes',
					'type'            => 'checkbox',
					'checkboxgroup'   => 'start',
					'show_if_checked' => 'option'
				),

				array(
					'title'    => __( 'Admin mobile number', 'sms-masivos' ),
					'id'       => 'wc_sms_admin_mobile_number',
					'default'  => '',
					'type'     => 'text'
				),

				array(
					'title'    => __( 'Country mobile number', 'sms-masivos' ),
					'id'       => 'wc_sms_admin_mobile_country',
					'default'  => '52',
					'type'     => 'select',
					'options' => array(
						'54'    => 'Argentina',
						'591'   => 'Bolivia',
						'55'    => __('Brazil', 'sms-masivos'),
						'56'    => 'Chile',
						'57'    => 'Colombia',
						'506'   => 'Costa Rica',
						'593'   => 'Ecuador',
						'503'   => 'El Salvador',
						'1'     => __('United States', 'sms-masivos'),
						'502'   => 'Guatemala',
						'504'   => 'Honduras',
						'52'    => 'Mexico',
						'505'   => 'Nicaragua',
						'507'   => 'Panamá',
						'58'    => 'Venezuela'
					)
				),

				array(
					'title'    => __( 'Admin SMS message', 'sms-masivos' ),
					'desc'     => __( 'Use these tags to customize your message: {shop_name}, {order_id}, {order_count}, {order_amount}, {order_status}, {order_number}, {billing_firstname}, {billing_lastname}, {billing_fullname}, {shipping_firstname}, {shipping_lastname}, {shipping_fullname} and {shipping_method} Remember that SMS messages may be limited to 160 characters or less.', 'sms-masivos' ),
					'id'       => 'wc_sms_admin_sms_message',
					'default'  => __( '{shop_name}: You have a new order ({order_id}) for {order_amount}!', 'sms-masivos' ),
					'type'     => 'textarea'
				),

				array(
					'type' => 'sectionend',
					'id'   => 'admin_notifications',
				),

				array(
					'title' => __( 'Customer Notifications', 'sms-masivos' ),
					'type'  => 'title',
					'id'    => 'customer_notifications'
				),

				array(
					'title'    => __( 'Client Default Country mobile number', 'sms-masivos' ),
					'id'       => 'wc_sms_admin_mobile_country_client',
					'default'  => '52',
					'type'     => 'select',
					'options' => array(
						'54'    => 'Argentina',
						'591'   => 'Bolivia',
						'55'    => __('Brazil', 'sms-masivos'),
						'56'    => 'Chile',
						'57'    => 'Colombia',
						'506'   => 'Costa Rica',
						'593'   => 'Ecuador',
						'503'   => 'El Salvador',
						'1'     => __('United States', 'sms-masivos'), 
						'502'   => 'Guatemala',
						'504'   => 'Honduras',
						'52'    => 'Mexico',
						'505'   => 'Nicaragua',
						'507'   => 'Panamá',
						'58'    => 'Venezuela'
					)
				),

				array(
					'title'           => __( 'Send SMS Notifications for these statuses:', 'sms-masivos' ),
					'desc'            => __( 'Pending Payment', 'sms-masivos' ),
					'id'              => 'wc_sms_pending',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => 'start'
				),

				array(
					'desc'            => __( 'Processing', 'sms-masivos' ),
					'id'              => 'wc_sms_processing',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => '',
					'autoload'        => false
				),

				array(
					'desc'            => __( 'On Hold', 'sms-masivos' ),
					'id'              => 'wc_sms_on-hold',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => '',
					'autoload'        => false
				),

				array(
					'desc'            => __( 'Completed', 'sms-masivos' ),
					'id'              => 'wc_sms_completed',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => '',
					'autoload'        => false
				),

				array(
					'desc'            => __( 'Cancelled', 'sms-masivos' ),
					'id'              => 'wc_sms_cancelled',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => '',
					'autoload'        => false
				),

				array(
					'desc'            => __( 'Refunded', 'sms-masivos' ),
					'id'              => 'wc_sms_Refunded',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => '',
					'autoload'        => false
				),

				array(
					'desc'            => __( 'Failed', 'sms-masivos' ),
					'id'              => 'wc_sms_failed',
					'default'         => 'no',
					'type'            => 'checkbox',
					'checkboxgroup'   => 'end',
					'autoload'        => false
				),

				array(
					'title'    => __( 'Pending Payment SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_pending_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'title'    => __( 'Processing SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_processing_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'title'    => __( 'On Hold SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_on-hold_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'title'    => __( 'Completed SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_completed_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'title'    => __( 'Cancelled SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_cancelled_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'title'    => __( 'Refunded SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_refunded_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'title'    => __( 'Failed SMS Message', 'sms-masivos' ),
					'id'       => 'wc_sms_failed_sms',
					'default'  => '',
					'type'     => 'textarea',
					'desc_tip' => true
				),

				array(
					'type' => 'sectionend',
					'id'   => 'customer_notifications',
				),

			)
		);
		return apply_filters( 'sms-masivos_get_settings_' . $this->id, $settings );
	}

	/**
	 * Output the settings.
	 */
	public function output() {
		$settings = $this->get_settings();
		WC_Admin_Settings::output_fields( $settings );
	}

	/**
	 * Save settings.
	 */
	public function save() {
		$settings = $this->get_settings();
		WC_Admin_Settings::save_fields( $settings );
	}
}


