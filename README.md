# BookByte Backend API Documentation

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
  - [Authentication APIs](#authentication-apis)
  - [User APIs](#user-apis)
  - [Book APIs](#book-apis)
  - [Cart APIs](#cart-apis)
  - [Favourite APIs](#favourite-apis)
  - [Order APIs](#order-apis)
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

3. Create & configure `.env` with the help of `.env.example` file.
4. Start the server

   ```bash
   npm start
   ```

5. Update the server URL in `api.rest` file:
   ```
   @serverUrl = http://localhost:1001
   # or
   @serverUrl = https://bookbyte-dcfk.onrender.com
   ```

## API Documentation

Note: For the easiest experience testing these APIs, please refer to the [Testing APIs with REST Client](#testing-apis-with-rest-client). The `api.rest` file contains all the pre-configured API requests that you can execute directly from VS Code.

### Authentication APIs

#### Sign Up

```http
POST /api/auth/sign-up
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
POST /api/auth/sign-in
Content-Type: application/json

{
    "username": string,
    "password": string
}
```

### User APIs

#### Get User Information

```http
GET /api/user/get-user-information
Headers:
- Content-Type: application/json
- id: user_id
- Authorization: Bearer user_token
```

#### Update Address

```http
PUT /api/user/update-address
Headers:
- Content-Type: application/json
- id: user_id
- Authorization: Bearer user_token

{
    "address": string
}
```

### Book APIs

#### Admin Book Operations

##### Add Book

```http
POST /api/book/add-book
Headers:
- Content-Type: application/json
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

##### Update Book

```http
PUT /api/book/update-book
Headers:
- Content-Type: application/json
- Authorization: Bearer admin_token
- bookID: book_id

{
    "url": string (optional),
    "title": string (optional),
    "author": string (optional),
    "price": number (optional),
    "desc": string (optional),
    "language": string (optional)
}
```

##### Delete Book

```http
DELETE /api/book/delete-book
Headers:
- Content-Type: application/json
- Authorization: Bearer admin_token
- bookID: book_id
```

#### Common Book Operations

##### Get All Books

```http
GET /api/book/get-all-books
Headers:
- Content-Type: application/json
- Authorization: Bearer token
```

##### Get Recent Books

```http
GET /api/book/get-recent-books
Headers:
- Content-Type: application/json
- Authorization: Bearer token
```

##### Get Book by ID

```http
GET /api/book/get-book-by-id/:bookid
Headers:
- Content-Type: application/json
- Authorization: Bearer token
```

### Cart APIs

#### Add Book to Cart

```http
PUT /api/cart/add-book-to-cart
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
- bookID: book_id
```

#### Remove Book from Cart

```http
PUT /api/cart/remove-book-from-cart
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
- bookID: book_id
```

#### Get User Cart

```http
GET /api/cart/get-user-cart
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
```

### Favourite APIs

#### Add Book to Favourites

```http
PUT /api/favourite/add-book-to-favourite
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
- bookID: book_id
```

#### Remove Book from Favourites

```http
PUT /api/favourite/remove-book-from-favourite
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
- bookID: book_id
```

#### Get Favourite Books

```http
GET /api/favourite/get-favourite-books
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
```

### Order APIs

#### Admin Order Operations

##### Get All Orders

```http
GET /api/order/get-all-orders
Headers:
- Content-Type: application/json
- Authorization: Bearer admin_token
```

##### Update Order Status

```http
PUT /api/order/update-status/:orderId
Headers:
- Content-Type: application/json
- Authorization: Bearer admin_token

{
    "status": string
}
```

#### User Order Operations

##### Place Order

```http
POST /api/order/place-order
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id

{
    "order": array[string] // Array of book IDs
}
```

##### Get Order History

```http
GET /api/order/get-order-history
Headers:
- Content-Type: application/json
- Authorization: Bearer user_token
- id: user_id
```

## Testing APIs with REST Client

1. Install the REST Client extension in VS Code
2. Open the `api.rest` file
3. Click on the "Send Request" link above each request to test the APIs
4. For local testing, use: `@serverUrl = http://localhost:1001`
5. For production testing, use: `@serverUrl = https://bookbyte-dcfk.onrender.com`

### Notes

- Remember to update the authentication tokens after signing in
- Admin operations require admin authentication
- All protected routes require a valid JWT token in the Authorization header
- The default admin credentials are:
  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```
