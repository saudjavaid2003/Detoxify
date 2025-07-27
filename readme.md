# Detoxify

I'm proud of your energy, and this project idea is 🔥. Here's a detailed checklist of the core things you need to know (and why) to build your Detoxify Chrome Extension + MERN backend like a pro:

✅ 1. Chrome Extension Basics (Manifest V3)
What to Learn:
manifest.json config

content.js: injected into YouTube

background.js: background tasks (optional)

popup.html + popup.js: UI panel (optional)

Why:
This is how you inject your code into YouTube's DOM and manipulate it to filter or block content.

How:
Learn what permissions, host_permissions, and content_scripts do in the manifest.

Practice targeting YouTube's page structure using selectors like #video-title, etc.

✅ 2. DOM Manipulation with JavaScript
What to Learn:
document.querySelector, querySelectorAll

remove(), innerText, closest()

Why:
You will need to filter out Shorts, clickbait, or non-interest videos by removing DOM nodes.

How:
You'll write logic like:

js
Copy
Edit
document.querySelectorAll("ytd-rich-item-renderer").forEach(card => {
  if (!card.innerText.toLowerCase().includes("react")) card.remove();
});
✅ 3. Chrome Extension ↔ Backend Communication
What to Learn:
fetch() API

CORS (Cross-Origin Resource Sharing)

Using chrome.storage for user data

Why:
You will call your MERN backend from the extension to get interests, post tracking data, etc.

How:
js
Copy
Edit
fetch("https://yourserver.com/api/user/interests?email=xyz", { method: "GET" })
✅ 4. MongoDB + Mongoose
What to Learn:
MongoDB schema design

Mongoose models

Connecting to DB

Why:
You need to persist user interests, clicked videos, and watch times.

How:
js
Copy
Edit
const InterestSchema = new mongoose.Schema({
  email: String,
  interests: [String]
});
✅ 5. Express.js
What to Learn:
express.Router()

req.body, req.query

Middleware (e.g., for auth)

Why:
This is the API layer your extension will talk to. It receives data and sends back what the extension needs.

✅ 6. CORS + Security
What to Learn:
What CORS is and why it's needed for browser → backend calls

Use of cors npm package

Rate limiting & headers

✅ 7. Optional: JWT Auth or Email Identification
Why:
If you want real users and sessions, you’ll need:

jsonwebtoken

Login/signup routes

Protecting routes with middleware

But if you use just email from Chrome storage, no login is needed.

✅ 8. Tracking Time Spent on YouTube
What to Learn:
setInterval, setTimeout

visibilitychange events to detect tab change

How to stop timer if user switches tabs

How:
js
Copy
Edit
let time = 0;
let timer = setInterval(() => { time++; }, 1000);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(timer);
});
✅ 9. Backend Logging API
You’ll build endpoints like:

POST /api/track/click

POST /api/track/watchtime

These save data in VideoLog.js:

js
Copy
Edit
{
  email: "user@example.com",
  videoTitle: "Intro to React",
  videoUrl: "https://youtube.com/...",
  clickedAt: new Date(),
  timeSpent: 300
}
✅ 10. (Optional) React Dashboard
If you want to show user progress:

Learn React basics

Charts with libraries like recharts

Use Axios to fetch /api/user/progress

🚀 Tools & Packages You'll Use
Tool	Why
express	API server
mongoose	MongoDB schema & models
cors	Allow extension to hit backend
dotenv	Environment variables
chrome.storage	Store email in extension
axios/fetch	To talk to backend
nodemon	Auto-reload backend on changes
concurrently	Run frontend/backend together
chrome://extensions/	Load your dev extension

🧠 Advice
Start with just filtering videos on YouTube via injected JS.

Then integrate backend interest fetch.

Then add tracking time + clicks.

Finally build dashboard.

Want me to generate:

🧾 Starter manifest.json

🛠 Full Chrome extension template

📡 Sample backend routes/controller files

📊 Dashboard starter layout in React

 1. POST /api/user/interests
Purpose: Save user-selected interests from the extension/dashboard.

Body: { userId, interests: ["Mental Health", "Cyberbullying", "Productivity"] }

Controller: addUserInterests(req, res)

2. GET /api/user/interests/:userId
Purpose: Fetch stored interests to personalize content or search.

Controller: getUserInterests(req, res)

3. PUT /api/user/interests/:userId
Purpose: Update/replace current interests.

Controller: updateUserInterests(req, res)

