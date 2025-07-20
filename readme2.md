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

