var email = document.getElementById("email")
  , confirm_email = document.getElementById("confirm_email");

function validateEmail(){
  if(email.value != confirm_email.value) {
    confirm_email.setCustomValidity("Emails diferentes!");
  } else {
    confirm_email.setCustomValidity('');
  }
}

email.onchange = validateEmail;
confirm_email.onkeyup = validateEmail;

$(document).ready(function(){
  $(".telefone").mask("(99) 9999-9999");
  $(".whats").mask("(99) 99999-9999");
  $(".cep").mask("99999-999");
  $(".cpf").mask("999.999.999-99");
  });

  $("#form-login").submit(function(){
    alert("aaaaaaa");
    $(this).find('button').html('<i class="fa fa-spin fa-spinner"></i>')
  });