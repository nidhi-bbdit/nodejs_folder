$(document).ready(function(){
    $('#createPostFrm').on('click', '#createPostbtn', function(){
        if($('input[name=title]').val() == '' || $('input[name=description]').val() == '' || $('textarea[name=content]').text()){
            alert('All fields are required');
        }
        else{
            var formData ={
                'title':$('input[name=title]').val(),
                'description': $('input[name=description]').val(),
                'content': $('textarea[name=content]').text(),
            };

            $.ajax({
                url: "/createPost",
                type:"post",
                data:formData,
                success:function(data){
                   /*  if(data.status == 200){
                        alert(data.message);
                    }
                    if(data.status == 400){
                        alert(data.errors);
                    } */
                    location.reload();
                },
                error:function(errors){
                    /* if(data.errors){
                        alert(data.errors);
                    } */
                }
            });
        }
    });

});