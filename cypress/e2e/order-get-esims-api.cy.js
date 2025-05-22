describe("Airalo Partner API", () => {
  before(() => {
    cy.getAiraloAccessToken();
  });

  it("should successfully create a new order and save its SIM details", () => {
    const currentAccessToken = Cypress.env("AIRALO_ACCESS_TOKEN");
    expect(currentAccessToken, "Access Token should be available").to.not.be
      .null;

    cy.request({
      method: "POST",
      url: "/v2/orders",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      body: {
        quantity: "6",
        package_id: "merhaba-7days-1gb",
        type: "sim",
      },
      form: true,
      failOnStatusCode: false, // Keep for debugging if order creation fails
    }).then((response) => {
      console.log("Order Creation Response Body (JSON):", response.body);

      if (response.status === 200) {
        expect(response.body).to.have.property("data");
        const orderData = response.body.data;

        expect(orderData).to.have.property("id").and.be.a("number");
        expect(orderData)
          .to.have.property("sims")
          .and.be.an("array")
          .and.have.lengthOf(6);

        const orderId = orderData.id;
        const orderedSimDetails = orderData.sims.map((sim) => ({
          id: sim.id,
          iccid: sim.iccid,
        }));

        Cypress.env("LAST_ORDER_ID", orderId); // Store the main order ID
        Cypress.env("ORDERED_SIM_DETAILS", orderedSimDetails); // Store array of {id, iccid} objects
      }
    });
  });

  it("should verify SIMs are correctly associated with the created order (by checking their presence)", () => {
    const lastOrderId = Cypress.env("LAST_ORDER_ID");
    const orderedSimDetails = Cypress.env("ORDERED_SIM_DETAILS");

    expect(lastOrderId).to.be.a("number");
    expect(orderedSimDetails).to.be.an("array").and.have.lengthOf(6);

    const currentAccessToken = Cypress.env("AIRALO_ACCESS_TOKEN");
    expect(currentAccessToken, "Access Token should be available").to.not.be
      .null;

    cy.request({
      method: "GET",
      url: "/v2/sims",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${currentAccessToken}`,
      },
      qs: {
        order_id: lastOrderId,
      },
    }).then((response) => {
      console.log(
        `SIMs Retrieved for Order ID ${lastOrderId} (JSON):`,
        response.body
      );

      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("data").and.be.an("array");
      expect(response.body.data).to.not.be.empty;

      const retrievedSimDetails = response.body.data.map((sim) => ({
        id: sim.id,
        iccid: sim.iccid,
      }));

      orderedSimDetails.forEach((orderedSim) => {
        const foundSim = retrievedSimDetails.find(
          (retrievedSim) =>
            retrievedSim.id === orderedSim.id &&
            retrievedSim.iccid === orderedSim.iccid
        );
        expect(foundSim, `${orderedSim.id}  ${orderedSim.iccid}`).to.exist;
      });
    });
  });
});
