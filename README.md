# Backend Assessment

This repository contains solutions for the backend assessment, including implementation and system design tasks.

---

## Overview

The project is divided into two main parts:

1. Logging Middleware and Vehicle Maintenance Scheduler (implementation)
2. Notification System Design (Stages 1–6)

---

## 1. Logging Middleware

A reusable logging function is implemented which sends logs to the external logging API.

Features:
- Supports log levels (info, error, debug, warn)
- Uses authentication token
- Handles API errors properly

---

## 2. Vehicle Maintenance Scheduler

This module selects vehicles for maintenance based on available mechanic hours.

Approach:
- Implemented using 0/1 Knapsack algorithm
- Maximizes total impact within time constraints

Features:
- Fetches data from external APIs
- Handles multiple depots
- Optimized selection logic
- Integrated logging middleware

Endpoint:
GET /schedule

---

## 3. Notification System Design

Stages 1 to 6 cover the design of a scalable notification system.

Includes:
- API design
- Database schema and indexing
- Query optimization
- Performance improvements (caching, pagination)
- Scalable architecture using queues
- Priority-based notification selection

All stages are documented in:
notification_system_design.md

---

## Tech Stack

- Node.js
- Express
- Axios
- MongoDB (design stage)
- Redis (conceptual)
- Message Queue (Kafka/RabbitMQ – conceptual)

---

## How to Run

1. Install dependencies:
npm install

2. Set up environment variables:
Create a `.env` file with:
ACCESS_TOKEN=your_token

3. Start server:
node src/index.js

---

## Notes

- APIs are protected using authentication token
- Logging middleware is used across modules
- Focus is on correctness, scalability, and clean design

---

## Author

Backend assessment submission