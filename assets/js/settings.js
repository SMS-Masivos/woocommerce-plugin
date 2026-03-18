$(function () {
    get_whastapp_instances()
    check_keys_status()

    $('#remove_whatsapp_intance').click(function (e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: ajax_object.ajaxurl,
            data: {action: 'sms_proxy_whatsapp_remove', nonce: ajax_object.nonce},
            dataType: "json",
            success: function (response) {
                if(response.status == 200){
                    $(".whatsapp-status").html('Sin vincular &nbsp; <i class="fas fa-unlink"></i>').addClass('w2')
                    swal("¡Éxito!",'Desvinculaste la instancia de WhatsApp correctamente', "success");
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

        let instance = $("#list-instances").val()
        if (instance == null || instance == undefined || instance == '') {
            swal("Selecciona una instancia", "Debes seleccionar una instancia para vincular", "warning");
            return
        }

        $.ajax({
            type: "POST",
            url: ajax_object.ajaxurl,
            data: {action: 'sms_proxy_whatsapp_set', nonce: ajax_object.nonce, instance:instance},
            dataType: "json",
            success: function (response) {
                if(response.status == 200){
                    $(".whatsapp-status").html('Vinculado &nbsp; <i class="fa-brands fa-whatsapp"></i>').removeClass('w2')
                    $(".single-whatsapp").removeClass('d-none')
                    $("#remove_whatsapp_intance").removeClass("d-none")
                    $("#set_whatsapp_intance").addClass("d-none")
                    swal("¡Éxito!",'Instancia vinculada correctamente. Ya puedes enviar tus automatizaciones a través de WhatsApp, solo ingresa a la automatización y selecciona "WhatsApp" como canal.', "success");
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
                nonce: ajax_object.nonce,
                ck:ck, cs:cs, apikey:null
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

    $('#list-instances').niceSelect();

    $.ajax({
        type: "POST",
        url: ajax_object.ajaxurl,
        data: {action: 'sms_proxy_whatsapp_get', nonce: ajax_object.nonce},
        dataType: "JSON",
        success: function (response) {
            if (response.status == 200) {
                response.list.forEach(element => {
                    $("#list-instances").append(`<option value="${element.id}">${element.name}</option>`)
                });
                $('#list-instances').removeClass("d-none").niceSelect('update')

                if(response.instance){
                    $(".whatsapp-status").html('Vinculado &nbsp; <i class="fa-brands fa-whatsapp"></i>').removeClass('w2')
                    $("#remove_whatsapp_intance").removeClass("d-none")
                    $("#set_whatsapp_intance").addClass("d-none")
                }else{
                    $(".whatsapp-status").html('Sin vincular &nbsp; <i class="fas fa-unlink"></i>').addClass('w2')
                    $("#remove_whatsapp_intance").addClass("d-none")
                    $("#set_whatsapp_intance").removeClass("d-none")
                }
            }else if(response.status == 202 && response.message == "not_found"){
                $("#list-instances").html(`<option disabled selected>No tienes instancias configuradas</option>`)
                $('#list-instances').removeClass("d-none").niceSelect('update')
            }

        },error: function(reason) {
            swal("¡Error!",'Error 500, inténtalo más tarde', "error");

        }
    });
}

function check_keys_status(){

    $.ajax({
        type: "POST",
        url: ajax_object.ajaxurl,
        data: {action: 'sms_proxy_keys_check', nonce: ajax_object.nonce},
        dataType: "JSON",
        success: function (response) {
            if(response.success)
                $("#consumer_container").removeClass("d-none")

        },error: function(reason) {
            swal("¡Error!",'Error 500 check keys, inténtalo más tarde', "error");

        }
    });
}
