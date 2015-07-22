$( document ).ready(function() {

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
