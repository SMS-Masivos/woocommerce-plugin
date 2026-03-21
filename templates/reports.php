<?php include SMS_PLUGIN_PATH . '/templates/skeleton.php'; ?>

<div id="sms-skeleton" class="sms-skeleton-wrap" style="margin-top:75px;margin-left:100px;margin-right:100px;padding:20px;">
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
        <div class="sms-sk" style="width:60%;height:20px;margin:0 auto 12px;"></div>
        <div style="display:flex;justify-content:center;gap:24px;">
            <div class="sms-sk" style="width:120px;height:16px;"></div>
            <div class="sms-sk" style="width:120px;height:16px;"></div>
            <div class="sms-sk" style="width:120px;height:16px;"></div>
        </div>
    </div>
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;">
        <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #f0f0f0;">
            <div class="sms-sk" style="flex:2;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
        </div>
        <div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #f0f0f0;">
            <div class="sms-sk" style="flex:2;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
        </div>
        <div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #f0f0f0;">
            <div class="sms-sk" style="flex:2;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
        </div>
        <div style="display:flex;gap:12px;padding:14px 0;">
            <div class="sms-sk" style="flex:2;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
            <div class="sms-sk" style="flex:1;height:14px;"></div>
        </div>
    </div>
</div>

<div id="global_container" style="display:none;">

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

      </div>
    </div>	
</div>