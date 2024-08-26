
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

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-detail').style.display = 'block';
      document.querySelector('#email-detail').innerHTML = `
      
<ul class="list-group">
  <li class="list-group-item">From: ${email.sender}</li>
  <li class="list-group-item">To: ${email.recipients}</li>
  <li class="list-group-item">Subject: ${email.subject}</li>
  <li class="list-group-item">${email.timestamp}</li>
  <div><button class="btn btn-sm btn-outline-primary" >Reply</button></div>
  
  <hr/>
  <li class="list-group-item">${email.body}</li>
</ul>
      
      `;

    });
}


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(email => {
        const Email = document.createElement('div');
        Email.className = "list-group-item"
        Email.innerHTML = `
        <h4>${email.recipients}</h4>
        <h6>${email.subject}</h6>
        <p>${email.timestamp}<p>

        `;
        //Read and unread messages
        Email.className = email.read ? 'read' : 'unread';

        Email.addEventListener('click', () => {
          view_email(email.id);
          console.log('This element has been clicked!')
        });
        document.querySelector('#emails-view').append(Email);



      });


    });
}

function send_email(event) {
  // Prevent default form submission
  event.preventDefault();

  // Get form field values
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
      // Print result
      console.log(result);
      load_mailbox('inbox');
    });

}