# Application Tracker

![Project Thumbnail](./thumbnail.png)

A MERN stack application for tracking and managing job applications.

## Table of Contents

- [Application Tracker](#application-tracker)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Applications](#applications)
  - [Testing](#testing)
  - [Technologies Used](#technologies-used)
  - [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/application-tracker.git
   cd application-tracker
   ```

2. Install dependencies for the server and client:
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

3. Create a `.env` file in the `server` directory and add the following environment variables:
   ```plaintext
   PORT=your_server_port
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # In the server directory
   npm start

   # In the client directory
   npm start
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login a user.

### Applications

- `GET /applications`: Get all applications for the authenticated user.
- `GET /applications/:id`: Get a single application by ID.
- `POST /applications`: Create a new application.
- `PUT /applications/:id`: Update an existing application.
- `DELETE /applications/:id`: Delete an application.

## Testing

Run tests using Jest and Supertest:
   ```bash
   # In the server directory
   npm start

   # In the client directory
   npm start
   ```

## Technologies Used

- **Frontend**: React, Typescript, SCSS Modules
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **Testing**: Jest, Supertest
- **State Management**: React-Redux

## License

This project is licensed under the MIT License.