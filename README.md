# Authly

This project provides a RESTful API for user authentication, including user registration, login, token refreshing, profile retrieval, and profile updates. It is designed to provide basic authentication and authorization functionality for web applications.

## Table of Contents

-   [Installation](#installation)
-   [Authentication Flow](#authentication-flow)
-   [Middlewares](#middlewares)
-   [Postman Collection](#postman-collection)
-   [API Endpoints](#api-endpoints)
    -   [POST /register](#post-register)
    -   [POST /login](#post-login)
    -   [POST /refresh](#post-refresh)
    -   [GET /profile](#get-profile)
    -   [PUT /profile](#put-profile)
-   [License](#license)

<br>
<br>

## Installation

To get started with the API, follow the instructions below.

### 1. Clone the Repository

```bash
git clone https://github.com/IVYLIFE/Authly.git
```

### 2. Install Dependencies
Navigate to the project directory and install the required dependencies.

```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory of the project and add the following variables:

```bash
# Server Configuration
PORT=5000
CLIENT_URLS=http://localhost:5173,http://localhost:3000

# MongoDB Connection (Replace with your actual connection string)
MONGO_URI=<your_mongodb_connection_string>

# JWT Authentication Secrets
JWT_SECRET=your_jwt_secret_key
REFRESH_SECRET=your_refresh_token_secret

# Security & Environment
NODE_ENV=development
```

### 4. Run the Development Server

Start the server using the following command:

```bash
npm run dev
```


<br>
<br>
<br>


## Authentication Flow

The authentication system uses JWT (JSON Web Tokens) to secure the API. Here's a step-by-step overview of how it works:

### 1. User Registration:
- A user registers with a name, email, and password. Optionally, they can provide their address, bio, and profile picture.
- After successful registration, the server returns an access token that the client can use for subsequent requests.

### 2. User Login:
- The user logs in with their email and password.
- Upon successful login, the server returns an access token and a refresh token.
- The refresh token is stored as an HTTP-only cookie for security purposes.

### 3. Token Refresh:
- If the access token expires, the client can send a request with the refresh token to obtain a new access token.

### 4. Protected Routes:
- To access protected routes like fetching or updating the profile, the user must send their access token in the `Authorization` header as a Bearer token.

<br>
<br>
<br>

## Middlewares

The following middlewares are used to secure and validate the requests:

### 1. `protect` Middleware:
- Ensures the user is authenticated by verifying the access token in the `Authorization` header.

### 2. `verifyUser` Middleware:
- Ensures that a user can only access or modify their own profile.

## Postman Collection

To quickly test the API endpoints, you can use the [Postman collection](https://documenter.getpostman.com/view/23283772/2sB2cPk6FR). The collection includes pre-configured requests for registering a user, logging in, refreshing tokens, fetching the profile, and updating the profile.

<br>
<br>
<br>

## API Endpoints 

<br>
<details id = "#post-register" >
  <summary><span style="font-size: 16px; font-weight: bold; margin: 50px 10px">Register User </summary>
  <p>This endpoint allows the client to register a new user. </p>

#### **Request:**

-   **`name`** (string, required): The name of the user.
-   **`email`** (string, required): The email address of the user. It should be unique.
-   **`password`** (string, required): The password for the user account. It should be securely hashed on the server.
-   **`address`** (string, optional): The address of the user.
-   **`bio`** (string, optional): A brief bio or description of the user.
-   **`profilePicture`** (string, optional): URL of the user's profile picture.

Example:

```json
{
    "name": "IvyLife",
    "email": "thisivylife01@gmail.com",
    "address": "Delhi",
    "password": "password!"
}
```

#### **Response:**

The response of this request is a JSON schema representing the user registration details. The schema includes the following properties:

-   **`_id`** (string): The unique identifier of the registered user.
-   **`name`** (string): The name of the registered user.
-   **`email`** (string): The email address of the registered user.
-   **`accessToken`** (string): A JWT access token to be used for authenticating further requests.

Example:

```json
{
    "_id": "67e91842b489125fbf9f138d",
    "name": "IvyLife",
    "email": "thisivylife01@gmail.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTk0YjUyMDBjOTUwODVmYjMyNGFiZSIsImlhdCI6MTc0MzM0MjQxOCwiZXhwIjoxNzQzMzQzMzE4fQ.P8oHo4BCDlT_vvxMLUWS7OR2mkCyA-ixx9BFcmRS9cA"
}
```

#### **Status Codes:**

-   **`201 Created`**: The user was successfully created and registered.
-   **`400 Bad Request`**: The request was invalid, Reason can be A user with the provided email already exists or missing data (e.g., missing required fields).

</details>

<br>

---

<br>

<details>
  <summary><span style="font-size: 16px; font-weight: bold; margin: 50px 10px">Login User</summary>

  <p>This endpoint allows users to log in by providing their email and password.  
  If the credentials are valid, the user will receive an access token and a refresh token.</p>

#### **Request:**

-   `email` (string): The email address of the user.
-   `password` (string): The password for the user's account.

```json
{
    "email": "thisivylife01@gmail.com",
    "password": "password!"
}
```

#### **Response:**

The response will return a JSON object with the following properties:

-   **`_id`** (string): The unique identifier of the logged-in user.
-   **`name`** (string): The name of the logged-in user.
-   **`email`** (string): The email address of the logged-in user.
-   **`accessToken`** (string): A JWT access token for the user to authenticate further requests.

```json
{
    "_id": "67e91842b489125fbf9f138d",
    "name": "IvyLife",
    "email": "thisivylife01@gmail.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkxODQyYjQ4OTEyNWZiZjlmMTM4ZCIsImlhdCI6MTc0MzMyOTM0NiwiZXhwIjoxNzQzMzMwMjQ2fQ.O7kytBT90d2kLOE5nwGEVKLV-nu80hj3_m9chqsezZU"
}
```

#### **Status Codes:**

-   **`200 OK`**: The login is successful. The response contains user details and tokens.
-   **`401 Unauthorized`**: The email or password is incorrect.
-   **`404 Not Found`**: No user exists with that email.
-   **`500 Internal Server Error`**: A server error occurred during the login process.

</details>

<br>

---

<br>
<details>
    <summary><span style="font-size: 16px; font-weight: bold; margin: 50px 10px">Refresh Access Token</summary>
  <p>This endpoint allows a user to refresh their access token by providing a valid refresh token stored in a cookie. If the refresh token is valid, a new access token will be generated and returned to the user.</p>

#### **Request:**

The request expects the **refresh token** to be sent in the **cookies** (not in the request body).

#### **Response:**

The response will return a JSON object with the following property:

-   **`accessToken`** (string): A newly generated JWT access token for the user.

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTkxODQyYjQ4OTEyNWZiZjlmMTM4ZCIsImlhdCI6MTY4NjQzMjU0NiwiZXhwIjoxNzQzMzMwMjQ2fQ.JUvH6J1U3lg7zyhDmb-fz6mwR2IlnuXwqQ-aEZAVj8w"
}
```

#### **Status Codes:**

-   **`200 OK`**: The refresh token is valid, and a new access token is returned.
-   **`401 Unauthorized`**: The request does not contain a refresh token.
-   **`403 Forbidden`**: The refresh token is invalid or expired.

</details>

<br>

***

<br>
<details>
  <summary><span style="font-size: 16px; font-weight: bold; margin: 50px 10px">Get User Profile</summary>

<p>This endpoint retrieves the profile details of the currently authenticated user. The user is authenticated through the **protect middleware**, which ensures the request contains a valid JWT access token.</p>

#### **Request:**

The request does not require a body, as the user information is retrieved from the authenticated user's session.

#### **Headers:**

-   **`Authorization`** (string, required): The **JWT access token** in the format `Bearer` . This token is used for authentication and must be valid.

#### **Response:**

If successful, the response will return the profile information of the user as a JSON object. The user's sensitive information like the password is not included.

```json
{
    "_id": "67e94b5200c95085fb324abe",
    "name": "IvyLife",
    "email": "thisivylife01@gmail.com",
    "address": "Delhi",
    "createdAt": "2025-03-30T13:46:58.158Z",
    "updatedAt": "2025-03-30T13:48:59.405Z",
    "__v": 0
}
```

#### **Status Codes:**

-   **`200 OK`**: The user profile is successfully fetched and returned.
-   **`401 Unauthorized`**: The request does not contain a valid access token or the token is expired/invalid.
-   **`500 Internal Server Error`**: There was an error fetching the user profile from the database.
</details>

<br>

***

<br>
<details>

  <summary><span style="font-size: 16px; font-weight: bold; margin: 50px 10px">Update User Profile</summary>
<p>This endpoint allows the authenticated user to update their profile information. The user must provide the updated data in the request body, and only the fields provided will be updated.</p>

#### **Headers:**

-   **`Authorization`** (string, required): The **JWT access token** in the format `Bearer` . This token is used for authentication and must be valid.

#### **Request:**

-   **`name`** (string, optional): The updated name of the user.
-   **`email`** (string, optional): The updated email address of the user.
-   **`address`** (string, optional): The updated address of the user.
-   **`bio`** (string, optional): The updated bio of the user.
-   **`profilePicture`** (string, optional): The URL of the updated profile picture.
-   **`password`** (string, optional): The new password for the user. If provided, it will be hashed before saving.

```json
{
    "name": "Updated Name",
    "email": "updated.email@example.com",
    "address": "New Address",
    "bio": "Updated Bio",
    "profilePicture": "https://example.com/updated-profile.jpg",
    "password": "newpassword123"
}
```

#### **Response:**

If the update is successful, the response will return a success message along with the updated user profile.

```json
{
    "message": "Profile updated successfully",
    "user": {
        "_id": "67e91842b489125fbf9f138d",
        "name": "Updated Name",
        "email": "updated.email@example.com",
        "address": "New Address",
        "bio": "Updated Bio",
        "profilePicture": "https://example.com/updated-profile.jpg"
    }
}
```

#### **Status Codes:**

-   **200 OK**: The user profile is successfully updated.
-   **401 Unauthorized**: The request does not contain a valid access token or the token is expired/invalid.
-   **404 Not Found**: The user could not be found in the database (this should not typically happen if the token is valid).

</details>



