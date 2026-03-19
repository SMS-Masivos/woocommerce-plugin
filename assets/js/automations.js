var gral_status = null
var present_msg = null
var present_delay = null
let active_keys = true;

$(function () {
   
    let apitoken = $("#globalApikey").val();   
    let json_conf = null
    let csrfToken = null
    let render_last = null
    let render_country = null
    let render_number   = null
    let credits   = null
    let close = true
    let close_ws = true
    let shop = $("#globalShopName").val();   ;
    let global_list = []
    
    load()

    $("#list-recipient").niceSelect();
    $("#list-type").niceSelect();
    $("#list-time").niceSelect();
    $('#list-send').niceSelect();
    $('#country').niceSelect();

    //DOM elements
    const DOMstrings = {
        stepsBtnClass: 'multisteps-form__progress-btn',
        stepsBtns: document.querySelectorAll(`.multisteps-form__progress-btn`),
        stepsBar: document.querySelector('.multisteps-form__progress'),
        stepsForm: document.querySelector('.multisteps-form__form'),
        stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
        stepFormPanelClass: 'multisteps-form__panel',
        stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
        stepPrevBtnClass: 'js-btn-prev',
        stepNextBtnClass: 'js-btn-next' };

    //remove class from a set of items
    const removeClasses = (elemSet, className) => {
    
        elemSet.forEach(elem => {
    
        elem.classList.remove(className);
    
        });
    
    };
    
    //return exect parent node of the element
    const findParent = (elem, parentClass) => {
    
        let currentNode = elem;
    
        while (!currentNode.classList.contains(parentClass)) {
        currentNode = currentNode.parentNode;
        }
    
        return currentNode;
    
    };
    
    //get active button step number
    const getActiveStep = elem => {
        return Array.from(DOMstrings.stepsBtns).indexOf(elem);
    };
    
    //set all steps before clicked (and clicked too) to active
    const setActiveStep = activeStepNum => {
    
        //remove active state from all the state
        removeClasses(DOMstrings.stepsBtns, 'js-active');
    
        //set picked items to active
        DOMstrings.stepsBtns.forEach((elem, index) => {
    
        if (index <= activeStepNum) {
            elem.classList.add('js-active');
        }
    
        });
    };
    
    //get active panel
    const getActivePanel = () => {
    
        let activePanel;
    
        DOMstrings.stepFormPanels.forEach(elem => {
    
        if (elem.classList.contains('js-active')) {
    
            activePanel = elem;
    
        }
    
        });
    
        return activePanel;
    
    };
    
    //open active panel (and close unactive panels)
    const setActivePanel = activePanelNum => {
    
        //remove active class from all the panels
        removeClasses(DOMstrings.stepFormPanels, 'js-active');
    
        //show active panel
        DOMstrings.stepFormPanels.forEach((elem, index) => {
        if (index === activePanelNum) {
    
            elem.classList.add('js-active');
    
            setFormHeight(elem);
    
        }
        });
    
    };
    
    //set form height equal to current panel height
    const formHeight = activePanel => {
    
        const activePanelHeight = activePanel.offsetHeight;
    
        DOMstrings.stepsForm.style.height = `${activePanelHeight}px`;
    
    };
    
    const setFormHeight = () => {
        const activePanel = getActivePanel();
    
        formHeight(activePanel);
    };
    
    //STEPS BAR CLICK FUNCTION
    DOMstrings.stepsBar.addEventListener('click', e => {
    
        //check if click target is a step button
        const eventTarget = e.target;
    
        if (!eventTarget.classList.contains(`${DOMstrings.stepsBtnClass}`)) {
        return;
        }
    
        //get active button step number
        const activeStep = getActiveStep(eventTarget);
    
        //set all steps before clicked (and clicked too) to active
        setActiveStep(activeStep);
    
        //open active panel
        setActivePanel(activeStep);
    });
    
    //PREV/NEXT BTNS CLICK
    DOMstrings.stepsForm.addEventListener('click', e => {
    
        const eventTarget = e.target;
    
        //check if we clicked on `PREV` or NEXT` buttons
        if (!(eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`) || eventTarget.classList.contains(`${DOMstrings.stepNextBtnClass}`)))
        {
        return;
        }
    
        //find active panel
        const activePanel = findParent(eventTarget, `${DOMstrings.stepFormPanelClass}`);
    
        let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);
    
        //set active step and active panel onclick
        if (eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`)) {
        activePanelNum--;
    
        } else {
    
        activePanelNum++;
    
        }
    
        setActiveStep(activePanelNum);
        setActivePanel(activePanelNum);
    
    });

    $('.see_password').click(function (ev) { 
        const inputPassword = $(ev.currentTarget).parent(".input-group").find(".see_password_input");
        if ($(ev.currentTarget).find("i").hasClass("fa-eye-slash")) {
            $(ev.currentTarget).find("i").addClass("fa-eye").removeClass("fa-eye-slash");
            inputPassword.get(0).type = "password";
        } else {
            $(ev.currentTarget).find("i").addClass("fa-eye-slash").removeClass("fa-eye");
            inputPassword.get(0).type = "text";
        }
      })

    $(".emoji").click(function (e) { 
        e.preventDefault();

        var count = getfakelenght($('#automation_text_ws').text())
        var added = $(this).text().length
        var extras = 0

        if(count+extras+added < 1000){

            let text = getText("automation_text_ws")+$(this).text()
            restore_html_from_text(text,true)

            var el = document.getElementById('automation_text_ws')
            placeCaretAtEnd(el)
            $('#automation_count_ws').text(count+extras+added);
            $(".baloon-container").addClass('d-none')
        }
    });

    $("#list-send").change(function (e) { 
        if($(this).val() == "1"){
            $("#tabone").prop('checked', true);
            $(".texteditor-whatsapp").removeClass("d-none")
        }else{
            $("#tabtwo").prop('checked', true);
            $(".texteditor-whatsapp").addClass("d-none")
        }
    });

    $(".direct").click(function (e) { 
        e.preventDefault();
        const eventTarget = e.target;
        if (eventTarget.classList.contains(`torecipient`)) {
            setActiveStep(2);
            setActivePanel(2);
        } else if(eventTarget.classList.contains(`tomsg`)){
            setActiveStep(4);
            setActivePanel(4);
        }
    });

    $(".direct-tosend").click(function (e) { 
        setActiveStep(3);
        setActivePanel(3);
    });

    $(".toname").click(function (e) { 

        e.preventDefault();
        let value = $("#list-send").val()
        let text = $("#automation_text").text()
        let text_ws = $("#automation_text_ws").text()
        $("#automation-text").removeClass('border-red')
        $("#automation-text_ws").removeClass('border-red')
        $("#text-error").addClass('d-none')
        $("#text-error_ws").addClass('d-none')
        
        if(value == '0' || !value){//case if sms

            if(!text || text == ""){

                $("#text-error").removeClass('d-none')
                $("#text-error small").text('Este campo no puede estar vacio')
                $("#automation-text").addClass('border-red')
                return false
            }
        }else{//case if whatsapp


            if(text_ws == null || text_ws == false || text_ws === ""){

                $("#text-error_ws").removeClass('d-none')
                $("#text-error_ws small").text('Este campo no puede estar vacio')
                $("#automation-text_ws").addClass('border-red')
                $("#tabtone").prop('checked', true);
                return false
            }

            if(!text || text == ""){
                $("#text-error").removeClass('d-none')
                $("#text-error small").text('Es necesario que configures este campo, así, en caso de que no podamos entregar tu mensaje por WhatsApp usaremos este medio')
                $("#automation-text").addClass('border-red')
                $("#tabtwo").prop('checked', true);
                return false
            }
        }
    });


    $(".create-automation").click(function (e) { 
        e.preventDefault();
    
        let shop = $("#globalShopName").val();
        let token = $("#globalToken").val();
        let apikey = $("#globalApikey").val();
    
        let name = $("#automation_name").val();
        let type = $("#list-type").val();
        let recipient = $("#list-recipient").val();
        let text = $("#automation_text").text()
        let text_ws = getText("automation_text_ws");
        let delay = $("#timelapse").val();
        let lapse = $("#list-time").val();
        let limit = $("#limit_input").prop('checked');
        let whatsapp = $("#list-send").val();
    
        let btn = $(this);
    
        if (!delay) delay = "days";
    
        if (text && text.trim() !== "") {
            if (getfakelenght(text) <= 160) {
                if (name && name.trim() !== "") {
                    if (name.length <= 150) {
                        if (!(recipient == 1 && (!render_country || !render_number))) {
                            if (type && recipient) {
                                if (!(whatsapp == "1" && (!text_ws || text_ws.trim() === ""))) {
                                    if (!(type === "suscripcion" || type === "upsell")) {
                                        if (!((type === "winback" && lapse !== "days") || (type === "cash-od" && lapse !== "days"))) {
    
                                            // AVISO EXTENSION WOOCOMMERCE
                                            if(type == "abandoned" && $("#isextensionactive").val() != "1"){
                                                swal({
                                                    title: "!Atención!",
                                                    text: 'Para esta automatizacion es necesario que cuentes con la extensión de woocommerce para carritos abandonados, si no la tienes puedes descargarlo aquí',
                                                    icon: "warning",
                                                    buttons: {
                                                        cancel : 'Entendido',
                                                        confirm : {text:'Descargar',className:'swal-btn'}
                                                        }
                                                    }).then(function(isConfirm) {
                                                        if (isConfirm){
                                                            window.location.href = "https://downloads.wordpress.org/plugin/woocommerce-abandoned-cart.zip"
                                                        }
                                                    })
                                            }
    
                                            btn.prop("disabled", true).html('<i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i> Cargando...');
    
                                            let url_request = "https://pluginssandbox.smsmasivos.com.mx/wp/automation/create";
                                            let automationid = btn.attr("data-id");
    
                                            if (btn.attr("data-edit") == "1") {
                                                url_request = "https://pluginssandbox.smsmasivos.com.mx/wp/automation/edit_general";
                                                $(".create-automation").attr("data-edit", 0).attr("data-id", 0);
                                                $("#list-type").attr("disabled", false).niceSelect('update');
                                            }
    
                                            $.ajax({
                                                type: "POST",
                                                url: url_request,
                                                dataType: "json",
                                                data: {
                                                    shop: shop,
                                                    name: name,
                                                    type: type,
                                                    recipient: recipient,
                                                    text: text.replace(/\s+/g, ' ').replace(/ ,+/g, ','),
                                                    text_ws: text_ws,
                                                    apikey: apikey,
                                                    token: token,
                                                    lapse: lapse,
                                                    delay: delay,
                                                    limit: limit,
                                                    whatsapp: whatsapp,
                                                    automationid: automationid
                                                },
                                                success: async function (response) {
                                                    btn.prop("disabled", false).html('Crear');
                                                    $('#automations-details').modal('hide');
                                                    if (response.success) {
                                                        let list = await refresh();
                                                        $(".totype").click();
                                                        $("#automation_name").val("");
                                                        present_msg = null;
                                                        if (url_request === "https://pluginssandbox.smsmasivos.com.mx/wp/automation/edit_general") {
                                                            showToast("La automatización se actualizó correctamente.", "success");
                                                        } else {
                                                            showToast("La automatización se creó correctamente.", "success");
                                                        }
                                                        $.ajax({
                                                            type: "POST",
                                                            url: ajax_object.ajaxurl,
                                                            data: {
                                                                action: 'sms_set_automations',
                                                                list: list,
                                                                nonce: $('#globalNonce').val(),
                                                            },
                                                            dataType: "JSON",
                                                            success: function (data) {
                                                                console.log('Automatizaciones sincronizadas.');
                                                            }
                                                        });
                                                    } else {
                                                        showToast(response.message || "Ocurrió un error desconocido.", "error");
                                                    }
                                                },
                                                error: function (error) {
                                                    btn.prop("disabled", false).html('Crear');
                                                    showToast("Algo salio mal, Intenta más tarde. code: AC001", "error");
                                                }
                                            });
    
                                        } else showToast( "El tiempo configurado no es válido para este tipo de automatización. Por favor ajústalo de nuevo.", "warning");
                                    } else showToast("Este evento aún no está disponible. Muy pronto podrás usarlo.", "warning");
                                } else showToast("Configura el mensaje de WhatsApp que será enviado al cliente.", "warning");
                            } else showToast("Completa todos los pasos antes de continuar.", "warning");
                        } else showToast("Debes configurar el número del administrador de la tienda antes de continuar.", "warning");
                    } else showToast("El nombre excede el límite máximo de 150 caracteres.", "warning");
                } else showToast("El nombre no puede estar vacío.", "warning");
            } else showToast("El mensaje SMS excede el límite máximo de 160 caracteres.", "warning");
        } else showToast( whatsapp == "1" ? "Configura un mensaje SMS. Se usará si no es posible entregar la notificación por WhatsApp." : "El mensaje no puede estar vacío.", "warning");
    });
    

    $("#btn_msg_automation").click(function (e){
        
        e.preventDefault();
        let id = $(this).data("id")
        let msg = $("#textarea_msg_automation").val()
        
        $(`#id-auto-${id} a`).attr("onclick",`editmsg(${id},'${msg}')` );
        autoedit(id,"msg",msg)
        
        $("#modal_msg_automation").modal('hide')

    })

    $("#btn-automations-details").click(function (e) { 
        $("#list-type").attr("disabled",false).niceSelect('update')
        
        e.preventDefault();


        if(!render_country || !render_number){

            $('li[data-value="admin"]').addClass('disabled');
            if($("#list-type").val() == "abandoned" || $("#list-type").val() == "winback" || $("#list-type").val() == "f-created")
                $(".note-red").addClass('d-none')
            else
                $(".note-red").removeClass('d-none')
        }else{

            $('li[data-value="admin"]').removeClass('disabled');
            if($("#list-type").val() == "abandoned" || $("#list-type").val() == "winback" || $("#list-type").val() == "f-created")
                $(".note-red").addClass('d-none')
            else
                $(".note-red").removeClass('d-none')
        }
        
        $(".totype").click()

        $("#automations-details").modal("show")
        DOMstrings.stepsForm.style.height = $("#list-type").val() !="abandoned" ? `300px` : "323px";

        $('#automation_text_ws').html("")
        var count = getfakelenght($('#automation_text').text())
        $('#automation_count').text(count);

    });

    $(".totime").click(function (e) { 

        e.preventDefault();
        let el = ''
        let event = $("#list-type").val()

        let local_delay = $("#list-time").val()
        let allowed_option = true


        $('.help-time').addClass('d-none')
        $("#list-time").html('<option id="minutes" value="minutes">Minuto/s</option>'
                             +'<option id="hours" value="hours">Hora/s</option>'
                             +'<option value="days">Día/s</option>')
        $("#tag-tiempo").text("Selecciona el tiempo adecuado para el envío de tus SMS.")

        if(event == "winback" || event == "abandoned" || event == "cash-od"){

            $(".right").removeClass("d-none")
            $("#timelapse").addClass("timelapse-forced").attr("disabled",false).removeClass("d-none")
            $(".auto").addClass("d-none")

            if(event == "winback" || event == "cash-od"){
                
                $("#hours").attr("disabled",true).addClass("d-none")
                $("#minutes").attr("disabled",true).addClass("d-none")
                $("#list-time").html('<option value="days">Día/s</option>')

                if(local_delay != "days")
                    allowed_option = false

                if(event == "cash-od")
                    $("#tag-tiempo").text("Selecciona el periodo que tendrá tu cliente para confirmar su orden")
            }

            if(event == "winback"){
                $('.help-time').removeClass('d-none')
            }
            
            
        }else{
            $(".right").addClass("d-none")
            $("#timelapse").removeClass("timelapse-forced").attr("disabled",true).val(1).addClass("d-none")
            $(".auto").removeClass("d-none")
        }

        let now = 30
        if($("#timelapse").val()) now = $("#timelapse").val()
        
        if(present_delay){
            $('#list-time').val(present_delay).niceSelect('update');
            present_delay = null
        }else{
            
            if(allowed_option){
                $('#list-time').val(local_delay).niceSelect('update');
            }else 
                $('#list-time').niceSelect('update');
        }

        if($("#list-time").val() == "minutes" && $('#list-type').val() == "abandoned"){

            $("#timelapse").prop("min","10").prop("step",10).prop("value",now).prop("max",60)
        }else{
            $("#timelapse").prop("min","1").prop("step",1).prop("max",30).prop("value",now)
        }
        

    });

    $(".torecipient").click(function(e){
        let current_state = $("#list-recipient").val()
        e.preventDefault();
        $("#list-recipient").html('<option value="customer">Cliente</option>'
                                +'<option id="value-admin" value="admin">Admin</option>')
        let type = $("#list-type").val()
        if( type == "winback" || type == "f-created" || type == "f-updated" || type == "abandoned")
            $("#list-recipient").html('<option value="customer">Cliente</option>')
        
        if(current_state)
            $("#list-recipient").val(current_state).niceSelect('update');
        else
            $('#list-recipient').niceSelect('update');

        if($("#list-type").val() == "abandoned" || $("#list-type").val() == "winback" || $("#list-type").val() == "f-created")
            $(".note-red").addClass('d-none')
        else
            $(".note-red").removeClass('d-none')
        
    })

    $(".tomsg").click(function (e){

        e.preventDefault();
        if(present_msg) return

        let el = ''
        switch ($("#list-type").val()) {


            case "new_order":
                el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span> gracias por comprar con nosotros. Tu pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> fue confirmado y pronto sera enviado';   
                if($("#list-recipient").val() == "admin")       
                    el = 'Tienes un nuevo pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> por un total de <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {total}</span>';  
            break;

            case "o-pending": 
            el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra con pago pendiente';   
            if($("#list-recipient").val() == "admin")       
                el = 'El estatus del pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra pendiente de pago';  
            break;

            case "o-onhold":
                el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra esperando confirmacion de pago';   
                if($("#list-recipient").val() == "admin")       
                    el = 'El estatus del pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> se encuentra esperando confirmacion de pago';  
            break;

            case "o-completed":
                el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> fue completada';   
                if($("#list-recipient").val() == "admin")       
                    el = 'El estatus del pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> cambio a completado';  
            break;

            case "o-cancelled":
                el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, sentimos que no pudieras comprar con nosotros. Tu orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> tu orden fue cancelada';   
                if($("#list-recipient").val() == "admin")       
                    el = 'El pedido <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> fue cancelado';  
            break;

            case "f-created":
                el = 'Tu pedido esta en camino a <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {direccion_de_envio}</span>'
                +' puedes rastrearlo con el codigo <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {numero_de_rastreo}</span>'         
            break;

            case "cash-od":
                el = 'Orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> creada exitosamente. Ingresa a <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url_confirmacion}</span> en los sig 3 dias para confirmar o se cancelara';   
                if($("#list-recipient").val() == "admin")     
                    el = 'La orden <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {order_id}</span> confirmo su numero exitosamente, puedes proceder con el envio';   
            break;

            case "winback":
                el = 'Hola <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, ha pasado un tiempo desde tu ultima orden, Obten 5% de descuento con el codigo VUELVE, ingresa a'
                +'<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span>'
            break;

            case "feedback":
                el = 'Hey <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, gracias por tu compra. Te gusto tu pedido?, nos gustaria conocer tu opinion, ingresa a <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span> ';        
                if($("#list-recipient").val() == "admin")
                    el = '<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span> recibio su pedido y dejo un comentario, puedes verlo en <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span>';   
            break;

            case "abandoned":
                el = 'Hola <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>, te recordamos que aun tienes articulos en tu carrito. Entra a '
                +'<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span> para continuar tu compra'
                if($("#list-recipient").val() == "admin")  
                    el = 'El cliente <span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span> abandono su carrito de compra entra a '
                    +'<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {url}</span> para ver el checkout'
            break;

            default:
                break;
        }

        present_msg = el
        $("#automation_text").html(el)
        $("#automation_text_ws").html(el)
        $('#automation_count').text(getfakelenght($('#automation_text').text()));
        $('#automation_count_ws').text(getfakelenght($('#automation_text_ws').text()));
        availabletags()
    })        

    $('#shortcodes').click(function (e) { 
        e.preventDefault();
        let el = $("#shortcode_tags")
        if(el.hasClass('d-none'))
            $("#shortcode_tags").removeClass('d-none')
        else 
            $("#shortcode_tags").addClass('d-none')

        availabletags()
    });

    $('#shortcodes_ws').click(function (e) { 
        e.preventDefault();
        let el = $(".baloon-container");
        if (el.hasClass("d-none")) $(".baloon-container").removeClass("d-none");
        else $(".baloon-container").addClass("d-none");
        $("#shortcode_tags span").removeClass("tag-disabled");

        availabletags(true)
    });



    $('#automation_text_ws').keypress(function(e) {

        if($(this).text() == "") $(this).html("")

        let count = getfakelenght($(this).text())

        if(count < 1000){
            if (e.key === 'Enter' || e.keyCode === 13) {
                document.getElementById('automation_text_ws').focus();
                //pasteHtmlAtCaret('<span class="d-none helper"><span>{blank_space}</span></span>');
            }
        }

        return (count < 1000);
    }).on({
        'paste': function(e) {
        var len = getfakelenght($(this).text()),
            cp = e.originalEvent.clipboardData.getData('text');
        if (len < 1000)
            this.innerHTML += $('<span/>').text(cp.substring(0, 1000 - len)).html();
        return false;
        },
        'drop': function(e) {
        e.preventDefault();
        e.stopPropagation();
        }
    });

    $('#automation_text').keypress(function(e) {
        

        let count = getfakelenght($(this).text())

        if(count < 160){
            if (e.key === 'Enter' || e.keyCode === 13) {
                document.getElementById('automation_text').focus();
                pasteHtmlAtCaret('<span class="d-none">{blank_space}</span>');
            }
        }

        return (count < 160);
    }).on({
        'paste': function(e) {
        var len = getfakelenght($(this).text()),
            cp = e.originalEvent.clipboardData.getData('text');
        if (len < 160)
            this.innerHTML += $('<span/>').text(cp.substring(0, 160 - len)).html();
        return false;
        },
        'drop': function(e) {
        e.preventDefault();
        e.stopPropagation();
        }
    });

    $('#automation_text').keyup(function(){
        var count = getfakelenght($(this).text())
       $('#automation_count').text(count);
    });

    $('#automation_text_ws').keyup(function(){
        var count = getfakelenght($(this).text())
       $('#automation_count_ws').text(count);
    });

    $('#list-time').on('change', function() {

        if($(this).val() == "minutes" && $('#list-type').val() == "abandoned"){
            $("#timelapse").prop("min","10").prop("step",10).prop("max",60)
        }else if($("#list-time").val() == "hours" && $('#list-type').val() == "abandoned"){
            $("#timelapse").prop("min","1").prop("step",1).prop("value",24).prop("max",24)
        }else{
            $("#timelapse").prop("min","1").prop("step",1).prop("max",30)
        }
    });

    $('#list-type').on('change', function() {
        let el = ''
        switch ($(this).val()) {

            case "new_order":
                el = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-cliente-j661jd/"">Ver guía paso a paso</a>'
                if($("#list-recipient").val() == "admin")  
                    el = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-administrador-11mpyl5/">Ver guía paso a paso</a>'
            break;

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
                break;

            case "cash-od":
                el = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-clientes-1ltxjwt/">Ver guía paso a paso</a>'    
                if($("#list-recipient").val() == "admin")  
                    el = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-administrador-14xujps/">Ver guía paso a paso</a>'    
            break;

            case "winback":
                el = '¿Tienes clientes que quieres que te compren de nuevo? Mantenerte presente y enviarles promociones periódicas después de cierto tiempo de su última compra es muy fácil. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recuperacion-del-cliente-4dcg2p/">Ver guía paso a paso</a>'
                break;

            case "feedback":
                el = 'Obtener reseñas de tus productos nunca fue tan fácil, tan pronto como se entrega el pedido tu cliente recibirá un link en donde podrá capturar su reseña y esta se publicará directamente en tu tienda generando confianza con el resto de tus clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-cliente-1mmk5bz/">Ver guía paso a paso</a>'     
                if($("#list-recipient").val() == "admin")
                    el = 'Recibirás un SMS cuando tu cliente deje su reseña y esta se publicará directamente en el pedido de tu tienda. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-administrador-3dp4fy/">Ver guía paso a paso</a>'    
            break;

            case "abandoned":
                el = 'Se activa cuando un cliente abandona un carrito de compra. Te recomendamos configurar un tiempo de retraso mínimo de 30 minutos para darle tiempo al cliente de que termine el proceso antes de considerarlo un abandono. Para aumentar la efectividad, crea múltiples automatizaciones en diferentes periodos de tiempo. Por ejemplo, una hora después de que un cliente abandona un carrito, 24 horas y 3 días después. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'
                if($("#list-recipient").val() == "admin")
                    el = 'Enterate de todo lo que pasa con tus usuarios al momento de comprar. Estarás recibiendo un SMS con una notificación indicando que han abandonado un carrito en tu tienda en línea, así podrás tomar acción de la mano de la automatización para carritos abandonados para clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'  
            break;

            default:
                break;
        }

        present_msg = null

        $("#indicaciones").html(el)

        setActivePanel(0);
    });

    $("#cancel-automation").click(function (e) { 
        e.preventDefault();

        swal({
            title: "¡Atención!",
            text: '¿Estás seguro de que quieres cancelar esta automatización? Se perderá tu avance.',
            icon: "warning",
            buttons: {
                skip : {text:'Continuar',className:'swal-btn'},
                confirm : {text:'Sí, cancelar',className:'swal-button--cancel'}
              }
            }).then(function(isConfirm) {
              if (isConfirm === true) {
                $(".totype").click()
                $("#automation_name").val("")
                present_msg = null
                $("#automations-details").modal("hide")
              }
            })
        
    });

    $( "#shortcode_tags" ).mouseleave(function() {
        if(close)
            $("#shortcode_tags").addClass('d-none')
        
    });

    $( "#shortcode_tags_ws" ).mouseleave(function() {
        if(close_ws)
            $(".baloon-container").addClass('d-none')
    });

    $('#login-boton').click(function (e) { 
        let noti = $(".notification")
        let btnLogin = $(this)
        noti.html()
        e.preventDefault();
        let useremail = $("#useremail").val()
        let userpass = $("#userpassword").val()
        if(useremail && userpass){
          userpass = calcMD5(userpass).toLowerCase();
          useremail = calcMD5(useremail).toLowerCase().trim()
          $.ajax({
            beforeSend: () => { btnLogin.html('<i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true"></i> Procesando ...').prop("disabled", true).css("opacity", 0.5); },
            url: "https://pluginssandbox.smsmasivos.com.mx/wp/login",
            type: "POST",
            data: { user: useremail, pass: userpass, shop: shop, token: $("#globalToken").val()},
            dataType: "json",
            success: function (response) {
              btnLogin.html('Inicia sesión').prop("disabled", false).css("opacity", 1);
              if(response.success){
                $(".step2").click()

                $('#credits').text(response.credits)

                $('.country').find('option[value="'+response.country+'"]').prop('selected', true);
                $('#country').niceSelect('update');
                $("#phone_number").val(response.number)
                noti.html()

                if($("#userstatus").val() == "administrator"){

                    $.ajax({
                        type: "POST",
                        url: ajax_object.ajaxurl,
                        dataType: "json",
                        data:{
                            action:      'woocommerce_update_api_key',
                            security:    $('#globalNonce_apikey').val(),
                            key_id:      0,
                            description: 'SMS MASIVOS PLUGIN AUTO KEYS',
                            user:        '1',
                            permissions: 'read_write'
                        },
                        success: function (res) {
                            if(res.data && res.data.consumer_key){
                                $.ajax({
                                    type: "POST",
                                    url: ajax_object.ajaxurl,
                                    data : {
                                        action : 'sms_set_apikey',
                                        apikey : response.apikey,
                                        nonce: $('#globalNonce').val(),
                                        cs:res.data.consumer_secret,
                                        ck:res.data.consumer_key,
                                        shop:$("#globalShopName").val(),
                                        token:$("#globalToken").val(),
                                    },
                                    dataType: "JSON",
                                    success: async function (data) {
                                        $("#globalApikey").val(response.apikey)
                                        await refresh()
                                    },error: function (error){
                                        showToast("Algo salio mal, Intenta más tarde. code: LG001",'error')
                                    }
                                });
                            }else{
                                $("#user_no_admin").removeClass("d-none")
                                active_keys = false
                            }

                        },
                        error:function(error){
                            showToast("Algo salio mal, Intenta más tarde. code: LG002",'error')
                        }
                    });
                }else{

                    $("#user_no_admin").removeClass("d-none")
                    user_no_admin = false

                    $.ajax({
                        type: "POST",
                        url: ajax_object.ajaxurl,
                        data : {
                            action : 'sms_set_apikey',
                            apikey : response.apikey,
                            nonce: $('#globalNonce').val(),
                            cs:null,
                            ck:null
                        },
                        dataType: "JSON",
                        success: async function (data) {
                            $("#globalApikey").val(response.apikey)
                            await refresh()
                        },error: function (error){
                            showToast("Algo salio mal, Intenta más tarde. code: LG003",'error')
                        }
                    });
                }

              }else 
                noti.html('<div class="alert alert-warning"><i class="fa fa-info float-right"></i>'+response.message+'</div>')

            },error: function (error){
              btnLogin.html('Inicia sesión').prop("disabled", false).css("opacity", 1);
              showToast("Algo salio mal, Intenta más tarde. code: LG004",'error')
            }
          })
        }else
          noti.html('<div class="alert alert-warning"><i class="fa fa-info float-right"></i>Campos obligatorios</div>')

    });

    $('#save').click(()=>{

        let country         =  $("#country").val()
        let number          =  $("#phone_number").val()
        let last_credits    =  $("#last_credits").prop('checked')
        let sync_agenda     =  $("#save_contacts").prop('checked')
        
        if(country != null && country != ''){
            if(number.length < 7 || number.length > 11 || isNaN(number) ){
                showToast("Atención!","Ingresa un número válido",'error')
                return
            }
        }else{
            showToast("Selecciona tu país",'error')
            return
        }

        $.ajax({
            url: 'https://pluginssandbox.smsmasivos.com.mx/wp/set',
            type:'POST',
            datatype: 'json',
            data : { 
                shop:$("#globalShopName").val(),
                apikey:$("#globalApikey").val(),
                token:$("#globalToken").val(),
                country:country,
                number:number,
                last_credits:last_credits,
                sync_agenda: sync_agenda  
            },
            success: (response)=>{
                if (response.success)
                    showToast("El celular del administrador se configuró correctamente.",'success')
                else
                    showToast(response.message,'error')
            },error: function(reason) {
                showToast("Algo salio mal, Intenta más tarde. code: SA001",'error')
            }
        })
    });     

});

