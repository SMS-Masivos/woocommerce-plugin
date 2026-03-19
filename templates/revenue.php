<input id="globalShopName" name="globalShopName" type="hidden" value="<?=get_option('home')?>" readonly>
<input id="globalApikey" name="globalShopName" type="hidden" value="<?=get_option('sms_plugin_apikey')?>" readonly>
<input id="globalToken" name="globalShopName" type="hidden" value="<?=get_option('sms_plugin_token')?>" readonly>

<div id="global_container">
<div id="revenue" class="m100">
      <div class="report">
        
        <div class="stats lateral">
          <div class="card-body">
            <p class="main-title ">Ventas totales <i class="fa fa-dollar-sign"></i></p>
            <p class="note m-0 p-0">Últimos 30 días</p>
            <hr>
            <p class="neutral ventas_totales">$0.00</p>
            <hr>
            <p class="auxiliar">.</p>
          </div>
        </div>

        <div class="stats central">
          <div class="card-body">
            <p class="main-title">Ingresos totales de automatizaciones <i class="fa fa-dollar-sign"></i></p>
            <p class="note m-0 p-0">Últimos 30 días</p>
            <hr>
            <p class="neutral ventas_automatizacion">$0.00</p>
            <hr>
            <p id="indicador1"><i class="fas fa-sort-up"></i>Dato no disponible aún</p>
            
          </div>
        </div>
      
        <div class="stats lateral">
          <div class="card-body">
            <p class="main-title">Clientes alcanzados <i class="fa fa-users"></i></p>
            <p class="note m-0 p-0">Last month</p>
            <hr>
            <p class="neutral clientes_alcanzados">0</p>
            <hr>
            <p id="indicador2"><i class="fas fa-sort-up"></i>Dato no disponible aún</p>
           
          </div>
        </div>        
      </div>

      <div class="banner2">
        <h4>Ingresos por automatizaciones</h4>
        <p class="m-0">Conoce el impacto que tienen las automatizaciones sobre tus ventas y cómo te ayudan a traer clientes nuevos.</p>
      </div>
      <div class="report2">
        <div class="wrapper-chart">
          <div class="card-body">
            <span class="loading"><i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i> Loading </span>
            <canvas class="d-none" id="grafica-revenue"></canvas>
          </div>
        </div>
        <div class="wrapper-chart-left">
          <div class="card-body">
            <span class="loading"><i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i> Loading </span>
            <canvas class="d-none" id="grafica-clientes"></canvas>
          </div>
        </div>
      </div>
      
    </div>	
</div>