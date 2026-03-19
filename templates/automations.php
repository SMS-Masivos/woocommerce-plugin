<input id="globalShopName" name="globalShopName" type="hidden" value="<?php echo esc_attr(get_option('home')); ?>" readonly>
<input id="globalApikey" name="globalApikey" type="hidden" value="<?php echo esc_attr(get_option('sms_plugin_apikey')); ?>" readonly>
<input id="globalToken" name="globalToken" type="hidden" value="<?php echo esc_attr(get_option('sms_plugin_token')); ?>" readonly>
<input id="globalNonce" name="globalNonce" type="hidden" value="<?php echo esc_attr(wp_create_nonce( 'my-ajax-nonce' )); ?>" readonly>
<input id="globalNonce_apikey" name="globalNonce_apikey" type="hidden" value="<?php echo esc_attr(wp_create_nonce( 'update-api-key' )); ?>" readonly>
<input id="userstatus" name="userstatus" type="hidden" value="<?php $user_meta = get_userdata(1); echo esc_attr($user_meta->roles[0]); ?>" readonly>
<input id="isextensionactive" type="hidden" value="<?php echo esc_attr(is_plugin_active('woocommerce-abandoned-cart/woocommerce-ac.php')); ?>" readonly>


<div id="global_container">
    <div id="global_automations">

      <nav class="navbar navbar-expand-lg">
        <a class="navbar-brand" href="#"><img src='<?php echo esc_url(SMS_PLUGIN_URL); ?>assets/images/logo-sms-01.png' class="logo"></a>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <p class="whatsapp btn-settings">¡Envía por WhatsApp! &nbsp;<i class="fab fa-whatsapp"></i></p>
            </li>
                      
          </ul>

          <a style="color: #14477e;"><i class="fa fa-envelope"></i> <span id="credits">0</span> Créditos</a>
          <span class="btn btn-primary btn-credits ml-3">
              <span><i class="fa-light fa-cart-shopping"></i> Comprar mensajes</span>
          </span>
          
        </div>
      </nav>
      <div style="border-bottom: 1px solid #cccccc;"></div>

      <div id="automations">
        <div class="banner-red text-center d-none" id="invalid_admin">Algunas de tus automatizacion no pueden ser procesadas, configura un telefono de administrador en tu panel para resolverlo.</div>
        <div class="banner-red text-center d-none text-center" id="invalid_apikey">La apikey que configuraste ha cambiado, para reanudar las automatizaciones actualízala.</div>
        <div class="banner-red text-center d-none" id="invalid_whatsapp_instance">Tus notificaciones no pueden ser entregadas por WhatsApp debido a que la instancia no está sincronizada en este momento. Tus mensajes serán entregados vía SMS.</div>
        <div class="banner-red text-center d-none" id="user_no_admin">Es necesario que configures manualmente tu consumer_key y consumer_secret en la sección de configuraciones para el correcto funcionamiento de tu plugin</div>
        
        <div class="classic m100x" style="margin-top: 75px;">
          <h5>Las automatizaciones hacen tu vida más fácil</h5>
          <small>Aprovecha todas las posibilidades que pueden ofrecerte las automatizaciones. Acelera tus ventas, atiende mejor a tus clientes de forma automática y sin esfuerzo.</small>
        </div>

        <div class="classic m100x">
          <div class="row">
            <div class="col-md-4">
              <div class="row">
                <div class="col-md-12">
                  <div class="box mt-2">
                    <label style="padding-left: 0;color: #0e3258;" for="country">País</label>
                    
                    <select id="country" class="wide country">
                    <option disabled selected>Selecciona tu País</option>
                    <option value="54">🇦🇷 &nbsp;&nbsp;Argentina</option>
                    <option value="591">🇧🇴 &nbsp;&nbsp;Bolivia</option>
                    <option value="55">🇧🇷 &nbsp;&nbsp;Brasil</option>
                    <option value="56">🇨🇱 &nbsp;&nbsp;Chile</option>
                    <option value="57">🇨🇴 &nbsp;&nbsp;Colombia</option>
                    <option value="506">🇨🇷 &nbsp;&nbsp;Costa Rica</option>
                    <option value="593">🇪🇨 &nbsp;&nbsp;Ecuador</option>
                    <option value="503">🇸🇻 &nbsp;&nbsp;El Salvador</option>
                    <option value="1">🇺🇸 &nbsp;&nbsp;Estados Unidos</option>
                    <option value="502">🇬🇹 &nbsp;&nbsp;Guatemala</option>
                    <option value="504">🇭🇳 &nbsp;&nbsp;Honduras</option>
                    <option value="52">🇲🇽 &nbsp;&nbsp;México</option>
                    <option value="505">🇳🇮 &nbsp;&nbsp;Nicaragua</option>
                    <option value="507">🇵🇦 &nbsp;&nbsp;Panamá</option>
                    <option value="58">🇻🇪 &nbsp;&nbsp;Venezuela</option>
                    </select>
           
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="box mt-3">
                    <label style="padding-left: 0;color: #0e3258;" for="phone_number">Número de celular del administrador de esta tienda</small></label>
                    <input placeholder="Código de ciudad + número" id="phone_number" class="form-control" type="number">
                  </div>
                </div>

              </div>
            </div>
            <div class="col-md-8">
              <div class="col-md-12">
                
                <div class="form-group mt-3" style="margin-bottom:0px;padding-top: 10px;">
                  <input class="col-md-1 mr-3" type="checkbox" id="last_credits"/>
                  <label class="col-md-10" for="last_credits" style="padding-left:0;color:#0e3258;">Envíame un SMS cuando se terminen mis créditos
                  <br><small style="color:#5f6265;">Te notificaremos cuando tus créditos esten por agotarse al número de telefono que configures como administrador de esta tienda</small></label>
                </div>
              </div>

              <div class="col-md-12">
                <div class="form-group mt-3" style="margin-bottom:0px;padding-top:10px;">
                  <input class="col-md-1 mr-3" type="checkbox" id="save_contacts" checked/>
                  <label class="col-md-10" for="save_contacts" style="padding-left:0;color:#0e3258;">Guardar mis contactos en una agenda de SMS Masivos
                  <br><small style="color:#5f6265;">Cada vez que algún cliente interactúe a través de alguna de las automatizaciones, guardaremos sus datos en una agenda en el panel de SMS Masivos. Así podrás tenerlos a la mano para enviarles nuevas campañas y notificarlos de nuevas promociones. <a class="agendalink" href="https://app.smsmasivos.com.mx/agendas" target="_blank">Ver agenda.</a></small></label>
                </div>
              </div>
            </div>

          </div>
          <div class="row justify-content-end">
            <div class="col-md-2">
              <a class="btn btn-block btn-save btn btn-outline-secondary" id="save"> Guardar</a>   
            </div>
          </div>
        </div>

        <div class="classic m100x">
          <div class="card-body p15">

            <div class="mb-4">
              <h5 style="float: left;margin-bottom: 0;margin-top: 10px;"><i class="text-white fa fa-cube"></i>Automatizaciones</h5>
              <div class="row m-0">
                <div class="col text-right">
                  <button id="btn-automations-details" class="btn btn-primary"><i class="fa-light fa-plus p-r-5"></i> Nueva automatización</button>
                  <a href="https://app.smsmasivos.com.mx/reportescampania" target="_blank" class="btn btn-outline-secondary"><i class="fas fa-cart-arrow-down"></i> Reportes</a>
                </div>
              </div>
            </div>
            
            <div class="table-container" style="position:relative;">
              <div class="row m-0" style="overflow-x: auto;">
                <table class="table table-hover text-center">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">SMS enviados</th>
                      <th scope="col">Clics</th>
                      <th scope="col">Ingresos</th>
                      <th scope="col">Estatus</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody id="list-body">
                  </tbody>
                </table>
              </div>
            </div>

            <div class="row justify-content-center mb-3 empty">
              <img src="<?php echo esc_url(SMS_PLUGIN_URL); ?>assets/images/empty.png" alt="" width="60%">
            </div>
            <div class="row justify-content-center mb-3 empty">
              <a class="btn btn-danger" href="https://help.smsmasivos.com.mx/es/category/woocommerce-18koplv/" target="_blank">Aprende a usar el plugin</a>
            </div>
          </div>

        </div>

      </div>

    </div>
    <!-- Modal -->
    <div class="modal fade" id="automations-details" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="modal-title-details">Crea una nueva automatización</h4>
            <button id="cancel-automation" type="button" class="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p70">
            <div class="container-fluid p-0">

              <div class="multisteps-form">

                <!--progress bar-->
                <div class="row">
                  <div class="col-12 ml-auto mr-auto mb-4">
                    <div class="multisteps-form__progress">
                         <button class="multisteps-form__progress-btn js-active totype" type="button" title="Address">Tipo</button>
                        <button class="multisteps-form__progress-btn totime" type="button" title="Time">Tiempo</button>
                        <button class="multisteps-form__progress-btn torecipient" type="button" title="Order Info">Destinatario </button>
                        <button class="multisteps-form__progress-btn tosend direct-tosend" type="button" title="envio">Envío</button>
                        <button class="multisteps-form__progress-btn tomsg" type="button" title="Comments">Contenido</button>
                        <button class="multisteps-form__progress-btn toname" type="button" title="User Info">Nombre de la automatización</button>
                    </div>
                  </div>
                </div>

                <!--form panels-->
                <div class="row">
                  <div class="col-12 m-auto">
                    <form class="multisteps-form__form" style="height: 273px;">

                      <!--single form panel-->
                      <div class="multisteps-form__panel  p-4 rounded bg-white js-active" data-animation="FadeIn">
                        <h5 class="multisteps-form__title m-sub">Tipo de automatización </h5>
                        <p>¿Qué clase de automatización quieres?</p>
                        <div class="multisteps-form__content">
                          <div class="form-row mt-4">

                            <div class="col my-2">
                              <div class="box">
                                <select id="list-type" class="wide country">
                                  <option disabled>Retención</option>
                                  <option value="winback">Recuperación del cliente</option>
                                  <option value="abandoned">Recordatorios para carritos abandonados</option>
                                  <option disabled>Atención al cliente</option>
                                  <option value="new_order">Nueva orden</option>
                                  <option value="f-created">Confirmación de envío de productos</option>
                                  <option value="cash-od">Pago contra entrega</option>
                                  <option value="feedback">Retroalimentación en pedido entregado</option>
                                  <option disabled>Eventos de Wordpress</option>
                                  <option value="o-pending">Orden Pendiente</option>
                                  <option value="o-onhold">Orden en espera</option>
                                  <option value="o-completed">Orden completada</option>
                                  <option value="o-cancelled">Orden cancelada</option> 
                                </select>
                              </div>
                            </div>
                          </div>
                          <p class="note" id="indicaciones">¿Tienes clientes que quieres que te compren de nuevo? Mantenerte presente y enviarles promociones periódicas después de cierto tiempo de su última compra es muy fácil. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-para-recordatorios-de-carritos-abandonados-para-clientes-7xgqay/">Ver guía paso a paso</a></p>
                          <div class="button-row d-flex mt-4">
                            <button class="btn btn-classic ml-auto js-btn-next totime" type="button" title="Next">Siguiente</button>
                          </div>
                        </div>
                      </div>

                      <!--single form panel-->
                      <div class="multisteps-form__panel  p-4 rounded bg-white" data-animation="FadeIn">
                      <h5 class="multisteps-form__title m-sub">Tiempo/Retraso </h5>
                      <p id="tag-tiempo">Selecciona el tiempo adecuado para el envío de tus SMS.</p>
                        <div class="multisteps-form__content">
                          <div class="form-row mt-4">
    
                            <div class="col my-2">
                              <div class="box timelapse p35">
                                <p class="help-time">Determina el tiempo de retraso contando desde la última compra realizada por el usuario para enviar el SMS de recuperación. </p>
                                <input type="number" id="timelapse" class="form-control timelapse-forced" autocomplete="false" max="30" min="1" value="30" required="" aria-required="true">
                                <select id="list-time" class="right">
                                  <option id="minutes" value="minutes">Minuto/s</option>
                                  <option id="hours" value="hours">Hora/s</option>
                                  <option value="days">Día/s</option>
                                </select>
                                <p class="auto">Automática, notificación instantánea.</p>
                           
                              </div>
                            </div>

                          </div>
                          <div class="button-row d-flex mt-4">
                            <button class="btn btn-classic js-btn-prev" type="button" title="Prev">Atrás</button>
                            <button class="btn btn-classic ml-auto js-btn-next torecipient" type="button" title="Next">Siguiente</button>
                          </div>
                        </div>
                      </div>

                      <!--single form panel-->
                      <div class="multisteps-form__panel  p-4 rounded bg-white" data-animation="FadeIn">
                        <h5 class="multisteps-form__title m-sub">Destinatario </h5>
                        <p>Selecciona quién recibirá los mensajes.</p>
                        <div class="multisteps-form__content">
                          <div class="form-row mt-4">

                            <div class="col my-2">
                              <div class="box">
                                <select id="list-recipient" class="wide country">
                                  <option value="customer">Cliente</option>
                                  <option id="value-admin" value="admin">Admin</option>
                                </select>
                              </div>
                            </div>

                          </div>
                          <div class="note-red d-none">Para activar la opción de administrador, configura el número y el código de país en tu panel.</div>
                          <div class="row">
                            <div class="button-row d-flex mt-4 col-12">
                                <button class="btn btn-classic js-btn-prev totime" type="button" title="Prev">Atrás</button>
                                <button class="btn btn-classic ml-auto tomsg direct" type="button" title="Next">Siguiente</button>
                                <button class="btn btn-classic ml-auto js-btn-next tosend d-none" type="button" title="Next">Siguiente</button>
                            </div>
                          </div>
                        </div>
                      </div>

                                            <!--single form panel-->
                      <div class="multisteps-form__panel  p-4 rounded bg-white" data-animation="FadeIn">
                        <h5 class="multisteps-form__title m-sub">Selecciona el canal de envío para esta automatización</h5>
                        <div class="multisteps-form__content">
                          <div class="form-row mt-4">
                            <div class="col">
                              <div class="box">
                                <select id="list-send" class="wide">
                                  <option value="0">SMS</option>
                                  <option value="1">WhatsApp</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="button-row d-flex mt-4">
                              <button class="btn btn-classic js-btn-prev torecipient" type="button" title="Prev">Atrás</button>
                              <button class="btn btn-classic ml-auto js-btn-next tomsg" type="button" title="Next">Siguiente</button>
                          </div>
                        </div>
                      </div>


                        <!--single form panel-->
                        <div class="multisteps-form__panel  p-4 rounded bg-white" data-animation="FadeIn">
                          <!--<h5 class="multisteps-form__title m-sub">Texto del mensaje</h5>-->
                          <div class="multisteps-form__content">

                            <div class="tabs">
                              <input type="radio" name="tabs" id="tabone" checked="checked" class="texteditor-whatsapp">
                              <label for="tabone" class="texteditor-whatsapp">Mensaje por WhatsApp</label>
                              <div class="tab texteditor-whatsapp">
                                <div class="form-row">
                                    <small>Redacta aquí el texto que enviaremos por WhatsApp, recuerda que tienes hasta 1000 caracteres disponibles, usa etiquetas dinamicas, iconos y más</small>
                                    <pre id="automation_text_ws" contenteditable="true" class="multisteps-form__textarea form-control" maxlength = "15" >
                                    </pre>
                                    <p class="autocount"><span id="automation_count_ws">0</span>/1000</p>
                                    <p id="text-error_ws" style="margin-top: -25px;" class="text-danger d-none"><small>Este campo no puede estar vacio</small></p>

                                </div>

                                <div class="tags-wrapper">
                                    <div class="baloon-container d-none compact">
                                        <div class="baloon_ws" id="shortcode_tags_ws">
                                          <div class="resources">
                                            <input type="radio" name="resources-list" id="resone" checked="checked" class="resources-one">
                                            <label for="resone" class="resources-one">Etiquetas</label>
                                            <div class="resource resources-one" id="taglist">
                                            </div>
                                            <input type="radio" name="resources-list" id="restwo" class="resources-two" >
                                            <label for="restwo" class="resources-two"> 😀 </label>
                                            <div class="resource resources-two">
                                              <span class="emoji">😀</span>
                                              <span class="emoji">😁</span>
                                              <span class="emoji">😂</span>
                                              <span class="emoji">🤣</span>
                                              <span class="emoji">😃</span>
                                              <span class="emoji">😄</span>
                                              <span class="emoji">😅</span>
                                              <span class="emoji">😆</span>
                                              <span class="emoji">😉</span>

                                              <span class="emoji">😊</span>
                                              <span class="emoji">😋</span>
                                              <span class="emoji">😎</span>
                                              <span class="emoji">😍</span>
                                              <span class="emoji">😘</span>
                                              <span class="emoji">🥰</span>
                                              <span class="emoji">😙</span>
                                              <span class="emoji">😚</span>
                                              <span class="emoji">🤪</span>

                                              <span class="emoji">🙂</span>
                                              <span class="emoji">🤩</span>
                                              <span class="emoji">🤔</span>
                                              <span class="emoji">😏</span>
                                              <span class="emoji">😮</span>
                                              <span class="emoji">🤑</span>
                                              <span class="emoji">😴</span>
                                              <span class="emoji">😛</span>
                                              <span class="emoji">😕</span>

                                              <span class="emoji">🙁</span>
                                              <span class="emoji">😖</span>
                                              <span class="emoji">😭</span>
                                              <span class="emoji">😨</span>
                                              <span class="emoji">🤯</span>
                                              <span class="emoji">😱</span>
                                              <span class="emoji">🥳</span>
                                              <span class="emoji">🤫</span>


                                              <span class="emoji">👦</span>
                                              <span class="emoji">👩</span>
                                              <span class="emoji">🙋‍♀️</span>
                                              <span class="emoji">🙋‍♂️</span>
                                              <span class="emoji">🤷‍♀️</span>
                                              <span class="emoji">🤷‍♂️</span>
                                              <span class="emoji">🏃‍♀️</span>
                                              <span class="emoji">🏃‍♂️</span>
                                              <span class="emoji">👫</span>
                                              <span class="emoji">👨‍👩‍👧</span>
                                            </div>

                                            <input type="radio" name="resources-list" id="resthree" class="resources-three" >
                                            <label for="resthree" class="resources-three"> 🐶 </label>
                                            <div class="resource resources-three">
                                              <span class="emoji">🐶</span>
                                              <span class="emoji">🐱</span>
                                              <span class="emoji">🐭</span>
                                              <span class="emoji">🐹</span>
                                              <span class="emoji">🐰</span>
                                              <span class="emoji">🦊</span>
                                              <span class="emoji">🐻</span>
                                              <span class="emoji">🐼</span>
                                              <span class="emoji">🦁</span>

                                              <span class="emoji">🙈</span>
                                              <span class="emoji">🙉</span>
                                              <span class="emoji">🙊</span>
                                              <span class="emoji">🐧</span>
                                              <span class="emoji">🦋</span>
                                              <span class="emoji">🍄</span>
                                              <span class="emoji">🌷</span>
                                              <span class="emoji">🌻</span>
                                              <span class="emoji">🌞</span>

                                              <span class="emoji">🌝</span>
                                              <span class="emoji">🌛</span>
                                              <span class="emoji">🌔</span>
                                              <span class="emoji">🌎</span>
                                              <span class="emoji">⭐️</span>
                                              <span class="emoji">💥</span>
                                              <span class="emoji">🔥</span>
                                              <span class="emoji">🌈</span>
                                            </div>

                                            <input type="radio" name="resources-list" id="resfour" class="resources-four" >
                                            <label for="resfour" class="resources-four"> 🍏 </label>
                                            <div class="resource resources-four">
                                              <span class="emoji">🍏</span>
                                              <span class="emoji">🍎</span>
                                              <span class="emoji">🍐</span>
                                              <span class="emoji">🍊</span>
                                              <span class="emoji">🍋</span>
                                              <span class="emoji">🍌</span>
                                              <span class="emoji">🍉</span>
                                              <span class="emoji">🍇</span>
                                              <span class="emoji">🍓</span>

                                              <span class="emoji">🍒</span>
                                              <span class="emoji">🍑</span>
                                              <span class="emoji">🥥</span>
                                              <span class="emoji">🍆</span>
                                              <span class="emoji">🥑</span>
                                              <span class="emoji">🥦</span>
                                              <span class="emoji">🌶</span>
                                              <span class="emoji">🌽</span>
                                              <span class="emoji">🥐</span>


                                              <span class="emoji">🥚</span>
                                              <span class="emoji">🥞</span>
                                              <span class="emoji">🍖</span>
                                              <span class="emoji">🍔</span>
                                              <span class="emoji">🌮</span>
                                              <span class="emoji">🍰</span>
                                              <span class="emoji">🎂</span>
                                              <span class="emoji">🍺</span>
                                              <span class="emoji">🍷</span>

                                              <span class="emoji">🍾</span>
                                              <span class="emoji">🍴</span>
                                              <span class="emoji">🍽</span>
                                            </div>

                                            <input type="radio" name="resources-list" id="resfive" class="resources-five" >
                                            <label for="resfive" class="resources-five"> ⚽️ </label>
                                            <div class="resource resources-five">
                                              <span class="emoji">⚽️</span>
                                              <span class="emoji">🏀</span>
                                              <span class="emoji">🏈</span>
                                              <span class="emoji">⚾️</span>
                                              <span class="emoji">🏐</span>
                                              <span class="emoji">🎾</span>
                                              <span class="emoji">🏓</span>
                                              <span class="emoji">🥊</span>
                                              <span class="emoji">⛷</span>

                                              <span class="emoji">🧘‍♀️</span>
                                              <span class="emoji">🚴‍♂️</span>
                                              <span class="emoji">🏆</span>
                                              <span class="emoji">🥇</span>
                                              <span class="emoji">🥈</span>
                                              <span class="emoji">🥉</span>
                                              <span class="emoji">🎨</span>
                                              <span class="emoji">🎼</span>
                                              <span class="emoji">🎷</span>
                                              <span class="emoji">🎮</span>
                                            </div>

                                            <input type="radio" name="resources-list" id="ressix" class="resources-six" >
                                            <label for="ressix" class="resources-six"> 🚗 </label>
                                            <div class="resource resources-six">
                                              <span class="emoji">🚗</span>
                                              <span class="emoji">🚕</span>
                                              <span class="emoji">🚌</span>
                                              <span class="emoji">🚑</span>
                                              <span class="emoji">🚜</span>
                                              <span class="emoji">🚲</span>
                                              <span class="emoji">🛵</span>
                                              <span class="emoji">🛫</span>
                                              <span class="emoji">🛩</span>

                                              <span class="emoji">🚀</span>
                                              <span class="emoji">⛵️</span>
                                              <span class="emoji">🚢</span>
                                              <span class="emoji">🚧</span>
                                              <span class="emoji">🚦</span>
                                              <span class="emoji">🗽</span>
                                              <span class="emoji">⛱</span>
                                              <span class="emoji">🏝</span>
                                              <span class="emoji">🏔</span>

                                              <span class="emoji">🏠</span>
                                              <span class="emoji">🏭</span>
                                              <span class="emoji">🏛</span>
                                              <span class="emoji">🛣</span>
                                              <span class="emoji">🌅</span>
                                              <span class="emoji">🎇</span>
                                              <span class="emoji">🌇</span>
                                              <span class="emoji">🏙</span>
                                              <span class="emoji">🌉</span>
                                            </div>

                                            <input type="radio" name="resources-list" id="resseven" class="resources-seven" >
                                            <label for="resseven" class="resources-seven"> ⌚️ </label>
                                            <div class="resource resources-seven">

                                              <span class="emoji">📱</span>
                                              <span class="emoji">💻</span>
                                              <span class="emoji">🖥</span>
                                              <span class="emoji">🖨</span>
                                              <span class="emoji">💾</span>
                                              <span class="emoji">📀</span>
                                              <span class="emoji">📸</span>
                                              <span class="emoji">📞</span>

                                              <span class="emoji">🎙</span>
                                              <span class="emoji">🕰</span>
                                              <span class="emoji">🔋</span>
                                              <span class="emoji">💡</span>
                                              <span class="emoji">💸</span>
                                              <span class="emoji">💵</span>

                                              <span class="emoji">💳</span>
                                              <span class="emoji">🧾</span>
                                              <span class="emoji">🛠</span>
                                              <span class="emoji">🔪</span>
                                              <span class="emoji">🔑</span>
                                              <span class="emoji">🛒</span>
                                              <span class="emoji">🎁</span>
                                              <span class="emoji">🛍</span>
                                              <span class="emoji">🎀</span>

                                              <span class="emoji">🎊</span>
                                              <span class="emoji">🎉</span>
                                              <span class="emoji">📩</span>
                                              <span class="emoji">📦</span>
                                              <span class="emoji">📫</span>
                                              <span class="emoji">📆</span>
                                              <span class="emoji">📂</span>
                                              <span class="emoji">📚</span>
                                              <span class="emoji">📌</span>

                                              <span class="emoji">📝</span>
                                              <span class="emoji">🔍</span>
                                              <span class="emoji">🔒</span>

                                            </div>
                                          </div>
                                        </div>
                                    </div>
                                </div>
    
                                <button id="shortcodes_ws" class="btn btn-block btn-classic_ws" type="button">Ver etiquetas disponibles (WhatsApp)</button>
                                <div>
                                  <p class="note">El uso de etiquetas modifica la longitud final del mensaje y varía en función del contenido.
                                    <br>Recuerda no sobrepasar los 1000 caracteres disponibles, ya que tu mensaje podría no entregarse. Por ejemplo, un cliente se puede llamar Juan, que consumiría 4 caracteres, y otro Emiliano, que consumiría 8.
                                    <label class="d-none" id="restriccion_ws"><input type="checkbox" name="checkbox" value="value" id="restriccion_input_ws">Desactivar restricción de caracteres (No recomendado)</label>
                                  </p>
      
                                </div>

                              </div>
                              
                              <input type="radio" name="tabs" id="tabtwo" class="texteditor-sms">
                              <label for="tabtwo" class="texteditor-sms">Mensaje SMS</label>
                              <div class="tab texteditor-sms">

                                <div class="form-row">
                                  <small>Mensaje por SMS, redacta un breve mensaje, en caso de que tu envío por WhatsApp no pueda llevarse a cabo aún podremos notificar a tu cliente vía sms</small>
                                  <pre id="automation_text" contenteditable="true" class="multisteps-form__textarea form-control" maxlength = "15" >
                                  </pre>
                                  <p class="autocount"><span id="automation_count">0</span>/160</p>
                                  <p id="text-error" style="margin-top: -25px;" class="text-danger d-none"><small>Este campo no puede estar vacio</small></p>
                                </div>
                                <div class="baloon sb1 d-none" id="shortcode_tags">      
                                </div>
                                <button id="shortcodes" class="btn btn-block btn-classic" type="button">Ver etiquetas disponibles (SMS)</button>
                                <div>
                                  <p class="note">El uso de etiquetas modifica la longitud final del mensaje y varía en función del contenido.
                                    <br>Recuerda no sobrepasar los 160 caracteres disponibles, ya que tu mensaje podría no entregarse. Por ejemplo, un cliente se puede llamar Juan, que consumiría 4 caracteres, y otro Emiliano, que consumiría 8.
                                    <label  class="d-none" id="restriccion"><input type="checkbox" name="checkbox" value="value" id="restriccion_input">Desactivar restricción de caracteres (No recomendado)</label>
                                  </p>
      
                                </div>

                              </div>
                            </div>





                            <div class="button-row d-flex mt-4">
                              <button class="btn btn-classic torecipient direct" type="button" title="Prev">Atrás</button>
                              <button class="btn btn-classic js-btn-prev tosend" type="button" title="Prev">Atrás</button>
                              <button class="btn btn-classic ml-auto js-btn-next toname" type="button" title="Next">Siguiente</button>
                            </div>
                          </div>
                        </div>


                      <!--single form panel-->
                      <div class="multisteps-form__panel  p-4 rounded bg-white" data-animation="FadeIn">
                        <h5 class="multisteps-form__title m-sub">Agrega un nombre a tu automatización</h5>
                        <div class="multisteps-form__content">
                          <div class="form-row mt-4">
                            <div class="col-12">
                              <input maxlength = "150" class="multisteps-form__input form-control" type="text" id="automation_name" placeholder="Describe brevemente tu automatización"/>
                            </div>
                          </div>
                          <div class="button-row d-flex mt-4">
                              <button class="btn btn-classic js-btn-prev tomsg" type="button" title="Prev">Atrás</button>
                              <button class="create-automation btn btn-primary ml-auto" type="button" title="Send" data-edit="0" data-id="0">Crear</button>
                          </div>
                        </div>
                      </div>


                    </form>
                   </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal  Msg-->
    <div class="modal fade" id="modal_msg_automation" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-title-details">Mensaje personalizado</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body p70">
            <div class="container-fluid p-0">   
              <div class="form-row">
                <textarea id="textarea_msg_automation" class="multisteps-form__textarea form-control" placeholder="Place here the message your recipient will receive"  maxlength="160"></textarea>
              </div> 
              <div class="button-row d-flex mt-4">
                <button class="btn btn-primary ml-auto" id="btn_msg_automation" type="button" title="Update">Actualizar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal  Msg-->
    <div class="modal fade" id="modal_msg_info" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          
          <div class="modal-header">
            <h5 class="modal-title" id="modal-title-details">Detalles</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body p70">
            <div class="container-fluid p-0"> 

              <div class="row justify-content-md-center">
                  <div class="col-md-5"><p class="mt-15" id="info_text"></p></div>
                  <div class="col-md-3">
                    <img src="<?php echo esc_url(SMS_PLUGIN_URL); ?>assets/images/paper_plane.png" width="100%">
                  </div>
              </div>

              <div class="col-md-12">
                <p class="tag2">Destinatario: <span class="tag1" id="info_recipient_number">4646551706</span></p>
              </div>

              <div class="col-md-12">
                <p class="tag2">SMS: <span class="tag1" id="info_message">¡Un nuevo usuario a sido creado!</span></p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal  Registro-->
    <div class="modal fade" id="modal_register" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content p30">

          <h1 class="register-title ml-15">¡Bienvenido a tu PlugIn de SMS Masivos!         
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button></h1>
          <h2 class="register-subtitle ml-15 ">Para comenzar, sigue estos pasos:</h2>
      
          <div id="accordion">
            <div>
              <div id="headingOne">
                <h5 class="mb-0">
                  <span class="circle">1</span>
                  Inicia sesión con tu cuenta de SMS Masivos<small class="small-sub"><a href="https://help.smsmasivos.com.mx/es/article/como-registrar-una-cuenta-en-sms-masivos-tsg92b/" target="_blank">¿Qué es esto?</a></small>
                  <button class="btn btn-link btn-custom-2" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <i class="fas fa-caret-down"></i>
                  </button>
                </h5>
              </div>
          
              <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="ml-15 grey-color">
                  <p>Sólo ingresa con tus usuario y contraseña para poder empezar a usar el PlugIn. </p>
                  <div class="notification">
                  </div>
                  <form method="POST" action="#" id="login-form">
                    <div class="mb-3">
                      <label for="exampleInputEmail1" class="form-label">Correo electrónico</label>
                      <input type="email" class="form-control" id="useremail" aria-describedby="emailHelp" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="password">Contraseña</label>
                        <div class="controls">
                            <div class="input-group">
                                <input id="userpassword" name="password" type="password" class="form-control see_password_input" required>
                                <span class="btn btn-primary see_password"><i class="fas fa-eye text-white"></i></span>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" id="login-boton">Inicia sesión</button>
                    <a class=" ml-3 text-decoration-none" href="https://app.smsmasivos.com.mx/signup?utm_source=woocommerce&utm_medium=plugin_woocommerce" target="_blank" style="color: #14477e;">¿Todavía no tienes una cuenta? Regístrate gratis</a>
                    </span>
                  </form>
                </div>
              </div>
            </div>

            <div>
              <div id="headingFour">
                <h5 class="mb-0">
                  <span class="circle">2</span>
                  Configura tus automatizaciones<small class="small-sub"><a href="https://help.smsmasivos.com.mx/es/category/woocommerce-18koplv/" target="_blank">¿Qué es esto?</a></small>
                  <button class="btn btn-link btn-custom-2 step2" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                    <i class="fas fa-caret-down"></i>
                  </button>
                </h5>
              </div>
              <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
                <div class="ml-15 grey-color">
                  <p>¡Listo! Ya puedes empezar a configurar tu plugin en el menú de <b>automatizaciones</b> aquí a la izquierda.</p>
                  <img src="<?php echo esc_url(SMS_PLUGIN_URL); ?>assets/images/flecha.png" width="150px" class="mb-15">
                  <p>Aprende a configurarlo para sacarle el máximo provecho y empieza a vender más. Tenemos guías para que aprendas todo lo que puedes lograr con el plugin.</p>
                  <a class="btn btn-primary" href="https://help.smsmasivos.com.mx/es/category/woocommerce-18koplv/" target="_blank">Ver guías</a>
                </div>
              </div>
            </div>


            <div>
              <div id="headingFive">
                <h5 class="mb-0">
                  <span class="circle">3</span>
                  Prueba el plugin con los mensajes gratis
                  <button class="btn btn-link btn-custom-2" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                    <i class="fas fa-caret-down"></i>
                  </button>
                </h5>
              </div>
              <div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#accordion">
                <div class="ml-15 grey-color">
                  <p>Empieza a configurar tu plugin de SMS Masivos.</p>
                  <button type="button" data-dismiss="modal" aria-label="Close" class="btn btn-primary">Comienza aquí</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Modal -->
    <div class="modal fade" id="modal_issues" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-title-details">Informe de problemas</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid p-2">
              <p>Los mensajes relacionados a esta automatización (Recordatorio de Carritos Abandonados) no pueden procesarse correctamente</p>
              <hr><br>
              <span class="info-claves">
                <i class="gn-icon fa fa-check text-success float-left" style="height: 25px;"></i><p>Claves acceso WP configuradas correctamente</p>
              </span>
              <br>
              <i class="gn-icon fa fa-times text-warning float-left" style="height: 25px;"></i><p>Extensión de carritos abandonados no instalada (woocommerce abandoned carts). <a href="https://downloads.wordpress.org/plugin/woocommerce-abandoned-cart.zip">Descargar e instalar</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>

</div>
