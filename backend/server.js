const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const twilio = require("twilio");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const xss = require('xss');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.twilioAccountSid;
const authToken = process.env.twilioAuthToken;
const twilioNumber = '+16814484190';
const client = twilio(accountSid, authToken);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/binzDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};
connectDB();

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many registration attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return xss(input.trim());
};

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    state: String,
    phoneNumber: String,
    coins: { type: Number, default: 0 },
});
const User = mongoose.model("User", UserSchema);

const LeaderboardEntry = mongoose.model("LeaderboardEntry", new mongoose.Schema({
    name: { type: String, required: true },
    coins: { type: Number, required: true },
}));

const leaderboardNames = [
    "Aarav Mehta", "Diya Kapoor", "Kabir Shah", "Meera Nair",
    "Rohan Verma", "Ishita Rao", "Vivaan Singh", "Anaya Joshi",
];
const EWASTE_TRACKING_STATUSES = [
    "Ticket Created",
    "Pickup Scheduled",
    "Picked Up",
    "At Facility",
    "Processing",
    "Material Recovery",
    "Final Disposal",
    "Recycled",
    "Cancelled",
];

const DEFAULT_TRACKING_STEPS = [
    { status: "Picked Up", label: "Picked Up", fallbackTime: "Pending" },
    { status: "At Facility", label: "At Facility", fallbackTime: "Pending" },
    { status: "Processing", label: "Processing", fallbackTime: "Pending" },
    { status: "Material Recovery", label: "Material Recovery", fallbackTime: "Pending" },
    { status: "Final Disposal", label: "Final Disposal", fallbackTime: "Pending" },
];

function normalizeTicketStatus(status) {
    if (typeof status !== "string") return null;
    const cleaned = sanitizeInput(status);
    return EWASTE_TRACKING_STATUSES.find((item) => item.toLowerCase() === cleaned.toLowerCase()) || null;
}

function buildTrackingSteps(currentStatus, history = []) {
    const activeIndex = DEFAULT_TRACKING_STEPS.findIndex((step) => step.status === currentStatus);
    const historyByStatus = new Map(
        history
            .filter((item) => item.status)
            .map((item) => [item.status, item]),
    );

    return DEFAULT_TRACKING_STEPS.map((step, index) => {
        const historyItem = historyByStatus.get(step.status);
        let state = "pending";

        if (currentStatus === "Cancelled") state = historyItem ? "done" : "cancelled";
        else if (currentStatus === "Ticket Created" || currentStatus === "Pickup Scheduled") state = "pending";
        else if (index < activeIndex) state = "done";
        else if (index === activeIndex) state = currentStatus === "Final Disposal" ? "done" : "active";

        return {
            status: step.status,
            label: step.label,
            state,
            time: historyItem?.changedAt || step.fallbackTime,
            note: historyItem?.note || "",
            facility: historyItem?.facility || "",
        };
    });
}

function buildReportDownloadUrl(ticket) {
    return `/track-ewaste/${encodeURIComponent(ticket.ticketID)}/report`;
}

function buildTrackingReport(ticket) {
    const productName = ticket.productName || ticket.eWasteType;
    const productCategory = ticket.productCategory || ticket.eWasteType;
    const lines = [
        "BinZ E-Waste Recycling Report",
        "",
        `Tracking ID: ${ticket.ticketID}`,
        `Product ID: ${ticket.productId || ticket.ticketID}`,
        `Product Name: ${productName}`,
        `Category: ${productCategory}`,
        `Current Status: ${ticket.status}`,
        `Status Note: ${ticket.statusNote || ""}`,
        `Facility: ${ticket.facility || ""}`,
        `Created At: ${ticket.createdAt || ticket.date || ""}`,
        `Updated At: ${ticket.updatedAt || ""}`,
        "",
        "Checkpoint History:",
    ];

    (ticket.statusHistory || []).forEach((item) => {
        lines.push(`- ${item.status}: ${item.note || "No note"} (${item.changedAt || "time pending"})`);
    });

    return `${lines.join("\n")}\n`;
}

