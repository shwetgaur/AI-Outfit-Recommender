# 🤖 AI-Powered Outfit Recommender

A smart wardrobe assistant built with React Native and Node.js that uses Google Vision AI to automatically categorize clothing from images and provide smart outfit recommendations.

---

## ✨ Key Features

* **📸 AI-Powered Image Analysis:** Upload a photo of a clothing item, and the Google Vision API automatically detects its type (e.g., "shirt", "jeans"), color, and other attributes.
* **🗂️ Virtual Wardrobe:** All uploaded items are saved to a personal virtual wardrobe, accessible anytime.
* **💡 Smart Recommendations:** (Future Goal) A rule-based engine suggests compatible outfits based on item attributes and color theory.
* **🔒 Secure Authentication:** User accounts and data are secured using Firebase Authentication.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | `React Native`                                                                                                                         |
| **Backend** | `Node.js`, `Express.js`                                                                                                                |
| **Database** | `MongoDB` (with Mongoose)                                                                                                              |
| **AI Service**| `Google Cloud Vision API`                                                                                                              |
| **Auth** | `Firebase Authentication`                                                                                                              |
| **Tools** | `Git`, `Postman`                                                                                                                       |
| **Deployment**| (Planned) `Docker`, `Heroku`/`Render`                                                                                                  |

---

## 🏗️ Architecture

This application follows a standard client-server architecture:

1.  **React Native Client:** The mobile app handles user interaction, including login, image uploads, and displaying the wardrobe.
2.  **Node.js Backend API:** A RESTful API built with Express that serves as the brain of the application. It handles business logic, communicates with the database, and integrates with third-party services.
3.  **MongoDB Database:** A NoSQL database used to store user information and wardrobe item details.
4.  **Google Cloud Vision:** An external AI service used for analyzing and labeling images.
5.  **Firebase:** An external service used for handling user authentication securely.

---

## 🚀 Getting Started

### Prerequisites

* Node.js and npm
* MongoDB Atlas account
* Google Cloud Platform account with Vision API enabled
* Firebase account

### Backend Setup

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/AI-Outfit-Recommender.git](https://github.com/your-username/AI-Outfit-Recommender.git)
    ```
2.  Navigate to the backend directory:
    ```bash
    cd AI-Outfit-Recommender/backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the `backend` directory and add the following variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    GOOGLE_APPLICATION_CREDENTIALS=./config/google-vision-api-key.json
    ```
5.  Place your `google-vision-api-key.json` file inside the `backend/config` directory.
6.  Start the server:
    ```bash
    node server.js
    ```

---

