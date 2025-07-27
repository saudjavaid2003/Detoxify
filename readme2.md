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

🧩 YouTube Interest Filter — Chrome Extension
This Chrome Extension customizes a user's YouTube homepage based on their interests, which are stored and managed via the Detoxify backend.

📌 How It Works
User logs in to the Detoxify Dashboard

User selects or enters their interests.

Interests are saved to the backend via POST /api/user/interests.

Chrome Extension is installed and activated

It loads automatically when the user visits https://www.youtube.com.

Extension fetches user interests from backend

Using a stored userId or auth token.

Example endpoint: GET /api/user/interests/:userId.

Content script runs on YouTube

Grabs video titles from the homepage.

Hides any videos that do not match the user’s interests.

📁 Folder Structure
arduino
Copy
Edit
youtube-extension/
├── manifest.json
├── content.js
├── background.js (optional)
├── popup.html (optional UI)
└── README.md
⚙️ Setup Instructions
1. Store userId in Chrome Storage
In your popup or login logic, store the user ID:

js
Copy
Edit
chrome.storage.local.set({ userId: "6880ecbf2dc73d1fc341f20a" });
2. Content Script (content.js)
js
Copy
Edit
(async () => {
  const { userId } = await chrome.storage.local.get("userId");

  const response = await fetch(`https://your-backend.com/api/user/interests/${userId}`);
  const { interests } = await response.json();

  const cards = document.querySelectorAll('ytd-rich-item-renderer');
  cards.forEach(card => {
    const title = card.querySelector('h3')?.innerText?.toLowerCase() || '';
    const matches = interests.some(i => title.includes(i.toLowerCase()));
    if (!matches) card.style.display = 'none';
  });
})();
3. Manifest File (manifest.json)
json
Copy
Edit
{
  "manifest_version": 3,
  "name": "YouTube Interest Filter",
  "version": "1.0",
  "permissions": ["storage"],
  "host_permissions": ["https://www.youtube.com/*", "https://your-backend.com/*"],
  "content_scripts": [
    {
      "matches": ["https://www.youtube.com/"],
      "js": ["content.js"]
    }
  ]
}
🚀 Features Planned
✅ Filter homepage videos

✅ Backend-driven interest filtering

🔒 Secure login integration

📊 Logging video views & time spent

🧠 Learning progress stats

🎯 Future: Filter related videos, shorts, etc.

🧠 Requirements
Chrome browser (extension dev mode)

Detoxify backend running (/api/user/interests/:userId)

MongoDB + Express API

YouTube DOM structure (uses ytd-rich-item-renderer)

👨‍💻 Developer Notes
You don’t need YouTube API.

All filtering is DOM-based.

Extension works client-side using your backend's data.

