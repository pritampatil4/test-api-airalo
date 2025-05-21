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

    it('should successfully create a new order', () => {
      expect(accessToken, 'Access Token should be available').to.not.be.null;
  
      cy.request({
        method: 'POST',
        url: '/v2/orders', 
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}` 
        },
        body: {
          quantity: '6',
          package_id: 'merhaba-7days-1gb', 
          type: 'sim',      
        },
        form: true 
      }).then((response) => {
        expect(response.status).to.eq(200); 
        expect(response.body).to.have.property('data');
        expect(response.body.data.id).not.to.be.null;
        expect(response.body.data.package_id).to.eq('merhaba-7days-1gb');
        expect(response.body.data.sims).to.be.an('array');
        expect(response.body.data.sims).to.have.length(6);
      });
    });
  
  });
