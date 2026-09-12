# BinZ Backend

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI (and Twilio/Gmail if you want those features live)
npm start               # or: npm run dev (nodemon, auto-restart)
```

Server runs on `http://localhost:5000` by default (`PORT` in `.env` to change it).

## Requirements

- **MongoDB** — required. Either run one locally (`mongodb://localhost:27017/binzDB` is the default) or point `MONGO_URI` at Atlas/another instance. The server exits on startup if it can't connect.
- **Twilio** — optional. Without `twilioAccountSid` / `twilioAuthToken`, `POST /sendSMS` will fail but pickup booking on the frontend still succeeds (SMS is called best-effort).
- **Gmail** — optional. Without `EMAIL_USER` / `EMAIL_PASS` (a Gmail **App Password**, not your login password), the ticket confirmation email will silently fail but the ticket is still created.
- **Video upload (`POST /uploadVideo`)** — currently simulated: waits 5 seconds then awards a random 5-10 coins, no Python/detector script needed. Swap the `setTimeout` body in `server.js` for a real detection call whenever you're ready to wire that up.

## Auth model

`/register` requires a strong password and stores only its bcrypt hash. `/login` requires the email and password, verifies the password against that hash, and rejects both nonexistent accounts and incorrect credentials. New accounts start with five reward coins; users do not receive coins merely by logging in.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/register` | Create account (firstName, lastName, email, state) |
| POST | `/login` | Fetch account by email |
| POST | `/sendSMS` | Send pickup-confirmation SMS via Twilio |
| POST | `/storePhoneNumber` | Save a phone number to a user |
| GET | `/leaderboard` | Top 3 users by coins |
| GET | `/getCoins/:email` | Current coin balance |
| POST | `/rewardCoins` | Add (or subtract) coins for a user |
| POST | `/uploadVideo` | Upload a cleanup video for garbage detection |
| POST | `/submit-ticket` | Raise an e-waste pickup ticket and return a tracking ID |
| GET | `/track-ewaste/:ticketID` | Public tracking view for a user's e-waste ticket |
| GET | `/track-ewaste/:ticketID/report` | Download the recycling report for a tracking ID |
| GET | `/admin/ewaste-tickets` | Admin list of e-waste tickets; requires x-admin-key |
| GET | `/admin/ewaste-tickets/:ticketID` | Admin ticket detail; requires x-admin-key |
| PATCH | `/admin/ewaste-tickets/:ticketID/status` | Admin status/product/report update; requires x-admin-key |

## E-waste tracking API

When a user submits an e-waste ticket, the backend creates a tracking record. The frontend can keep using `POST /submit-ticket`; the response now includes `ticketID`, `trackingID`, product details, status, checkpoints, and a report download URL.

Admin routes require this header:

```http
x-admin-key: your-admin-key
```

Set the matching value in `.env`:

```bash
ADMIN_API_KEY=your-admin-key
```

Allowed status values:

```text
Ticket Created
Pickup Scheduled
Picked Up
At Facility
Processing
Material Recovery
Final Disposal
Recycled
Cancelled
```

Create a ticket:

```http
POST /submit-ticket
Content-Type: application/json

{
  "name": "Ahsan",
  "email": "ahsan@example.com",
  "eWasteType": "Laptop",
  "productName": "Dell Inspiron 15",
  "productCategory": "Laptop (E-waste)",
  "productImageUrl": "https://example.com/laptop.png",
  "description": "Old laptop for recycling",
  "pickupAddress": "Greater Noida"
}
```

Track as a user:

```http
GET /track-ewaste/EW-123456
```

The public tracking response includes:

```json
{
  "trackingID": "EW-123456",
  "product": {
    "id": "BINZ-48291",
    "name": "Dell Inspiron 15",
    "category": "Laptop (E-waste)",
    "type": "Laptop",
    "imageUrl": "https://example.com/laptop.png"
  },
  "status": "Processing",
  "statusNote": "At recycling facility",
  "trackingSteps": [],
  "reportDownloadUrl": "/track-ewaste/EW-123456/report"
}
```

Download report as a user:

```http
GET /track-ewaste/EW-123456/report
```

List tickets as admin:

```http
GET /admin/ewaste-tickets
x-admin-key: your-admin-key
```

Update status as admin:

```http
PATCH /admin/ewaste-tickets/EW-123456/status
Content-Type: application/json
x-admin-key: your-admin-key

{
  "status": "Processing",
  "statusNote": "Device is being dismantled and sorted.",
  "productName": "Dell Inspiron 15",
  "productCategory": "Laptop (E-waste)",
  "productImageUrl": "https://example.com/laptop.png",
  "facility": "Greater Noida, UP",
  "estimatedCompletionAt": "2026-09-20T10:00:00.000Z",
  "recyclingReportUrl": "https://example.com/report.pdf"
}
```