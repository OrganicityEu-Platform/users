var api = require('../../../api_routes.js');
var HttpStatus = require('http-status');
var mailer = require('nodemailer');
var contactUsValidation = require('../../../models/joi/contactUs.js');
var validate = require('express-validation');
var Contact = require('../../../models/contact.js');

function sendContactMail(req, res) {
  var mail = {
    'from': req.body.address,
    'to': Contact.mailAddress,
    'subject': 'New Entry from the OrganiCity Scenarios Contact Form',
    'text': 'Hello, \n\n' +
      'A message was submitted on the OrganiCity Scenarios Contact Form:\n\n' +
      req.body.message
  };

  // console.log(req.body, typeof req.body);

  // console.log('Sending Mail: ' + JSON.stringify(mail));

  var transporter = mailer.createTransport();
  transporter.sendMail(mail, function(error, info) {
    if (error) {
      console.log('Failure while sending mail: ' +
        error + '(' + info.response + ')');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        'Failure while sending mail: ' +
          error + '(' + info.response + ')');
    } else {
      console.log('Message sent: ' + info.response);
      res.status(HttpStatus.OK).send();
    }
  });
}

module.exports = function(router) {
  router.post(api.route('contactUs'),
    [validate(contactUsValidation.form)],
    sendContactMail);
  return router;
};
