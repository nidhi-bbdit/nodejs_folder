$(document).ready(function(){
    $(document).on('click', '.edit', function(){
        var id = $(this).attr("data-id");
        $.ajax({
            url : "/editPosts/"+id,
            type : "GET",
            success : function(data){
                console.log('page loaded');
                window.location = "/editPosts/"+id
            },
            error : function(error){
                console.log(error);
                window.location.reload();
            },
        });
    });

 
    $('#editPostFrm').on('click', '#editPostbtn', function(e){
        e.preventDefault();
        var id = $('#resultid').val(); 
        var formData = {
            title : $('input[name=title]').val(),
            description : $('input[name=description]').val(),
            content : $('textarea[name=content]').text(),
        };
        $.ajax({
            url : "/updatePosts/"+id,
            type : "POST",
            data: formData,
            success : function(data){
                alert(data.message);
                window.location = "/showPosts"

            },
            error : function(err){
                alert(err.message);
            },
        }); 
        
    });
}); 