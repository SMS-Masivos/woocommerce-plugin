=== SMS Masivos ===
Contributors: smsmasivos, erickgonzalez
Tags: sms, woocommerce, notifications, whatsapp, mensajes
Requires at least: 4.4
Tested up to: 6.7
Requires PHP: 7.2
Stable tag: 6.0.2
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Plugin de envio de mensajes SMS y WhatsApp para WooCommerce integrado con la plataforma SMS Masivos.

== Description ==

SMS Masivos es un plugin para WooCommerce que permite enviar notificaciones automaticas por SMS y WhatsApp a tus clientes cuando el estado de sus ordenes cambia.

**Caracteristicas principales:**

* Envio automatico de SMS cuando cambia el estado de una orden
* Integracion con WhatsApp para notificaciones
* Panel de administracion para configurar mensajes personalizados
* Soporte para variables dinamicas en los mensajes (nombre del cliente, numero de orden, etc.)
* Gestion de carritos abandonados
* API personalizada para integraciones externas

**Requisitos:**

* WooCommerce 3.5 o superior
* Cuenta activa en [SMS Masivos](https://www.smsmasivos.com.mx/)

== Installation ==

1. Sube la carpeta del plugin al directorio `/wp-content/plugins/`
2. Activa el plugin desde el menu 'Plugins' en WordPress
3. Ve a WooCommerce > SMS Masivos para configurar tu cuenta
4. Ingresa tus credenciales de API de SMS Masivos
5. Configura los mensajes para cada estado de orden

== Frequently Asked Questions ==

= Necesito una cuenta de SMS Masivos? =

Si, necesitas una cuenta activa en [SMS Masivos](https://www.smsmasivos.com.mx/) para poder enviar mensajes.

= Que estados de orden soporta? =

El plugin soporta todos los estados de orden de WooCommerce: pendiente de pago, procesando, en espera, completado, cancelado, reembolsado y fallido.

= Puedo personalizar los mensajes? =

Si, puedes personalizar los mensajes para cada estado de orden utilizando variables dinamicas como el nombre del cliente, numero de orden, total, entre otros.

== Changelog ==

= 6.0.2 =
* Actualizacion de version

= 6.0.1 =
* Migracion de URLs de sandbox a produccion
* Actualizacion de version a 6.0.1

= 6.0.0 =
* Migracion del update checker a GitHub
* Nuevo diseno y mejoras de seguridad
* Refactorizacion de JavaScript
* Actualizacion de textos de vinculacion WhatsApp

= 5.4.3 =
* Version anterior con soporte GitLab

== Upgrade Notice ==

= 6.0.2 =
Actualizacion recomendada con mejoras de estabilidad.

= 6.0.0 =
Actualizacion mayor con mejoras de seguridad y nuevo sistema de actualizaciones via GitHub.
