# Twitter Clone — Internship Project

A full-stack Twitter clone built with the MERN stack, extended with 6 additional feature tasks for the internship submission.

## 🔗 Live Links
- **Live Site:** https://training-wheat-kappa.vercel.app
- **Backend API:** https://training-yzk2.onrender.com (or training-1-gpwl.onrender.com)
- **GitHub Repo:** https://github.com/rakshithagp7-hue/training-

## 🛠️ Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Deployment:** Vercel (frontend), Render (backend)

## ✨ Core Features
- User registration & login
- Post text tweets
- View feed

## 🚀 Additional Internship Tasks

1. **Subscription Plans + Mock Payment Gateway**
   Bronze/Silver/Gold plans with a mock payment flow (Razorpay KYC wasn't feasible for a student project, so a mock gateway simulates the payment process). Time-restricted to 10 AM–11 AM IST.

2. **Forgot Password + Password Generator**
   Users can reset their password via email/phone; a new random password is auto-generated and sent to their registered email.

3. **Login History + Chrome OTP Login + Mobile Time Restriction**
   - Login attempts are logged with browser, OS, device type, and IP.
   - Chrome browser logins require OTP verification via email.
   - Mobile device logins are restricted to 10:00 AM–1:00 PM.

4. **Audio Tweet Upload**
   Users can upload short audio clips (max 5 minutes) as tweets, with OTP verification required before posting. Restricted to 2:00 PM–7:00 PM IST.

5. **Notifications**
   Keyword-based notifications with an on/off toggle in user settings.

6. **Multi-language Support**
   Users can switch the app's language. French requires OTP verification via email; other languages use a mock SMS OTP (logged to the server console).

## ⚠️ Known Limitations

- **OTP Email Delivery:** Render's free tier restricts/delays outbound SMTP connections to Gmail. OTP codes and generated passwords are always logged to the server console (visible via Render's Logs tab) as a reliable fallback if the email doesn't arrive. All OTP logic and verification is fully functional — only the email transport is affected by the free hosting tier.
- **Audio File Storage:** Render's free tier uses an ephemeral filesystem, so uploaded audio files may be cleared when the service restarts after inactivity.

## 🖥️ Running Locally

**Backend:**
```bash
cd backend
npm install
npm start
```
Create a `.env` file in `backend/` with:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📱 Responsive Design
Tested and confirmed working across desktop, tablet (iPad), and mobile viewport sizes.


