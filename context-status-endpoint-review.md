# Revisión de Seguridad — class/sms-API-Status.php

## Contexto del plugin

Plugin de WordPress/WooCommerce para envío masivo de SMS. Se instala en servidores propios del cliente (self-hosted), donde el ecosistema de tecnologías varía ampliamente (proxies, CDNs, configuraciones de DB, plugins activos). El endpoint `/status` existe para diagnóstico rápido del entorno cuando algo falla en la instalación.

---

## Archivo a revisar

`class/sms-API-Status.php`

---

## Estado actual de protecciones (contexto importante)

El endpoint **no es público**. Ya tiene las siguientes protecciones:

- Requiere SSL (con detección de Cloudflare y proxies via `HTTP_CF_VISITOR` y `HTTP_X_FORWARDED_PROTO`)
- Requiere WooCommerce API keys con permiso `read_write` en el header
- Usa `hash_equals()` para comparar secrets (resistente a timing attacks)

El riesgo real es: si las credenciales WooCommerce se filtran, el endpoint entrega datos de reconocimiento del servidor. Por eso se proponen los siguientes ajustes.

---

## Cambios a aplicar

### 1. No exponer `$wpdb->prefix` directamente

**Problema:** El prefijo exacto de las tablas de DB facilita ataques SQL si se combina con otras vulnerabilidades.

**Fix:** Reemplazar el valor exacto por un booleano que indique si el prefijo es distinto del default `wp_`.

```php
// ANTES (línea 27):
"prefix" => $wpdb->prefix

// DESPUÉS:
"custom_prefix" => ($wpdb->prefix !== 'wp_')
```

---

### 2. Filtrar active plugins — solo los relevantes al plugin

**Problema:** La lista completa de plugins activos (serializada, con rutas de archivo) expone toda la superficie de ataque del sitio. Para diagnóstico solo importan los plugins con los que este plugin interactúa.

**Fix:** Deserializar y filtrar solo los plugins relevantes.

```php
// ANTES (líneas 24-25):
$active_plugins = $wpdb->get_results( $wpdb->prepare("SELECT * FROM {$wpdb->prefix}options WHERE option_name = '%s'", "active_plugins"));
$actives = $active_plugins ? $active_plugins : false;

// DESPUÉS:
$relevant_plugins = [
    'woocommerce/woocommerce.php',
    'woo-abandoned-cart/woocommerce-abandoned-cart.php',
];
$active_plugins = $wpdb->get_results(
    $wpdb->prepare("SELECT option_value FROM {$wpdb->prefix}options WHERE option_name = %s", "active_plugins")
);
$all_active     = $active_plugins ? maybe_unserialize($active_plugins[0]->option_value) : [];
$actives        = array_values(array_intersect($relevant_plugins, (array) $all_active));
```

Y en la respuesta:
```php
// ANTES:
"Active_plugins" => $actives

// DESPUÉS:
"relevant_plugins" => $actives
```

---

### 3. No exponer las capacidades del usuario ID=1

**Problema:** Devolver las capabilities del administrador principal (user ID=1) confirma su existencia y su nivel de acceso. No aporta información útil para diagnóstico del plugin.

**Fix:** Reemplazar por un booleano que indique si existe un administrador de WooCommerce.

```php
// ANTES (líneas 21-22):
$user = $wpdb->get_results( $wpdb->prepare("SELECT meta_value FROM {$wpdb->prefix}usermeta WHERE meta_key = '%s' AND user_id = 1",$wpdb->prefix."capabilities"));
$user_table = $user ? $user : false;

// DESPUÉS:
$user = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT meta_value FROM {$wpdb->prefix}usermeta WHERE meta_key = %s AND user_id = 1",
        $wpdb->prefix . 'capabilities'
    )
);
$user_table = !empty($user); // true/false — solo confirma si existe el usuario admin
```

Y en la respuesta:
```php
// ANTES:
"user" => $user_table

// DESPUÉS:
"wc_admin_exists" => $user_table
```

---

### 4. Corregir `$wpdb->prepare()` sin placeholders (warning en WP 6.1+)

**Problema:** En las líneas 15 y 24 originales se usa `$wpdb->prepare()` sin argumentos de reemplazo. Desde WordPress 6.1 esto genera un `_doing_it_wrong` warning.

**Fix para la consulta de la tabla de carritos abandonados:**

```php
// ANTES (línea 15):
$carts = $wpdb->get_results( $wpdb->prepare('SHOW tables like "%ac_abandoned_cart_history_lite"'));

// DESPUÉS:
$carts = $wpdb->get_results(
    $wpdb->prepare("SHOW TABLES LIKE %s", $wpdb->prefix . 'ac_abandoned_cart_history_lite')
);
```

---

## Indicación general para el revisor

- Agregar **comentarios explicativos** en cada bloque de la función `get_details()` y en `authenticate()` que expliquen el propósito de cada consulta y por qué se expone o no cada dato.
- Mantener sin cambios: `timezone`, `carts` (booleano), y las opciones `home`, `blogname`, `sms_plugin_automations` — estos datos no representan riesgo significativo y son necesarios para diagnóstico.
- La función `wpdocs_maybe_is_ssl()` y el método `authenticate()` no requieren cambios de seguridad — están correctamente implementados.
- La clave de hash en `sms_api_hash()` (`'wc-api'`) es la misma que usa WooCommerce internamente; mantenerla así es intencional para compatibilidad.
