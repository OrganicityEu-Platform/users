$( document ).ready(function() {

    //#####################################################
    // Scenario
    //#####################################################

    $("button.scenarioDelete").on('click', function() {
        var id = $(this).data("id");
        $.ajax({
            type : 'DELETE',
            url : "/scenarios/" + id,
            success : function(o){
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

    //#####################################################
    // User
    //#####################################################

    $("button.userDelete").on('click', function() {
        var id = $(this).data("id");
        $.ajax({
            type : 'DELETE',
            url : "/users/" + id,
            success : function(o){
                window.location = "/users";
            },
            error: function(){
                console.log("error", error);                
            }
        });

    });

    $("button.userEdit").on('click', function() {
        var id = $(this).data("id");
        window.location = "/users/" + id + "/edit";
    });

  	$("time.timeago").timeago();

});
