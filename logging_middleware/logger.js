const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMDIzYnQwMDk5QG1vZ2kuZWR1LmluIiwiZXhwIjoxNzgxMTY2OTQ3LCJpYXQiOjE3ODExNjYwNDcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJjYjI3ODNmZi1hYzViLTQxOTQtYjc4Yy0yZTJlYzc3ZWIyMGIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzbmlnZGhhIHNheGVuYSIsInN1YiI6IjI5ZDhkYWNmLWM3OTktNDIyYy05ZGIxLTM0NzQzZjJhMTNmNSJ9LCJlbWFpbCI6IjIwMjNidDAwOTlAbW9naS5lZHUuaW4iLCJuYW1lIjoic25pZ2RoYSBzYXhlbmEiLCJyb2xsTm8iOiIyMzAwNDYwMTAwMTE5IiwiYWNjZXNzQ29kZSI6IkJBVkRTaCIsImNsaWVudElEIjoiMjlkOGRhY2YtYzc5OS00MjJjLTlkYjEtMzQ3NDNmMmExM2Y1IiwiY2xpZW50U2VjcmV0IjoielRKdVJxbmZkV1pGUEFTWSJ9.RsT_pq41hmfD-D6uWvVz4mYmRZ5MOu4oV5fIrAErAF8";

async function Log(stack, level, package_name, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: package_name,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Log created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Logging failed:", error.message);
  }
}

module.exports = { Log };