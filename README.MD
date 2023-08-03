# Predicta-Med Backend

This is an Express.js backend application that interacts with the Monday.com API and a patient data API to fetch patient data and visualize it on a Monday.com board. It also utilizes OAuth 2.0 for authorization.

## Installation

Clone the repository:

```
git clone git@github.com:phoenix979/predicta-backend.git
```

Navigate to the project directory:

```
cd backend
```

adjust the parameters in .env.template file and rename it to be .env

Install the dependencies:

```
npm install
```

## Usage

To run the application:

```
npm start
```

This starts the server at `localhost:3000`. You can then navigate to `http://localhost:3000/patient?patientId=<patientId>` in your browser and click "Allow" to see the patient data in your Monday.com board.

## Features

- Handles the OAuth 2.0 authorization code grant flow for secure access to the patient data API.
- Fetches patient data from the patient data API and sends it to a Monday.com board.
- Utilizes the `express-session` middleware to store the OAuth 2.0 code verifier in a session.

## Environment Variables

The application requires the following environment variables:

- `SESSION_SECRET`: Secret for the session.
- `PORT`: Port to run the server.
- `BASE_URL`: Base URL of the patient data API.
- `CLIENT_ID`: Client ID for the patient data API.
- `CLIENT_SECRET`: Client secret for the patient data API.
- `REDIRECT_URI`: Redirect URI for the OAuth 2.0 authorization code grant flow.
- `MONDAY_SDK_TOKEN`: Your Monday.com SDK token.

## Libraries Used

- `express`: For building the server.
- `axios`: For making HTTP requests.
- `crypto`: For generating the PKCE code verifier and code challenge.
- `express-session`: For managing sessions.
- `monday-sdk-js`: For interacting with the Monday.com API.
- `moment.js`: For date calculations.

## Code Explanation

The application consists of a server (`index.js`) and two routers (`authController.js` and `patientController.js`). It also has three services (`authService.js`, `mondayService.js`, and `patientService.js`).

- The server uses the two routers to handle the `/authorize`, `/callback`, and `/patient` endpoints.
- The `authController.js` router handles the OAuth 2.0 authorization code grant flow.
  - The `/authorize` endpoint generates a PKCE code verifier and challenge, retrieves the patient data API's smart-configuration, and redirects to the authorization endpoint.
  - The `/callback` endpoint exchanges the authorization code for an access token and redirects back to the `/patient` endpoint with the patient ID.
- The `patientController.js` router handles fetching the patient data.
  - The `/patient` endpoint fetches the patient data from the patient data API and sends it to a Monday.com board using the `mondayService.js` service.
- The `authService.js` service generates the PKCE code verifier and challenge.
- The `mondayService.js` service sends the patient data to a Monday.com board.
- The `patientService.js` service fetches the patient data from the patient data API and merges it into one object.