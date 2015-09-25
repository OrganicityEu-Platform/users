var ui = require('./ui_routes.js');

module.exports = '' +
'<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'  <meta charset="utf-8">' +
'  <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1">' +
'  <title>OrganiCity Scenario Tool</title>' +
'  <link href="' + ui.asset('static/css/font-awesome.min.css') + '" rel="stylesheet">' +
'  <link href="' + ui.asset('static/css/oc.css') + '" rel="stylesheet">' +
'  <link href="' + ui.asset('static/img/favicon.ico') + '" rel="SHORTCUT ICON">' +
'  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->' +
'  <!-- WARNING: Respond.js doesn\'t work if you view the page via file:// -->' +
'  <!--[if lt IE 9]>' +
'    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>' +
'    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>' +
'  <![endif]-->' +
'  <script src="' + ui.asset('static/js/App.js') + '"></script>' +
'</head>' +
'<body>' +
'</body>' +
'</html>';
