($ => {
    const _revenue = {
        charts: { revenue: null, customers: null },

        init: () => {
            $('#sms-skeleton').remove()
            $('#global_container').show()

            _revenue.refresh()
        },

        refresh: () => {
            _request.send({
                action: 'sms_proxy_revenue_get',
                success: (response) => {
                    $('#grafica-clientes').removeClass('d-none')
                    $('#grafica-revenue').removeClass('d-none')
                    $('.loading').addClass('d-none')

                    let data = [0, 0, 0, 0, 0, 0]
                    let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
                    let dataCustomers = [0, 0, 0, 0, 0, 0]

                    if (response.success) {
                        let current = response.current
                        $('.ventas_totales').html(_general.formatCurrency(response.total))
                        $('.ventas_automatizacion').html(_general.formatCurrency(response.sales[current]))
                        $('.clientes_alcanzados').html(response.customers[current])

                        let pastMonth = current - 1
                        if (pastMonth < 0) pastMonth += 12

                        _revenue.renderIndicator('#indicador1', response.sales[current], response.sales[pastMonth])
                        _revenue.renderIndicator('#indicador2', response.customers[current], response.customers[pastMonth])

                        for (let index = 0; index < 6; index++) {
                            let past = current - index
                            if (past < 0) past += 12
                            data[5 - index] = response.sales[past]
                            dataCustomers[5 - index] = response.customers[past]
                            labels[5 - index] = _general.monthName(past)
                        }
                    }

                    _revenue.createChart('grafica-revenue', 'Ingresos obtenidos por automatizaciones', data, labels, 'rgba(255, 206, 86, 0.6)')
                    _revenue.createChart('grafica-clientes', '# clientes alcanzados', dataCustomers, labels, 'rgba(255, 206, 86, 0.6)')
                },
                error: (error) => {
                    console.log(error)
                }
            })
        },

        clean: () => {
            $('#revenue').append(
                '<div class="classic revenue-modal">'
                + '<p class="title-revenue">Empieza a aumentar tus ventas,<br>crea tu primera automatización</p>'
                + '<img src="/images/ingresos.png" alt="" class="img-center">'
                + '<a class="btn btn-danger btn-centered" href="https://help.smsmasivos.com.mx/es/category/woocommerce-18koplv/" target="_blank">Aprende a usar el plugin</a>'
                + '</div>'
            )

            $('.ventas_totales').html('$46,500.00')
            $('.ventas_automatizacion').html('$6,420.00')
            $('.clientes_alcanzados').html(76)

            $('#grafica-clientes').removeClass('d-none')
            $('#grafica-revenue').removeClass('d-none')
            $('.loading').addClass('d-none')

            let data = [5, 10, 20, 30, 40, 50]
            let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']

            _revenue.createChart('grafica-revenue', 'Ingresos obtenidos por automatizaciones', data, labels, 'rgba(210, 218, 226, 0.78)')
            _revenue.createChart('grafica-clientes', '# clientes alcanzados', data, labels, 'rgba(210, 218, 226, 0.78)')
        },

        createChart: (containerId, label, data, labels, color) => {
            let options = {
                chart: { type: 'area', height: 250, toolbar: { show: false }, animations: { enabled: true } },
                series: [{ name: label, data: data }],
                xaxis: { categories: labels, labels: { style: { fontSize: '12px' } } },
                fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
                colors: [color],
                stroke: { curve: 'smooth', width: 2 },
                dataLabels: { enabled: false },
                tooltip: { y: { formatter: val => val } },
                grid: { borderColor: '#f0f0f0', strokeDashArray: 4 }
            }
            let chart = new ApexCharts(document.getElementById(containerId), options)
            chart.render()
            return chart
        },

        renderIndicator: (selector, current, previous) => {
            let stats = 100
            if (previous != 0 && previous)
                stats = (current * 100) / previous - 100

            if (stats > 0) {
                $(selector).html('<i class="fas fa-sort-up"></i>' + stats + '%</p>').addClass('text-success')
            } else if (stats == 0) {
                $(selector).html('<i class="fas fa-sort-up"></i>' + stats + '%</p>').addClass('neutral')
            } else {
                $(selector).html('<i class="fas fa-sort-down"></i>' + stats + '%</p>').addClass('text-danger')
            }
        }
    }

    $(function () { _revenue.init() })
})(jQuery)
