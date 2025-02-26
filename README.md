# LawMadad

LawMadad is a legal assistance application built using **Expo** and **React Native**, designed to help users with legal queries. The app has a simple two-page structure:

1. **Query Input Page**: Users enter a legal query and submit it to the backend.
2. **Response Page**: Displays the response received from the backend and allows users to return to the input page.

## Features
- User authentication with email-based login.
- Query submission to the backend.
- Display of AI-generated legal responses.
- Role-based navigation after login.
- **Document Draft Feature**: Users can create, edit, and save legal document drafts within the app.

## Tech Stack
- **Frontend:** React Native (Expo)
- **Backend:** Node.js (with an API for handling legal queries)
- **Deployment:** AWS EC2 for backend services

## Setup & Installation

### Prerequisites
Ensure you have the following installed:
- Node.js
- Expo CLI
- Git

### Clone the Repository
```sh
git clone https://github.com/your-username/LawMadad.git
cd LawMadad
```

### Install Dependencies
```sh
npm install
```

### Run the App
Start the Expo development server:
```sh
npx expo start
```

## API Configuration
The login API is located at:
```
http://localhost:3000/dev/loginUser
```
Ensure your backend is running before testing login functionality.

## Deployment
For backend deployment on AWS EC2:
1. Enable **Instance Auto-Recovery** to ensure the server restarts automatically.
2. Configure the backend to handle incoming queries.
3. Update API endpoints in the frontend as needed.

## Future Enhancements
- Implement real-time chat with legal advisors.
- Add multi-language support.
- Improve UI/UX for better user experience.

## Contributing
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first.

## License
This project is licensed under the MIT License.

## Contact
For any issues, contact **Mohammad Ali** at **mohammadali83123.com**.

