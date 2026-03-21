($ => {
    $(function () {
        $(document).on('click', '#btn-questions', (e) => {
            e.preventDefault()
            let html = $('#questions-template').html()
            el.html(html)
        })
    })
})(jQuery)
