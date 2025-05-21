describe('Airalo Partner API', () => {
    before(() => {
      cy.getAiraloAccessToken(); 
    });
  
    it('should successfully create a new order', () => {
      const currentAccessToken = Cypress.env('AIRALO_ACCESS_TOKEN');
      expect(currentAccessToken, 'Access Token should be available').to.not.be.null;
      cy.request({
        method: 'POST',
        url: '/v2/orders', 
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentAccessToken}` 
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

    it('should successfully retrieve SIMs', () => {
      const currentAccessToken = Cypress.env('AIRALO_ACCESS_TOKEN');
      expect(currentAccessToken, 'Access Token should be available').to.not.be.null;
      const queryParams = {
        limit: 10,
        page: 1,
        include: 'order,order.status,order.user',      
      }; 
      cy.request({
        method: 'GET',
        url: '/v2/sims',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentAccessToken}`
        },
        qs: queryParams 
      }).then((response) => {
        expect(response.status).to.eq(200); 
        expect(response.body).to.have.property('data').and.be.an('array');
        expect(response.body.data.length).to.be.greaterThan(0);
      });
    });
  });
