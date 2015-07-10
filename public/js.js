$( document ).ready(function() {
    console.log( "ready!" );
    $("button.scenarioDelete").on('click', function() {
        var id = $(this).data("id");
        $.ajax({
            type : 'DELETE',
            url : "/rest/scenarios/" + id,
            success : function(o){
                // FIXME: REMOVE FROM OVERVIEW
                window.location = "/scenarios";
            },
            error: function(){
                console.log("error", error);                
            }
        });

    });

    $("button.scenarioEdit").on('click', function() {
        var id = $(this).data("id");
        window.location = "/scenarios/" + id + "/edit";
    });
});
