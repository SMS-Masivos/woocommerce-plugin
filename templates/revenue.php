<?php include SMS_PLUGIN_PATH . '/templates/skeleton.php'; ?>

<div id="sms-skeleton" class="sms-skeleton-wrap" style="margin-top:75px;margin-left:100px;margin-right:100px;padding:20px;">
    <div style="display:flex;gap:1.5%;margin-bottom:24px;">
        <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;">
            <div class="sms-sk" style="width:70%;height:16px;margin-bottom:8px;"></div>
            <div class="sms-sk" style="width:50%;height:12px;margin-bottom:16px;"></div>
            <div style="border-top:1px solid #f0f0f0;padding-top:12px;margin-bottom:12px;">
                <div class="sms-sk" style="width:80px;height:22px;"></div>
            </div>
            <div style="border-top:1px solid #f0f0f0;padding-top:12px;">
                <div class="sms-sk" style="width:40px;height:12px;"></div>
            </div>
        </div>
        <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;">
            <div class="sms-sk" style="width:85%;height:16px;margin-bottom:8px;"></div>
            <div class="sms-sk" style="width:50%;height:12px;margin-bottom:16px;"></div>
            <div style="border-top:1px solid #f0f0f0;padding-top:12px;margin-bottom:12px;">
                <div class="sms-sk" style="width:80px;height:22px;"></div>
            </div>
            <div style="border-top:1px solid #f0f0f0;padding-top:12px;">
                <div class="sms-sk" style="width:70px;height:14px;"></div>
            </div>
        </div>
        <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;">
            <div class="sms-sk" style="width:75%;height:16px;margin-bottom:8px;"></div>
            <div class="sms-sk" style="width:45%;height:12px;margin-bottom:16px;"></div>
            <div style="border-top:1px solid #f0f0f0;padding-top:12px;margin-bottom:12px;">
                <div class="sms-sk" style="width:40px;height:22px;"></div>
            </div>
            <div style="border-top:1px solid #f0f0f0;padding-top:12px;">
                <div class="sms-sk" style="width:70px;height:14px;"></div>
            </div>
        </div>
    </div>
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:20px;">
        <div class="sms-sk" style="width:260px;height:22px;margin-bottom:8px;"></div>
        <div class="sms-sk" style="width:80%;height:14px;"></div>
    </div>
    <div style="display:flex;gap:1.5%;">
        <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;">
            <div class="sms-sk" style="width:100%;height:200px;border-radius:8px;"></div>
        </div>
        <div style="flex:1;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;">
            <div class="sms-sk" style="width:100%;height:200px;border-radius:8px;"></div>
        </div>
    </div>
</div>

<div id="global_container" style="display:none;">
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