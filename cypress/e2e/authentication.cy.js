describe('Airalo API Authentication', () => {
    let accessToken; 
  
    it('should successfully obtain an OAuth2 token', () => {
      cy.request({
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
        expect(response.body.data).to.have.property('access_token');
        expect(response.body.data).to.have.property('token_type', 'Bearer');
        expect(response.body.data).to.have.property('expires_in').and.be.a('number');    
        accessToken = response.body.data.access_token;       
        Cypress.env('AIRALO_ACCESS_TOKEN', accessToken);
      });
    });
  });
