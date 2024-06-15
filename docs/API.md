# API Documentation

## Users
### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "username": "testuser",
      "email": "testuser@example.com",
      "password": "password"
    }
    ```
- **Responses**:
    - `201`: User created
    - `400`: Validation error

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
    - `200`: Login successful
    - `400`: Invalid credentials
