($ => {

    const _automations = {

        // ── State ──────────────────────────────────────────────
        state: {
            gralStatus: null,
            presentMsg: null,
            presentDelay: null,
            activeKeys: true,
            jsonConf: null,
            csrfToken: null,
            renderLast: null,
            renderCountry: null,
            renderNumber: null,
            credits: null,
            close: true,
            closeWs: true,
            globalList: [],
            DOM: null
        },

        // ── Init ───────────────────────────────────────────────
        init: () => {
            $('#sms-skeleton').remove()
            $('#global_container').show()

            _automations.crud.load()

            $("#list-recipient").niceSelect()
            $("#list-type").niceSelect()
            $("#list-time").niceSelect()
            $('#list-send').niceSelect()
            $('#country').niceSelect()

            _automations.wizard.initDOM()
            _automations.wizard.bindEvents()
            _automations.ui.bindEvents()
            _automations.editor.bindEvents()
            _automations.crud.bindEvents()
            _automations.whatsapp.bindEvents()

            // Window globals for inline onclick
            window.closetag = _automations.editor.closeTag
            window.closetag_ws = _automations.editor.closeTagWs
            window.autoedit = _automations.crud.edit
            window.delete_automation = _automations.crud.delete
            window.open_edit = _automations.crud.openEdit
            window.editmsg = _automations.crud.editMsg
            window.showinfo = _automations.ui.showInfo
            window.open_issues = _automations.ui.openIssues
            window.edit_send_method = _automations.whatsapp.editSendMethod
        },

        // ── Wizard (multi-step form navigation) ───────────────
        wizard: {
            initDOM: () => {
                _automations.state.DOM = {
                    stepsBtnClass: 'multisteps-form__progress-btn',
                    stepsBtns: document.querySelectorAll(`.multisteps-form__progress-btn`),
                    stepsBar: document.querySelector('.multisteps-form__progress'),
                    stepsForm: document.querySelector('.multisteps-form__form'),
                    stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
                    stepFormPanelClass: 'multisteps-form__panel',
                    stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
                    stepPrevBtnClass: 'js-btn-prev',
                    stepNextBtnClass: 'js-btn-next'
                }
            },

            removeClasses: (elemSet, className) => {
                elemSet.forEach(elem => {
                    elem.classList.remove(className)
                })
            },

            findParent: (elem, parentClass) => {
                let currentNode = elem
                while (!currentNode.classList.contains(parentClass)) {
                    currentNode = currentNode.parentNode
                }
                return currentNode
            },

            getActiveStep: (elem) => {
                return Array.from(_automations.state.DOM.stepsBtns).indexOf(elem)
            },

            setActiveStep: (activeStepNum) => {
                const DOM = _automations.state.DOM
                _automations.wizard.removeClasses(DOM.stepsBtns, 'js-active')
                DOM.stepsBtns.forEach((elem, index) => {
                    if (index <= activeStepNum) {
                        elem.classList.add('js-active')
                    }
                })
            },

            getActivePanel: () => {
                const DOM = _automations.state.DOM
                let activePanel
                DOM.stepFormPanels.forEach(elem => {
                    if (elem.classList.contains('js-active')) {
                        activePanel = elem
                    }
                })
                return activePanel
            },

            setActivePanel: (activePanelNum) => {
                const DOM = _automations.state.DOM
                _automations.wizard.removeClasses(DOM.stepFormPanels, 'js-active')
                DOM.stepFormPanels.forEach((elem, index) => {
                    if (index === activePanelNum) {
                        elem.classList.add('js-active')
                        _automations.wizard.setFormHeight(elem)
                    }
                })
            },

            formHeight: (activePanel) => {
                const DOM = _automations.state.DOM
                const activePanelHeight = activePanel.offsetHeight
                DOM.stepsForm.style.height = `${activePanelHeight}px`
            },

            setFormHeight: () => {
                const activePanel = _automations.wizard.getActivePanel()
                _automations.wizard.formHeight(activePanel)
            },

            bindEvents: () => {
                const DOM = _automations.state.DOM

                DOM.stepsBar.addEventListener('click', e => {
                    const eventTarget = e.target
                    if (!eventTarget.classList.contains(`${DOM.stepsBtnClass}`)) {
                        return
                    }
                    const activeStep = _automations.wizard.getActiveStep(eventTarget)
                    _automations.wizard.setActiveStep(activeStep)
                    _automations.wizard.setActivePanel(activeStep)
                })

                DOM.stepsForm.addEventListener('click', e => {
                    const eventTarget = e.target
                    if (!(eventTarget.classList.contains(`${DOM.stepPrevBtnClass}`) || eventTarget.classList.contains(`${DOM.stepNextBtnClass}`))) {
                        return
                    }
                    const activePanel = _automations.wizard.findParent(eventTarget, `${DOM.stepFormPanelClass}`)
                    let activePanelNum = Array.from(DOM.stepFormPanels).indexOf(activePanel)
                    if (eventTarget.classList.contains(`${DOM.stepPrevBtnClass}`)) {
                        activePanelNum--
                    } else {
                        activePanelNum++
                    }
                    _automations.wizard.setActiveStep(activePanelNum)
                    _automations.wizard.setActivePanel(activePanelNum)
                })
            }
        },

        // ── CRUD (create, read, update, delete automations) ───
        crud: {
            syncList: () => {
                let list = []
                $('#list-body tr').each(function () {
                    list.push({ type: $(this).attr('data-type'), status: $(`#${this.id} td label input`).prop('checked') ? 1 : 0 })
                })
                _request.send({
                    action: 'sms_set_automations',
                    data: { list: list },
                    success: (data) => { console.log('Automatizaciones sincronizadas.') }
                })
                return list
            },

            load: () => {
                _request.send({
                    action: 'sms_proxy_wp_load',
                    success: async (response) => {
                        if (response.success) {
                            if (!response.login) {
                                $('#modal_register').modal('show')
                            } else {
                                $(".step2").click()
                                $('#credits').text(parseInt(response.credits).toLocaleString())
                                $('.country').find('option[value="' + response.country + '"]').prop('selected', true)
                                $('#country').niceSelect('update')
                                $("#phone_number").val(response.number)
                                $("#last_credits").prop('checked', response.last_credits)
                                $("#save_contacts").prop('checked', response.sync_agenda == 1)
                                $(".agendalink").attr("href", "https://app.smsmasivos.com.mx/contactos?agenda=" + response.agendaid)
                                if (!response.keys) {
                                    $("#user_no_admin").removeClass("d-none")
                                    _automations.state.activeKeys = false
                                } else _automations.state.activeKeys = true

                                let cl = response.list
                                $('#country option').each(function () {
                                    if ($(this).attr("value")) {
                                        if (!cl.includes(Number($(this).attr("value")))) {
                                            $(this).remove()
                                        }
                                    }
                                })
                                $('#country').niceSelect('update')
                                let list = await _automations.crud.refresh()
                                _automations.crud.syncList()
                            }
                        } else _general.showToast(response.message, 'error')
                    },
                    error: (error) => {
                        _general.showToast("Algo salio mal, Intenta más tarde. code: LO001", 'error')
                        console.log(error)
                    }
                })
            },

            refresh: () => {
                return new Promise(async (resolve, reject) => {
                    const $tableContainer = $('.table-container')
                    const $listBody = $("#list-body")
                    $tableContainer.addClass('table-loading')
                    if ($tableContainer.find('.table-overlay').length === 0) {
                        $tableContainer.append(
                            `<div class="table-overlay">
                                <i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true" style="font-size:48px"></i>
                            </div>`
                        )
                    }
                    $listBody.find('button, a, input[type="checkbox"]').prop('disabled', true)
                    _automations.state.globalList = []
                    _request.send({
                        action: 'sms_proxy_automation_get',
                        success: (response) => {
                            $listBody.html('')
                            if (response.success) {
                                let i = 0, recipient = 0
                                if (response.list && response.list.length > 0) {
                                    $(".empty").addClass('d-none')
                                }
                                _automations.state.globalList = response.list
                                response.list.forEach(element => {
                                    let recomendation = '', clicks = 0
                                    if (response.clicks && response.clicks.length > 0) {
                                        response.clicks.forEach(e => {
                                            if (e.automation == element.id) clicks = e.count
                                        })
                                    }
                                    if (element.status == 0 && [2, 4, 6, 7].includes(element.type))
                                        recomendation = '<span class="recomendation">Recomendada</span>'
                                    let whatsapp_active = element.whatsapp ? 'text-whatsapp-main' : ''
                                    let warning_ac = '', warning_ac_button = ''
                                    if (element.type == 6 && $("#isextensionactive").val() != "1" && element.status == 1) {
                                        warning_ac = "warning_ac"
                                        warning_ac_button = '<a onclick="open_issues()" type="button" class="btn btn-rounded btn-sm pulsingButton"><i class="fas fa-question"></i></a>'
                                        let info_claves = _automations.state.activeKeys
                                            ? '<i class="gn-icon fa fa-check text-success float-left" style="height: 25px;"></i><p> Claves acceso WP configuradas correctamente</p>'
                                            : '<i class="gn-icon fa fa-times text-warning float-left" style="height: 25px;"></i> <p>Es necesario configurar manualmente las claves de acceso a WP</p>'
                                        $(".info-claves").html(info_claves)
                                    }
                                    var a = $(
                                        `<tr class="vertical ${warning_ac}" id="id-auto-${element.id}" data-type="${element.type}">
                                            <th class="th-index" scope="row">${++i}</th>
                                            <td>${element.name}${recomendation}</td>
                                            <td>${element.sent}</td>
                                            <td>${clicks}</td>
                                            <td>$${parseFloat(element.revenue).toFixed(2)}</td>
                                            <td>
                                                <label class="switch">
                                                    <input type="checkbox" onchange="autoedit(${element.id},'status',null,${element.type})">
                                                    <span class="slider round"></span>
                                                </label>
                                            </td>
                                            <td>
                                                <a onclick="open_edit(${element.id},${element.type},${element.time},${element.recipient},'${element.name}',${element.whatsapp})" class="btn btn-rounded btn-sm btn-outline-secondary"><i class="fa-light fa-pen-to-square"></i></a>
                                                <a onclick="delete_automation(${element.id},${element.type})" class="btn btn-rounded btn-sm btn-primary ml-1"><i class="fas fa-times"></i></a>
                                                ${warning_ac_button}
                                            </td>
                                        </tr>`
                                    )
                                    $listBody.append(a)
                                    $(`#id-auto-${element.id} input`).prop('checked', element.status == 1)
                                    if (element.recipient == 1) recipient++
                                })
                                _automations.whatsapp.checkInstanceStatus()
                            }
                        },
                        error: (error) => {
                            $listBody.html('')
                        },
                        complete: () => {
                            $tableContainer.removeClass('table-loading')
                            $tableContainer.find('.table-overlay').remove()
                            $listBody.find('button, a, input[type="checkbox"]').prop('disabled', false)
                            resolve(_automations.state.globalList)
                        }
                    })
                })
            },

            create: (e) => {
                e.preventDefault()

                let name = $("#automation_name").val()
                let type = $("#list-type").val()
                let recipient = $("#list-recipient").val()
                let text = $("#automation_text").text()
                let text_ws = _automations.editor.getText("automation_text_ws")
                let delay = $("#timelapse").val()
                let lapse = $("#list-time").val()
                let limit = $("#limit_input").prop('checked')
                let whatsapp = $("#list-send").val()
                let btn = $(e.currentTarget)

                if (!delay) delay = "days"

                // Flat validation with early returns
                if (!text || text.trim() === "") {
                    _general.showToast(whatsapp == "1" ? "Configura un mensaje SMS. Se usará si no es posible entregar la notificación por WhatsApp." : "El mensaje no puede estar vacío.", "warning")
                    return
                }
                if (_automations.editor.getFakeLength(text) > 160) {
                    _general.showToast("El mensaje SMS excede el límite máximo de 160 caracteres.", "warning")
                    return
                }
                if (!name || name.trim() === "") {
                    _general.showToast("El nombre no puede estar vacío.", "warning")
                    return
                }
                if (name.length > 150) {
                    _general.showToast("El nombre excede el límite máximo de 150 caracteres.", "warning")
                    return
                }
                if (recipient == 1 && (!_automations.state.renderCountry || !_automations.state.renderNumber)) {
                    _general.showToast("Debes configurar el número del administrador de la tienda antes de continuar.", "warning")
                    return
                }
                if (!type || !recipient) {
                    _general.showToast("Completa todos los pasos antes de continuar.", "warning")
                    return
                }
                if (whatsapp == "1" && (!text_ws || text_ws.trim() === "")) {
                    _general.showToast("Configura el mensaje de WhatsApp que será enviado al cliente.", "warning")
                    return
                }
                if (type === "suscripcion" || type === "upsell") {
                    _general.showToast("Este evento aún no está disponible. Muy pronto podrás usarlo.", "warning")
                    return
                }
                if ((type === "winback" && lapse !== "days") || (type === "cash-od" && lapse !== "days")) {
                    _general.showToast("El tiempo configurado no es válido para este tipo de automatización. Por favor ajústalo de nuevo.", "warning")
                    return
                }

                // AVISO EXTENSION WOOCOMMERCE
                if (type == "abandoned" && $("#isextensionactive").val() != "1") {
                    swal({
                        title: "!Atención!",
                        text: 'Para esta automatizacion es necesario que cuentes con la extensión de woocommerce para carritos abandonados, si no la tienes puedes descargarlo aquí',
                        icon: "warning",
                        buttons: {
                            cancel: 'Entendido',
                            confirm: { text: 'Descargar', className: 'swal-btn' }
                        }
                    }).then(function (isConfirm) {
                        if (isConfirm) {
                            window.location.href = "https://downloads.wordpress.org/plugin/woocommerce-abandoned-cart.zip"
                        }
                    })
                }

                btn.prop("disabled", true).html('<i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i> Cargando...')

                let isEdit = btn.attr("data-edit") == "1"
                let ajax_action = "sms_proxy_automation_create"
                let automationid = btn.attr("data-id")

                if (isEdit) {
                    ajax_action = "sms_proxy_automation_edit_general"
                    $(".create-automation").attr("data-edit", 0).attr("data-id", 0)
                    $("#list-type").attr("disabled", false).niceSelect('update')
                }

                _request.send({
                    action: ajax_action,
                    data: {
                        name: name,
                        type: type,
                        recipient: recipient,
                        text: text.replace(/\s+/g, ' ').replace(/ ,+/g, ','),
                        text_ws: text_ws,
                        lapse: lapse,
                        delay: delay,
                        limit: limit,
                        whatsapp: whatsapp,
                        automationid: automationid
                    },
                    success: async (response) => {
                        btn.prop("disabled", false).html('Crear')
                        $('#automations-details').modal('hide')
                        if (response.success) {
                            let list = await _automations.crud.refresh()
                            $(".totype").click()
                            $("#automation_name").val("")
                            _automations.state.presentMsg = null
                            if (isEdit) {
                                _general.showToast("La automatización se actualizó correctamente.", "success")
                            } else {
                                _general.showToast("La automatización se creó correctamente.", "success")
                            }
                            _automations.crud.syncList()
                        } else {
                            _general.showToast(response.message || "Ocurrió un error desconocido.", "error")
                        }
                    },
                    error: (error) => {
                        btn.prop("disabled", false).html('Crear')
                        _general.showToast("Algo salio mal, Intenta más tarde. code: AC001", "error")
                    }
                })
            },

            edit: (id, cmd, options = null, type = null) => {
                let e = null
                if (cmd == "status") {
                    e = $(`#id-auto-${id} input`)
                    if (type == "2" && e.prop('checked'))
                        _general.showToast("Asegúrate de solicitar el número de teléfono de tus clientes al momento de registrarse para hacer efectiva la automatización", 'success')
                    options = e.prop('checked')
                    e.prop("disabled", true).addClass('opa5')
                    if (type == "6" && e.prop('checked') == true && $("#isextensionactive").val() != "1") {
                        swal({
                            title: "!Atención!",
                            text: 'Para esta automatizacion es necesario que cuentes con la extensión de woocommerce para carritos abandonados, si no la tienes puedes descargarlo aquí',
                            icon: "warning",
                            buttons: {
                                cancel: 'Entendido',
                                confirm: { text: 'Descargar', className: 'swal-btn' }
                            }
                        }).then(function (isConfirm) {
                            if (isConfirm) {
                                window.location.href = "https://downloads.wordpress.org/plugin/woocommerce-abandoned-cart.zip"
                            } else {
                                $(`#${this.id} td label input`).prop('checked', false)
                                return
                            }
                        })
                    }
                } else if (cmd == "msg") {
                    e = $("#btn_msg_automation")
                    e.prop("disabled", true)
                }

                _request.send({
                    action: 'sms_autoedit_automation',
                    data: {
                        id: id,
                        options: options,
                    },
                    success: (response) => {
                        if (e) e.prop("disabled", false).removeClass('opa5')
                        if (!response.success) {
                            if (cmd == "status") $(`#id-auto-${id} input`).prop('checked', !options)
                            _general.showToast(response.message || "Algo salió mal, intenta más tarde.", 'warning')
                        } else {
                            _general.showToast("Automatización actualizada correctamente", 'success')
                            _automations.crud.syncList()
                        }
                    },
                    error: (error) => {
                        if (e) e.prop("disabled", false).removeClass('opa5')
                        _general.showToast("Algo salió mal, intenta más tarde. code: ED001", 'error')
                    }
                })
            },

            delete: (id, type) => {
                swal({
                    title: "!Atención!",
                    text: 'Estas a punto de eliminar esta automatizacion. ¿Estas seguro?',
                    icon: "warning",
                    buttons: {
                        cancel: 'Cancelar',
                        confirm: { text: 'Sí, ¡Eliminar!', className: 'swal-btn' }
                    }
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        if (!id) {
                            _general.showToast("Error al eliminar la automatización", 'error')
                            return
                        }

                        _request.send({
                            action: 'sms_proxy_automation_delete',
                            data: {
                                id: id,
                                type: type
                            },
                            success: (response) => {
                                if (response.success) {
                                    $(`#id-auto-${id}`).remove()
                                    _general.showToast("Automatización eliminada correctamente", 'success')
                                    _automations.crud.syncList()
                                } else
                                    _general.showToast(response.message, 'error')
                            },
                            error: (error) => {
                                _general.showToast("Algo salio mal, Intenta más tarde. code: DE001", 'error')
                            }
                        })
                    }
                })
            },

            editMsg: (id, msg) => {
                $("#btn_msg_automation").data("id", id)
                $("#textarea_msg_automation").val(msg)
                $("#modal_msg_automation").modal('show')
            },

            openEdit: (id, tipo, tiempo, destinatario, nombre, envio) => {
                let contenido = ""
                let text_ws = ""
                _automations.state.globalList.forEach(element => {
                    if (element.id == id) {
                        contenido = element.msg
                        text_ws = element.text_ws
                    }
                })

                destinatario = destinatario == 0 ? "customer" : "admin"

                switch (tipo) {
                    case 2: tipo = "welcome"; break
                    case 4: tipo = "winback"; break
                    case 5: tipo = "c-disabled"; break
                    case 6: tipo = "abandoned"; break
                    case 7: tipo = "f-created"; break
                    case 8: tipo = "f-updated"; break
                    case 9: tipo = "new_order"; break
                    case 10: tipo = "cash-od"; break
                    case 11: tipo = "feedback"; break
                    case 12: tipo = "o-pending"; break
                    case 13: tipo = "o-onhold"; break
                    case 14: tipo = "o-completed"; break
                    case 15: tipo = "o-cancelled"; break
                    default: break
                }

                if (tiempo >= 1440) {
                    _automations.state.presentDelay = "days"
                    tiempo = tiempo / 1440
                    $("#timelapse").prop("min", "1").prop("step", 1).prop("max", 30)
                } else if (tiempo >= 60) {
                    _automations.state.presentDelay = "hours"
                    tiempo = tiempo / 60
                    $("#timelapse").prop("min", "1").prop("step", 1).prop("value", 24).prop("max", 24)
                } else {
                    $("#timelapse").prop("min", "10").prop("step", 10).prop("max", 60)
                    _automations.state.presentDelay = "minutes"
                }

                $("#timelapse").val(tiempo)
                $("#list-type").val(tipo).attr("disabled", true).niceSelect('update')
                $("#list-recipient").val(destinatario).niceSelect('update')
                _automations.state.presentMsg = contenido
                $("#automation_name").val(nombre)
                $("#list-send").val(envio).niceSelect('update')
                $(".create-automation").attr("data-edit", 1).attr("data-id", id).html("Editar")
                $('#automation_count').text(_automations.editor.getFakeLength(contenido))
                _automations.editor.restoreHtmlFromText(contenido)
                if (text_ws && text_ws != "") {
                    $('#automation_count_ws').text(_automations.editor.getFakeLength(text_ws))
                    _automations.editor.restoreHtmlFromText(text_ws, true)
                } else $("#automation_text_ws").html("")
                $("#automations-details").modal("show")
                let stepsForm = document.querySelector('.multisteps-form__form')
                stepsForm.style.height = `308px`
                let elem = ''
                switch (tipo) {
                    case "new_order":
                        elem = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-cliente-j661jd/"">Ver guía paso a paso</a>'
                        if ($("#list-recipient").val() == "admin")
                            elem = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-administrador-11mpyl5/">Ver guía paso a paso</a>'
                        break
                    case "o-pending":
                        elem = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                        break
                    case "o-onhold":
                        elem = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                        break
                    case "o-completed":
                        elem = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href=">Ver guía paso a paso</a>'
                        break
                    case "o-cancelled":
                        elem = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                        break
                    case "f-created":
                        elem = 'Genera confianza con tu cliente manteniéndolo informado del momento en el que se realiza su envío, incluye de forma dinámica su número de rastreo y mejora sin esfuerzo el servicio al cliente. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                        break
                    case "cash-od":
                        elem = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-clientes-1ltxjwt/">Ver guía paso a paso</a>'
                        if ($("#list-recipient").val() == "admin")
                            elem = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-administrador-14xujps/">Ver guía paso a paso</a>'
                        break
                    case "winback":
                        elem = '¿Tienes clientes que quieres que te compren de nuevo? Mantenerte presente y enviarles promociones periódicas después de cierto tiempo de su última compra es muy fácil. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recuperacion-del-cliente-4dcg2p/">Ver guía paso a paso</a>'
                        break
                    case "feedback":
                        elem = 'Obtener reseñas de tus productos nunca fue tan fácil, tan pronto como se entrega el pedido tu cliente recibirá un link en donde podrá capturar su reseña y esta se publicará directamente en tu tienda generando confianza con el resto de tus clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-cliente-1mmk5bz/">Ver guía paso a paso</a>'
                        if ($("#list-recipient").val() == "admin")
                            elem = 'Recibirás un SMS cuando tu cliente deje su reseña y esta se publicará directamente en el pedido de tu tienda. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-administrador-3dp4fy/">Ver guía paso a paso</a>'
                        break
                    case "abandoned":
                        elem = 'Se activa cuando un cliente abandona un carrito de compra. Te recomendamos configurar un tiempo de retraso mínimo de 30 minutos para darle tiempo al cliente de que termine el proceso antes de considerarlo un abandono. Para aumentar la efectividad, crea múltiples automatizaciones en diferentes periodos de tiempo. Por ejemplo, una hora después de que un cliente abandona un carrito, 24 horas y 3 días después. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'
                        if ($("#list-recipient").val() == "admin")
                            elem = 'Enterate de todo lo que pasa con tus usuarios al momento de comprar. Estarás recibiendo un SMS con una notificación indicando que han abandonado un carrito en tu tienda en línea, así podrás tomar acción de la mano de la automatización para carritos abandonados para clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'
                        stepsForm.style.height = `328px`
                        break
                    default:
                        break
                }
                $("#indicaciones").html(elem)
            },

            bindEvents: () => {
                $(document).on('click', '.create-automation', _automations.crud.create)

                $(document).on('click', '#btn_msg_automation', (e) => {
                    e.preventDefault()
                    let id = $(e.currentTarget).data("id")
                    let msg = $("#textarea_msg_automation").val()
                    $(`#id-auto-${id} a`).attr("onclick", `editmsg(${id},'${msg}')`)
                    _automations.crud.edit(id, "msg", msg)
                    $("#modal_msg_automation").modal('hide')
                })

                $(document).on('click', '#btn-automations-details', (e) => {
                    $("#list-type").attr("disabled", false).niceSelect('update')
                    e.preventDefault()
                    if (!_automations.state.renderCountry || !_automations.state.renderNumber) {
                        $('li[data-value="admin"]').addClass('disabled')
                        if ($("#list-type").val() == "abandoned" || $("#list-type").val() == "winback" || $("#list-type").val() == "f-created")
                            $(".note-red").addClass('d-none')
                        else
                            $(".note-red").removeClass('d-none')
                    } else {
                        $('li[data-value="admin"]').removeClass('disabled')
                        if ($("#list-type").val() == "abandoned" || $("#list-type").val() == "winback" || $("#list-type").val() == "f-created")
                            $(".note-red").addClass('d-none')
                        else
                            $(".note-red").removeClass('d-none')
                    }
                    $(".totype").click()
                    $("#automations-details").modal("show")
                    _automations.state.DOM.stepsForm.style.height = $("#list-type").val() != "abandoned" ? `300px` : "323px"
                    $('#automation_text_ws').html("")
                    var count = _automations.editor.getFakeLength($('#automation_text').text())
                    $('#automation_count').text(count)
                })

                $(document).on('click', '#cancel-automation', (e) => {
                    e.preventDefault()
                    swal({
                        title: "¡Atención!",
                        text: '¿Estás seguro de que quieres cancelar esta automatización? Se perderá tu avance.',
                        icon: "warning",
                        buttons: {
                            skip: { text: 'Continuar', className: 'swal-btn' },
                            confirm: { text: 'Sí, cancelar', className: 'swal-button--cancel' }
                        }
                    }).then(function (isConfirm) {
                        if (isConfirm === true) {
                            $(".totype").click()
                            $("#automation_name").val("")
                            _automations.state.presentMsg = null
                            $("#automations-details").modal("hide")
                        }
                    })
                })

                $(document).on('click', '.totime', (e) => {
                    e.preventDefault()
                    let el = ''
                    let event = $("#list-type").val()
                    let local_delay = $("#list-time").val()
                    let allowed_option = true

                    $('.help-time').addClass('d-none')
                    $("#list-time").html('<option id="minutes" value="minutes">Minuto/s</option>'
                        + '<option id="hours" value="hours">Hora/s</option>'
                        + '<option value="days">Día/s</option>')
                    $("#tag-tiempo").text("Selecciona el tiempo adecuado para el envío de tus SMS.")

                    if (event == "winback" || event == "abandoned" || event == "cash-od") {
                        $(".right").removeClass("d-none")
                        $("#timelapse").addClass("timelapse-forced").attr("disabled", false).removeClass("d-none")
                        $(".auto").addClass("d-none")
                        if (event == "winback" || event == "cash-od") {
                            $("#hours").attr("disabled", true).addClass("d-none")
                            $("#minutes").attr("disabled", true).addClass("d-none")
                            $("#list-time").html('<option value="days">Día/s</option>')
                            if (local_delay != "days")
                                allowed_option = false
                            if (event == "cash-od")
                                $("#tag-tiempo").text("Selecciona el periodo que tendrá tu cliente para confirmar su orden")
                        }
                        if (event == "winback") {
                            $('.help-time').removeClass('d-none')
                        }
                    } else {
                        $(".right").addClass("d-none")
                        $("#timelapse").removeClass("timelapse-forced").attr("disabled", true).val(1).addClass("d-none")
                        $(".auto").removeClass("d-none")
                    }

                    let now = 30
                    if ($("#timelapse").val()) now = $("#timelapse").val()

                    if (_automations.state.presentDelay) {
                        $('#list-time').val(_automations.state.presentDelay).niceSelect('update')
                        _automations.state.presentDelay = null
                    } else {
                        if (allowed_option) {
                            $('#list-time').val(local_delay).niceSelect('update')
                        } else
                            $('#list-time').niceSelect('update')
                    }

                    if ($("#list-time").val() == "minutes" && $('#list-type').val() == "abandoned") {
                        $("#timelapse").prop("min", "10").prop("step", 10).prop("value", now).prop("max", 60)
                    } else {
                        $("#timelapse").prop("min", "1").prop("step", 1).prop("max", 30).prop("value", now)
                    }
                })

                $(document).on('click', '.torecipient', (e) => {
                    let current_state = $("#list-recipient").val()
                    e.preventDefault()
                    $("#list-recipient").html('<option value="customer">Cliente</option>'
                        + '<option id="value-admin" value="admin">Admin</option>')
                    let type = $("#list-type").val()
                    if (type == "winback" || type == "f-created" || type == "f-updated" || type == "abandoned")
                        $("#list-recipient").html('<option value="customer">Cliente</option>')

                    if (current_state)
                        $("#list-recipient").val(current_state).niceSelect('update')
                    else
                        $('#list-recipient').niceSelect('update')

                    if ($("#list-type").val() == "abandoned" || $("#list-type").val() == "winback" || $("#list-type").val() == "f-created")
                        $(".note-red").addClass('d-none')
                    else
                        $(".note-red").removeClass('d-none')
                })

                $(document).on('click', '.tomsg', (e) => {
                    e.preventDefault()
                    if (_automations.state.presentMsg) return

                    let el = ''
                    switch ($("#list-type").val()) {
                        case "new_order":
                            el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span> gracias por comprar con nosotros. Tu pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> fue confirmado y pronto sera enviado'
                            if ($("#list-recipient").val() == "admin")
                                el = 'Tienes un nuevo pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> por un total de <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {total}</span>'
                            break
                        case "o-pending":
                            el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra con pago pendiente'
                            if ($("#list-recipient").val() == "admin")
                                el = 'El estatus del pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra pendiente de pago'
                            break
                        case "o-onhold":
                            el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra esperando confirmacion de pago'
                            if ($("#list-recipient").val() == "admin")
                                el = 'El estatus del pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra esperando confirmacion de pago'
                            break
                        case "o-completed":
                            el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> fue completada'
                            if ($("#list-recipient").val() == "admin")
                                el = 'El estatus del pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> cambio a completado'
                            break
                        case "o-cancelled":
                            el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, sentimos que no pudieras comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> tu orden fue cancelada'
                            if ($("#list-recipient").val() == "admin")
                                el = 'El pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> fue cancelado'
                            break
                        case "f-created":
                            el = 'Tu pedido esta en camino a <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {direccion_de_envio}</span>'
                                + ' puedes rastrearlo con el codigo <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {numero_de_rastreo}</span>'
                            break
                        case "cash-od":
                            el = 'Orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> creada exitosamente. Ingresa a <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url_confirmacion}</span> en los sig 3 dias para confirmar o se cancelara'
                            if ($("#list-recipient").val() == "admin")
                                el = 'La orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> confirmo su numero exitosamente, puedes proceder con el envio'
                            break
                        case "winback":
                            el = 'Hola <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, ha pasado un tiempo desde tu ultima orden, Obten 5% de descuento con el codigo VUELVE, ingresa a'
                                + '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span>'
                            break
                        case "feedback":
                            el = 'Hey <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por tu compra. Te gusto tu pedido?, nos gustaria conocer tu opinion, ingresa a <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span> '
                            if ($("#list-recipient").val() == "admin")
                                el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span> recibio su pedido y dejo un comentario, puedes verlo en <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span>'
                            break
                        case "abandoned":
                            el = 'Hola <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, te recordamos que aun tienes articulos en tu carrito. Entra a '
                                + '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span> para continuar tu compra'
                            if ($("#list-recipient").val() == "admin")
                                el = 'El cliente <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span> abandono su carrito de compra entra a '
                                    + '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span> para ver el checkout'
                            break
                        default:
                            break
                    }

                    _automations.state.presentMsg = el
                    $("#automation_text").html(el)
                    $("#automation_text_ws").html(el)
                    $('#automation_count').text(_automations.editor.getFakeLength($('#automation_text').text()))
                    $('#automation_count_ws').text(_automations.editor.getFakeLength($('#automation_text_ws').text()))
                    _automations.editor.availableTags()
                })

                $(document).on('change', '#list-time', function () {
                    if ($(this).val() == "minutes" && $('#list-type').val() == "abandoned") {
                        $("#timelapse").prop("min", "10").prop("step", 10).prop("max", 60)
                    } else if ($("#list-time").val() == "hours" && $('#list-type').val() == "abandoned") {
                        $("#timelapse").prop("min", "1").prop("step", 1).prop("value", 24).prop("max", 24)
                    } else {
                        $("#timelapse").prop("min", "1").prop("step", 1).prop("max", 30)
                    }
                })

                $(document).on('change', '#list-type', function () {
                    let el = ''
                    switch ($(this).val()) {
                        case "new_order":
                            el = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-cliente-j661jd/"">Ver guía paso a paso</a>'
                            if ($("#list-recipient").val() == "admin")
                                el = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-administrador-11mpyl5/">Ver guía paso a paso</a>'
                            break
                        case "o-pending":
                            el = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                            break
                        case "o-onhold":
                            el = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                            break
                        case "o-completed":
                            el = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href=">Ver guía paso a paso</a>'
                            break
                        case "o-cancelled":
                            el = 'Notifica a tu cliente sobre el estatus de su pedido, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                            break
                        case "f-created":
                            el = 'Genera confianza con tu cliente manteniéndolo informado del momento en el que se realiza su envío, incluye de forma dinámica su número de rastreo y mejora sin esfuerzo el servicio al cliente. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/automatizacion-de-confirmacion-de-pedido-para-cliente-f65md/">Ver guía paso a paso</a>'
                            break
                        case "cash-od":
                            el = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-clientes-1ltxjwt/">Ver guía paso a paso</a>'
                            if ($("#list-recipient").val() == "admin")
                                el = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-administrador-14xujps/">Ver guía paso a paso</a>'
                            break
                        case "winback":
                            el = '¿Tienes clientes que quieres que te compren de nuevo? Mantenerte presente y enviarles promociones periódicas después de cierto tiempo de su última compra es muy fácil. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recuperacion-del-cliente-4dcg2p/">Ver guía paso a paso</a>'
                            break
                        case "feedback":
                            el = 'Obtener reseñas de tus productos nunca fue tan fácil, tan pronto como se entrega el pedido tu cliente recibirá un link en donde podrá capturar su reseña y esta se publicará directamente en tu tienda generando confianza con el resto de tus clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-cliente-1mmk5bz/">Ver guía paso a paso</a>'
                            if ($("#list-recipient").val() == "admin")
                                el = 'Recibirás un SMS cuando tu cliente deje su reseña y esta se publicará directamente en el pedido de tu tienda. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-administrador-3dp4fy/">Ver guía paso a paso</a>'
                            break
                        case "abandoned":
                            el = 'Se activa cuando un cliente abandona un carrito de compra. Te recomendamos configurar un tiempo de retraso mínimo de 30 minutos para darle tiempo al cliente de que termine el proceso antes de considerarlo un abandono. Para aumentar la efectividad, crea múltiples automatizaciones en diferentes periodos de tiempo. Por ejemplo, una hora después de que un cliente abandona un carrito, 24 horas y 3 días después. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'
                            if ($("#list-recipient").val() == "admin")
                                el = 'Enterate de todo lo que pasa con tus usuarios al momento de comprar. Estarás recibiendo un SMS con una notificación indicando que han abandonado un carrito en tu tienda en línea, así podrás tomar acción de la mano de la automatización para carritos abandonados para clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'
                            break
                        default:
                            break
                    }
                    _automations.state.presentMsg = null
                    $("#indicaciones").html(el)
                    _automations.wizard.setActivePanel(0)
                })

                $(document).on('click', '#save', () => {
                    let country = $("#country").val()
                    let number = $("#phone_number").val()
                    let last_credits = $("#last_credits").prop('checked')
                    let sync_agenda = $("#save_contacts").prop('checked')

                    if (country != null && country != '') {
                        if (number.length < 7 || number.length > 11 || isNaN(number)) {
                            _general.showToast("Atención!", "Ingresa un número válido", 'error')
                            return
                        }
                    } else {
                        _general.showToast("Selecciona tu país", 'error')
                        return
                    }

                    _request.send({
                        action: 'sms_proxy_wp_set',
                        data: {
                            country: country,
                            number: number,
                            last_credits: last_credits,
                            sync_agenda: sync_agenda
                        },
                        success: (response) => {
                            if (response.success)
                                _general.showToast("El celular del administrador se configuró correctamente.", 'success')
                            else
                                _general.showToast(response.message, 'error')
                        },
                        error: (reason) => {
                            _general.showToast("Algo salio mal, Intenta más tarde. code: SA001", 'error')
                        }
                    })
                })
            }
        },

        // ── WhatsApp ──────────────────────────────────────────
        whatsapp: {
            checkInstanceStatus: () => {
                _request.send({
                    action: 'sms_proxy_whatsapp_check',
                    success: (response) => {
                        if (response.active && response.message != "connected") {
                            $("#invalid_whatsapp_instance").removeClass('d-none')
                            $(".texteditor-whatsapp").addClass("d-none")
                            $("#tabtwo").click()
                            $(".direct").removeClass('d-none')
                            $(".tosend").addClass('d-none')
                            $("#list-send").val('0').niceSelect('update')
                        }
                        if (response.active) {
                            $(".tosend").removeClass('d-none')
                            $(".direct").addClass('d-none')
                            $(".single-whatsapp").removeClass('d-none')
                            $(".texteditor-whatsapp").removeClass("d-none")
                            $("#tabone").click()
                            $("#list-send").val('1').niceSelect('update')
                        } else {
                            $(".texteditor-whatsapp").addClass("d-none")
                            $("#tabtwo").click()
                            $(".direct").removeClass('d-none')
                            $(".tosend").addClass('d-none')
                            $("#list-send").val('0').niceSelect('update')
                        }
                    }
                })
            },

            editSendMethod: (id) => {
                let e = $(`[data-whatsapp-${id}]`)
                let status = e.data(`whatsapp-${id}`)
                let message = status ? 'Desactivar en el envío por WhatsApp' : 'Activar el envío por WhatsApp'
                swal({
                    title: "!Atención!",
                    text: message,
                    icon: "info",
                    buttons: {
                        cancel: 'Cancelar',
                        confirm: { text: 'Ok,entendido', className: 'swal-btn' }
                    }
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        _request.send({
                            action: 'sms_proxy_whatsapp_edit',
                            data: { id: id, status: status },
                            success: (response) => {
                                if (response.status == 200) {
                                    let new_status = status ? 0 : 1
                                    e.data(`whatsapp-${id}`, new_status)
                                    if (new_status)
                                        e.addClass("text-whatsapp-main")
                                    else
                                        e.removeClass("text-whatsapp-main")
                                }
                            },
                            error: (error) => {
                                console.log('Error 500, intentalo más tarde')
                            }
                        })
                    }
                    _automations.state.close = true
                })
            },

            bindEvents: () => {
                $(document).on('change', '#list-send', (e) => {
                    if ($(e.currentTarget).val() == "1") {
                        $("#tabone").prop('checked', true)
                        $(".texteditor-whatsapp").removeClass("d-none")
                    } else {
                        $("#tabtwo").prop('checked', true)
                        $(".texteditor-whatsapp").addClass("d-none")
                    }
                })
            }
        },

        // ── Editor (text editing, shortcodes, tags) ───────────
        editor: {
            getText: (global_object) => {
                var ce = $("<pre />").html($("#" + global_object).html())
                if ($.browser && $.browser.webkit)
                    ce.find("div").replaceWith(function () { return "\n" + this.innerHTML })
                ce.find("div").replaceWith(function () { return "\n" + this.innerHTML })
                if ($.browser && $.browser.msie)
                    ce.find("p").replaceWith(function () { return this.innerHTML + "<br>" })
                if ($.browser && ($.browser.mozilla || $.browser.opera || $.browser.msie)) ce.find("br").replaceWith("\n")
                var text = ce.text().trim()
                text = text.replace(/ ,+/g, ",")
                text = text.replace("  ", " ")
                return text
            },

            getLength: (text) => {
                try {
                    if (!text) return 0
                    text = text.replace(/\s+/g, ' ')
                    text = text.replace(/ ,+/g, ',')
                    return text.length
                } catch (error) {
                    return 0
                }
            },

            getFakeLength: (msg) => {
                try {
                    if (!msg) return 0
                    msg = msg.replace(/\s+/g, ' ')
                    msg = msg.replace(/ ,+/g, ',')
                    var name = ((msg.match(/{nombre}/g) || []).length) * 7
                    var order_id = ((msg.match(/{order_id}/g) || []).length) * 4
                    var status = ((msg.match(/{status}/g) || []).length) * 3
                    var currency = ((msg.match(/{moneda}/g) || []).length) * -5
                    var nuevo_total = ((msg.match(/{total}/g) || []).length) * 1
                    var gateway = ((msg.match(/{pasarela}/g) || []).length) * 2
                    var address = ((msg.match(/{direccion_de_envio}/g) || []).length) * 40
                    var creacion = ((msg.match(/{fecha_creacion}/g) || []).length) * -6
                    var email = ((msg.match(/{email}/g) || []).length) * 28
                    var telefono = ((msg.match(/{telefono}/g) || []).length) * 2
                    var company = ((msg.match(/{tracking_company}/g) || []).length) * -8
                    var tracking_number = ((msg.match(/{numero_de_rastreo}/g) || []).length) * -4
                    var url_confirmacion = ((msg.match(/{url_confirmacion}/g) || []).length) * 7
                    var url = ((msg.match(/{url}/g) || []).length) * 20
                    var ordenes = ((msg.match(/{ordenes}/g) || []).length) * -5
                    var apellido = ((msg.match(/{apellido}/g) || []).length) * 7
                    var items = ((msg.match(/{numero_productos}/g) || []).length) * -15
                    var size = msg.length
                    size = size + items + apellido + url + ordenes + url_confirmacion + tracking_number + company + name + order_id + status + currency + nuevo_total + gateway + address + creacion + email + telefono
                    return size
                } catch (error) {
                    return 0
                }
            },

            pasteHtmlAtCaret: (html) => {
                var sel, range
                if (window.getSelection) {
                    sel = window.getSelection()
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0)
                        range.deleteContents()
                        var el = document.createElement("div")
                        el.innerHTML = html
                        var frag = document.createDocumentFragment(), node, lastNode
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node)
                        }
                        range.insertNode(frag)
                        if (lastNode) {
                            range = range.cloneRange()
                            range.setStartAfter(lastNode)
                            range.collapse(true)
                            sel.removeAllRanges()
                            sel.addRange(range)
                        }
                    }
                } else if (document.selection && document.selection.type != "Control") {
                    document.selection.createRange().pasteHTML(html)
                }
            },

            placeCaretAtEnd: (el) => {
                el.focus()
                if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                    var range = document.createRange()
                    range.selectNodeContents(el)
                    range.collapse(false)
                    var sel = window.getSelection()
                    sel.removeAllRanges()
                    sel.addRange(range)
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange()
                    textRange.moveToElementText(el)
                    textRange.collapse(false)
                    textRange.select()
                }
            },

            closeTag: (e) => {
                let a = e.closest('span')
                a.remove()
                var count = _automations.editor.getFakeLength($('#automation_text').text())
                $('#automation_count').text(count)
                $('#automation_count_ws').text(_automations.editor.getFakeLength($('#automation_text_ws').text()))
            },

            closeTagWs: (e) => {
                let a = e.closest('span')
                a.remove()
                var count = _automations.editor.getFakeLength($('#automation_text_ws').text())
                $('#automation_count_ws').text(count)
            },

            restoreHtmlFromText: (msg, whatsapp = null) => {
                try {
                    let type = ""
                    if (whatsapp) type = "_ws"
                    let msg_html = msg.replaceAll('{nombre}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>')
                    msg_html = msg_html.replaceAll('{order_id}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {order_id}</span>')
                    msg_html = msg_html.replaceAll('{status}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {status}</span>')
                    msg_html = msg_html.replaceAll('{moneda}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {moneda}</span>')
                    msg_html = msg_html.replaceAll('{total}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {total}</span>')
                    msg_html = msg_html.replaceAll('{pasarela}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {pasarela}</span>')
                    msg_html = msg_html.replaceAll('{direccion_de_envio}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {direccion_de_envio}</span>')
                    msg_html = msg_html.replaceAll('{fecha_creacion}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {fecha_creacion}</span>')
                    msg_html = msg_html.replaceAll('{email}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {email}</span>')
                    msg_html = msg_html.replaceAll('{telefono}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {telefono}</span>')
                    msg_html = msg_html.replaceAll('{tracking_company}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {tracking_company}</span>')
                    msg_html = msg_html.replaceAll('{numero_de_rastreo}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {numero_de_rastreo}</span>')
                    msg_html = msg_html.replaceAll('{url_confirmacion}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {url_confirmacion}</span>')
                    msg_html = msg_html.replaceAll('{url}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {url}</span>')
                    msg_html = msg_html.replaceAll('{ordenes}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {ordenes}</span>')
                    msg_html = msg_html.replaceAll('{apellido}', '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag' + type + '(this)"></i> {apellido}</span>')
                    if (whatsapp)
                        $("#automation_text_ws").html(msg_html)
                    else
                        $("#automation_text").html(msg_html)
                } catch (error) {
                    if (whatsapp)
                        $("#automation_text_ws").html(msg)
                    else
                        $("#automation_text").html(msg)
                }
            },

            availableTags: (whatsapp = false) => {
                $('#shortcode_tags, #taglist').removeClass('baloon-forced baloon-forced-2 baloon-forced-3 baloon-forced-4 baloon-forced-5 baloon-forced-6 baloon-forced-7')

                let tags = `
                <span id="_nombre" data-value="7">{nombre}</span>
                <span id="_order" data-value="4">{order_id}</span>
                <span id="_nota" data-value="78" class="special_tag">{nota}</span>
                <span id="_total" data-value="-2">{total}</span>
                <span id="_rem" data-value="-18" class="special_tag">{productos_removidos}</span>
                <span id="_add" data-value="-18" class="special_tag">{productos_agregados}</span>
                <span id="_descuento" data-value="-3">{descuentos}</span>
                <span id="_url" data-value="20">{url}</span>
                <span id="_email" data-value="28">{email}</span>
                <span id="_telefono" data-value="2">{telefono}</span>
                <span id="_ordenes" data-value="-5" class="special_tag">{ordenes}</span>
                <span id="_gastado" data-value="-6" class="special_tag">{total_gastado}</span>
                <span id="_creacion" data-value="-6" class="special_tag">{fecha_creacion}</span>
                <span id="_apellido" data-value="7">{apellido}</span>
                <span id="_checkout_created" data-value="-14" class="special_tag">{fecha_creacion_carrrito}</span>
                <span id="_checkout_updated" data-value="-19" class="special_tag">{fecha_actualizacion_carrito}</span>
                <span id="_currency" data-value="-5" class="special_tag">{moneda}</span>
                <span id="_gateway" data-value="1" class="special_tag">{pasarela}</span>
                <span id="_items_count" data-value="-15" class="special_tag">{numero_productos}</span>
                <span id="_tracking_url" data-value="5" class="special_tag">{url_de_seguimiento}</span>
                <span id="_company" data-value="-8" class="special_tag">{tracking_company}</span>
                <span id="_status" data-value="2" class="special_tag">{status}</span>
                <span id="_cancel_reason" data-value="10" class="special_tag">{motivo_cancelacion}</span>
                <span id="_tracking_number" data-value="-4" class="special_tag">{numero_de_rastreo}</span>
                <span id="_shipping_address" data-value="40" class="special_tag">{direccion_de_envio}</span>
                <span id="_actualizacion" data-value="-11" class="special_tag">{fecha_actualizacion}</span>
                <span id="_total_discount" data-value="-13" class="special_tag">{total_descontado}</span>
                <span id="_order_name" data-value="10" class="special_tag">{nombre_orden}</span>
                <span id="_url_confirmacion" data-value="7" class="special_tag">{url_confirmacion}</span>
                <span id="_purchased_productt" data-value="-13" class="special_tag">{purchased_product}</span>
                <span id="_recommended_product" data-value="9" class="special_tag">{recommended_product}</span>
                <span id="_reference" data-value="-4" class="special_tag">{referencia_de_pago}</span>
                <span id="_payment_method" data-value="18" class="special_tag">{metodo_de_pago}</span>`

                if (whatsapp) {
                    $('#taglist').html(tags)
                    $("#shortcode_tags").addClass('d-none')
                } else {
                    $('#shortcode_tags').html(tags)
                    $(".baloon-container").addClass("d-none")
                }

                $('#shortcode_tags').removeClass('baloon-forced')
                $('.special_tag').addClass('d-none')

                switch ($("#list-type").val()) {
                    case "new_order":
                    case "o-pending":
                    case "o-onhold":
                    case "o-completed":
                    case "o-cancelled":
                        $("#shortcode_tags").addClass('baloon-forced-2')
                        $("#_nombre, #_order, #_status, #_currency, #_total, #_gateway, #_shipping_address, #_creacion, #_email, #_telefono").removeClass('d-none')
                        break
                    case "f-created":
                        $("#shortcode_tags").addClass('baloon-forced-3')
                        $("#_nombre, #_order, #_shipping_address, #_company, #_tracking_number").removeClass('d-none')
                        break
                    case "cash-od":
                        $("#shortcode_tags").addClass('baloon-forced-4')
                        $("#_nombre, #_order, #_status, #_currency, #_total, #_gateway, #_shipping_address, #_creacion, #_email, #_url_confirmacion").removeClass('d-none')
                        break
                    case "winback":
                        $("#shortcode_tags").addClass('baloon-forced-5')
                        $("#_nombre, #_email, #_apellido, #_telefono, #_ordenes, #_url, #_creacion, #_shipping_address").removeClass('d-none')
                        break
                    case "feedback":
                        $("#shortcode_tags").addClass('baloon-forced-6')
                        $("#_nombre, #_order, #_currency, #_total, #_gateway, #_creacion, #_email, #_apellido, #_url").removeClass('d-none')
                        break
                    case "abandoned":
                        $("#shortcode_tags").addClass('baloon-forced-7')
                        $("#_nombre, #_apellido, #_total, #_email, #_items_count, #_checkout_created, #_url").removeClass('d-none')
                        break
                    default: break
                }

                $('#shortcode_tags span').click(function (e) {
                    e.preventDefault()
                    if ($(this).hasClass("tag-disabled")) return
                    var count = _automations.editor.getFakeLength($('#automation_text').text())
                    var extras = $(this).data("value")
                    var added = $(this).text().length
                    if (count + extras + added < 160) {
                        let text = _automations.editor.getText("automation_text") + " " + $(this).text() + " "
                        _automations.editor.restoreHtmlFromText(text)
                        var el = document.getElementById('automation_text')
                        _automations.editor.placeCaretAtEnd(el)
                        $('#automation_count').text(count + extras + added)
                        $("#shortcode_tags").addClass('d-none')
                    } else _general.showToast('El mensaje ya es demasiado largo para agregar el campo personalizado', 'error')
                })

                $('#shortcode_tags_ws span').click(function (e) {
                    _automations.state.closeWs = true
                    e.preventDefault()
                    if ($('#automation_text_ws').text() == "") $('#automation_text_ws').html("")
                    if ($(this).hasClass("tag-disabled") || $(this).hasClass("emoji")) return
                    var count = _automations.editor.getFakeLength($('#automation_text_ws').text())
                    var extras = $(this).data("value")
                    var added = $(this).text().length
                    if (count + extras + added < 1000) {
                        let text = _automations.editor.getText("automation_text_ws") + " " + $(this).text() + " "
                        _automations.editor.restoreHtmlFromText(text, true)
                        var el = document.getElementById('automation_text_ws')
                        _automations.editor.placeCaretAtEnd(el)
                        $('#automation_count_ws').text(count + extras + added)
                    } else _general.showToast('El mensaje ya es demasiado largo para agregar el campo personalizado', 'error')
                })
            },

            outsideClick: (event, notelem) => {
                notelem = $(notelem)
                var clickedOut = true, i, len = notelem.length
                for (i = 0; i < len; i++) {
                    if (event.target == notelem[i] || notelem[i].contains(event.target)) {
                        clickedOut = false
                    }
                }
                if (clickedOut) return true
                else return false
            },

            bindEvents: () => {
                $(document).on('click', '.see_password', (ev) => {
                    const inputPassword = $(ev.currentTarget).parent(".input-group").find(".see_password_input")
                    if ($(ev.currentTarget).find("i").hasClass("fa-eye-slash")) {
                        $(ev.currentTarget).find("i").addClass("fa-eye").removeClass("fa-eye-slash")
                        inputPassword.get(0).type = "password"
                    } else {
                        $(ev.currentTarget).find("i").addClass("fa-eye-slash").removeClass("fa-eye")
                        inputPassword.get(0).type = "text"
                    }
                })

                $(document).on('click', '.emoji', function (e) {
                    e.preventDefault()
                    var count = _automations.editor.getFakeLength($('#automation_text_ws').text())
                    var added = $(this).text().length
                    var extras = 0
                    if (count + extras + added < 1000) {
                        let text = _automations.editor.getText("automation_text_ws") + $(this).text()
                        _automations.editor.restoreHtmlFromText(text, true)
                        var el = document.getElementById('automation_text_ws')
                        _automations.editor.placeCaretAtEnd(el)
                        $('#automation_count_ws').text(count + extras + added)
                        $(".baloon-container").addClass('d-none')
                    }
                })

                $(document).on('click', '.direct', (e) => {
                    e.preventDefault()
                    const eventTarget = e.target
                    if (eventTarget.classList.contains(`torecipient`)) {
                        _automations.wizard.setActiveStep(2)
                        _automations.wizard.setActivePanel(2)
                    } else if (eventTarget.classList.contains(`tomsg`)) {
                        _automations.wizard.setActiveStep(4)
                        _automations.wizard.setActivePanel(4)
                    }
                })

                $(document).on('click', '.direct-tosend', (e) => {
                    _automations.wizard.setActiveStep(3)
                    _automations.wizard.setActivePanel(3)
                })

                $(document).on('click', '.toname', (e) => {
                    e.preventDefault()
                    let value = $("#list-send").val()
                    let text = $("#automation_text").text()
                    let text_ws = $("#automation_text_ws").text()

                    $("#automation-text").removeClass('border-red')
                    $("#automation-text_ws").removeClass('border-red')
                    $("#text-error").addClass('d-none')
                    $("#text-error_ws").addClass('d-none')

                    if (value == '0' || !value) {
                        if (!text || text == "") {
                            $("#text-error").removeClass('d-none')
                            $("#text-error small").text('Este campo no puede estar vacio')
                            $("#automation-text").addClass('border-red')
                            return false
                        }
                    } else {
                        if (text_ws == null || text_ws == false || text_ws === "") {
                            $("#text-error_ws").removeClass('d-none')
                            $("#text-error_ws small").text('Este campo no puede estar vacio')
                            $("#automation-text_ws").addClass('border-red')
                            $("#tabtone").prop('checked', true)
                            return false
                        }
                        if (!text || text == "") {
                            $("#text-error").removeClass('d-none')
                            $("#text-error small").text('Es necesario que configures este campo, así, en caso de que no podamos entregar tu mensaje por WhatsApp usaremos este medio')
                            $("#automation-text").addClass('border-red')
                            $("#tabtwo").prop('checked', true)
                            return false
                        }
                    }
                })

                $(document).on('click', '#shortcodes', (e) => {
                    e.preventDefault()
                    let el = $("#shortcode_tags")
                    if (el.hasClass('d-none'))
                        $("#shortcode_tags").removeClass('d-none')
                    else
                        $("#shortcode_tags").addClass('d-none')
                    _automations.editor.availableTags()
                })

                $(document).on('click', '#shortcodes_ws', (e) => {
                    e.preventDefault()
                    let el = $(".baloon-container")
                    if (el.hasClass("d-none")) $(".baloon-container").removeClass("d-none")
                    else $(".baloon-container").addClass("d-none")
                    $("#shortcode_tags span").removeClass("tag-disabled")
                    _automations.editor.availableTags(true)
                })

                $('#automation_text_ws').keypress(function (e) {
                    if ($(this).text() == "") $(this).html("")
                    let count = _automations.editor.getFakeLength($(this).text())
                    if (count < 1000) {
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            document.getElementById('automation_text_ws').focus()
                        }
                    }
                    return (count < 1000)
                }).on({
                    'paste': function (e) {
                        var len = _automations.editor.getFakeLength($(this).text()),
                            cp = e.originalEvent.clipboardData.getData('text')
                        if (len < 1000)
                            this.innerHTML += $('<span/>').text(cp.substring(0, 1000 - len)).html()
                        return false
                    },
                    'drop': function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                    }
                })

                $('#automation_text').keypress(function (e) {
                    let count = _automations.editor.getFakeLength($(this).text())
                    if (count < 160) {
                        if (e.key === 'Enter' || e.keyCode === 13) {
                            document.getElementById('automation_text').focus()
                            _automations.editor.pasteHtmlAtCaret('<span class="d-none">{blank_space}</span>')
                        }
                    }
                    return (count < 160)
                }).on({
                    'paste': function (e) {
                        var len = _automations.editor.getFakeLength($(this).text()),
                            cp = e.originalEvent.clipboardData.getData('text')
                        if (len < 160)
                            this.innerHTML += $('<span/>').text(cp.substring(0, 160 - len)).html()
                        return false
                    },
                    'drop': function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                    }
                })

                $('#automation_text').keyup(function () {
                    var count = _automations.editor.getFakeLength($(this).text())
                    $('#automation_count').text(count)
                })

                $('#automation_text_ws').keyup(function () {
                    var count = _automations.editor.getFakeLength($(this).text())
                    $('#automation_count_ws').text(count)
                })

                $(document).on('mouseleave', '#shortcode_tags', () => {
                    if (_automations.state.close)
                        $("#shortcode_tags").addClass('d-none')
                })

                $(document).on('mouseleave', '#shortcode_tags_ws', () => {
                    if (_automations.state.closeWs)
                        $(".baloon-container").addClass('d-none')
                })
            }
        },

        // ── UI (login, info modals, misc) ─────────────────────
        ui: {
            showInfo: (id, type, envio, msg = '') => {
                let info_text = ''
                let info_message = msg
                let info_number = ''
                envio = envio ? 'SMS' : ' WhatsApp'
                if (id) {
                    info_text = "Esta automatización te tiene a ti como destinatario, recibirás notificaciones SMS de tus automatizaciones"
                    info_number = _automations.state.renderNumber
                } else {
                    info_text = `Esta automatización tiene como destinatario a tus clientes, los mensajes llegarán a sus números de celular vía <span class="text-red-1">${envio}<span> `
                    if (type == "2")
                        info_text = `Esta automatización tiene como destinatario a tus clientes, los mensajes llegarán a sus números de celular vía <span class="text-red-1">${envio}<span> <br><b class='text-warning'>Asegúrate de solicitar el número de teléfono de tus clientes al momento de registrarse para hacer efectiva la automatización</b>`
                    info_number = "El número de telefono del cliente"
                }
                $("#info_text").html(info_text)
                $("#info_recipient_number").text(info_number)
                $("#info_message").text(info_message)
                $("#modal_msg_info").modal("show")
            },

            openIssues: () => {
                $("#modal_issues").modal("show")
            },

            bindEvents: () => {
                $(document).on('click', '#login-boton', (e) => {
                    let noti = $(".notification")
                    let btnLogin = $(e.currentTarget)
                    noti.html()
                    e.preventDefault()
                    let useremail = $("#useremail").val()
                    let userpass = $("#userpassword").val()
                    if (useremail && userpass) {
                        userpass = calcMD5(userpass).toLowerCase()
                        useremail = calcMD5(useremail).toLowerCase().trim()
                        _request.send({
                            action: 'sms_proxy_login',
                            data: { user: useremail, pass: userpass },
                            beforeSend: () => { btnLogin.html('<i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i> Procesando ...').prop("disabled", true).css("opacity", 0.5) },
                            success: (response) => {
                                btnLogin.html('Inicia sesión').prop("disabled", false).css("opacity", 1)
                                if (response.success) {
                                    $(".step2").click()
                                    $('#credits').text(response.credits)
                                    $('.country').find('option[value="' + response.country + '"]').prop('selected', true)
                                    $('#country').niceSelect('update')
                                    $("#phone_number").val(response.number)
                                    noti.html()
                                    if ($("#userstatus").val() == "administrator") {
                                        // WooCommerce API key call — uses different nonce, keep as raw $.ajax
                                        $.ajax({
                                            type: "POST",
                                            url: ajax_object.ajaxurl,
                                            dataType: "json",
                                            data: {
                                                action: 'woocommerce_update_api_key',
                                                security: $('#globalNonce_apikey').val(),
                                                key_id: 0,
                                                description: 'SMS MASIVOS PLUGIN AUTO KEYS',
                                                user: '1',
                                                permissions: 'read_write'
                                            },
                                            success: (res) => {
                                                if (res.data && res.data.consumer_key) {
                                                    _request.send({
                                                        action: 'sms_set_apikey',
                                                        data: {
                                                            apikey: response.apikey,
                                                            cs: res.data.consumer_secret,
                                                            ck: res.data.consumer_key,
                                                        },
                                                        success: async (data) => {
                                                            await _automations.crud.refresh()
                                                        },
                                                        error: (error) => {
                                                            _general.showToast("Algo salio mal, Intenta más tarde. code: LG001", 'error')
                                                        }
                                                    })
                                                } else {
                                                    $("#user_no_admin").removeClass("d-none")
                                                    _automations.state.activeKeys = false
                                                }
                                            },
                                            error: (error) => {
                                                _general.showToast("Algo salio mal, Intenta más tarde. code: LG002", 'error')
                                            }
                                        })
                                    } else {
                                        $("#user_no_admin").removeClass("d-none")
                                        _automations.state.activeKeys = false
                                        _request.send({
                                            action: 'sms_set_apikey',
                                            data: {
                                                apikey: response.apikey,
                                                cs: null,
                                                ck: null
                                            },
                                            success: async (data) => {
                                                await _automations.crud.refresh()
                                            },
                                            error: (error) => {
                                                _general.showToast("Algo salio mal, Intenta más tarde. code: LG003", 'error')
                                            }
                                        })
                                    }
                                } else
                                    noti.html('<div class="alert alert-warning"><i class="fa fa-info float-right"></i>' + response.message + '</div>')
                            },
                            error: (error) => {
                                btnLogin.html('Inicia sesión').prop("disabled", false).css("opacity", 1)
                                _general.showToast("Algo salio mal, Intenta más tarde. code: LG004", 'error')
                            }
                        })
                    } else
                        noti.html('<div class="alert alert-warning"><i class="fa fa-info float-right"></i>Campos obligatorios</div>')
                })
            }
        }
    }

    // ── Bootstrap ──────────────────────────────────────────
    $(function () {
        _automations.init()
    })

})(jQuery)
