$(document).ready(function(){
    $(document).on('click', '.delete', function(){
        var id = $(this).attr("data-id");
        $.ajax({
            url : "/deletePosts/"+id,
            type : "GET",
            success : function(data){
               if(data.status == 200){
                   alert(data.message);
                   window.location.reload();
               }
            },
            error : function(error){
                console.log(error);
                window.location.reload();
            },
        });
    });
});