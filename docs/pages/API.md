# API Documentation

## Users

### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "name": "Test User",
      "username": "uniqueness",
      "email": "testuser@example.com",
      "password": "password"
    }
    ```
- **Responses**:
    - `201`: User registered successfully
    - `400`: User already exists
    - `500`: Server error

### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "email": "testuser@example.com",
      "password": "password"
    }
    ```
- **Responses**:
    - `200`: Login successful, returns a JWT token
    - `400`: Invalid credentials
    - `500`: Server error

### Forgot Password
- **URL**: `/api/users/forgot-password`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "email": "testuser@example.com"
    }
    ```
- **Responses**:
    - `200`: Password reset email sent
    - `400`: User not found
    - `500`: Server error