function load(){

    $.ajax({
        type: "POST",
        url: "https://pluginssandbox.smsmasivos.com.mx/wp",
        data: {shop: $("#globalShopName").val(),apikey:$("#globalApikey").val(),token:$("#globalToken").val()},
        dataType: "JSON",
        success: async function (response) {
            if(response.success){
                if(!response.login){
                    $('#modal_register').modal('show')
                }else{
                    $(".step2").click()


                    $('#credits').text(parseInt(response.credits).toLocaleString())
                    $('.country').find('option[value="'+response.country+'"]').prop('selected', true);
                    $('#country').niceSelect('update');
                    $("#phone_number").val(response.number)
                    $("#last_credits").prop('checked',response.last_credits)
                    $("#save_contacts").prop('checked',response.sync_agenda == 1)
                    $(".agendalink").attr("href","https://app.smsmasivos.com.mx/contactos?agenda="+response.agendaid)

                    if(!response.keys){
                        $("#user_no_admin").removeClass("d-none")
                        active_keys = false
                    }else active_keys = true

                    let cl = response.list

                    $('#country option').each(function() {
                        if($(this).attr("value")){
                            if(!cl.includes(Number($(this).attr("value")))){
                                $(this).remove()
                            }
                        }
                    });
                
                    $('#country').niceSelect('update');
                    
                    let list = await refresh()

                    $.ajax({
                        type: "POST",
                        url: ajax_object.ajaxurl,
                        data : {
                            action : 'sms_set_automations',
                            list: list,
                            nonce: $('#globalNonce').val(),
                        },
                        dataType: "JSON",
                        success: function (data) {
                            console.log('ok')
                        }
                    });
                    
                }
            }else showToast(response.message,'error') 
        },error: function (error){
            showToast("Algo salio mal, Intenta más tarde. code: LO001",'error')
            console.log(error);
        }
    });
    
}

