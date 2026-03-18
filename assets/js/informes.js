$(function () {
    refresh()

    $("#load_info").click(function (e) { 
        e.preventDefault();
        $(this).attr('data-id',Number($(this).attr('data-id'))+100)
        refresh()
    });
});


function refresh(){

    $("#list-body-2").append('<tr class="vertical"><td colspan="9"><i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i></td></tr>')

    $.ajax({
        type: "POST",
        url: ajax_object.ajaxurl,
        data: {
            action: 'sms_proxy_reports_get',
            nonce: ajax_object.nonce,
            rows:$('#load_info').attr('data-id')
        },
        dataType: "json",
        success: function (response) {
            $("#list-body-2").html('')
            $(".loadcontent").removeClass('d-none')
            if(response.success){

                if(response.list.length > 0 && response.list)
                    $(".empty-3").addClass('d-none')

                let i = 0

                response.list.forEach(element => {
                    if(true){//element.type == 4 || element.type == 6){

                        let type = ''
                        let problem = 'Ninguno'
                        let click = 0
                        let enviado = "<span style='color:#dab549'><i class='fas fa-ban'></i></span>"
                        i++

                        let recuperado = "No"

                        switch (element.type) {
                            case 2: type = "Mensaje de bienvenida"; break;
                            case 4: type = "Recuperación de cliente"; break;
                            case 5: type = "Cliente Desactivado"; break;
                            case 6: type = "Carrito Abandonado"; break;
                            case 7: type = "Confirmación de envío"; break;
                            case 8: type = "Actualización de envío"; break;
                            case 9: type = "Nuevo pedido"; break;
                            case 10: type = "Pago contra entrega"; break;
                            case 11: type = "Retroalimentación"; break;
                            case 12: type = "Estatus: Pedido pendiente"; break;
                            case 13: type = "Estatus: Pedido en espera"; break;
                            case 14: type = "Estatus: Pedido completado"; break;
                            case 15: type = "Estatus: Pedido cancelado"; break;

                            default:break;
                        }

                        if(element.recipient == 1) type += "<span style='color:#14477e;'> (A)</span>"

                        switch (element.problem) {
                            case 1: problem = "Mensaje muy largo"; break;
                            case 2: problem = "Sin número"; break;
                            //case 3: problem = "Automatización desactivada"; break;
                            default: problem = "otro"; break;
                        }

                        if(element.click && element.click != null && element.click == 1)
                             click = '<span style="color:#49DA96"><i class="fas fa-check"></i></span>'
                        else 
                             click = "<span style='color:#dab549'><i class='fas fa-ban'></i></span>" 
                             
                        if(element.status == 1){
                            enviado = '<span style="color:#49DA96"><i class="fas fa-check"></i></span>'
                            if(element.problem == 0 && element.click == 1 && element.paid == 1)
                                recuperado = '<span class="recovery">$'+element.revenue+'</span>'
                            
                            if(element.problem == 0 && element.click == 1 && element.paid == 2)
                                recuperado = '<span class="recovery-p">P $'+element.revenue+'</span>'

                            if(element.problem == 0 && element.click == 1 && element.paid == 3)
                                recuperado = '<span class="recovery-c">C $'+element.revenue+'</span>'    

                        }else{
                            enviado = `<span style='color:#dab549' data-toggle="tooltip" data-placement="top" title="${problem}"><i class='fas fa-ban'></i></span>`
                        }
                        
                        let delay = '<1 min'
                        if(element.delay >= 1440)
                            delay = `${element.delay/1440} días`
                        else if(element.delay>= 60)
                            delay = `${element.delay/60} Hrs`
                        else delay = `${element.delay} min`

                        let link = '<td class="neutral"><a class="customer-link"  target="_blank">'+element.cid+'</a></td>'
                        if(element.type == 6) link = '<td class="neutral"><a class="customer-link" target="_blank">'+element.checkout+'</a></td>'

                        var a = $(
                            '<tr class="vertical">'
                            +'<td class="help-time">'+type+'</td>'
                            +'<td class="help-time">'+delay+'</td>'
                            +'<td class="help-time">'+enviado+'</td>'
                            +'<td class="help-time">'+element.name+'</td>'
                            +link
                            +'<td class="help-time">'+click+'</td>'
                            +'<td class="help-time">'+recuperado+'</td>'
                        +'</tr>')

                      $("#list-body-2").append(a);
                    }
                });

                $(".stats-sent").html('<i class="far fa-envelope"></i> &nbsp;'+response.sent+'</span>')
                $(".stats-clicks").html('<i class="fas fa-mouse-pointer"></i>&nbsp; '+response.clicks+'</span>')
                $(".stats-recovery").html('<i class="fas fa-hands-helping"></i> &nbsp;'+response.recovery+'</span>')

            }

        },
        error: function(error){
            console.log(error);
        }

    });
}