
Cypress.Commands.add('getAiraloAccessToken', () => {
    const existingToken = Cypress.env('AIRALO_ACCESS_TOKEN'); 
    if (existingToken) {
      return cy.wrap(existingToken); 
    } else {
      return cy.request({
        method: 'POST',
        url: '/v2/token', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          grant_type: 'client_credentials',
          client_id: Cypress.env('AIRALO_CLIENT_ID'),
          client_secret: Cypress.env('AIRALO_CLIENT_SECRET')
        },
        form: true
      }).then((response) => {
        expect(response.status).to.eq(200);
        const newToken = response.body.data.access_token;
        Cypress.env('AIRALO_ACCESS_TOKEN', newToken); 
        return cy.wrap(newToken); 
      });
    }
  });
  