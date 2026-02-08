import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'security-realm',
  clientId: 'frontend-react',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
