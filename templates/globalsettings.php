<input id="userstatus" name="userstatus" type="hidden" value="<?php $user_meta = get_userdata(1); echo esc_attr($user_meta->roles[0]); ?>" readonly>

<?php include SMS_PLUGIN_PATH . '/templates/skeleton.php'; ?>

<div id="sms-skeleton" class="sms-skeleton-wrap" style="margin-top:75px;margin-left:100px;margin-right:100px;padding:20px;">
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div class="sms-sk" style="width:120px;height:24px;border-radius:20px;"></div>
        </div>
        <div class="sms-sk" style="width:180px;height:24px;margin-bottom:12px;"></div>
        <div style="border-top:1px solid #f0f0f0;padding-top:16px;margin-bottom:16px;">
            <div class="sms-sk" style="width:100%;height:14px;margin-bottom:8px;"></div>
            <div class="sms-sk" style="width:90%;height:14px;margin-bottom:8px;"></div>
            <div class="sms-sk" style="width:70%;height:14px;margin-bottom:20px;"></div>
        </div>
        <div class="sms-sk" style="width:140px;height:12px;margin-bottom:8px;"></div>
        <div class="sms-sk" style="width:100%;height:38px;margin-bottom:24px;"></div>
        <div style="display:flex;justify-content:flex-end;gap:12px;">
            <div class="sms-sk" style="width:150px;height:38px;border-radius:6px;"></div>
            <div class="sms-sk" style="width:150px;height:38px;border-radius:6px;"></div>
        </div>
    </div>
</div>

<div id="global_container" style="display:none;">

    <div id="global_settings">
        <div id="settings" class="m100">
            <div class="classic whatsapp-box" >
                <div class="box-apikey">
                    <span class="whatsapp-status w2">Sin vincular &nbsp; <i class="fas fa-unlink"></i> </span>
                    <h2>Envío por WhatsApp</h2>
                    <hr>
                    <p style="font-size:14px"> Conecta tu propio número de WhatsApp escaneando un código QR similar a como lo haces con WhatsApp Web, con eso tu tienda puede enviar mensajes automáticos usando tu número.
                    <br><br>
                    Conectar tu número es muy sencillo solo tienes que ingresar a tu panel SMS Masivos en la sección "Conectar WhatsApp" y seguir nuestra guía de configuración.
                    </p>

                    <div id="instances-container">
                    <label for="list-instances">Selecciona tu instancia</label>
                    <select id="list-instances" class="wide font-whatsapp">
                        <option disabled selected>Selecciona una instancia</option>
                    </select>
                    </div>

                    <br><br>

                    <div class="modal-footer" style="border:none">
                        <br>
                        <a class="btn btn-outline-danger d-none" id="remove_whatsapp_intance">Desvincular instancia</a>
                        <a class="btn btn-set" id="set_whatsapp_intance"> Vincular instancia</a>
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