function buildTrackingResponse(ticket, options = {}) {
    const productName = ticket.productName || ticket.eWasteType;
    const productCategory = ticket.productCategory || ticket.eWasteType;
    const response = {
        ticketID: ticket.ticketID,
        trackingID: ticket.ticketID,
        product: {
            id: ticket.productId || ticket.ticketID,
            name: productName,
            category: productCategory,
            type: ticket.eWasteType,
            imageUrl: ticket.productImageUrl,
            imageAlt: `${productName} product image`,
        },
        eWasteType: ticket.eWasteType,
        productId: ticket.productId || ticket.ticketID,
        productName,
        productCategory,
        productImageUrl: ticket.productImageUrl,
        description: ticket.description,
        status: ticket.status,
        statusNote: ticket.statusNote,
        facility: ticket.facility,
        scheduledPickupAt: ticket.scheduledPickupAt,
        estimatedCompletionAt: ticket.estimatedCompletionAt,
        recyclingReportUrl: ticket.recyclingReportUrl,
        reportDownloadUrl: buildReportDownloadUrl(ticket),
        report: {
            available: true,
            downloadUrl: buildReportDownloadUrl(ticket),
            externalUrl: ticket.recyclingReportUrl || null,
        },
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        trackingSteps: buildTrackingSteps(ticket.status, ticket.statusHistory || []),
        history: ticket.statusHistory,
    };

    if (options.includeCustomer) {
        response.customer = {
            name: ticket.name,
            email: ticket.email,
            pickupAddress: ticket.pickupAddress,
        };
        response.name = ticket.name;
        response.email = ticket.email;
        response.pickupAddress = ticket.pickupAddress;
    }

    return response;
}

function requireAdmin(req, res, next) {
    const expectedKey = process.env.ADMIN_API_KEY;
    const providedKey = req.header("x-admin-key");

    if (!expectedKey) {
        return res.status(500).json({ message: "Admin API key is not configured on the server." });
    }

    if (!providedKey || providedKey !== expectedKey) {
        return res.status(401).json({ message: "Unauthorized admin request." });
    }

    next();
}

app.post("/register", registrationLimiter, async (req, res) => {
    try {
        const { firstName, lastName, email, password, state } = req.body;
        console.log("📥 Received data:", req.body);

        if (!firstName || !lastName || !email || !password || !state) {
            return res.status(400).json({ message: "First name, last name, email, password and state are required!" });
        }

        const sanitizedFirstName = sanitizeInput(firstName);
        const sanitizedLastName = sanitizeInput(lastName);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedState = sanitizeInput(state);

        if (!validateEmail(sanitizedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address!" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character!"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const existingUser = await User.findOne({ email: sanitizedEmail.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = new User({
            firstName: sanitizedFirstName,
            lastName: sanitizedLastName,
            email: sanitizedEmail.toLowerCase(),
            password: hashedPassword,
            state: sanitizedState,
            coins: 5
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "✅ Registration successful! 5 bonus coins added!",
            User: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                state: savedUser.state,
                coins: savedUser.coins
            }
        });

    } catch (error) {
        console.error("❌ Error during registration:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "User already exists!" });
        }
        res.status(500).json({ message: "❌ Server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: "❌ Email is required!" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "❌ Invalid credentials!" });
        }

        if (!password || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "❌ Invalid credentials!" });
        }

        res.status(200).json({
            message: "✅ Login successful!",
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            state: user.state,
            phoneNumber: user.phoneNumber,
            coins: user.coins || 0,
        });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

app.post("/sendSMS", async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber || phoneNumber.length !== 10) {
            return res.status(400).json({ message: "⚠️ Invalid phone number!" });
        }
        const fullPhoneNumber = `+91${phoneNumber}`;
        const message = await client.messages.create({
            body: "Your slot is booked successfully! A Rider will be assigned soon. Thanks For Contacting Us!",
            from: twilioNumber,
            to: fullPhoneNumber,
        });
        console.log("✅ Message sent! SID:", message.sid);
        res.status(200).json({ message: "📩 SMS sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending SMS:", error);
        res.status(500).json({ message: "❌ Failed to send SMS!" });
    }
});

app.post("/storePhoneNumber", async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        if (!email || !phoneNumber) {
            return res.status(400).json({ message: "⚠️ Email and Phone Number are required!" });
        }
        const updatedUser = await User.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { phoneNumber } }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "❌ User not found!" });
        }
        res.status(200).json({ message: "✅ Phone number stored successfully!" });
    } catch (error) {
        console.error("❌ Error storing phone number:", error);
        res.status(500).json({ message: "❌ Server error!" });
    }
});

