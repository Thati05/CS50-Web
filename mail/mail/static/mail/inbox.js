document.addEventListener('DOMContentLoaded', function () {
  // Use buttons to toggle between views
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#starred').addEventListener('click', () => load_mailbox('starred'));
  document.querySelector('#trash').addEventListener('click', () => load_mailbox('trash'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail').style.display = 'none';

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';

  document.querySelector('#emails-view').classList.remove('email-list-split');
  document.querySelector('#emails-view').classList.add('email-list-full');
  document.querySelector('#email-detail').classList.remove('email-detail-visible');
  document.querySelector('#email-detail').classList.add('email-detail-hidden');

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      const unreadCount = emails.filter(email => !email.read).length;

      document.querySelector('#emails-view').innerHTML = `
              <div class='inbox-contain'>
                  <div class="inbox-header">
                      <div>
                          <div class="inbox-title">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</div>
                          <div class="message-info">${emails.length} Messages · ${unreadCount} unread</div>
                      </div>
                      <img style="display:none;" width='20px' id="back-icon" src="https://cdn-icons-png.flaticon.com/512/2413/2413268.png">
                  </div>
                  <div class='bar'>
                      <div class="search-bar">
                          <img width='20px' src="https://cdn-icons-png.flaticon.com/512/17216/17216943.png">
                          <input autofocus='off' type="text" placeholder="Search">
                      </div>
                      <div class="add-button"></div>
                  </div>
              </div>
          `;

      document.querySelector('#back-icon').addEventListener('click', () => {
        document.querySelector('.email-section-contain').classList.toggle('full-email-view');
      });

      emails.forEach(email => {
        const emailItem = document.createElement('div');
        emailItem.className = `email-item ${email.read ? 'read' : 'unread'}`;

        emailItem.innerHTML = `
                  <div class="email-header">
                      <div class="email-subject">
                          <div class="read-indicator"></div>
                          ${email.subject}
                      </div>
                      <div class="email-timestamp">${email.timestamp}</div>
                  </div>
                  <div class="email-sender">
                      <div>${email.sender}</div>
                      <img width='20px' src='https://cdn-icons-png.flaticon.com/512/2990/2990259.png'>
                  </div>
                  <div class="email-body">${email.body.substring(0, 50)}...</div>
              `;

        emailItem.addEventListener('click', () => {
          document.querySelectorAll('.email-item').forEach(item => item.style.backgroundColor = '');
          emailItem.style.backgroundColor = '#f8d7da';

          // Display the email details when an email is clicked
          view_email(email.id);
        });

        document.querySelector('#emails-view').append(emailItem);
      });
    });
}

function view_email(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email);

      document.querySelector('#emails-view').classList.add('email-list-split');
      document.querySelector('#emails-view').classList.remove('email-list-full');
      document.querySelector('#email-detail').classList.add('email-detail-visible');
      document.querySelector('#email-detail').classList.remove('email-detail-hidden');
      document.querySelector('#email-detail').style.display = 'block';

      document.querySelector('#email-detail').innerHTML = `
              <ul class="list-group">
                  <li class="list-group-item">From: ${email.sender}</li>
                  <li class="list-group-item">To: ${email.recipients}</li>
                  <li class="list-group-item">Subject: ${email.subject}</li>
                  <li class="list-group-item">${email.timestamp}</li>
                  <hr/>
                  <li class="list-group-item">${email.body}</li>
              </ul>
          `;
    });
}


function send_email(event) {
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    })
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      load_mailbox('inbox');
    });
}