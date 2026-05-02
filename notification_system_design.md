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


# Stage 2 — Database Design

## Database choice

MongoDB is used for storing notifications.

Reason:

- Flexible schema allows different types of notifications without strict structure
- Handles high read and write operations efficiently
- Easy to scale horizontally as user base grows

---

## Collection design

### Notifications collection

{
  "_id": "ObjectId",
  "userId": "string",
  "type": "Placement | Result | Event",
  "message": "string",
  "isRead": false,
  "createdAt": "ISODate"
}

---

## Indexing

- Index on userId for fast retrieval of user-specific notifications
- Index on isRead for filtering unread notifications
- Compound index on (userId, isRead, createdAt) to support filtering and sorting together

---

## Queries

Get all notifications (latest first):

db.notifications.find({ userId: "123" })
  .sort({ createdAt: -1 })
  .limit(10)

---

Get unread notifications:

db.notifications.find({ userId: "123", isRead: false })
  .sort({ createdAt: -1 })

---

Mark notification as read:

db.notifications.updateOne(
  { _id: ObjectId("...") },
  { $set: { isRead: true } }
)

---

Create notification:

db.notifications.insertOne({
  userId: "123",
  message: "New placement drive",
  type: "Placement",
  isRead: false,
  createdAt: new Date()
})

---

## Scaling considerations

- As number of users increases, queries on large datasets can become slow
- Sharding based on userId helps distribute data across multiple nodes
- Caching frequently accessed notifications reduces database load
- Batch writes can improve performance during high traffic
- Old notifications can be cleaned using a TTL index on createdAt

---

## Possible issues with large data

- Full collection scans if indexes are missing
- Increased query latency for unread notifications
- High write load when many notifications are created simultaneously

---

## Summary

MongoDB works well for this system due to its flexibility and scalability. Proper indexing and sharding ensure good performance even as data volume grows.


# Stage 3 — Query Optimization and Debugging

## Problem

The following query is slow:

SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

---

## Why it is slow

- There may be no proper index on studentID and isRead
- Database may perform a full table scan
- Sorting by createdAt without index increases cost
- As data grows, performance degrades significantly

---

## Solution

To optimize this query, we should create a compound index:

(studentID, isRead, createdAt)

This helps in:
- Filtering by studentID and isRead efficiently
- Sorting results by createdAt without extra computation

---

## Optimized query

SELECT id, message, createdAt FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 10;

Notes:
- LIMIT reduces data fetched
- Improves response time

---

## Why not "index everything"

Indexing every column is not a good idea because:

- Increases storage overhead
- Slows down write operations (insert/update)
- Many indexes are unused and waste resources

Indexes should only be created for frequently queried fields.

---

## Additional query

Find students who received a placement notification in the last 7 days:

SELECT DISTINCT studentID
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;

---

## Improvements for large datasets

- Use pagination with LIMIT and OFFSET
- Avoid SELECT * (fetch only required fields)
- Monitor slow queries using database tools
- Regularly review index usage

---

## Summary

The query was slow due to missing indexes and inefficient sorting.  
Using a compound index and limiting results improves performance significantly.



# Stage 4 — System Performance Optimization

## Problem

The system is experiencing high load because notifications are fetched from the database every time a user opens the application.

This leads to:
- Increased database queries
- Higher latency
- Reduced system performance under heavy traffic

---

## Causes

- Repeated database reads for the same data
- No caching mechanism
- Fetching all notifications without limits
- Lack of pagination

---

## Solutions

### 1. Caching

Use a caching layer such as Redis.

- Store recent notifications in cache
- On request:
  - First check cache
  - If not present, fetch from database and update cache

This reduces direct database load.

---

### 2. Pagination

Fetch notifications in smaller batches:

Example:
GET /notifications?page=1&limit=10

Benefits:
- Reduces response size
- Improves response time
- Avoids unnecessary data transfer

---

### 3. Lazy loading

Load notifications only when needed.

- Initial load shows recent notifications
- Older notifications are loaded on scroll

---

### 4. Background synchronization

Instead of fetching every time:
- Periodically sync notifications in background
- Store them locally on client side

---

## Trade-offs

- Caching introduces data consistency issues (stale data)
- Pagination adds complexity in frontend handling
- Background sync may delay latest updates

---

## Summary

The performance issue is caused by repeated database access.  
Using caching, pagination, and optimized fetching strategies significantly improves system scalability and reduces load.