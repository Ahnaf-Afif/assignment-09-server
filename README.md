# SportNest Server

This is the backend API for SportNest, a sports facility booking management system. The server handles facility data, booking data, protected API routes, and MongoDB operations for the client application.

## Live URL

Server: add your deployed server URL here
Client: add your deployed client URL here

## Purpose

The server provides REST API endpoints for the SportNest client. It stores facilities and bookings in MongoDB, verifies authenticated requests with Better Auth JWT tokens, and supports backend search and filtering for facilities.

## Main Features

- Create sports facilities
- Read all facilities
- Read a single facility by ID
- Search facilities by name using MongoDB regex
- Filter facilities by sport type using MongoDB in query
- Update facility information
- Delete facilities
- Create bookings
- Read bookings for a logged-in user
- Cancel bookings
- JWT-protected private API routes
- MongoDB collections for facilities and bookings

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Better Auth JWT verification
- dotenv
- CORS

## NPM Packages Used

- express
- mongodb
- cors
- dotenv
- jose-node-cjs-runtime

## Environment Variables

Create a .env file in the server folder and add the required values:

~~~env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:3000
~~~

Do not commit the real .env file to GitHub. Keep only an example file if you need to show the required variable names.

## Run Locally

Install dependencies:

~~~bash
npm install
~~~

Start the server:

~~~bash
node index.js
~~~

The server will run at:

~~~txt
http://localhost:5000
~~~

## API Endpoints

### Facilities

~~~txt
GET    /facilities
GET    /facilities?search=arena&type=Football
GET    /facilities/:id
POST   /facilities
PATCH  /facilities/:id
DELETE /facilities/:id
~~~

### Bookings

~~~txt
POST   /bookings
GET    /bookings/:userId
DELETE /bookings/:id
~~~

## Database Collections

### facilities

- name
- facility_type
- location
- price_per_hour
- capacity
- available_slots
- description
- image
- owner_email
- booking_count

### bookings

- facility_id
- facility_name
- facility_image
- facility_type
- userId
- user_email
- booking_date
- time_slot
- hours
- total_price
- status

## Notes

Before deploying, update CLIENT_URL with the deployed client URL so JWT verification and cross-origin requests work correctly.
