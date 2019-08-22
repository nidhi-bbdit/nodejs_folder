$(document).ready(function(){
    $('#login_frm').on('click', '#loginbtn', function(){
        var html ="";
        html +=`<ul>`;
        if($('input[name=uemail]').val() ==''){
            html += `<li style="color:red">Email is required</li>`;
        }
        if($('input[name=upassword]').val() ==''){
            html += `<li style="color:red">Password is required</li>`;
        }
        html +=`</ul>`; 
        $('#error_msg').append(html);
    
        var formData = {
            'email': $('input[name=uemail]').val(),
            'password': $('input[name=upassword]').val(),
        };
        if($('input[name=uemail]').val() !='' && $('input[name=upassword]').val() !=''){
            $.ajax({
            url: "/signin",
            type: "post",
            data: formData,
            success: function(data) {
                if(data.status == 200){
                    alert(data.message);
                    window.location.href="http://localhost:3000/showPosts"
                }
            },
            error: function(errors) {
                console.log('process error');
                },
            });
        }
    
    });
});