function refresh() {
    return new Promise(async (resolve, reject) => {
        const $tableContainer = $('.table-container');
        const $listBody = $("#list-body");


        $tableContainer.addClass('table-loading');

        if ($tableContainer.find('.table-overlay').length === 0) {
            $tableContainer.append(
                `<div class="table-overlay">
                    <i class="fa-light fa-spinner-third fa-spin icon-center color-secondary" aria-hidden="true" style="font-size:48px"></i>
                </div>`
            );
        }

        $listBody.find('button, a, input[type="checkbox"]').prop('disabled', true);

        global_list = [];

        $.ajax({
            type: "POST",
            url: "https://pluginssandbox.smsmasivos.com.mx/wp/automation/get",
            data: { 
                shop: $("#globalShopName").val(),
                apikey: $("#globalApikey").val(),
                token: $("#globalToken").val()
            },
            dataType: "JSON",
            success: function (response) {
                $listBody.html('');
                if (response.success) {
                    let i = 0, recipient = 0;
                    if (response.list && response.list.length > 0) {
                        $(".empty").addClass('d-none');
                    }
                    global_list = response.list;
                    response.list.forEach(element => {
                        let recomendation = '', clicks = 0;
                        if (response.clicks && response.clicks.length > 0) {
                            response.clicks.forEach(e => {
                                if (e.automation == element.id) clicks = e.count;
                            });
                        }
                        if (element.status == 0 && [2, 4, 6, 7].includes(element.type))
                            recomendation = '<span class="recomendation">Recomendada</span>';
                        let whatsapp_active = element.whatsapp ? 'text-whatsapp-main' : '';
                        let warning_ac = '', warning_ac_button = '';
                        if (element.type == 6 && $("#isextensionactive").val() != "1" && element.status == 1) {
                            warning_ac = "warning_ac";
                            warning_ac_button = '<a onclick="open_issues()" type="button" class="btn btn-rounded btn-sm pulsingButton"><i class="fas fa-question"></i></a>';
                            let info_claves = active_keys
                                ? '<i class="gn-icon fa fa-check text-success float-left" style="height: 25px;"></i><p> Claves acceso WP configuradas correctamente</p>'
                                : '<i class="gn-icon fa fa-times text-warning float-left" style="height: 25px;"></i> <p>Es necesario configurar manualmente las claves de acceso a WP</p>';
                            $(".info-claves").html(info_claves);
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
                        );
                        $listBody.append(a);
                        $(`#id-auto-${element.id} input`).prop('checked', element.status == 1);
                        if (element.recipient == 1) recipient++;
                    });
                    check_whatsapp_instance_status();
                }
            },
            error: function (error) {
                $listBody.html('');
            },
            complete: function () {
                $tableContainer.removeClass('table-loading');
                $tableContainer.find('.table-overlay').remove();
                $listBody.find('button, a, input[type="checkbox"]').prop('disabled', false);
                resolve(global_list);
            }
        });
    });
}


