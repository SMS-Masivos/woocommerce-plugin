window.addEventListener('load', () => {

    $('#btn-questions').click(function (e) { 
        e.preventDefault();
        let html = $('#questions-template').html()        
        el.html(html);
    });
});