app.get("/leaderboard", async (req, res) => {
    try {
        let entries = await User.find({})
            .sort({ coins: -1 })
            .limit(8)
            .select("firstName lastName coins _id");

        entries = entries.map((user) => ({
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            coins: user.coins || 0,
        }));

        if (entries.length === 0) {
            entries = await LeaderboardEntry.find({})
                .sort({ coins: -1 })
                .limit(8)
                .select("name coins _id");

            if (entries.length === 0) {
                const seedEntries = leaderboardNames.map((name) => ({
                    name,
                    coins: Math.floor(Math.random() * 901) + 100,
                }));
                await LeaderboardEntry.insertMany(seedEntries);
                entries = await LeaderboardEntry.find({})
                    .sort({ coins: -1 })
                    .limit(8)
                    .select("name coins _id");
            }
        }

        res.status(200).json({ leaderboard: entries });
    } catch (error) {
        console.error("❌ Leaderboard Fetch Error:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

app.get("/getCoins/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "❌ User not found!" });
        }
        res.status(200).json({ coins: user.coins });
    } catch (error) {
        console.error("❌ Error fetching coins:", error);
        res.status(500).json({ message: "❌ Server error!" });
    }
});

// ✅ Reward coins endpoint
app.post("/rewardCoins", async (req, res) => {
    try {
        const { email, coins } = req.body;
        if (!email || typeof coins !== 'number') {
            return res.status(400).json({ message: "⚠️ Email and coins are required!" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "❌ User not found!" });
        }

        user.coins += coins;
        await user.save();

        res.status(200).json({ message: `✅ ${coins} coins added!`, coins: user.coins });
    } catch (error) {
        console.error("❌ Error updating coins:", error);
        res.status(500).json({ message: "❌ Server error while rewarding coins" });
    }
});

app.get("/register", (req, res) => res.send("✅ Registration Route is Working!"));
app.get("/login", (req, res) => res.send("✅ Login Route is Working!"));

if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Simulated "processing" — waits 5s, then awards a random coin count (5-10).
// Swap the setTimeout body for a real detector call later without touching the route contract.
app.post("/uploadVideo", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No video file received." });
        }
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        setTimeout(async () => {
            try {
                const reward = Math.floor(Math.random() * 6) + 5; // random 5-10
                user.coins += reward;
                await user.save();
                res.json({ message: `Cleanup verified! You earned ${reward} coins!`, coins: user.coins });
            } catch (saveError) {
                console.error("❌ Error awarding coins after processing buffer:", saveError);
                res.status(500).json({ message: "Error processing video." });
            }
        }, 5000);
    } catch (error) {
        console.error("❌ Upload error:", error);
        res.status(500).json({ message: "❌ Server error while processing upload." });
    }
});

// E-waste ticket and tracking system
const ticketSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    eWasteType: { type: String, required: true },
    productName: String,
    productCategory: String,
    productId: { type: String, unique: true, sparse: true, index: true },
    productImageUrl: String,
    description: String,
    pickupAddress: String,
    ticketID: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: EWASTE_TRACKING_STATUSES, default: "Ticket Created" },
    statusNote: { type: String, default: "Your e-waste ticket has been created." },
    facility: { type: String, default: "Greater Noida, UP" },
    scheduledPickupAt: Date,
    estimatedCompletionAt: Date,
    recyclingReportUrl: String,
    statusHistory: [
        {
            status: { type: String, enum: EWASTE_TRACKING_STATUSES },
            note: String,
            facility: String,
            changedBy: String,
            changedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

async function createUniqueTicketID() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const ticketID = "EW-" + Math.floor(100000 + Math.random() * 900000);
        const existingTicket = await Ticket.exists({ ticketID });
        if (!existingTicket) return ticketID;
    }

    return `EW-${Date.now()}`;
}

async function createUniqueProductId() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const productId = "BINZ-" + Math.floor(10000 + Math.random() * 90000);
        const existingProduct = await Ticket.exists({ productId });
        if (!existingProduct) return productId;
    }

    return `BINZ-${Date.now()}`;
}

app.post("/submit-ticket", async (req, res) => {
    try {
        const { name, email, eWasteType, productName, productCategory, productImageUrl, description, pickupAddress, scheduledPickupAt } = req.body;
        if (!name || !email || !eWasteType) {
            return res.status(400).json({ message: "Name, email and e-waste type are required." });
        }

        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        if (!validateEmail(sanitizedEmail)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        const ticketID = await createUniqueTicketID();
        const productId = await createUniqueProductId();
        const sanitizedProductName = sanitizeInput(productName || eWasteType);
        const sanitizedProductCategory = sanitizeInput(productCategory || eWasteType);
        const initialStatus = "Ticket Created";
        const initialNote = "Your e-waste ticket has been created.";
        const newTicket = new Ticket({
            name: sanitizeInput(name),
            email: sanitizedEmail,
            eWasteType: sanitizeInput(eWasteType),
            productName: sanitizedProductName,
            productCategory: sanitizedProductCategory,
            productId,
            productImageUrl: sanitizeInput(productImageUrl || ""),
            description: sanitizeInput(description || ""),
            pickupAddress: sanitizeInput(pickupAddress || ""),
            scheduledPickupAt: scheduledPickupAt ? new Date(scheduledPickupAt) : undefined,
            ticketID,
            status: initialStatus,
            statusNote: initialNote,
            statusHistory: [
                {
                    status: initialStatus,
                    note: initialNote,
                    changedBy: "system",
                },
            ],
        });
        await newTicket.save();

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: sanitizedEmail,
                subject: "E-Waste Ticket Confirmation",
                text: `Hello ${newTicket.name}\n\nYour ticket has been created successfully.\nTicket ID: ${ticketID}\nTrack it at: /track-ewaste/${ticketID}\n\nWe will contact you soon!\n\nThank you!`
            };

            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error("⚠️ Ticket email failed (ticket still created):", mailError.message);
        }

        res.status(201).json({
            message: "Ticket created successfully!",
            ticketID,
            trackingID: ticketID,
            tracking: buildTrackingResponse(newTicket, { includeCustomer: true }),
        });

    } catch (error) {
        console.error("Error submitting ticket:", error);
        res.status(500).json({ message: "Error submitting ticket" });
    }
});

