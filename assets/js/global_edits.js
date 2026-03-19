docReady(function() {
    let url = window.location.href
    if(url.indexOf("/wp-admin/post.php?post=") !== -1 && url.indexOf("action=edit") !== -1){
        let e = document.getElementById('woocommerce-order-data')
        let sms = document.getElementById('sms-plugin-container')

        if(typeof(e) != 'undefined' && e != null && sms == undefined) {
            create_helper_inputs()
        }
    }
    
    function create_helper_inputs(){
        let wrapper = document.getElementsByClassName('order_data_column_container')[0]
        let globaldiv = document.createElement('div')
        globaldiv.className = "order_data_column"
        globaldiv.style.display = "inline-grid"
        let title= document.createElement('h3')
        title.textContent = "Acciones"
        let subtitle= document.createElement('p')
        subtitle.textContent = "Notifica al cliente de los detalles de su envío"
        var newinput = document.createElement('input');
        newinput.type = "text"
        newinput.name = "sms_company"
        newinput.id = "sms_plugin_company"
        newinput.maxLength = "25"
        newinput.placeholder = "DHL"
        var newlabel = document.createElement('label');
        newlabel.innerHTML = "Compañia";
        newlabel.style.display = "block"
        newlabel.style.margin = "4px 0"
        

        var newinput2 = document.createElement('input');
        newinput2.type = "text"
        newinput2.name = "sms_rastreo"
        newinput2.id = "sms_plugin_tracking"
        newinput2.maxLength = "25"
        newinput2.placeholder = "9698F-0012"
        var newlabel2 = document.createElement('label');
        newlabel2.innerHTML = "Número de seguimiento";
        newlabel2.style.display = "block"
        newlabel2.style.margin = "4px 0"

        globaldiv.appendChild(title)
        globaldiv.appendChild(subtitle)
    
        globaldiv.appendChild(newlabel)
        globaldiv.appendChild(newinput)

        globaldiv.appendChild(newlabel2)
        globaldiv.appendChild(newinput2)
        wrapper.appendChild(globaldiv)

        var button = document.createElement('button')
        button.innerText = "Enviar"
        button.className = "button"
        button.type = "button"
        button.style.margin = "4px 0"
        button.id = "envio_sms"
        button.addEventListener('click', function() {
           sms_fulfillment_create()
        }, false);

        globaldiv.appendChild(button)


    
    
    }
    
    function sms_fulfillment_create(){

        let this_button = document.getElementById('envio_sms') 

        let order =  document.getElementById('post_ID')
        let company = document.getElementById('sms_plugin_company')
        let tracking_number = document.getElementById('sms_plugin_tracking')
    
        if(!company.value){
            company.style.border = "1px solid red"
            return
        }
    
        if(!tracking_number.value){
            tracking_number.style.border = "1px solid red"
            return
        }
    
        tracking_number.style.border = "1px solid #555"
        company.style.border = "1px solid #555"

        this_button.setAttribute("disabled", "disabled");
        this_button.innerHTML = "Enviando ..."
        
        Backbone.ajax({
            method:   'POST',
            dataType: 'json',
            url:      ajax_object.ajaxurl,
            data:     {
                action: 'sms_fulfillment_created',
                order: order.value,
                company: company.value,
                tracking_number: tracking_number.value,
                name: document.getElementById('_billing_first_name').value,
                nonce: ajax_object.fulfillment_nonce,
                address: document.getElementById('_billing_address_1').value,
                country: document.getElementById('_billing_country').value,
                phone: document.getElementById('_billing_phone').value
            },
            success: function( res ) {

                this_button.removeAttribute("disabled");
                this_button.innerText = "Enviar"

                let _tracking_number = ' Número de rastreo: '+tracking_number.value

                let container = document.getElementsByClassName('order_notes')[0]
                let li = document.createElement('li')
                li.className = "note"
                let div = document.createElement('div')
                div.className = "note_content"
                let p_content = document.createElement('p')
                p_content.textContent = res.success ? res.message : 'No se pudo completar el envío, revisa tu automatización y los detalles del cliente'
                let p_meta = document.createElement('p')
                p_meta.className = "meta"
                let span = document.createElement('span')
                span.className = "exact-date"
                span.textContent = "Hace unos instantes por smsmasivos"

                p_meta.appendChild(span)
                div.appendChild(p_content)
                li.appendChild(div)
                li.appendChild(p_meta)
                container.prepend(li)
            
            }
        })

        
    }
});

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}   

