$(function() {
  var list = $('#storyList');
  $.getJSON('https://hack-or-snooze.herokuapp.com/stories')
    .then(function(data) {
      data.data.forEach(function(name) {
        list.append(`<li>${name.title} (${name.url})</li>`);
        // console.log(name.title);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

$('#loginLink').on('click', function() {
  $('#signUpForm').hide();
  $('#loginForm').slideToggle();
});

$('#signUpLink').on('click', function() {
  $('#loginForm').hide();
  $('#signUpForm').slideToggle();
});

$('#loginForm').submit(logIn);

function logIn(e) {
  e.preventDefault();
  let data = {
    data: {
      username: $('#login_username').val(),
      password: $('#login_password').val()
    }
  };
  $.post('https://hack-or-snooze.herokuapp.com/auth/', data, 'json')
    .then(res => {
      localStorage.setItem('token', res.data.token);
      $('#loginForm').slideToggle();
      $('#loginForm > form')[0].reset();
      $('#loginLink').hide();
      $('#signUpLink').hide();
    })
    .catch(err => console.log(err));
}
