(function () {
    'use strict'

    const _globalEdits = {
        init: () => {
            if (!_globalEdits.shouldRun()) return
            _globalEdits.createUI()
        },

        shouldRun: () => {
            return window.location.href.indexOf('action=edit') !== -1
                && document.getElementById('woocommerce-order-data')
                && !document.getElementById('sms-plugin-container')
        },

        createUI: () => {
            let wrapper = document.getElementsByClassName('order_data_column_container')[0]

            let globaldiv = document.createElement('div')
            globaldiv.className = 'order_data_column'
            globaldiv.style.display = 'inline-grid'

            let title = document.createElement('h3')
            title.textContent = 'Acciones'

            let subtitle = document.createElement('p')
            subtitle.textContent = 'Notifica al cliente de los detalles de su envío'

            let newlabel = document.createElement('label')
            newlabel.innerHTML = 'Compañia'
            newlabel.style.display = 'block'
            newlabel.style.margin = '4px 0'

            let newinput = document.createElement('input')
            newinput.type = 'text'
            newinput.name = 'sms_company'
            newinput.id = 'sms_plugin_company'
            newinput.maxLength = '25'
            newinput.placeholder = 'DHL'

            let newlabel2 = document.createElement('label')
            newlabel2.innerHTML = 'Número de seguimiento'
            newlabel2.style.display = 'block'
            newlabel2.style.margin = '4px 0'

            let newinput2 = document.createElement('input')
            newinput2.type = 'text'
            newinput2.name = 'sms_rastreo'
            newinput2.id = 'sms_plugin_tracking'
            newinput2.maxLength = '25'
            newinput2.placeholder = '9698F-0012'

            let button = document.createElement('button')
            button.innerText = 'Enviar'
            button.className = 'button'
            button.type = 'button'
            button.style.margin = '4px 0'
            button.id = 'envio_sms'
            button.addEventListener('click', () => _globalEdits.sendFulfillment())

            globaldiv.appendChild(title)
            globaldiv.appendChild(subtitle)
            globaldiv.appendChild(newlabel)
            globaldiv.appendChild(newinput)
            globaldiv.appendChild(newlabel2)
            globaldiv.appendChild(newinput2)
            globaldiv.appendChild(button)
            wrapper.appendChild(globaldiv)
        },

        sendFulfillment: () => {
            let btn = document.getElementById('envio_sms')
            let order = document.getElementById('post_ID')
            let company = document.getElementById('sms_plugin_company')
            let trackingNumber = document.getElementById('sms_plugin_tracking')

            if (!company.value) {
                company.style.border = '1px solid red'
                return
            }

            if (!trackingNumber.value) {
                trackingNumber.style.border = '1px solid red'
                return
            }

            trackingNumber.style.border = '1px solid #555'
            company.style.border = '1px solid #555'
            btn.setAttribute('disabled', 'disabled')
            btn.innerHTML = 'Enviando ...'

            Backbone.ajax({
                method: 'POST',
                dataType: 'json',
                url: ajax_object.ajaxurl,
                data: {
                    action: 'sms_fulfillment_created',
                    order: order.value,
                    company: company.value,
                    tracking_number: trackingNumber.value,
                    name: document.getElementById('_billing_first_name').value,
                    nonce: ajax_object.fulfillment_nonce,
                    address: document.getElementById('_billing_address_1').value,
                    country: document.getElementById('_billing_country').value,
                    phone: document.getElementById('_billing_phone').value
                },
                success: (res) => {
                    btn.removeAttribute('disabled')
                    btn.innerText = 'Enviar'

                    let container = document.getElementsByClassName('order_notes')[0]
                    let li = document.createElement('li')
                    li.className = 'note'
                    let div = document.createElement('div')
                    div.className = 'note_content'
                    let pContent = document.createElement('p')
                    pContent.textContent = res.success ? res.message : 'No se pudo completar el envío, revisa tu automatización y los detalles del cliente'
                    let pMeta = document.createElement('p')
                    pMeta.className = 'meta'
                    let span = document.createElement('span')
                    span.className = 'exact-date'
                    span.textContent = 'Hace unos instantes por smsmasivos'

                    pMeta.appendChild(span)
                    div.appendChild(pContent)
                    li.appendChild(div)
                    li.appendChild(pMeta)
                    container.prepend(li)
                }
            })
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive')
        setTimeout(() => _globalEdits.init(), 1)
    else
        document.addEventListener('DOMContentLoaded', () => _globalEdits.init())
})()
