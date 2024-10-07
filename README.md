# ToDo Application

A full-stack ToDo application that allows users to sign up, sign in, and manage their tasks. Users can add, modify, delete, and mark todos as done or not done. Each user has their own set of todos and requires authentication to manage them.

## Features📚

- **User Authentication**🪧
  - Sign up for a new account.
  - Sign in with existing credentials.
  - JWT-based secure authentication.

- **Todo Management**📃
  - Add new todos.
  - Modify existing todos.
  - Delete todos.
  - Mark todos as done or not done.

## Technology Stack⚙️

### Backend
- ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)  
  Web framework for Node.js.

- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)  
  JavaScript runtime environment.

- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)  
  JSON Web Tokens for secure authentication.

- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)  
  NoSQL database for storing todos and user data.

- ![bcrypt](https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge&logo=security&logoColor=white)  
  Hashing library for password security.

- ![Zod](https://img.shields.io/badge/Zod-FF4154?style=for-the-badge&logo=zod&logoColor=white)  
  Schema validation for input data.

- ![dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)  
  Environment variable management.

### Frontend
- ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)


## Project Structure 🗃️

```plaintext
├── public               # Frontend files (HTML, CSS, JS)
│   ├── auth.css         # Styles for authentication pages (signin, signup)
│   ├── index.html       # Main HTML file
│   ├── mediaquary.css   # CSS for responsive design
│   ├── script.js        # Main JavaScript file for frontend functionality
│   ├── signin.html      # HTML file for sign-in page
│   ├── signup.html      # HTML file for sign-up page
│   └── style.css        # Main styles for the application
├── routes               # Backend routes
│   └── main.js          # Backend routes handling todos and user actions
├── .env.example         # Example of environment variables
├── database.js          # MongoDB connection setup
├── index.js             # Main entry point for the backend application
├── package.json         # Project metadata and dependencies
└── package-lock.json    # Lock file for npm dependencies
