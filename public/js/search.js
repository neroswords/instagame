var showResults = debounce(function(arg){
    var value = arg.trim();
    console.log(value);
    
    if ( value == "" || value.length <=0 ){
        $("#search-results").fadeOut();
        return;
    }
    else {
        $("#search-results").fadeIn();
    };
    
    var jqsearch = $.get('/search?q='+ value, function(data){
        $("#search-results").html("");
    }) 
    .done(function(data){
        if(data.length === 0) {
            $("#search-results").append('<p class="lead text-center mt-2">No results</p>');
        } else {
            data.forEach(x => {
                $("#search-results").append('<a href="/search/'+ x.name +'"><p class="m-2 lead" style="border-bottom: 1px solid black">'+ x.name +'</p></a>');
            });
        }
    }).fail(function(err){
        console.log(err);
    })
}, 200);

function debounce(func, wait, immediate){
    var timeout;
    return function() {
        var context = this,
        args = arguments;
        var later = function(){
            timeout = null;
            if(!immediate){func.apply(context, args)};
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if(callNow){func.apply(context.args)};
    };
};