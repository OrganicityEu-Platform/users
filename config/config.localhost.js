var config = {
  host : 'http://localhost',
  port : 8080,
  contextPath : '/organicity-scenario-tool',
  dev : true,
  title : 'OrganiCity User Service'
};

config.accounts_token_endpoint = {
  protocol: 'https',
  host: 'accounts.organicity.eu',
  port: '443',
  path: '/realms/organicity/protocol/openid-connect/token',
};

config.client_id = '';
config.client_secret = '';

module.exports = config;
