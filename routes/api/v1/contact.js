var api = require('../../../api_routes.js');
var HttpStatus = require('http-status');
var mailer = require('nodemailer');
var ContactUsValidation = require('../../../models/joi/contactUs.js');
var validate = require('express-validation');
var Contact = require('../../../models/contact.js');
var User = require('../../../logic/user.js');

function sendContactMail(req, res) {
  if (typeof req.body == 'undefined' || typeof req.user == 'undefined') {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      'error': 'body or user undefined.'
    });
  }

  var username = User.getName(req.user);
  var mail = {
    'from': req.body.address,
    'to': Contact.mailAddress,
    'subject': 'Submission from the OrganiCity Scenarios Contact Form',
    'text': 'Hello, \n\n' +
      'The user ' + username + ' has submitted the OrganiCity\n' +
      'Scenario Tool contact form, and wrote this message:\n\n' +
      req.body.message
  };

  var transporter = mailer.createTransport();
  transporter.sendMail(mail, function(error) {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failure while sending mail: ' + error);
    } else {
      res.status(HttpStatus.OK).send({});
    }
  });
};

module.exports = function(router, passport) {
  var isLoggedIn = require('../../../models/isLoggedIn.js')(passport);

  router.post(api.route('contactUs'),
    isLoggedIn,
    validate(ContactUsValidation.form),
    sendContactMail);
  return router;
};
