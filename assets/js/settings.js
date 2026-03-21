($ => {
    const _settings = {
        init: () => {
            $('#sms-skeleton').remove()
            $('#global_container').show()

            _settings.whatsapp.loadInstances()
            _settings.keys.check()

            if ($('#userstatus').val() != 'administrator')
                $('#consumer_container').removeClass('d-none')
        },

        whatsapp: {
            loadInstances: () => {
                $('#list-instances').niceSelect()

                _request.send({
                    action: 'sms_proxy_whatsapp_get',
                    success: (response) => {
                        if (response.status == 200) {
                            response.list.forEach(element => {
                                $('#list-instances').append(`<option value="${element.id}">${element.name}</option>`)
                            })
                            $('#list-instances').removeClass('d-none').niceSelect('update')

                            if (response.instance) {
                                $('.whatsapp-status').html('Vinculado &nbsp; <i class="fa-brands fa-whatsapp"></i>').removeClass('w2')
                                $('#remove_whatsapp_intance').removeClass('d-none')
                                $('#set_whatsapp_intance').addClass('d-none')
                            } else {
                                $('.whatsapp-status').html('Sin vincular &nbsp; <i class="fas fa-unlink"></i>').addClass('w2')
                                $('#remove_whatsapp_intance').addClass('d-none')
                                $('#set_whatsapp_intance').removeClass('d-none')
                            }
                        } else if (response.status == 202 && response.message == 'not_found') {
                            $('#list-instances').html('<option disabled selected>No tienes instancias configuradas</option>')
                            $('#list-instances').removeClass('d-none').niceSelect('update')
                        }
                    },
                    error: () => {
                        swal('¡Error!', 'Error 500, inténtalo más tarde', 'error')
                    }
                })
            },

            set: (e) => {
                e.preventDefault()
                let instance = $('#list-instances').val()

                if (!instance) {
                    swal('Selecciona una instancia', 'Debes seleccionar una instancia para vincular', 'warning')
                    return
                }

                _request.send({
                    action: 'sms_proxy_whatsapp_set',
                    data: { instance: instance },
                    success: (response) => {
                        if (response.status == 200) {
                            $('.whatsapp-status').html('Vinculado &nbsp; <i class="fa-brands fa-whatsapp"></i>').removeClass('w2')
                            $('.single-whatsapp').removeClass('d-none')
                            $('#remove_whatsapp_intance').removeClass('d-none')
                            $('#set_whatsapp_intance').addClass('d-none')
                            swal('¡Éxito!', 'Instancia vinculada correctamente. Ya puedes enviar tus automatizaciones a través de WhatsApp, solo ingresa a la automatización y selecciona "WhatsApp" como canal.', 'success')
                        } else {
                            swal('¡Error!', 'No se puede configurar', 'error')
                        }
                    },
                    error: () => {
                        swal('¡Error!', 'Error 500, inténtalo más tarde', 'error')
                    }
                })
            },

            remove: (e) => {
                e.preventDefault()

                _request.send({
                    action: 'sms_proxy_whatsapp_remove',
                    success: (response) => {
                        if (response.status == 200) {
                            $('.whatsapp-status').html('Sin vincular &nbsp; <i class="fas fa-unlink"></i>').addClass('w2')
                            swal('¡Éxito!', 'Desvinculaste la instancia de WhatsApp correctamente', 'success')
                            $('#remove_whatsapp_intance').addClass('d-none')
                            $('#set_whatsapp_intance').removeClass('d-none')
                        } else {
                            swal('¡Error!', 'Error, intenta más tarde', 'error')
                        }
                    },
                    error: () => {
                        swal('¡Error!', 'Error 500, inténtalo más tarde', 'error')
                    }
                })
            }
        },

        keys: {
            check: () => {
                _request.send({
                    action: 'sms_proxy_keys_check',
                    success: (response) => {
                        if (response.success)
                            $('#consumer_container').removeClass('d-none')
                    },
                    error: () => {
                        swal('¡Error!', 'Error 500 check keys, inténtalo más tarde', 'error')
                    }
                })
            },

            update: (e) => {
                e.preventDefault()
                let cs = $('#cs').val()
                let ck = $('#ck').val()

                if (!cs || !ck) {
                    $('.text-warning').removeClass('d-none')
                    return
                }

                $('#text-warning').addClass('d-none')

                _request.send({
                    action: 'sms_set_apikey',
                    data: { ck: ck, cs: cs, apikey: null },
                    success: (response) => {
                        if (response.success)
                            swal('¡Éxito!', 'Actualización éxitosa ya puedes comenzar a enviar tus automatizaciones.', 'success')
                        else
                            swal('¡Error!', 'No se puede configurar', 'error')
                    }
                })
            }
        }
    }

    $(function () {
        _settings.init()
        $(document).on('click', '#remove_whatsapp_intance', _settings.whatsapp.remove)
        $(document).on('click', '#set_whatsapp_intance', _settings.whatsapp.set)
        $(document).on('click', '#sms_update_credentials', _settings.keys.update)
    })
})(jQuery)
