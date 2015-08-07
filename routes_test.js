var ui = require('./ui_routes.js');

console.log('scenarioList', ui.reverse('scenarioList'));
console.log('scenarioEdit', ui.reverse('scenarioEdit', { uuid : "123" }));
