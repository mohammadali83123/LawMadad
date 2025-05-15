# LawMadad

**LawMadad** is a legal assistance mobile application built using **Expo** and **React Native**, designed to help users with their legal needs — from submitting queries to drafting legal documents. It leverages AI models trained on **Pakistani law**, deployed via **Hugging Face Spaces** with a **FastAPI** + **Docker** backend.

---

## 📱 App Structure

The app features a simple and intuitive two-page structure:

- **Query Input Page**: Users enter a legal query and submit it to the backend for processing.
- **Response Page**: Displays the AI-generated legal response and provides navigation options.
- **Document Draft Page**: Allows users to generate, view, and download AI-generated legal document drafts based on their input.

---

## ✨ Features

- 🔐 **Email-based User Authentication**
- 📩 **Submit Legal Queries** and receive AI-powered answers
- 🧠 **AI-Powered Responses** customized for Pakistani legal context
- 📝 **Document Drafting**: Create, edit, and save legal documents in-app
- 👤 **Profile Page**: View user details, manage account settings, access privacy policy and help center, log out, or delete your account.

---

## ⚙️ Setup & Installation

### 📦 Prerequisites

Ensure the following tools are installed:

- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### 📥 Clone the Repository

```sh
git clone https://github.com/your-username/LawMadad.git
cd LawMadad
```

### 🚀 Run the App Locally

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npx expo start
```

---

## 🤖 Backend & Model Deployment

The backend and AI models are deployed using **FastAPI** and **Docker** on **Hugging Face Spaces**.

- **Legal Query API**:  
  🌐 [https://huggingface.co/spaces/ali4568/LawMadad](https://huggingface.co/spaces/ali4568/LawMadad)

- **Document Draft API**:  
  🌐 [https://huggingface.co/spaces/ali4568/LawMadad-DocumentDraft](https://huggingface.co/spaces/ali4568/LawMadad-DocumentDraft)

These APIs handle legal query analysis and dynamic document generation tailored to user input.

---

## 📱 App Status

LawMadad is currently available on the **Google Play Store** under **Early Access**. Users are encouraged to test the app and provide feedback during this open testing phase.

---

## 🔮 Future Enhancements

- 💬 **Live Chat** with verified legal advisors
- 🎨 Enhanced **UI/UX**
- ☁️ Cloud sync and storage for document drafts

---

## 🤝 Contributing

We welcome community contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes
4. Open a Pull Request

> For major features or architectural changes, please create an issue to discuss beforehand.


---

## 📬 Contact

For questions, collaboration, or bug reports:

**Mohammad Ali**  
📧 mohammadali83123@gmail.com

---

**LawMadad** – Your AI-powered legal assistant for everyday justice.
