# Detoxify: Focused YouTube Chrome Extension with MERN Backend

## Overview

**Detoxify** is a Chrome extension powered by a MERN backend. Its purpose is to help users stay focused on specific types of content on YouTube (e.g., only programming/coding videos) while tracking their activity to encourage mindful video consumption. The system filters YouTube content based on user-set interests and hides distractions like Shorts and clickbait.

Users can:

* See only videos matching their interests (from backend)
* Block Shorts and clickbait thumbnails
* Track video clicks and time spent
* View progress and analytics on a dashboard

---

## 🧠 Architecture

### Components:

* **Chrome Extension**: Injects logic into YouTube pages, filters videos, and tracks activity.
* **Backend (MERN)**: Stores user preferences, click/watch logs, and provides APIs.
* **(Optional) Dashboard**: React app to visualize user stats and preferences.

---

## 🧩 Backend Structure (MERN)

```
backend/
├── controllers/
│   ├── auth.controller.js          // (Optional) For login/signup
│   ├── user.controller.js          // Manage interests
│   └── tracking.controller.js      // Logs video clicks and time
│
├── models/
│   ├── User.js                     // Email, password (if needed)
│   ├── Interest.js                 // Interests per user
│   └── VideoLog.js                 // Logs per watched/clicked video
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── tracking.routes.js
│
├── middlewares/
│   └── auth.middleware.js          // Protect routes (optional)
│
├── config/
│   └── db.js                       // MongoDB connection
│
└── server.js                       // App entry point
```

---

## 📦 Chrome Extension Structure

```
extension/
├── manifest.json                   // Chrome config (Manifest V3)
├── content.js                      // Injected into YouTube
├── background.js                   // (Optional) for data handling
├── popup.html                      // (Optional UI)
├── popup.js
└── icons/
```

---

## 🔁 Flow of Data

1. User installs extension.
2. Extension injects `content.js` into YouTube.
3. `content.js` fetches user interests from backend:

   ```js
   GET /api/user/interests?email=xyz@example.com
   ```
4. It parses the YouTube page, filters out unrelated videos (by title, keywords).
5. If user clicks a video:

   ```js
   POST /api/track/click
   Body: { email, videoTitle, videoUrl, timestamp }
   ```
6. While video is open, time is tracked (intervals or visibility API).
7. On video close:

   ```js
   POST /api/track/watchtime
   Body: { email, videoUrl, timeSpentInSeconds }
   ```
8. All activity is logged in MongoDB.
9. Dashboard reads this data:

   ```js
   GET /api/user/progress?email=xyz@example.com
   ```

---

## 🧪 APIs

### User Routes:

* `POST /api/user/interests` → set/update interests
* `GET /api/user/interests?email=` → get user interests
* `GET /api/user/progress?email=` → get summary: total time, videos watched, most watched

### Tracking Routes:

* `POST /api/track/click` → save clicked video
* `POST /api/track/watchtime` → log watch duration

### Auth Routes (optional):

* `POST /api/auth/signup`
* `POST /api/auth/login`

---

## 🧩 Models

### User.js

```js
{
  email: String,
  password: String (optional),
  createdAt: Date
}
```

### Interest.js

```js
{
  email: String,
  interests: [String] // e.g., ['react', 'machine learning']
}
```

### VideoLog.js

```js
{
  email: String,
  videoTitle: String,
  videoUrl: String,
  clickedAt: Date,
  timeSpent: Number // in seconds
}
```

---

## 🚫 Blocking Distractions

In `content.js`:

* **Block Shorts:**

  ```js
  document.querySelectorAll("ytd-rich-section-renderer").forEach(sec => {
    if (sec.innerText.includes("Shorts")) sec.remove();
  });
  ```

* **Block Clickbait:**
  Use regex/keywords:

  ```js
  const bannedWords = ["you won't believe", "crazy", "shocking"];
  const videos = document.querySelectorAll("#video-title");
  videos.forEach(vid => {
    if (bannedWords.some(word => vid.innerText.toLowerCase().includes(word))) {
      vid.closest("ytd-rich-item-renderer").remove();
    }
  });
  ```

---

## 📈 Progress Dashboard (Optional)

If you later build a frontend (React):

* Show total time spent
* Videos watched
* Charts (e.g., pie of topics)
* Current interests
* Button to update interests

---

## 🌐 Tech Stack

* **MongoDB** – store data
* **Express.js** – API layer
* **Node.js** – server runtime
* **Chrome Extension** – user interface and filter
* **JavaScript DOM** – manipulate YouTube content
* **(Optional) React** – dashboard visualization

---

## ✅ Future Ideas

* OAuth (Google login)
* ML-based clickbait detection
* Daily goals/reminders
* Pomodoro integration

---

## ✅ Summary

Detoxify gives users control over their YouTube experience:

* Filter videos using a Chrome extension
* Feed personalized by MERN backend
* Track attention, time, and click behavior
* Optional dashboard to visualize progress

Perfect for coders, students, or anyone who wants a **distraction-free YouTube**.

---diagram

Let’s build! 💻


Extension Popup (Set Interests)
          ↓
     [Backend API]
          ↓
MongoDB stores interests
          ↓
content.js reads interests → filters YouTube feed

User watches/clicks a video
          ↓
    content.js sends click data
          ↓
     [Backend stores progress]
          ↓
  Dashboard shows progress report