function availabletags(whatsapp = false){
   
    //$('#shortcode_tags span').addClass('d-none')
    $('#shortcode_tags, #taglist').removeClass('baloon-forced baloon-forced-2 baloon-forced-3 baloon-forced-4 baloon-forced-5 baloon-forced-6 baloon-forced-7' )
    //$('.special_tag').addClass('d-none')

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

        
    if(whatsapp){
         $('#taglist').html(tags)
         $("#shortcode_tags").addClass('d-none')
    }else{
        $('#shortcode_tags').html(tags)
        $(".baloon-container").addClass("d-none");
    }

    //$('#shortcode_tags span, #taglist span').addClass('tag-disabled')
    $('#shortcode_tags').removeClass('baloon-forced')
    $('.special_tag').addClass('d-none')

    switch ($("#list-type").val()) {

        case "new_order":
        case "o-pending":
        case "o-onhold":
        case "o-completed":
        case "o-cancelled":
            $("#shortcode_tags").addClass('baloon-forced-2')
            $("#_nombre").removeClass('d-none');
            $("#_order").removeClass('d-none');
            $("#_status").removeClass('d-none');
            $("#_currency").removeClass('d-none');
            $("#_total").removeClass('d-none');
            $("#_gateway").removeClass('d-none');
            $("#_shipping_address").removeClass('d-none');
            $("#_creacion").removeClass('d-none');
            $("#_email").removeClass('d-none');
            $("#_telefono").removeClass('d-none');

            
        break;


        case "f-created":
            $("#shortcode_tags").addClass('baloon-forced-3')
            $("#_nombre").removeClass('d-none');
            $("#_order").removeClass('d-none');
            $("#_shipping_address").removeClass('d-none');
            $("#_company").removeClass('d-none');
            $("#_tracking_number").removeClass('d-none');    
            
        break;

        case "cash-od":
            $("#shortcode_tags").addClass('baloon-forced-4')
            $("#_nombre").removeClass('d-none');
            $("#_order").removeClass('d-none');
            $("#_status").removeClass('d-none');
            $("#_currency").removeClass('d-none');
            $("#_total").removeClass('d-none');
            $("#_gateway").removeClass('d-none');
            $("#_shipping_address").removeClass('d-none');
            $("#_creacion").removeClass('d-none');
            $("#_email").removeClass('d-none');
            $("#_url_confirmacion").removeClass('d-none');
        break;

        case "winback":

            $("#shortcode_tags").addClass('baloon-forced-5')
            $("#_nombre").removeClass('d-none');
            $("#_email").removeClass('d-none');
            $("#_apellido").removeClass('d-none');
            $("#_telefono").removeClass('d-none');
            $("#_ordenes").removeClass('d-none');
            $("#_url").removeClass('d-none');
            $("#_creacion").removeClass('d-none');
            $("#_shipping_address").removeClass('d-none')
        break;

        case "feedback":
            $("#shortcode_tags").addClass('baloon-forced-6')
            $("#_nombre").removeClass('d-none');
            $("#_order").removeClass('d-none');
            $("#_currency").removeClass('d-none');
            $("#_total").removeClass('d-none');
            $("#_gateway").removeClass('d-none');
            $("#_creacion").removeClass('d-none');
            $("#_email").removeClass('d-none');
            $("#_apellido").removeClass('d-none');
            $("#_url").removeClass('d-none');
        break;

        case "abandoned":
            $("#shortcode_tags").addClass('baloon-forced-7')
            $("#_nombre").removeClass('d-none');
            $("#_apellido").removeClass('d-none');
            $("#_total").removeClass('d-none');
            $("#_email").removeClass('d-none');
            $("#_items_count").removeClass('d-none');
            $("#_checkout_created").removeClass('d-none');
            $("#_url").removeClass('d-none');
        break;


        default: break;
    }   

    $('#shortcode_tags span').click(function (e) { 
    
        e.preventDefault();
        
        if($(this).hasClass("tag-disabled")) return;

        var count = getfakelenght($('#automation_text').text())
        var extras = $(this).data("value")
        var added = $(this).text().length

        if(count+extras+added < 160){

            let text = getText("automation_text")+" "+$(this).text()+" "
            restore_html_from_text(text)
            
            var el = document.getElementById('automation_text')
            placeCaretAtEnd(el)
            $('#automation_count').text(count+extras+added);
            $("#shortcode_tags").addClass('d-none')
        }else showToast('El mensaje ya es demasiado largo para agregar el campo personalizado','error')

    });

    $('#shortcode_tags_ws span').click(function (e) { 

        close_ws = true
        e.preventDefault();
        if($('#automation_text_ws').text() == "") $('#automation_text_ws').html("") 

        if($(this).hasClass("tag-disabled") || $(this).hasClass("emoji")) return;

        var count = getfakelenght($('#automation_text_ws').text())
        var extras = $(this).data("value")
        var added = $(this).text().length

        if(count+extras+added < 1000){

            let text = getText("automation_text_ws")+" "+$(this).text()+" "
            restore_html_from_text(text,true)

            var el = document.getElementById('automation_text_ws')
            placeCaretAtEnd(el)
            $('#automation_count_ws').text(count+extras+added);
           // $(".baloon-container").addClass('d-none')
        }else showToast('El mensaje ya es demasiado largo para agregar el campo personalizado','error')

    });
}

