$(document).ready(function(){
    $('#reg_frm').on('click', '#regbtn', function(){
        var formData = {
            'name': $('input[name=uname]').val(),
            'email': $('input[name=uemail]').val(),
            'password': $('input[name=upassword]').val(),
            'phoneno': $('input[name=phno]').val(),
        };
       $.ajax({
        url: "/signup",
        type: "post",
        data: formData,
        success: function(data) {
            console.log(data.status);
           if(data.status == 401){
            console.log(data.errors);
               $('#error_msg').text(data.message);
               $(data.errors).each(function(index, el){
                   
                var html ="";
                   if(el.param == 'name'){
                    html +=`<ul>`;
                    if(el.value == ''){
                        html += `<li style="color:red">Name is required</li>`;
                    }
                    else{
                        $(el).each(function(i,e){
                            html += `<li style="color:red">${e.msg}</li>`;
                        });
                        html +=`</ul>`;    
                    }
                    
                    if($('#name_div').find('ul').length==0){
                        $('#name_div').append(html);
                    }
                   }
                   if(el.param == 'email'){
                    html +=`<ul>`;
                    if(el.value == ''){
                        html += `<li style="color:red">Email is required</li>`;
                    }
                    else{
                        $(el).each(function(i,e){
                            html += `<li style="color:red">${e.msg}</li>`;
                        });
                    }
                    html +=`</ul>`; 
                    if($('#email_div').find('ul').length==0){
                        $('#email_div').append(html);
                    }
                   }
                   if(el.param == 'password'){
                    html +=`<ul>`;
                    if(el.value == ''){
                        html += `<li style="color:red">Password is required</li>`;
                    }
                    else{
                        $(el).each(function(i,e){
                            html += `<li style="color:red">${e.msg}</li>`;
                        });
                    }
                    html +=`</ul>`; 
                    if($('#pwd_div').find('ul').length==0){
                        $('#pwd_div').append(html);
                    }
                   }
                   if(el.param == 'phoneno'){
                    html +=`<ul>`;
                    if(el.value == ''){
                        html += `<li style="color:red">Phoneno is required</li>`;
                    }
                    else{
                        $(el).each(function(i,e){
                            html = `<li style="color:red">${e.msg}</li>`;
                        });
                    html +=`</ul>`; 
                    }
                    if($('#phno_div').find('ul').length==0){
                        $('#phno_div').append(html);
                    }
                   }
               });
           }
            else if(data.status == 200){
                alert(data.message);
                location.reload();
            }
        },
        error: function(errors) {
            console.log('process error');
          },
       });
    });
});