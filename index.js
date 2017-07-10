var ui = require('./ui_routes.js');
var config = require('./config/config.js');
var ga = require('./config/ga.js');

module.exports = '' +
'<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'  <meta charset="utf-8">' +
'  <meta http-equiv="X-UA-Compatible" content="IE=edge">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1">' +
'  <title>' + config.title + '</title>' +
'  <link href="' + ui.asset('static/css/font-awesome.min.css') + '" rel="stylesheet">' +
'  <link href="' + ui.asset('static/css/oc.css') + '" rel="stylesheet">' +
'  <link href="' + ui.asset('static/css/react-select.css') + '" rel="stylesheet">' +
'  <link href="' + ui.asset('static/css/react-toggle.css') + '" rel="stylesheet">' +
'  <link href="' + ui.asset('static/img/favicon.ico') + '" rel="SHORTCUT ICON">' +
'  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->' +
'  <!-- WARNING: Respond.js doesn\'t work if you view the page via file:// -->' +
'  <!--[if lt IE 9]>' +
'    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>' +
'    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>' +
'  <![endif]-->' +
'  <script src="' + ui.asset('static/js/App.js') + '"></script>' +
'  <script>' +
'    (function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){' +
'    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),' +
'    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)' +
'    })(window,document,\'script\',\'https://www.google-analytics.com/analytics.js\',\'ga\');' +
'    ga(\'create\', \'' + ga.id + '\', \'auto\');';
'    ga(\'send\', \'pageview\');';
'  </script>';
'</head>' +
'<body>' +
'</body>' +
'</html>';
