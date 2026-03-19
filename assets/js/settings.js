$(function () {
    get_whastapp_instances() 
    check_keys_status()

    $('#remove_whatsapp_intance').click(function (e) { 
        e.preventDefault();
        
        let shop = $("#globalShopName").val()
        let token = $("#globalToken").val()
        let apikey = $("#globalApikey").val() 

        $.ajax({
            type: "POST",
            url: "https://pluginssandbox.smsmasivos.com.mx/whatsapp/instances/remove",
            data: {shop:shop,apikey:apikey,token:token},
            dataType: "json",
            success: function (response) {
                if(response.status == 200){
                    $(".whatsapp-status").html('Desactivado &nbsp; <i class="fas fa-times"></i>').addClass('w2')
                    swal("¡Éxito!",'Desactivaste el envío por WhatsApp correctamente', "success");
                    $("#remove_whatsapp_intance").addClass("d-none")
                    $("#set_whatsapp_intance").removeClass("d-none")
                }else 
                    swal("¡Error!",'Error, intenta más tarde', "error");
            },error: function(reason) {
                swal("¡Error!",'Error 500, inténtalo más tarde', "error");
            }
        });
    });

    $('#set_whatsapp_intance').click(function (e) { 
        e.preventDefault();
        let shop = $("#globalShopName").val()
        let token = $("#globalToken").val()
        let apikey = $("#globalApikey").val() 

        let instance = $("#list-instances").val()
        if (instance == null || instance == undefined || instance == '') {
            swal("Selecciona una instancia", "El campo no puede estar vacío!", "warning");
            return
        }

        $.ajax({
            type: "POST",
            url: "https://pluginssandbox.smsmasivos.com.mx/whatsapp/instances/set",
            data: {shop:shop,apikey:apikey,instance:instance,token:token},
            dataType: "json",
            success: function (response) {
                if(response.status == 200){
                    $(".whatsapp-status").html('Activo &nbsp; <i class="fas fa-check-circle"></i>').removeClass('w2')
                    $(".single-whatsapp").removeClass('d-none')
                    $("#remove_whatsapp_intance").removeClass("d-none")
                    $("#set_whatsapp_intance").addClass("d-none")
                    swal("¡Éxito!",'Ya puedes enviar tus automatizaciones a través de WhatsApp. Ya solamente ingresa a la automatización y selecciona "WhatsApp" como canal.', "success");
                }else 
                    swal("¡Error!",'No se puede configurar', "error");
            },error: function(reason) {
                swal("¡Error!",'Error 500, inténtalo más tarde', "error");
            }
        });

    });

    if($("#userstatus").val() != "administrator"){
        $("#consumer_container").removeClass("d-none")
    }

    $("#sms_update_credentials").click(function (e) { 
        e.preventDefault();
        let shop = $("#globalShopName").val()
        let token = $("#globalToken").val()
        let apikey = $("#globalApikey").val() 
        let cs = $("#cs").val()
        let ck = $("#ck").val()

        if(!cs || !ck){
            $(".text-warning").removeClass('d-none')
            return
        }

        $("#text-warning").addClass('d-none')

        $.ajax({
            type: "POST",
            url: ajax_object.ajaxurl,
            data: {
                action: 'sms_set_apikey',
                nonce: $('#globalNonce').val(),
                ck:ck, cs:cs, apikey:apikey, shop:shop, token:token
            },
            dataType: "JSON",
            success: function (response) {
                if (response.success)
                    swal("¡Éxito!",'Actualización éxitosa ya puedes comenzar a enviar tus automatizaciones.', "success");
                else
                    swal("¡Error!",'No se puede configurar', "error");
            }
        });
    });

})


function get_whastapp_instances(){

    let shop = $("#globalShopName").val()
    let token = $("#globalToken").val()
    let apikey = $("#globalApikey").val() 

    $('#list-instances').niceSelect(); 

    $.ajax({
        type: "POST",
        url: "https://pluginssandbox.smsmasivos.com.mx/whatsapp/instances/get",
        data: {apikey:apikey,shop,shop,token:token},
        dataType: "JSON",
        success: function (response) {
            if (response.status == 200) {
                response.list.forEach(element => { 
                    $("#list-instances").append(`<option value="${element.id}">${element.name}</option>`)
                });  
                $('#list-instances').removeClass("d-none").niceSelect('update')

                if(response.instance){
                    $(".whatsapp-status").html('Activo &nbsp; <i class="fa-brands fa-whatsapp"></i>').removeClass('w2')
                    $("#remove_whatsapp_intance").removeClass("d-none")
                    $("#set_whatsapp_intance").addClass("d-none")
                }else{
                    $("#remove_whatsapp_intance").addClass("d-none")
                    $("#set_whatsapp_intance").removeClass("d-none")
                }
            }else if(response.status == 202 && response.message == "not_found"){
                $("#list-instances").html(`<option disabled selected>Sin instancias configuradas</option>`)
                $('#list-instances').removeClass("d-none").niceSelect('update')
            }
            
        },error: function(reason) {
            swal("¡Error!",'Error 500, inténtalo más tarde', "error");
            
        }
    });
}

function check_keys_status(){
    let shop = $("#globalShopName").val()
    let token = $("#globalToken").val()
    let apikey = $("#globalApikey").val() 


    $.ajax({
        type: "POST",
        url: "https://pluginssandbox.smsmasivos.com.mx/wp/keys/check",
        data: {apikey:apikey,shop,shop,token:token},
        dataType: "JSON",
        success: function (response) {
            if(response.success)
                $("#consumer_container").removeClass("d-none")

        },error: function(reason) {
            swal("¡Error!",'Error 500 check keys, inténtalo más tarde', "error");
            
        }
    });
}

