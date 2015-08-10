var ui = require('./ui_routes.js');

console.log('scenarioList', ui.reverse('scenarioList'));
console.log('scenarioEdit', ui.reverse('scenarioList', {}, { q : 'bla' }));
console.log('scenarioEdit', ui.reverse('scenarioEdit', { uuid : '123' }));
console.log('scenarioEdit', ui.reverse('scenarioEdit', { uuid : '123' }, { q : 'bla' }));
