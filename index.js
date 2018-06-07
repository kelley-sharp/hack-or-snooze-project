$(function() {
  /* check if the user has logged in previously */
  var username = localStorage.getItem('username');
  var token = localStorage.getItem('token');

  if (username && token) {
    $('#login_link').hide();
    $('#signup_link').hide();
  }

  $.getJSON('https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10')
    .then(function(data) {
      // data.data.forEach(function(name) {
      //   list.append(`<li>${name.title} (${name.url})</li>`);
      //   // console.log(name.title);
      // });
      displayTenStories(data.data);
    })
    .catch(function(error) {
      console.log(error);
    });

  $('#login_link').on('click', function() {
    $('#signup_form_container').hide();
    $('#login_form_container').slideToggle();
  });

  $('#signup_link').on('click', function() {
    $('#login_form_container').hide();
    $('#signup_form_container').slideToggle();
  });

  $('#submit_button').on('click', function() {
    $('#submit_form_container').slideToggle();
  });

  $('#login_form_container').submit(logIn);
  $('#submit_form_container').submit(submit);

  //click on star to favorite
  $('#story_list').on('click', 'i', function(e) {
    $(e.target).toggleClass('fas fa-star far fa-star');
    addtoFavorites();
  });
});

function displayTenStories(d) {
  const list = $('#story_list');
  d.forEach(function(story) {
    let url = story.url;

    /* extract host from URL. Credit: https://stackoverflow.com/a/8498629 */
    var domain = url
      .match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i)[1]
      .replace('www.', '');

    list.append(
      `<li><i class="far fa-star"></i><a href="${url}">${
        story.title
      }</a><small>(${domain})</small></li>`
    );
    // console.log(name.title);
  });
}

function logIn(event) {
  event.preventDefault();
  let user_name = $('#login_username').val();
  let data = {
    data: {
      username: $('#login_username').val(),
      password: $('#login_password').val()
    }
  };

  $.post('https://hack-or-snooze.herokuapp.com/auth', data, 'json')
    .then(function(msg) {
      localStorage.setItem('token', msg.data.token);
      localStorage.setItem('username', user_name);
      $('#login_form_container').slideToggle();
      $('#login_form_container > form')[0].reset();
      $('#login_link').hide();
      $('#signup_link').hide();
      console.log(msg);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function submit(event) {
  event.preventDefault();
  let title = $('#submit_title').val();
  let url = $('#submit_url').val();
  let author = $('#submit_author').val();
  let data = {
    data: {
      author: author,

      title: title,

      url: url,

      username: localStorage.getItem('username')
    }
  };

  let token = localStorage.getItem('token');

  $.ajax({
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    method: 'POST',
    dataType: 'json',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: JSON.stringify(data)
  })
    .then(function(msg) {
      const list = $('#story_list');
      // list.append(`<li>${title} (${url})</li>`);
      list.append(`<li><i class="fas fa-star"></i> ${title} (${url})</li>`);
      $('#submit_form_container > form')[0].reset();

      console.log(msg);
    })
    .catch(function(error) {
      console.log(error);
    });
}

//implement starred favorites feature
function addtoFavorites() {}
