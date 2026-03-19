<div id="global_container">
<div id="questions" class="m100">

      <div class="classic">
        <div class="question-title">  
          <h3>Requerimientos de instalación</h3>
          <hr>
          <p class="mb-1"><b>1.-</b> Contar con el certificado para HTTPS en tu sitio es obligatorio para ejecutar de forma segura tus peticiones y el correcto funcionamiento del Plug-In </p>
          <p class="mb-1"><b>2.-</b>Debido a la gran flexibilidad que ofrece wordpress el Plug-In se adapta a la instalación por defecto de wordpress y woocommerce usando el prefijo wp_ en tu base de datos, cualquier modificación a esta norma resultara en un funcionamiento incorrecto del mismo </p>
          <p class="mb-1"><b>3.-</b>Para la automatización de recuperación de carritos abandonados asegúrate de tener activa la extensión de woocommerce "Abandoned Cart Lite for WooCommerce", si no cuentas con ella aún puedes descargarla <a href="https://downloads.wordpress.org/plugin/woocommerce-abandoned-cart.zip" target="_black">aquí</a></p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Por qué mis mensajes no están siendo entregados?</h3>
          <hr>
          <p>La causa mas común de esto es debido a que durante el proceso de compra el cliente nunca proporciono algún número de contacto, puedes verificar si tus clientes tienen algún número asociado a su cuenta en tu panel en la sección usuarios, para los eventos relacionados a algun pedido, es posible encontrar información adicional del problema en la barra de notas en la vista de la orden
          <br><br>
          La segunda razón más probable suele deberse a que el texto final de tus mensajes es demasiado largo, recuerda que el longitud máxima es de 160 caracteres, si usas alguna etiqueta dinámica el contador de abajo se vuelve un aproximado, ten en cuenta esto y formula algún mensaje mas corto para aumentar las probabilidades de éxito en tu entrega
          </p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Cuántas automatizaciones puedo configurar?</h3>
          <hr>
          <p>Para las automatizaciones de recuperación de cliente y carritos abandonados puedes configurar tantas como creas necesarias. Para el resto de las automatizaciones se pueden configurar un máximo de 2, una para cada destinatario</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿A qué número llegan los mensajes de texto?</h3>
          <hr>
          <p>Las automatizaciones para los clientes, llegarán al número que hayan configurado en su cuenta. Para los administradores, llegarán al número establecido en la sección de "Automatización".</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Qué pasa si el cliente no tiene un número configurado al momento de hacer la compra?</h3>
          <hr>
          <p>Dependiendo de la configuración de tu tienda, será posible o no comprar de forma anónima sin necesidad de crear una cuenta o proporcionar un número de teléfono durante el proceso de pago, para esos casos, las automatizaciones no podrán completarse y ningún mensaje será enviado. Si eso llegara a pasar, se ignora ese evento y no se te descuenta ningún crédito.</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿A qué se refiere el tiempo en las automatizaciones?</h3>
          <hr>
          <p>
            La opción "tiempo" en las automatizaciones depende del tipo de automatización elegida, y determina el rango de tiempo en el que actúa o se dispara una notificación.<br>
            Tipo: Recuperación del cliente - Acción - Días desde el último pedido registrado del cliente.<br>
            Tipo: Recordatorio carritos abandonados - Acción - Tiempo transcurrido desde que el cliente abandonó su carrito de compra.<br>
            Tipo: Confirmación de envío de productos - Notificación - Instantánea<br>
            Tipo: Nueva orden (orden en proceso) - Notificación - Instantánea<br>
            Tipo: Pago contra reembolso - Acción - Días para que el cliente confirme su pedido<br>
            Tipo: Retroalimentación en pedido entregado - Notificación - Instantánea<br>
            Tipo: Eventos de wordpress (orden en completada, pendiente, en espera, cancelada) - Notificación - Instantánea<br>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Comó notifico sobre los estados del pedido?</h3>
          <hr>
          <p>Los automatizaciones asociadas directamente al estatus del pedido (pendiente, procesando, en espera, cancelado, completado) son controladas desde la vista woocommerce -> pedidos -> id_pedido, si tienes activa la automatizacion correspondiente cuando actualices el estatus del pedido el mensaje sera enviado automaticamente, ten en cuenta que para el estatus de procesando la automatización asociada es la de nueva orden y para el estatus de completada están asociadas la automatizacion de pedido completado y retroalimentación, dependiendo de que automatizaciones tienes activas serán los mensajes enviados al cliente
          </p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Qué tan largo puede ser mi mensaje?</h3>
          <hr>
          <p>La longitud final del mensaje, deberá ser de máximo 160 caracteres, de lo contrario, el mensaje no será enviado. Si esto llegara a suceder, el evento se ignora y no se descuenta ningún crédito.</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿De qué depende la longitud de los mensajes?</h3>
          <hr>
          <p>La longitud final de los mensajes, depende del uso de las etiquetas dinámicas, que son las encargadas de crear mensajes personalizados, como el contenido de cada una varía, la longitud del mensaje también. Es por eso que no es posible controlar el total de caracteres de cada mensaje.
            <br>
            Para ayudarte a maximizar la eficiencia de tus mensajes, cada etiqueta tiene asociada una longitud aproximada asociada a su uso normal. Puedes desactivar esta herramienta marcando la casilla de "Desactivar restricción de caracteres", pero no es recomendado.</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Cómo funciona la automatización de pago contra entrega?</h3>
          <hr>
          <p>El pago contra reembolso únicamente proporciona una herramienta más que te ayudara a verificar a tus clientes al comprobar que el numero proporcionado sea real, si tus clientes elijan esta opción como método de pago al momento de realizar su pedido. Una vez creado el pedido, se enviará un SMS con una URL corta para que el cliente confirme su número telefónico al dar clic en ella.
            <br>
            Una vez confirmada, aparecerá la leyenda "numero_verificado" sobre el pedido, indicando que se verificó al cliente y que el pedido puede ser enviado. De lo contrario, se cancelará la orden pasado el tiempo establecido en la automatización.
            </p>
        </div>
      </div>
      
      <div class="classic">
        <div class="question-title">  
          <h3>¿Cómo funciona la automatización de retroalimentación en pedido entregado?</h3>
          <hr>
          <p>
            Si el mensaje tiene como remitente al cliente: El mensaje deberá contener la etiqueta url, cuando el cliente de click en el enlace podrá dejar una reseña de su compra que se publicará de forma automática en tu tienda, es una excelente herramienta de validación social que te ayudará a dar más confianza a otros clientes.
            Si el mensajes tiene como remitente al administrador: Recibirás un mensaje por cada nueva reseña que dejen los clientes para que las puedas revisar y decidir si mantenerla u ocultarla..</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Los códigos mostrados en el mensaje de prueba pueden ser usados?</h3>
          <hr>
          <p>Sí, es posible enviar códigos de descuento en los mensajes, pero es necesario su configuración dentro de tu panel de Wordpress. Los códigos expuestos no están activos, sólo sirven de ejemplo.</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Para qué sirve la opción "Aplicar a todos los registros" durante la configuración del tiempo?</h3>
          <hr>
          <p>Algunas automatizaciones ofrecen dicha opción. Si marcas la casilla y se active la notificación se tomara en consideración cualquier registro que cumpla con las condiciones establecidas aun cuando este sea anterior a la configuracion, esto en un inicio podria resultar en una gran cantidad de notificaciones dependiendo del historial de la tienda, en caso contrario la automatizacion solo se activara para eventos que se activen despues de la configuración de la misma</p>
        </div>
      </div>

      <div class="classic">
        <div class="question-title">  
          <h3>¿Cómo se miden los ingresos de las automatizaciones?</h3>
          <hr>
          <p>Cada automatización lleva un registro aproximado de los ingresos generados por esta, cabe resaltar que dicha cantidad es una medida aproximada, la suma de los ingresos no equivale al total vendido por la tienda y mas bien reflejan el monto sobre el cual tuvo impacto la automatización durante las ventas
          </p>
        </div>
      </div>

    </div>	
</div>