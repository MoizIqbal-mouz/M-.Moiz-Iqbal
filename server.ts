import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'mouzmughal@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });

  const sendWelcomeEmail = async (toEmail: string, username: string) => {
    if (!process.env.EMAIL_PASS) {
      console.log("Email password not set, skipping welcome email.");
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mouzmughal@gmail.com',
      to: toEmail,
      subject: 'Welcome to Coral Whisper Fragrance',
      text: `Hello ${username},\n\nWelcome to Coral Whisper Fragrance! Your account has been successfully registered.\n\nExplore our deep-sea inspired fragrances and start your journey with us.\n\nBest regards,\nCoral Whisper Team`,
      html: `
        <div style="font-family: sans-serif; color: #001219; background-color: #e9d8a6; padding: 40px; border-radius: 20px;">
          <h1 style="color: #005f73;">Welcome to Coral Whisper Fragrance</h1>
          <p>Hello <strong>${username}</strong>,</p>
          <p>Your account has been successfully registered. We are thrilled to have you on board!</p>
          <p>Explore our deep-sea inspired fragrances and start your journey with us.</p>
          <br/>
          <p style="font-style: italic;">Best regards,<br/>Coral Whisper Team</p>
          <hr style="border: 1px solid #94d2bd;"/>
          <p style="font-size: 12px; opacity: 0.6;">Design by Moiz Iqbal | mouzmughal@gmail.com</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${toEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Mock Database
  const users: any[] = [];
  const orders: any[] = [];
  const notifications: any[] = [];

  // Auth Routes
  app.post("/api/register", async (req, res) => {
    const { username, password, email, role, country } = req.body;
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { id: Date.now(), username, password, email, role: role || 'customer', country };
    users.push(newUser);
    
    // Send notification email
    if (email) {
      await sendWelcomeEmail(email, username);
    }

    res.json({ message: "Registered successfully", user: { username, role: newUser.role } });
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ user: { id: user.id, username: user.username, role: user.role, email: user.email } });
  });

  // Order Routes
  app.post("/api/orders", (req, res) => {
    const { userId, items, total } = req.body;
    const newOrder = { id: `ORD-${Date.now()}`, userId, items, total, status: 'pending', createdAt: new Date() };
    orders.push(newOrder);
    res.json(newOrder);
  });

  app.get("/api/orders/:userId", (req, res) => {
    const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
    res.json(userOrders);
  });

  app.delete("/api/orders/:orderId", (req, res) => {
    const index = orders.findIndex(o => o.id === req.params.orderId);
    if (index !== -1) {
      orders[index].status = 'cancelled';
      return res.json({ message: "Order cancelled" });
    }
    res.status(404).json({ error: "Order not found" });
  });

  // Staff Routes
  app.post("/api/notifications", (req, res) => {
    const { message, targetRole } = req.body;
    notifications.push({ id: Date.now(), message, targetRole, createdAt: new Date() });
    res.json({ message: "Notification sent" });
  });

  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
