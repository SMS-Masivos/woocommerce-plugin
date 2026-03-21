($ => {
    const _request = {
        send: (options) => {
            $.ajax({
                type: 'POST',
                url: ajax_object.ajaxurl,
                dataType: 'json',
                data: Object.assign(
                    { action: options.action, nonce: ajax_object.nonce },
                    options.data || {}
                ),
                beforeSend: options.beforeSend,
                success: options.success,
                error: options.error || (() => {
                    _general.showToast('Error, intenta más tarde', 'error')
                }),
                complete: options.complete
            })
        },

        buttonLoading: (btn) => {
            btn.data('original-text', btn.html())
                .html('<i class="fa fa-spinner fa-spin"></i>')
                .attr('disabled', true)
        },

        buttonRestore: (btn) => {
            btn.html(btn.data('original-text'))
                .attr('disabled', false)
        }
    }

    window._request = _request
})(jQuery)
