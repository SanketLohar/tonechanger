# ReTone ✨ - AI-Powered Email Tone Rewriter

> A smart, full-stack web application that leverages the Gemini API to rewrite your emails and text into the perfect tone, ensuring your message always lands the right way.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring&logoColor=6DB33F)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🚀 Live Demo

*A live demo of the application will be available here soon.*

**[LINK TO YOUR DEPLOYED APPLICA]**

---

## 📸 Screenshot

*A screenshot of the user interface.*

**<img width="1900" height="813" alt="r1" src="https://github.com/user-attachments/assets/18690268-6d7b-4276-8f42-d7dd8195fc7b" />
  <img width="1891" height="902" alt="r2" src="https://github.com/user-attachments/assets/c80ea5bf-677f-4431-8cc6-c2764a27da6e" />
  <img width="1892" height="897" alt="r3" src="https://github.com/user-attachments/assets/2e139f6e-c7e6-47db-badf-7cea439906a0" />

**

---

## 🎯 The Problem

In professional and personal communication, the tone of an email can drastically alter its impact. Striking the right balance between being formal, casual, polite, or professional can be challenging. A poorly toned email can lead to miscommunication and unintended consequences. ReTone solves this by providing a simple yet powerful tool to instantly adapt your text to the desired tone.

---

## ✨ Features

* **📝 Real-time Text Rewriting:** Paste your text directly into the chat interface for instant rewriting.
* **📎 File Upload:** Upload `.txt`, `.md`, `.doc`, and `.docx` files to have their entire content rewritten.
* **🎨 Multiple Tone Selection:** Choose from a variety of tones, including Formal, Casual, Polite, and Professional.
* **💬 Interactive Chat UI:** A modern, intuitive chat-based interface to view both your original message and the AI-generated response.
* **🔐 Secure User Authentication:** (Coming Soon) User accounts to save rewrite history and manage favorite responses.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js
* **UI Library:** Ant Design
* **API Client:** Axios
* **State Management:** React Hooks (useState, useEffect)

### Backend
* **Framework:** Spring Boot
* **Language:** Java
* **API:** RESTful API
* **Authentication:** Spring Security with JWT (JSON Web Tokens)
* **AI Integration:** Google Gemini API

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Java 17+
* Apache Maven
* Node.js and npm

### Backend Setup

1.  Clone the repository:
    ```sh
    git clone [https://github.com/SanketLohar/tonechanger.git]
    ```
2.  Navigate to the backend directory:
    ```sh
    cd your-repo-name/backend
    ```
3.  Install Maven dependencies:
    ```sh
    mvn clean install
    ```
4.  You may need to add your Google Gemini API key to the `application.properties` file in `src/main/resources/`:
    ```properties
    gemini.api.key=YOUR_GEMINI_API_KEY
    ```
5.  Run the Spring Boot application:
    ```sh
    mvn spring-boot:run
    ```
    The backend server will start on `http://localhost:8080`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```sh
    cd your-repo-name/frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the frontend directory and add the backend API URL:
    ```
    VITE_API_URL=http://localhost:8080/api
    ```
4.  Run the React application:
    ```sh
    npm run dev
    ```
    The frontend development server will start on `http://localhost:5173`.

---

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
