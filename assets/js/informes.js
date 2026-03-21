($ => {
    const _informes = {
        currentPage: 100,

        init: () => {
            $('#sms-skeleton').remove()
            $('#global_container').show()

            _informes.refresh()
        },

        refresh: () => {
            $('#list-body-2').append(
                '<tr class="vertical"><td colspan="9"><i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i></td></tr>'
            )

            _request.send({
                action: 'sms_proxy_reports_get',
                data: { rows: _informes.currentPage },
                success: (response) => {
                    $('#list-body-2').html('')
                    $('.loadcontent').removeClass('d-none')

                    if (response.success) {
                        if (response.list.length > 0 && response.list)
                            $('.empty-3').addClass('d-none')

                        response.list.forEach((element, i) => {
                            _informes.renderRow(element, i)
                        })

                        $('.stats-sent').html('<i class="far fa-envelope"></i> &nbsp;' + response.sent + '</span>')
                        $('.stats-clicks').html('<i class="fas fa-mouse-pointer"></i>&nbsp; ' + response.clicks + '</span>')
                        $('.stats-recovery').html('<i class="fas fa-hands-helping"></i> &nbsp;' + response.recovery + '</span>')
                    }
                }
            })
        },

        renderRow: (element, index) => {
            let type = _informes.formatType(element.type)
            let delay = _informes.formatDelay(element.delay)
            let problem = 'Ninguno'
            let click = "<span style='color:#dab549'><i class='fas fa-ban'></i></span>"
            let enviado = "<span style='color:#dab549'><i class='fas fa-ban'></i></span>"
            let recuperado = 'No'

            if (element.recipient == 1) type += "<span style='color:#14477e;'> (A)</span>"

            switch (element.problem) {
                case 1: problem = 'Mensaje muy largo'; break
                case 2: problem = 'Sin número'; break
                default: problem = 'otro'; break
            }

            if (element.click && element.click != null && element.click == 1)
                click = '<span style="color:#49DA96"><i class="fas fa-check"></i></span>'

            if (element.status == 1) {
                enviado = '<span style="color:#49DA96"><i class="fas fa-check"></i></span>'
                if (element.problem == 0 && element.click == 1 && element.paid == 1)
                    recuperado = '<span class="recovery">$' + element.revenue + '</span>'
                if (element.problem == 0 && element.click == 1 && element.paid == 2)
                    recuperado = '<span class="recovery-p">P $' + element.revenue + '</span>'
                if (element.problem == 0 && element.click == 1 && element.paid == 3)
                    recuperado = '<span class="recovery-c">C $' + element.revenue + '</span>'
            } else {
                enviado = `<span style='color:#dab549' data-toggle="tooltip" data-placement="top" title="${problem}"><i class='fas fa-ban'></i></span>`
            }

            let link = '<td class="neutral"><a class="customer-link" target="_blank">' + element.cid + '</a></td>'
            if (element.type == 6)
                link = '<td class="neutral"><a class="customer-link" target="_blank">' + element.checkout + '</a></td>'

            let row = $(
                '<tr class="vertical">'
                + '<td class="help-time">' + type + '</td>'
                + '<td class="help-time">' + delay + '</td>'
                + '<td class="help-time">' + enviado + '</td>'
                + '<td class="help-time">' + element.name + '</td>'
                + link
                + '<td class="help-time">' + click + '</td>'
                + '<td class="help-time">' + recuperado + '</td>'
                + '</tr>'
            )

            $('#list-body-2').append(row)
        },

        formatType: (type) => {
            switch (type) {
                case 2: return 'Mensaje de bienvenida'
                case 4: return 'Recuperación de cliente'
                case 5: return 'Cliente Desactivado'
                case 6: return 'Carrito Abandonado'
                case 7: return 'Confirmación de envío'
                case 8: return 'Actualización de envío'
                case 9: return 'Nuevo pedido'
                case 10: return 'Pago contra entrega'
                case 11: return 'Retroalimentación'
                case 12: return 'Estatus: Pedido pendiente'
                case 13: return 'Estatus: Pedido en espera'
                case 14: return 'Estatus: Pedido completado'
                case 15: return 'Estatus: Pedido cancelado'
                default: return ''
            }
        },

        formatDelay: (delay) => {
            if (delay >= 1440) return `${delay / 1440} días`
            if (delay >= 60) return `${delay / 60} Hrs`
            return `${delay} min`
        }
    }

    $(function () {
        _informes.init()
        $(document).on('click', '#load_info', () => {
            _informes.currentPage += 100
            _informes.refresh()
        })
    })
})(jQuery)
