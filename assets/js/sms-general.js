($ => {
    const _general = {
        showToast: (message, type) => {
            $.toast({
                icon: type,
                text: message,
                position: 'top-center',
                hideAfter: 5000,
                showHideTransition: 'slide',
                stack: 3
            })
        },

        monthName: (index) => {
            const months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]
            return months[index] || ''
        },

        formatCurrency: (value) => {
            return '$' + parseFloat(value).toFixed(2)
        }
    }

    window._general = _general
})(jQuery)
