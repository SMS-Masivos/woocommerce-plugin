# Nonce inconsistente en `fulfillment_created`

## Archivos involucrados
- `class/sms-main.php` — handlers AJAX
- `assets/js/global_edits.js` — cliente JS que hace la llamada
- `templates/globalsettings.php` y `templates/automations.php` — donde vive `#globalNonce`

---

## El problema

El plugin tiene 3 handlers AJAX en `class/sms-main.php`:

| Handler | Action nonce verificada | Línea |
|---|---|---|
| `set_apikey` | `my-ajax-nonce` | L92 |
| `set_automations` | `my-ajax-nonce` | L120 |
| `fulfillment_created` | `woocommerce_save_data` | L155 |

---

## Por qué ocurrió

`fulfillment_created` se activa desde un botón que el plugin inyecta dentro de la pantalla de edición de pedidos de WooCommerce (`/wp-admin/post.php?post=X&action=edit`).

En esa pantalla **no existe** el campo `#globalNonce` del plugin (solo está en `globalsettings.php` y `automations.php`).

El desarrollador reutilizó el nonce que WooCommerce ya inyecta en esa pantalla:

```js
// assets/js/global_edits.js:105
nonce: document.getElementById('woocommerce_meta_nonce').value,
```

`#woocommerce_meta_nonce` es generado por WooCommerce con la action `woocommerce_save_data`, por eso el servidor verifica esa misma action en L155.

---

## Por qué es frágil

1. Si WooCommerce cambia el nombre del campo o la action en una versión futura, el handler falla silenciosamente (devuelve `{"success":false,"message":"f34f3"}`).
2. La action `woocommerce_save_data` es semánticamente incorrecta para este endpoint.
3. No hay un nonce propio del plugin para esta operación.

---

## Solución

Los 3 cambios deben aplicarse juntos.

### 1. `class/sms-main.php` — método `enqueue()` (~L80)

Agregar `fulfillment_nonce` al `wp_localize_script`:

```php
public function enqueue(){
    wp_enqueue_script('sms_global_edit', SMS_PLUGIN_URL.'assets/js/global_edits.js');
    wp_localize_script('sms_global_edit', 'ajax_object', array(
        'ajaxurl'           => admin_url('admin-ajax.php'),
        'fulfillment_nonce' => wp_create_nonce('sms_fulfillment_created'), // agregar
    ));
}
```

### 2. `assets/js/global_edits.js:105`

```js
// antes:
nonce: document.getElementById('woocommerce_meta_nonce').value,

// después:
nonce: ajax_object.fulfillment_nonce,
```

### 3. `class/sms-main.php:155` — método `fulfillment_created()`

```php
// antes:
if ( empty($_REQUEST['nonce']) || ! wp_verify_nonce( wp_unslash($_REQUEST['nonce']), 'woocommerce_save_data' ) )

// después:
if ( empty($_REQUEST['nonce']) || ! wp_verify_nonce( wp_unslash($_REQUEST['nonce']), 'sms_fulfillment_created' ) )
```
