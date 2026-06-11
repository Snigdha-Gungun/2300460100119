const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMDIzYnQwMDk5QG1vZ2kuZWR1LmluIiwiZXhwIjoxNzgxMTY5ODMwLCJpYXQiOjE3ODExNjg5MzAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4NTAzMjczYS1mZTY4LTQ2MmItYjQ5Ny01ZTE1ZTUyNTRmZTEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzbmlnZGhhIHNheGVuYSIsInN1YiI6IjI5ZDhkYWNmLWM3OTktNDIyYy05ZGIxLTM0NzQzZjJhMTNmNSJ9LCJlbWFpbCI6IjIwMjNidDAwOTlAbW9naS5lZHUuaW4iLCJuYW1lIjoic25pZ2RoYSBzYXhlbmEiLCJyb2xsTm8iOiIyMzAwNDYwMTAwMTE5IiwiYWNjZXNzQ29kZSI6IkJBVkRTaCIsImNsaWVudElEIjoiMjlkOGRhY2YtYzc5OS00MjJjLTlkYjEtMzQ3NDNmMmExM2Y1IiwiY2xpZW50U2VjcmV0IjoielRKdVJxbmZkV1pGUEFTWSJ9.BS89N4mOQqK-2C0eqRIf91lqLf71fstmfBztXgh4bYg";

const BASE_URL = "http://4.224.186.213/evaluation-service";
const headers = { Authorization: `Bearer ${TOKEN}` };

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      `${BASE_URL}/logs`,
      { stack, level, package: pkg, message },
      { headers }
    );
  } catch (e) {
    console.error("Log error:", e.message);
  }
}

app.get('/priority-notifications', async (req, res) => {
  await Log("backend", "info", "route", "Priority inbox requested");
  try {
    const n = parseInt(req.query.n) || 10;

    const response = await axios.get(
      `${BASE_URL}/notifications`,
      { headers }
    );

    const notifications = response.data.notifications;
    await Log("backend", "info", "service", `Fetched ${notifications.length} notifications`);

    const weight = { "Placement": 3, "Result": 2, "Event": 1 };

    const sorted = [...notifications].sort((a, b) => {
      const wDiff = (weight[b.Type] || 0) - (weight[a.Type] || 0);
      if (wDiff !== 0) return wDiff;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top = sorted.slice(0, n);
    await Log("backend", "info", "service", `Returning top ${n} priority notifications`);

    res.json({
      total: notifications.length,
      showing: n,
      priority_notifications: top
    });

  } catch (err) {
    await Log("backend", "error", "handler", `Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  Log("backend", "info", "service", "Notification backend server started");
});