app.get("/track-ewaste/:ticketID", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ ticketID: sanitizeInput(req.params.ticketID) });
        if (!ticket) {
            return res.status(404).json({ message: "Tracking ID not found." });
        }

        res.status(200).json({ tracking: buildTrackingResponse(ticket) });
    } catch (error) {
        console.error("Error fetching e-waste tracking:", error);
        res.status(500).json({ message: "Error fetching e-waste tracking" });
    }
});

app.get("/track-ewaste/:ticketID/report", async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ ticketID: sanitizeInput(req.params.ticketID) });
        if (!ticket) {
            return res.status(404).json({ message: "Tracking ID not found." });
        }

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="binz-ewaste-report-${ticket.ticketID}.txt"`);
        res.status(200).send(buildTrackingReport(ticket));
    } catch (error) {
        console.error("Error downloading e-waste report:", error);
        res.status(500).json({ message: "Error downloading e-waste report" });
    }
});
app.get("/admin/ewaste-tickets", requireAdmin, async (req, res) => {
    try {
        const { status, email } = req.query;
        const filter = {};

        const normalizedStatus = status ? normalizeTicketStatus(status) : null;
        if (status && !normalizedStatus) {
            return res.status(400).json({ message: "Invalid status value." });
        }
        if (normalizedStatus) filter.status = normalizedStatus;
        if (email) filter.email = sanitizeInput(email).toLowerCase();

        const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).limit(100);
        res.status(200).json({ tickets: tickets.map((ticket) => buildTrackingResponse(ticket, { includeCustomer: true })) });
    } catch (error) {
        console.error("Error fetching admin e-waste tickets:", error);
        res.status(500).json({ message: "Error fetching e-waste tickets" });
    }
});

app.get("/admin/ewaste-tickets/:ticketID", requireAdmin, async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ ticketID: sanitizeInput(req.params.ticketID) });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        res.status(200).json({ ticket: buildTrackingResponse(ticket, { includeCustomer: true }) });
    } catch (error) {
        console.error("Error fetching admin e-waste ticket:", error);
        res.status(500).json({ message: "Error fetching e-waste ticket" });
    }
});

app.patch("/admin/ewaste-tickets/:ticketID/status", requireAdmin, async (req, res) => {
    try {
        const status = normalizeTicketStatus(req.body.status);
        if (!status) {
            return res.status(400).json({
                message: "Invalid status value.",
                allowedStatuses: EWASTE_TRACKING_STATUSES,
            });
        }

        const ticket = await Ticket.findOne({ ticketID: sanitizeInput(req.params.ticketID) });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        const statusNote = sanitizeInput(req.body.statusNote || req.body.note || "");
        const facility = sanitizeInput(req.body.facility || ticket.facility || "");
        const changedBy = sanitizeInput(req.body.changedBy || "admin");

        ticket.status = status;
        ticket.statusNote = statusNote || ticket.statusNote;
        ticket.facility = facility;
        if (req.body.scheduledPickupAt) ticket.scheduledPickupAt = new Date(req.body.scheduledPickupAt);
        if (req.body.estimatedCompletionAt) ticket.estimatedCompletionAt = new Date(req.body.estimatedCompletionAt);
        if (req.body.recyclingReportUrl) ticket.recyclingReportUrl = sanitizeInput(req.body.recyclingReportUrl);
        if (req.body.productName) ticket.productName = sanitizeInput(req.body.productName);
        if (req.body.productCategory) ticket.productCategory = sanitizeInput(req.body.productCategory);
        if (req.body.productImageUrl) ticket.productImageUrl = sanitizeInput(req.body.productImageUrl);
        ticket.statusHistory.push({
            status,
            note: ticket.statusNote,
            facility: ticket.facility,
            changedBy,
        });

        await ticket.save();
        res.status(200).json({
            message: "Ticket status updated successfully.",
            ticket: buildTrackingResponse(ticket, { includeCustomer: true }),
        });
    } catch (error) {
        console.error("Error updating e-waste ticket status:", error);
        res.status(500).json({ message: "Error updating e-waste ticket status" });
    }
});

// ✅ Unified Server Start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});