4. GET /api/user/profile/:userId
Purpose: Fetch dashboard details — could include user's basic info, interests, and todo stats.

Controller: getUserProfile(req, res)

5. DELETE /api/user/interests/:userId
Optional: If you want to allow users to remove all interests.

Controller: deleteUserInterests(req, res)

🚧 Separate Controllers You’ll Have:
✅ TodoController.js
Handles:

POST /api/todos

GET /api/todos/:userId

PUT /api/todos/:todoId

DELETE /api/todos/:todoId

✅ TrackingController.js
Handles:

POST /api/tracking → Log when a user watches a video

GET /api/tracking/:userId → Get watch history or analytics

Maybe even GET /api/tracking/summary/:userId for insights
🚀 Phase 1: Chrome Extension (Frontend)
✅ Goal: Filter YouTube feed based on saved interests

1. Setup Chrome Extension Folder
Structure:

pgsql
Copy
Edit
/extension
  |-- manifest.json
  |-- content.js
  |-- background.js (optional)
  |-- popup.html (optional UI)
  |-- popup.js
2. Build manifest.json
Basic V3 config:

json
Copy
Edit
{
  "manifest_version": 3,
  "name": "Detoxify",
  "version": "1.0",
  "permissions": ["storage", "scripting"],
  "host_permissions": ["https://www.youtube.com/*"],
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/*"],
      "js": ["content.js"]
    }
  ],
  "action": {
    "default_popup": "popup.html"
  }
}
3. Write content.js logic
Fetch interests from your backend:

js
Copy
Edit
(async () => {
  const userEmail = await getFromStorage('email');

  const res = await fetch(`https://yourdomain.com/api/user/interests?email=${userEmail}`);
  const data = await res.json();
  const interests = data.interests || [];

  document.querySelectorAll("ytd-rich-item-renderer").forEach(card => {
    const title = card.innerText.toLowerCase();
    const matches = interests.some(i => title.includes(i.toLowerCase()));
    if (!matches) card.remove();
  });
})();
🔒 Phase 2: Finalize Backend APIs
✅ You already built:

authController

interestController

todoController

Now build:

✅ TrackingController
js
Copy
Edit
// POST /api/tracking
const logWatchTime = async (req, res) => {
  const { videoTitle, videoUrl, timeSpent } = req.body;
  const userId = req.user.id;

  try {
    const log = await VideoLog.create({
      user: userId,
      videoTitle,
      videoUrl,
      clickedAt: new Date(),
      timeSpent
    });
    res.status(201).json({ message: "Logged", log });
  } catch (err) {
    res.status(500).json({ message: "Error logging" });
  }
};

// GET /api/tracking
const getLogs = async (req, res) => {
  const userId = req.user.id;

  try {
    const logs = await VideoLog.find({ user: userId });
    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
  }
};
📊 Phase 3: (Optional) React Dashboard
Features:
Display todos

Display tracked videos

Show interests

Show stats (time spent, total todos completed)

Libraries:

axios

recharts for graphs

tailwindcss or chakra-ui

🧠 Phase 4: Tracking Script in Extension
Inside content.js:

js
Copy
Edit
let watchTime = 0;
const timer = setInterval(() => { watchTime++; }, 1000);

window.addEventListener('beforeunload', async () => {
  await fetch("https://yourdomain.com/api/tracking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${yourSavedToken}`
    },
    body: JSON.stringify({
      videoTitle: document.title,
      videoUrl: window.location.href,
      timeSpent: watchTime
    })
  });
});
✅ Final Structure Overview
markdown
Copy
Edit
backend/
├── controllers/
│   ├── authController.js
│   ├── interestController.js
│   ├── todoController.js
│   └── trackingController.js
├── models/
│   ├── User.js
│   ├── Interest.js
│   ├── Todo.js
│   └── VideoLog.js
├── routes/
│   ├── auth.routes.js
│   ├── interest.routes.js
│   ├── todo.routes.js
│   └── tracking.routes.js
└── middlewares/
    └── auth.middleware.js
🔚 Final Step: Polish & Deploy
✅ Backend → Deploy on Render, Railway, or Vercel serverless function

✅ Extension → Zip it and load via chrome://extensions

✅ Testing → Real user behavior

✅ Analytics Dashboard (optional but powerful)

✅ README.md → For GitHub repo

Do you want:

A VideoLog.js model?

A polished React dashboard template?

Chrome extension zip upload instructions?

Just say the word — I’ll generate it right away.#   D e t o x i f y  
 