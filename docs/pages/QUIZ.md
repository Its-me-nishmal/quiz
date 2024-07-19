
## Quizzes

### Get All Quizzes
- **URL**: `/api/quizzes`
- **Method**: `GET`
- **Responses**:
    - `200`: Returns a list of all quizzes
    - `500`: Server error

### Get Quiz by Category and Level
- **URL**: `/api/quizzes/:category/:level`
- **Method**: `GET`
- **Responses**:
    - `200`: Returns a quiz based on category and level
    - `500`: Server error

### Submit Quiz Answers
- **URL**: `/api/quizzes/submit`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "userId": "user_id",
      "category": "category_name",
      "level": "quiz_level",
      "answers": [
        {
          "questionId": "question_id",
          "answer": "user_answer"
        }
      ]
    }
    ```
- **Responses**:
    - `200`: Quiz submitted successfully, returns score
    - `404`: Quiz not found
    - `500`: Server error

### Add Quiz
- **URL**: `/api/quizzes/add`
- **Method**: `POST`
- **Body**:
    ```json
    {
      "category": "category_name",
      "level": "quiz_level",
      "questions": [
        {
          "question": "Question text",
          "options": ["option1", "option2", "option3", "option4"],
          "answer": "correct_option"
        }
      ]
    }
    ```
- **Responses**:
    - `200`: Quiz added successfully
    - `500`: Server error
