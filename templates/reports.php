<input id="globalShopName" name="globalShopName" type="hidden" value="<?=get_option('home')?>" readonly>
<input id="globalApikey" name="globalShopName" type="hidden" value="<?=get_option('sms_plugin_apikey')?>" readonly>
<input id="globalToken" name="globalShopName" type="hidden" value="<?=get_option('sms_plugin_token')?>" readonly>
<div id="global_container">
        
    <div id="informes" class="m100">
      <div class="classic p15 text-center">
        <h4>Mantente enterado de todo lo que sucede alrededor de tus automatizaciones</h4>
        <small class="help-time">
          <span>SMS Enviados: <span class="stats-span stats-sent"><i class="far fa-envelope"></i> 0</span></span>
          <span>Clics en enlace: <span class="stats-span stats-clicks"><i class="fas fa-mouse-pointer"></i> 0</span></span>
          <span>Recuperaciones: <span class="stats-span stats-recovery"><i class="fas fa-hands-helping"></i> 0</span></span>

        </small>
      </div>
      <div class="classic pb-3">
        <div class="row m-0" style="overflow-x: auto;">
          <table class="table table-hover text-center">
            <thead>
              <tr>
                <th scope="col">Tipo</th>
                <th scope="col">Tiempo</th>
                <th scope="col">Enviado</th>
                <th scope="col">Cliente</th>
                <th scope="col">Id</th>
                <th scope="col">Click</th>
                <th scope="col">Recuperado</th>
              </tr>
            </thead>
            <tbody id="list-body-2">
            </tbody>
          </table>
        </div>

        <div class="row justify-content-center d-none loadcontent">
          <button class="btn help-link" id="load_info" data-id="100"><i class="fas fa-caret-down"></i></button>
        </div>

        <div class="row justify-content-center mb-3 empty-3">
          <img src="https://smsmasivos.s3.us-west-1.amazonaws.com/public/woocommerce/empty-wordpress.png" alt="" width="60%">
        </div>
        <div class="row justify-content-center mb-3 empty-3">
          <a class="btn btn-danger" href="https://help.smsmasivos.com.mx/es/category/woocommerce-18koplv/" target="_blank">Aprende a usar el PlugIn</a>
        </div>
      </div>
    </div>	
</div>