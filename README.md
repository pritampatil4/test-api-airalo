# Airalo Partner API Automation 

## Test Cases & My Implementation Approach

### 1. OAuth2 Token Acquisition

* **Test Objective:** To get an OAuth2 access token from the Airalo Partner API using client credentials.
* **My Implementation Approach:**
    * I have created the token in reusable **Cypress Custom Command**: `cy.getAiraloAccessToken()`, making it cleaner and more maintainable across all tests.
    * This command is used in a **`before()` hook** within a test suite.
    * The `cy.request()` method is used with a `POST` request to the `/v2/token` endpoint.
    * The request body includes `grant_type`, `client_id`, and `client_secret` . The `form: true` option ensures the body is correctly sent as `x-www-form-urlencoded`.
    * After a successful `200 OK` response, the `access_token` is extracted from `response.body.data` and stored in `Cypress.env('AIRALO_ACCESS_TOKEN')` for global access throughout the test run.

### 2. Order Creation

* **Test Objective:** To verify that a new eSIM order can be successfully created via the API.
* **My Implementation Approach:**
    * This test assumes the `accessToken` is already available from the `before()` hook
    * A `cy.request()` method is used with a `POST` request to the `/v2/orders` endpoint.
    * The `Authorization` header is set to `Bearer {accessToken}` for authentication.
    * The request body contains the necessary order details: `quantity`, a valid `package_id`,the `form: true` option is used to send this as form data.
    * Assertions check for a `200 OK` status code, and the presence of an `id` and `status` in the `response.body.data`, confirming the order's successful creation.
      

### 3. SIMs Retrieval

* **Test Objective:** To confirm that a list of SIMs can be retrieved from the API
* **My Implementation Approach:**
    * The `accessToken` is retrieved from `Cypress.env()` as a prerequisite for this test.
    * A `cy.request()` method with a `GET` request is made to the `/v2/sims` endpoint
    * Query parameters (`qs` option) are used to apply filters, including `limit`, `page` and `include` 
    * Assertions verify a `200 OK` status, confirm `response.body.data` is an array


## Setup


1.  **Install dependencies:**
    (Requires Node.js and npm installed)
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:**
    * Create a file named **`.env`** in the **root** of your project.
    * Add your Airalo Sandbox credentials:
        ```
        AIRALO_CLIENT_ID=your_client_id
        AIRALO_CLIENT_SECRET=your_client_secret
        ```

---

## How to Run Tests

* **  With Cypress Test Runner :**
    ```bash
    npx cypress open
    ```

* **With Command Line :**
    ```bash
    npm run tests
    ```

---
