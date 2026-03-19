
$(function () {
    refresh()
});


function clean(){

$("#revenue").append(
    '<div class="classic revenue-modal">'
        +'<p class="title-revenue">Empieza a aumentar tus ventas,<br>crea tu primera automatización</p>'
        +'<img src="/images/ingresos.png" alt="" class="img-center">'
        +'<a class="btn btn-danger btn-centered" href="https://help.smsmasivos.com.mx/es/category/woocommerce-18koplv/" target="_blank">Aprende a usar el plugin</a>'
    +'</div>'
)


$(".ventas_totales").html("$46,500.00")
$(".ventas_automatizacion").html("$6,420.00")
$(".clientes_alcanzados").html(76)


$("#grafica-clientes").removeClass("d-none")
$("#grafica-revenue").removeClass("d-none")
$(".loading").addClass("d-none")
let data = [5,10,20,30,40,50]
let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
let data_customers = [5,10,20,30,40,50]

var ctx = document.getElementById("grafica-revenue");
var grafica_revenue = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Ingresos obtenidos por automatizaciones',
            data: data,
            backgroundColor: [
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)'
            ],
            borderColor: [
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var ctx2 = document.getElementById("grafica-clientes");
var grafica_clientes = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: '# clientes alcanzados',
            data: data_customers,
            backgroundColor: [
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)'
            ],
            borderColor: [
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)',
                'rgba(210, 218, 226, 0.78)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

}


function refresh(){

let shop = $("#globalShopName").val()
let token = $("#globalToken").val()
let apikey = $("#globalApikey").val() 

$.ajax({
    url: "https://pluginssandbox.smsmasivos.com.mx/wp/automation/revenue/get",
    type: "POST",
    dataType: "json",
    data: {
        shop:shop,
        apikey:apikey,
        token: token
    },
    success: function (response) {

        $("#grafica-clientes").removeClass("d-none")
        $("#grafica-revenue").removeClass("d-none")
        $(".loading").addClass("d-none")
        let data = [0,0,0,0,0,0]
        let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
        let data_customers = [0,0,0,0,0,0]

        if(response.success){
            let current = response.current
            $(".ventas_totales").html("$"+parseFloat(response.total).toFixed(2))
            $(".ventas_automatizacion").html("$"+parseFloat(response.sales[response.current]).toFixed(2))
            $(".clientes_alcanzados").html(response.customers[response.current])

            let past_month = current -1
            if(past_month < 0) past_month += 12
            
            let stats_revenue = 100
            if(response.sales[past_month] != 0 && response.sales[past_month])
                stats_revenue = (response.sales[current]*100)/response.sales[past_month]-100
            
            if(stats_revenue > 0){
                $("#indicador1").html('<i class="fas fa-sort-up"></i>'+stats_revenue+'%</p>').addClass("text-success")
            }else if(stats_revenue == 0){
                $("#indicador1").html('<i class="fas fa-sort-up"></i>'+stats_revenue+'%</p>').addClass("neutral")
            }else{
                $("#indicador1").html('<i class="fas fa-sort-down"></i>'+stats_revenue+'%</p>').addClass("text-danger")
            }

            let stats_customers = 100
            if(response.customers[past_month] != 0 && response.customers[past_month])
                stats_customers = (response.customers[current]*100)/response.customers[past_month]-100

            if(stats_customers > 0){
                $("#indicador2").html('<i class="fas fa-sort-up"></i>'+stats_customers+'%</p>').addClass("text-success")
            }else if(stats_customers == 0){
                $("#indicador2").html('<i class="fas fa-sort-up"></i>'+stats_customers+'%</p>').addClass("neutral")
            }else{
                $("#indicador2").html('<i class="fas fa-sort-down"></i>'+stats_customers+'%</p>').addClass("text-danger")
            }

            
            for (let index = 0; index < 6; index++) {
                let past = current - index 
                if(past < 0)
                    past += 12
                
                data[5-index] = response.sales[past]

                data_customers[5-index] = response.customers[past]

                switch (past) {
                    case 0: labels[5-index] = "Enero";break;
                    case 1: labels[5-index] = "Febrero";break;
                    case 2: labels[5-index] = "Marzo";break;
                    case 3: labels[5-index] = "Abril";break;
                    case 4: labels[5-index] = "Mayo";break;
                    case 5: labels[5-index] = "Junio";break;
                    case 6: labels[5-index] = "Julio";break;
                    case 7: labels[5-index] = "Agosto";break;
                    case 8: labels[5-index] = "Septiembre";break;
                    case 9: labels[5-index] = "Octubre";break;
                    case 10: labels[5-index] = "Noviembre";break;
                    case 11: labels[5-index] = "Diciembre";break;
                    default:
                        break;
                }

            }

        }

        var ctx = document.getElementById("grafica-revenue");
        var grafica_revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ingresos obtenidos por automatizaciones',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var ctx2 = document.getElementById("grafica-clientes");
        var grafica_clientes = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# clientes alcanzados',
                    data: data_customers,
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },error: function (error){
        console.log(error);
    }
});

}
