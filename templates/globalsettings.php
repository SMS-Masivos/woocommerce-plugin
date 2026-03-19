<input id="globalShopName" name="globalShopName" type="hidden" value="<?php echo esc_attr(get_option('home')); ?>" readonly>
<input id="globalApikey" name="globalApikey" type="hidden" value="<?php echo esc_attr(get_option('sms_plugin_apikey')); ?>" readonly>
<input id="globalToken" name="globalToken" type="hidden" value="<?php echo esc_attr(get_option('sms_plugin_token')); ?>" readonly>
<input id="globalNonce" name="globalNonce" type="hidden" value="<?php echo esc_attr(wp_create_nonce( 'my-ajax-nonce' )); ?>" readonly>
<input id="userstatus" name="userstatus" type="hidden" value="<?php $user_meta = get_userdata(1); echo esc_attr($user_meta->roles[0]); ?>" readonly>


<div id="global_container" >

    <div id="global_settings">
        <div id="settings" class="m100">
            <div class="classic whatsapp-box" >
                <div class="box-apikey">
                    <span class="whatsapp-status w2">Desactivado &nbsp; <i class="fas fa-check-circle"></i> </span>
                    <h2>Envío por WhatsApp</h2>
                    <hr>
                    <p style="font-size:14px"> Conecta tu propio número de WhatsApp escaneando un código QR, similar a como lo haces con WhatsApp Web. Con eso, tu tienda puede enviar mensajes automáticos usando tu número.
                    <br><br>
                    Conectar tu número es muy sencillo. Solo tienes que ingresar a tu panel de SMS Masivos, dirigirte a la sección "Conectar WhatsApp" y seguir nuestra guía de configuración.
                    </p>
                    
                    <div id="instances-container">
                    <label for="list-instances">Selecciona tu instancia</label>
                    <select id="list-instances" class="wide font-whatsapp">
                    </select>
                    </div>

                    <br><br>

                    <div class="modal-footer" style="border:none">
                        <br>
                        <a class="btn btn-outline-danger d-none" id="remove_whatsapp_intance">Detener envío por WhatsApp</a>
                        <a class="btn btn-set" id="set_whatsapp_intance"> Activar</a>
                    </div>

                </div>
            </div>

            <div class="classic d-none" id="consumer_container">
                <div class="question-title">  
                    <h3>Configura tus credenciales</h3>
                    <hr>
                    <p>Genera tus credenciales en la sección de "Ajustes" de tu PlugIn de WooCommerce. Busca la opción de "API", asegúrate de asignar un usuario de tipo administrador y dale permisos de lectura y escritura.</p>
                    <br>
                    <p class="text-warning d-none">Campos obligatorios</p>
                    <div class="mb-3">
                        <label for="ck" class="form-label">Consumer Key</label>
                        <input type="text" class="form-control" id="ck" placeholder="ck_o9f7y3o847nfo837fyno837yn43" maxlength="25">
                    </div>
                    <div class="mb-3">
                        <label for="cs" class="form-label">Consumer Secret</label>
                        <input type="text" class="form-control" id="cs" placeholder="cs_9r83nyo847grow8er7fhow8730j" maxlength="25">
                    </div>
                    <button type="button" id="sms_update_credentials" class="btn btn-danger">Actualizar</button>
                </div>
            </div>
        </div>	
    </div>


</div>
