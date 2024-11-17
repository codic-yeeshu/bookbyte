# BookByte Backend API Documentation

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
  - [Authentication APIs](#authentication-apis)
  - [Admin APIs](#admin-apis)
  - [Common APIs](#common-apis)
- [Testing APIs with REST Client](#testing-apis-with-rest-client)

## Setup Instructions

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the server

   ```bash
   npm start
   ```

4. Update the server URL in `api.rest` file:
   ```
   @serverUrl = http://localhost:1001
   ```

## API Documentation

Note: For the easiest experience testing these APIs, please refer to the [Testing APIs with REST Client](#testing-apis-with-rest-client). The `api.rest` file contains all the pre-configured API requests that you can execute directly from VS Code.

### Authentication APIs

#### Sign Up

```http
POST /api/sign-up
Content-Type: application/json

{
    "username": string,
    "email": string,
    "password": string,
    "address": string
}
```

#### Sign In

```http
POST /api/sign-in
Content-Type: application/json

{
    "username": string,
    "password": string
}
```

### Admin APIs

> **Admin Credentials**
>
> ```json
> {
>   "username": "admin",
>   "password": "admin"
> }
> ```

#### Add Book

```http
POST /api/add-book
Headers:
- Content-Type: application/json
- id: admin_id
- Authorization: Bearer admin_token

{
    "url": string,
    "title": string,
    "author": string,
    "price": number,
    "desc": string,
    "language": string
}
```

#### Update Book

```http
PUT /api/update-book
Headers:
- Content-Type: application/json
- id: admin_id
- bookId: book_id
- Authorization: Bearer admin_token

{
    "url": string (optional),
    "title": string (optional),
    "author": string (optional),
    "price": number (optional),
    "desc": string (optional),
    "language": string (optional)
}
```

#### Delete Book

```http
DELETE /api/delete-book
Headers:
- id: admin_id
- bookId: book_id
- Authorization: Bearer admin_token
```

### Common APIs

#### Get User Information

```http
GET /api/get-user-information
Headers:
- id: user_id
- Authorization: Bearer user_token
```

#### Update Address

```http
PUT /api/update-address
Headers:
- Content-Type: application/json
- id: user_id
- Authorization: Bearer user_token

{
    "address": string
}
```

#### Get All Books

```http
GET /api/get-all-books
```

#### Get Book by ID

```http
GET /api/get-book-by-id/:bookId
```

## Testing APIs with REST Client

1. Install the REST Client extension in VS Code
2. Open the `api.rest` file
3. Click on the "Send Request" link above each request to test the APIs
4. For local testing, use: `@serverUrl = http://localhost:1001`
5. For production testing, use: `@serverUrl = https://bookbyte-dcfk.onrender.com`

### Notes

- Make sure to save the authentication tokens after signing in
- Replace placeholder values (`user_id`, `admin_token`, etc.) with actual values
- The admin APIs require admin authentication
- All protected routes require a valid JWT token in the Authorization header
