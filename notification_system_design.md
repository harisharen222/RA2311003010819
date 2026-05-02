# Stage 1 — Notification System Design

## Overview

The system is responsible for delivering notifications to users for events like placements, results, and general updates. It should support both fetching notifications through APIs and receiving them in real time.

---

## Core functionality

- Fetch all notifications for a user
- Fetch only unread notifications
- Mark a notification as read
- Create a notification
- Deliver notifications in real time

---

## API design

### Get all notifications

Endpoint:
GET /notifications

Headers:
Authorization: Bearer <token>
Content-Type: application/json

Query params:
page: number
limit: number

Notes:
- User is identified using the JWT token
- Results are paginated
- Notifications are sorted by latest first (timestamp descending)

Response:

{
  "success": true,
  "page": 1,
  "limit": 10,
  "notifications": [
    {
      "id": "uuid",
      "type": "Placement",
      "message": "Company hiring",
      "timestamp": "2026-04-22T17:51:18Z",
      "isRead": false
    }
  ]
}

---

### Get unread notifications

Endpoint:
GET /notifications/unread

Query params:
page: number
limit: number

Response:

{
  "success": true,
  "notifications": []
}

---

### Mark notification as read

Endpoint:
PATCH /notifications/:id/read

Response:

{
  "success": true,
  "message": "Notification marked as read"
}

---

### Create notification

Endpoint:
POST /notifications

Request body:

{
  "type": "Placement",
  "message": "Google hiring"
}

Response:

{
  "success": true,
  "notificationID": "uuid"
}

---

## Real-time delivery

The system uses WebSockets to deliver notifications instantly.

Flow:

1. Client connects to server using WebSocket after authentication
2. Server maps userId to the active socket connection
3. When a notification is created, the server emits an event like "new_notification"
4. The notification is pushed instantly to the connected user

This avoids constant polling and reduces unnecessary load on the system.

---

## Data structure

{
  "id": "string",
  "userId": "string",
  "type": "Placement | Result | Event",
  "message": "string",
  "timestamp": "ISO string",
  "isRead": "boolean"
}

---

## Notes

- API follows REST conventions
- Plural resource naming is used
- HTTP methods are used based on action
- Authentication is handled using tokens

---

## Summary

The system provides a simple and scalable way to manage notifications. It supports both API-based retrieval and real-time delivery, while ensuring efficient handling through pagination and proper structure.