function getText(global_object){
    var ce = $("<pre />").html($("#" + global_object).html());
    if ($.browser && $.browser.webkit)
      ce.find("div").replaceWith(function () {
        return "\n" + this.innerHTML;
      });
    ce.find("div").replaceWith(function () {
      return "\n" + this.innerHTML;
    });
    if ($.browser && $.browser.msie)
      ce.find("p").replaceWith(function () {
        return this.innerHTML + "<br>";
      });
    if ($.browser && ($.browser.mozilla || $.browser.opera || $.browser.msie)) ce.find("br").replaceWith("\n");

    var text = ce.text().trim();
    text = text.replace(/ ,+/g, ",");
    text = text.replace("  ", " ");

    return text;
}

function getLength(text){
    try {
        if(!text) return 0;
        text = text.replace(/\s+/g, ' ')
        text = text.replace(/ ,+/g, ',')
        return text.length
    } catch (error) {
        return 0;
    }
}

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function closetag(e){
    let a = e.closest('span')
    a.remove()
    var count = getfakelenght($('#automation_text').text())
    $('#automation_count').text(count);
    $('#automation_count_ws').text(getfakelenght($('#automation_text_ws').text()));
}

function closetag_ws(e){
    let a = e.closest('span')
    a.remove()
    var count = getfakelenght($('#automation_text_ws').text())
    $('#automation_count_ws').text(count);
}

