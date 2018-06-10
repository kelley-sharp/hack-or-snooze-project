$(() => {
  /* check if the user has logged in previously */

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if ($('#login_link').text() === 'Logout') {
    $('#login_link').on('click', logOut);
  }

  if (username && token) {
    $('#login_link').text('Logout');
    $('#signup_link').hide();
  }

  /* set up event listeners */

  $('#login_link').click(() => {
    $('#signup_form_container').hide();
    $('#login_form_container').slideToggle();
  });

  $('#signup_link').click(() => {
    $('#login_form_container').hide();
    $('#signup_form_container').slideToggle();
  });

  $('#profile_link').click(() => {
    let $current = $('#stories_container');
    if ($current.css('display') === 'none') {
      $current = $('#profile_container');
    }

    let $next =
      $current.attr('id') === 'stories_container'
        ? $('#profile_container')
        : $('#stories_container');

    $current.slideToggle(300, 'swing', () => {
      $next.slideToggle();
    });
  });

  $('#submit_button').click(() => {
    $('#submit_form_container').slideToggle();
  });

  $('#login_form_container').submit(logIn);
  $('#submit_form_container').submit(submit);

  // Star Click
  $('#story_list').click('i', e => {
    $(e.target).toggleClass('fas fa-star far fa-star');
    addtoFavorites();
  });

  /* fetch stories */

  $.getJSON('https://hack-or-snooze.herokuapp.com/stories?skip=0&limit=10')
    .then(data => displayTenStories(data.data))
    .catch(error => alert(error));
});

function displayTenStories(d) {
  const storiesContainer = $('#stories_container');
  const list = $('#story_list');

  d.forEach(story => {
    const url = story.url;

    /* extract host from URL. Credit: https://stackoverflow.com/a/8498629 */
    const domain = url
      .match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i)[1]
      .replace('www.', '');

    list.append(
      `<li><i class="far fa-star"></i><a href="${url}">${
        story.title
      }</a><small>(${domain})</small></li>`
    );
    // alert(name.title);
  });

  storiesContainer.slideToggle();
}

function logIn(event) {
  event.preventDefault();
  const username = $('#login_username').val();
  const data = {
    data: {
      username: $('#login_username').val(),
      password: $('#login_password').val()
    }
  };

  $.post('https://hack-or-snooze.herokuapp.com/auth', data, 'json')
    .then(msg => {
      localStorage.setItem('token', msg.data.token);
      localStorage.setItem('username', username);
      $('#login_form_container').slideToggle();
      $('#login_form_container > form')[0].reset();
      $('#signup_link').hide();
      $('#login_link').text('Logout');
    })
    .catch(error => alert(error));
}

function logOut() {
  //remove username and password from local storage.
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  $('#login_link').text('Login');
}

function submit(event) {
  event.preventDefault();
  // get values from the form
  const title = $('#submit_title').val();
  const url = $('#submit_url').val();
  const author = $('#submit_author').val();
  // build payload for API
  const payload = {
    data: {
      author: author,
      title: title,
      url: url,
      username: localStorage.getItem('username')
    }
  };

  const token = localStorage.getItem('token');

  $.ajax({
    url: 'https://hack-or-snooze.herokuapp.com/stories',
    method: 'POST',
    dataType: 'json',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: JSON.stringify(payload)
  })
    .then(() => {
      const list = $('#story_list');
      list.append(`<li><i class="fas fa-star"></i> ${title} (${url})</li>`);
      $('#submit_form_container > form')[0].reset();
    })
    .catch(error => alert(error));
}

//implement starred favorites feature
function addtoFavorites() {}