function showinfo(id,type,envio,msg = '',){
    let info_text= ''
    let info_message = msg
    let info_number = ''

    envio = envio ? 'SMS' :' WhatsApp' 

    if(id) {//admin
            info_text = "Esta automatización te tiene a ti como destinatario, recibirás notificaciones SMS de tus automatizaciones";
            info_number = render_number

    }else{ //customer
            info_text = `Esta automatización tiene como destinatario a tus clientes, los mensajes llegarán a sus números de celular vía <span class="text-red-1">${envio}<span> `;
            if(type == "2")
                info_text = `Esta automatización tiene como destinatario a tus clientes, los mensajes llegarán a sus números de celular vía <span class="text-red-1">${envio}<span> <br><b class='text-warning'>Asegúrate de solicitar el número de teléfono de tus clientes al momento de registrarse para hacer efectiva la automatización</b>`;
            info_number = "El número de telefono del cliente"
    }

    $("#info_text").html(info_text)

    $("#info_recipient_number").text(info_number)
    $("#info_message").text(info_message)
    $("#modal_msg_info").modal("show")
}

function editmsg(id,msg){
    
    $("#btn_msg_automation").data("id",id)
    $("#textarea_msg_automation").val(msg)
    $("#modal_msg_automation").modal('show')

}

function autoedit(id,cmd,options = null,type = null){
    
    let e = null
    let shop = $("#globalShopName").val()
    let token = $("#globalToken").val()
    let apikey = $("#globalApikey").val() 

    if(cmd == "status"){

        e = $(`#id-auto-${id} input`)
        if(type == "2" && e.prop('checked'))
            showToast("Asegúrate de solicitar el número de teléfono de tus clientes al momento de registrarse para hacer efectiva la automatización",'success') 

        options = e.prop('checked')
        e.prop("disabled",true).addClass('opa5')
       

        if(type == "6" &&  e.prop('checked') == true && $("#isextensionactive").val() != "1"){


              swal({
                title: "!Atención!",
                text: 'Para esta automatizacion es necesario que cuentes con la extensión de woocommerce para carritos abandonados, si no la tienes puedes descargarlo aquí',
                icon: "warning",
                buttons: {
                    cancel : 'Entendido',
                    confirm : {text:'Descargar',className:'swal-btn'}
                    }
                }).then(function(isConfirm) {
                    if (isConfirm){
                        window.location.href = "https://downloads.wordpress.org/plugin/woocommerce-abandoned-cart.zip"
                    }else{
                        $(`#${this.id} td label input`).prop('checked',false)
                        return
                    }
                })
        }

    }

    let data = {
        id:id,
        apikey:apikey,
        token:token,
        shop:shop,
        options:options,
    };


    $.ajax({
        type: "POST",
        url: "https://pluginssandbox.smsmasivos.com.mx/wp/automation/edit",
        dataType: "json",
        data:data,
        success: function (response) {
            e.prop("disabled",false)
            if(!response.success){
                $(`#id-auto-${id} input`).prop('checked',!options)
                swal("¡Atención!",response.message,"warning");  
                e.prop("disabled",false).removeClass('opa5')
            }else{


                var list = new Array();
                $('#list-body tr').each(function() {
                    list.push({"type":$(this).attr("data-type"), "status": $(`#${this.id} td label input`).prop('checked') == true ? 1 : 0});
                });


                $.ajax({
                    type: "POST",
                    url: ajax_object.ajaxurl,
                    data : {
                        action : 'sms_set_automations',
                        list: list,
                        nonce: $('#globalNonce').val(),
                    },
                    dataType: "JSON",
                    success: function (data) {
                        console.log('ok')
                    }
                });
            }

        },
        error:function(error){
            e.prop("disabled",false).removeClass('opa5')
            showToast("Algo salio mal, Intenta más tarde. code: ED001",'error')
        }
    });
}

function getfakelenght(msg){

    try {
        if(!msg) return 0;
        msg = msg.replace(/\s+/g, ' ')
        msg = msg.replace(/ ,+/g, ',')
        var name = ((msg.match(/{nombre}/g) || []).length)*7;
        var order_id = ((msg.match(/{order_id}/g) || []).length)*4;
        var status = ((msg.match(/{status}/g) || []).length)*3;
        var currency = ((msg.match(/{moneda}/g) || []).length)*-5;
        var nuevo_total = ((msg.match(/{total}/g) || []).length)*1;
        var gateway = ((msg.match(/{pasarela}/g) || []).length)*2;
        var address = ((msg.match(/{direccion_de_envio}/g) || []).length)*40;
        var creacion = ((msg.match(/{fecha_creacion}/g) || []).length)*-6;
        var email = ((msg.match(/{email}/g) || []).length)*28;
        var telefono = ((msg.match(/{telefono}/g) || []).length)*2;
        var company = ((msg.match(/{tracking_company}/g) || []).length)*-8;
        var tracking_number = ((msg.match(/{numero_de_rastreo}/g) || []).length)*-4;
        var url_confirmacion = ((msg.match(/{url_confirmacion}/g) || []).length)*7;
        var url = ((msg.match(/{url}/g) || []).length)*20;
        var ordenes = ((msg.match(/{ordenes}/g) || []).length)*-5;
        var apellido = ((msg.match(/{apellido}/g) || []).length)*7;
        var items = ((msg.match(/{numero_productos}/g) || []).length)*-15;


        var size = msg.length
            size = size+items+apellido+url+ordenes+url_confirmacion+tracking_number+company+name+order_id+status+currency+nuevo_total+gateway+address+creacion+email+telefono
        
        return size

    } catch (error) {
        return 0;   
    }
}

function outsideClick(event, notelem)	{
    notelem = $(notelem); // jquerize (optional)
    // check outside click for multiple elements
    var clickedOut = true, i, len = notelem.length;
    for (i = 0;i < len;i++)  {
        if (event.target == notelem[i] || notelem[i].contains(event.target)) {
            clickedOut = false;
        }
    }
    if (clickedOut) return true;
    else return false;
}

function delete_automation(id,type){

    let shop = $("#globalShopName").val()
    let token = $("#globalToken").val()
    let apikey = $("#globalApikey").val() 

    swal({
        title: "!Atención!",
        text: 'Estas a punto de eliminar esta automatizacion. ¿Estas seguro?',
        icon: "warning",
        buttons: {
            cancel : 'Cancelar',
            confirm : {text:'Sí, ¡Eliminar!',className:'swal-btn'}
            }
    }).then(function(isConfirm) {
        if (isConfirm){
            if(!id)
                showToast("Error al eliminar la automatización",'error')
    
            $.ajax({
                type: "POST",
                url: "https://pluginssandbox.smsmasivos.com.mx/wp/automation/delete",
                data: {
                    shop:shop,
                    apikey:apikey,
                    token:token,
                    id:id,
                    type:type
                },
                dataType: "json",
                success: function (response) {
                    if(response.success){
                        $(`#id-auto-${id}`).remove()
                        var list = new Array();
                        $('#list-body tr').each(function() {
                            list.push({"type":$(this).attr("data-type"), "status": $(`#${this.id} td label input`).prop('checked') == true ? 1 : 0});
                        });
    
                        $.ajax({
                            type: "POST",
                            url: ajax_object.ajaxurl,
                            data : {
                                action : 'sms_set_automations',
                                list: list,
                                nonce: $('#globalNonce').val(),
                            },
                            dataType: "JSON",
                            success: function (data) {
                                console.log('ok')
                            }
                        });
                    }else
                        showToast(response.message,'error')
                },error: function(error){
                    showToast("Algo salio mal, Intenta más tarde. code: DE001",'error')
                } 
            })  
        }
    })
}

function check_whatsapp_instance_status(){
   
    $.ajax({
        type: "POST",
        url: "https://pluginssandbox.smsmasivos.com.mx/whatsapp/instances/check",
        data: {
            shop: $("#globalShopName").val(),
            apikey:$("#globalApikey").val(),
            token:$("#globalToken").val()
        },
        dataType: "json",
        success: function (response) {
            if (response.active && response.message != "connected") {
                $("#invalid_whatsapp_instance").removeClass('d-none')
                $(".texteditor-whatsapp").addClass("d-none")
                $("#tabtwo").click()
                $(".direct").removeClass('d-none')
                $(".tosend").addClass('d-none')
                $("#list-send").val('0').niceSelect('update');
            }

            if(response.active){
                $(".tosend").removeClass('d-none')
                $(".direct").addClass('d-none')
                $(".single-whatsapp").removeClass('d-none')
                $(".texteditor-whatsapp").removeClass("d-none")
                $("#tabone").click()
                $("#list-send").val('1').niceSelect('update');
            }else{
                $(".texteditor-whatsapp").addClass("d-none")
                $("#tabtwo").click()
                $(".direct").removeClass('d-none')
                $(".tosend").addClass('d-none')
                $("#list-send").val('0').niceSelect('update');
            }
        }
    });
    
}

function edit_send_method(id){
    let e = $(`[data-whatsapp-${id}]`)
    let status = e.data(`whatsapp-${id}`) 
    
    let message = status ? 'Desactivar en el envío por WhatsApp' : 'Activar el envío por WhatsApp';
    swal({
        title: "!Atención!",
        text: message,
        icon: "info",
        buttons: {
            cancel : 'Cancelar',
            confirm : {text:'Ok,entendido',className:'swal-btn'}
          }
        }).then(function(isConfirm) {
          if (isConfirm){
            $.ajax({
                type: "POST",
                url: "/whatsapp/instances/edit",
                data: {id:id,status:status,shop:shop},
                dataType: "json",
                success: function (response) {
                    if (response.status == 200) {
                        let new_status = status ? 0 : 1
                        e.data(`whatsapp-${id}`,new_status)

                        if(new_status) 
                            e.addClass("text-whatsapp-main")
                        else
                            e.removeClass("text-whatsapp-main")
                    }
                },error: function (error){
                    console.log('Error 500, intentalo más tarde');
                }
            });
          }
          close = true
        })
}

function open_edit(id,tipo,tiempo,destinatario,nombre,envio){

    let contenido = ""
    let text_ws = ""

    global_list.forEach(element => {

        if(element.id == id){

            contenido = element.msg
            text_ws = element.text_ws
        }
       
    });


    destinatario = destinatario == 0 ? "customer" : "admin"

    switch (tipo) {
    case 2: tipo = "welcome"; break;
    //case "o-edited": type = 3; event = "orders/edited"; break;
    case 4: tipo = "winback"; break;
    case 5: tipo = "c-disabled"; break;
    case 6: tipo = "abandoned"; break;
    case 7: tipo = "f-created"; break;
    case 8: tipo = "f-updated"; break;
    case 9: tipo = "new_order"; break;
    case 10: tipo = "cash-od"; break;
    case 11: tipo = "feedback"; break;
    case 12: tipo = "o-pending"; break;
    case 13: tipo = "o-onhold"; break;
    case 14: tipo = "o-completed"; break;
    case 15: tipo = "o-cancelled"; break;
    default: break;
    }

    if(tiempo >= 1440){
        present_delay = "days"
        tiempo = tiempo/1440;
        $("#timelapse").prop("min","1").prop("step",1).prop("max",30)
    }else if(tiempo >= 60){
        present_delay = "hours";
        tiempo = tiempo/60;
        $("#timelapse").prop("min","1").prop("step",1).prop("value",24).prop("max",24)
    }else{
        $("#timelapse").prop("min","10").prop("step",10).prop("max",60)
        present_delay = "minutes"
    }

    $("#timelapse").val(tiempo)

    $("#list-type").val(tipo).attr("disabled",true).niceSelect('update')
    $("#list-recipient").val(destinatario).niceSelect('update');
    
    present_msg = contenido
    
    
    $("#automation_name").val(nombre)
    $("#list-send").val(envio).niceSelect('update');

    $(".create-automation").attr("data-edit",1).attr("data-id",id).html("Editar")

    $('#automation_count').text(getfakelenght(contenido));
    restore_html_from_text(contenido)

    if(text_ws && text_ws != ""){
        $('#automation_count_ws').text(getfakelenght(text_ws));
        restore_html_from_text(text_ws,true)
    }else $("#automation_text_ws").html("")

    $("#automations-details").modal("show");

    let stepsForm = document.querySelector('.multisteps-form__form')
    stepsForm.style.height = `308px`;

    let elem = ''
    switch (tipo) {

        case "new_order":
            elem = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-cliente-j661jd/"">Ver guía paso a paso</a>'
            if($("#list-recipient").val() == "admin")  
                elem = 'Confirma a tu cliente que realizó su pedido de manera correcta, es muy sencillo y automático. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-confirmacion-de-pedido-para-administrador-11mpyl5/">Ver guía paso a paso</a>'
        break;

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
            break;

        case "cash-od":
            elem = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-clientes-1ltxjwt/">Ver guía paso a paso</a>'    
            if($("#list-recipient").val() == "admin")  
                elem = 'Te ayuda a validar que el cliente existe al enviarle un SMS al celular que capturó con un link, una vez que da clic en el link el estatus cambia y te muestra "Número verificado", si no se confirma, el pedido se cancela de forma automática al transcurrir el tiempo que determines. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-pago-contra-entrega-para-administrador-14xujps/">Ver guía paso a paso</a>'    
        break;

        case "winback":
            elem = '¿Tienes clientes que quieres que te compren de nuevo? Mantenerte presente y enviarles promociones periódicas después de cierto tiempo de su última compra es muy fácil. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recuperacion-del-cliente-4dcg2p/">Ver guía paso a paso</a>'
            break;

        case "feedback":
            elem = 'Obtener reseñas de tus productos nunca fue tan fácil, tan pronto como se entrega el pedido tu cliente recibirá un link en donde podrá capturar su reseña y esta se publicará directamente en tu tienda generando confianza con el resto de tus clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-cliente-1mmk5bz/">Ver guía paso a paso</a>'     
            if($("#list-recipient").val() == "admin")
                elem = 'Recibirás un SMS cuando tu cliente deje su reseña y esta se publicará directamente en el pedido de tu tienda. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-de-retroalimentacion-en-pedido-entregado-para-administrador-3dp4fy/">Ver guía paso a paso</a>'    
        break;

        case "abandoned":
            elem = 'Se activa cuando un cliente abandona un carrito de compra. Te recomendamos configurar un tiempo de retraso mínimo de 30 minutos para darle tiempo al cliente de que termine el proceso antes de considerarlo un abandono. Para aumentar la efectividad, crea múltiples automatizaciones en diferentes periodos de tiempo. Por ejemplo, una hora después de que un cliente abandona un carrito, 24 horas y 3 días después. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'
            if($("#list-recipient").val() == "admin")
                elem = 'Enterate de todo lo que pasa con tus usuarios al momento de comprar. Estarás recibiendo un SMS con una notificación indicando que han abandonado un carrito en tu tienda en línea, así podrás tomar acción de la mano de la automatización para carritos abandonados para clientes. <a class="help-link" target="_blank" href="https://help.smsmasivos.com.mx/es/article/woocommerce-automatizacion-para-recordatorios-de-carritos-abandonados-646tpt/">Ver guía paso a paso</a>'  

            stepsForm.style.height = `328px`;
        break;

        default:
            break;
    }

    $("#indicaciones").html(elem)
}

function restore_html_from_text(msg,whatsapp = null){
    try {


        let type = ""
        if(whatsapp) type = "_ws"
        
        let msg_html = msg.replaceAll('{nombre}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag(this)"></i> {nombre}</span>');
        msg_html = msg_html.replaceAll('{order_id}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {order_id}</span>');
        msg_html = msg_html.replaceAll('{status}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {status}</span>');
        msg_html = msg_html.replaceAll('{moneda}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {moneda}</span>');
        msg_html = msg_html.replaceAll('{total}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {total}</span>');
        msg_html = msg_html.replaceAll('{pasarela}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {pasarela}</span>');
        msg_html = msg_html.replaceAll('{direccion_de_envio}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {direccion_de_envio}</span>');
        msg_html = msg_html.replaceAll('{fecha_creacion}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {fecha_creacion}</span>');
        msg_html = msg_html.replaceAll('{email}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {email}</span>');
        msg_html = msg_html.replaceAll('{telefono}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {telefono}</span>');
        msg_html = msg_html.replaceAll('{tracking_company}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {tracking_company}</span>');
        msg_html = msg_html.replaceAll('{numero_de_rastreo}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {numero_de_rastreo}</span>');
        msg_html = msg_html.replaceAll('{url_confirmacion}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {url_confirmacion}</span>');
        msg_html = msg_html.replaceAll('{url}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {url}</span>');
        msg_html = msg_html.replaceAll('{ordenes}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {ordenes}</span>');
        msg_html = msg_html.replaceAll('{apellido}','<span class="tag3" contenteditable="false"><i class="fa fa-times" onclick="closetag'+type+'(this)"></i> {apellido}</span>');

        if(whatsapp)
            $("#automation_text_ws").html(msg_html)
        else
            $("#automation_text").html(msg_html)

    } catch (error) {
        if(whatsapp)
            $("#automation_text_ws").html(msg)
        else
            $("#automation_text").html(msg)
    }
}

function open_issues(){
    $("#modal_issues").modal("show")
}

function showToast(message,type){
    $.toast({
        icon: type,
        text: message,
        position: 'top-center',
        hideAfter: 5000,
        showHideTransition: 'slide',
        stack: 3
      });
}