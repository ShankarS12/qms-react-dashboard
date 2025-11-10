# Schedule Email API Documentation

Complete REST API documentation for `schedule_email_api.php` - Scheduled Emails CRUD Operations

**Base URL:** `http://localhost/bulkemail-git/fullstack/schedule_email_api.php`

**Version:** 1.0  
**Last Updated:** October 29, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [CREATE - Schedule New Email](#create---schedule-new-email)
   - [READ - Get Scheduled Email(s)](#read---get-scheduled-emails)
   - [UPDATE - Modify Scheduled Email](#update---modify-scheduled-email)
   - [DELETE - Remove Scheduled Email](#delete---remove-scheduled-email)
4. [Request & Response Examples](#request--response-examples)
5. [Error Handling](#error-handling)
6. [Database Schema](#database-schema)
7. [Testing Examples](#testing-examples)

---

## Overview

The Schedule Email API provides full CRUD (Create, Read, Update, Delete) operations for managing scheduled bulk email campaigns. Emails scheduled through this API are processed by the `scheduled_test.php` cron job at their designated time.

### Features

- ✅ Create scheduled email campaigns
- ✅ Retrieve single or multiple scheduled emails
- ✅ Filter emails by status (pending, processing, sent)
- ✅ Update existing scheduled emails
- ✅ Delete scheduled emails
- ✅ Support for email placeholders (e.g., `{{name}}`, `{{email}}`)
- ✅ HTML and plain text content support
- ✅ Attachment support
- ✅ API key authentication

### HTTP Methods Supported

| Method          | Operation | Description                     |
| --------------- | --------- | ------------------------------- |
| `POST`          | Create    | Schedule a new email campaign   |
| `GET`           | Read      | Retrieve scheduled email(s)     |
| `PUT` / `PATCH` | Update    | Modify existing scheduled email |
| `DELETE`        | Delete    | Remove scheduled email          |

---

## Authentication

All requests require API key authentication.

### API Key

**Default Key:** `replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1`

⚠️ **Security Note:** Change this key in production by:

- Setting environment variable: `SCHEDULED_TEST_API_KEY`
- Or modifying the key directly in `schedule_email_api.php`

### Authentication Methods

You can provide the API key using any of these methods:

#### 1. Authorization Header (Recommended)

```http
Authorization: Bearer replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1
```

#### 2. X-API-Key Header

```http
X-API-Key: replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1
```

#### 3. Query Parameter

```http
?api_key=IATT-BULK-EMAIL-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1
```

### Authentication Error Response

If authentication fails, you'll receive:

```json
{
  "error": "unauthorized",
  "message": "Invalid or missing API key."
}
```

**HTTP Status:** `401 Unauthorized`

---

## API Endpoints

### CREATE - Schedule New Email

Schedule a new bulk email campaign to be sent at a specified time.

#### Endpoint

```
POST /schedule_email_api.php
```

#### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

#### Request Body Parameters

| Parameter             | Type    | Required | Default                  | Description                                           |
| --------------------- | ------- | -------- | ------------------------ | ----------------------------------------------------- |
| `from_mail`           | string  | No       | `no-reply@4kfineart.com` | Sender email address (must be valid)                  |
| `subject`             | string  | **Yes**  | -                        | Email subject line (supports placeholders)            |
| `message`             | string  | **Yes**  | -                        | Email body content (supports placeholders)            |
| `cc_emails`           | string  | No       | `""`                     | Comma-separated CC email addresses (used as Reply-To) |
| `scheduled_date_time` | string  | **Yes**  | -                        | When to send (format: `YYYY-MM-DD HH:MM:SS`)          |
| `to_group`            | string  | **Yes**  | -                        | Contact group ID from database                        |
| `htmlcontent`         | boolean | No       | `false`                  | `true` for HTML content, `false` for plain text       |
| `attachments`         | string  | No       | `""`                     | Comma-separated file paths                            |

#### Placeholder Support

The `subject` and `message` fields support dynamic placeholders that will be replaced with contact data:

- `{{name}}` - Contact's name
- `{{email}}` - Contact's email
- `{{company}}` - Contact's company (if column exists)
- Any other column name from the `contacts` table

#### Request Example

```json
{
  "from_mail": "no-reply@4kfineart.com",
  "subject": "Hello {{name}}, Special Offer!",
  "message": "<p>Dear {{name}},</p><p>We have a special offer for you. Your email is {{email}}.</p>",
  "cc_emails": "hr@example.com,support@example.com",
  "scheduled_date_time": "2025-10-30 15:00:00",
  "to_group": "5",
  "htmlcontent": true,
  "attachments": "uploads/brochure.pdf,uploads/catalog.pdf"
}
```

#### Success Response

**HTTP Status:** `201 Created`

```json
{
  "status": "created",
  "id": 42,
  "scheduled_date_time": "2025-10-30 15:00:00",
  "to_group": "5",
  "message": "Email scheduled successfully"
}
```

#### Error Responses

**Validation Error - HTTP 422**

```json
{
  "error": "validation_error",
  "message": "Validation failed",
  "errors": [
    "subject is required",
    "scheduled_date_time format invalid. Use: YYYY-MM-DD HH:MM:SS"
  ]
}
```

**Database Error - HTTP 500**

```json
{
  "error": "database_error",
  "message": "Failed to insert: SQLSTATE[HY000]..."
}
```

---

### READ - Get Scheduled Email(s)

Retrieve scheduled email campaign(s) from the database.

#### Endpoint Options

```
GET /schedule_email_api.php?id={id}          # Get single email by ID
GET /schedule_email_api.php                  # Get all emails
GET /schedule_email_api.php?status={status}  # Filter by status
GET /schedule_email_api.php?limit={limit}    # Limit results
```

#### Request Headers

```http
Authorization: Bearer YOUR_API_KEY
```

#### Query Parameters

| Parameter | Type    | Required | Description                                       |
| --------- | ------- | -------- | ------------------------------------------------- |
| `id`      | integer | No       | Specific email ID to retrieve                     |
| `status`  | string  | No       | Filter by status: `pending`, `processing`, `sent` |
| `limit`   | integer | No       | Maximum number of results to return               |

#### Use Cases

##### 1. Get Single Email by ID

**Request:**

```http
GET /schedule_email_api.php?id=42
Authorization: Bearer YOUR_API_KEY
```

**Success Response - HTTP 200**

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "from_mail": "no-reply@4kfineart.com",
    "subject": "Hello {{name}}, Special Offer!",
    "message": "<p>Dear {{name}},</p>...",
    "cc_emails": "hr@example.com,support@example.com",
    "scheduled_date_time": "2025-10-30 15:00:00",
    "attachments": "uploads/brochure.pdf",
    "status": "pending",
    "to_group": "5",
    "htmlcontent": "true"
  }
}
```

**Not Found - HTTP 404**

```json
{
  "error": "not_found",
  "message": "Scheduled email not found"
}
```

##### 2. Get All Scheduled Emails

**Request:**

```http
GET /schedule_email_api.php
Authorization: Bearer YOUR_API_KEY
```

**Success Response - HTTP 200**

```json
{
  "status": "success",
  "count": 25,
  "data": [
    {
      "id": 1,
      "from_mail": "no-reply@4kfineart.com",
      "subject": "Campaign 1",
      "scheduled_date_time": "2025-10-30 15:00:00",
      "status": "pending",
      ...
    },
    {
      "id": 2,
      "from_mail": "no-reply@4kfineart.com",
      "subject": "Campaign 2",
      "scheduled_date_time": "2025-10-31 10:00:00",
      "status": "sent",
      ...
    }
  ]
}
```

##### 3. Filter by Status

**Request:**

```http
GET /schedule_email_api.php?status=pending
Authorization: Bearer YOUR_API_KEY
```

**Success Response - HTTP 200**

```json
{
  "status": "success",
  "count": 5,
  "data": [
    { "id": 1, "status": "pending", ... },
    { "id": 3, "status": "pending", ... },
    { "id": 5, "status": "pending", ... }
  ]
}
```

**Valid Status Values:**

- `pending` - Scheduled but not yet sent
- `processing` - Currently being sent
- `sent` - Successfully sent

##### 4. Limit Results

**Request:**

```http
GET /schedule_email_api.php?limit=10
Authorization: Bearer YOUR_API_KEY
```

Returns only the 10 most recent scheduled emails.

##### 5. Combined Filters

**Request:**

```http
GET /schedule_email_api.php?status=pending&limit=5
Authorization: Bearer YOUR_API_KEY
```

Returns the 5 most recent pending emails.

---

### UPDATE - Modify Scheduled Email

Update an existing scheduled email campaign. You can update one or multiple fields.

#### Endpoint

```
PUT /schedule_email_api.php?id={id}
PATCH /schedule_email_api.php?id={id}
```

Both `PUT` and `PATCH` methods work identically - partial updates are supported.

#### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

#### ID Parameter

The ID can be provided in two ways:

1. **In URL (Recommended):**

   ```
   PUT /schedule_email_api.php?id=42
   ```

2. **In JSON Body:**
   ```json
   {
     "id": 42,
     "subject": "Updated Subject"
   }
   ```

#### Updatable Fields

| Field                 | Type    | Description                                    |
| --------------------- | ------- | ---------------------------------------------- |
| `from_mail`           | string  | Sender email address                           |
| `subject`             | string  | Email subject                                  |
| `message`             | string  | Email body content                             |
| `cc_emails`           | string  | Comma-separated CC emails                      |
| `scheduled_date_time` | string  | Schedule time (`YYYY-MM-DD HH:MM:SS`)          |
| `to_group`            | string  | Contact group ID                               |
| `htmlcontent`         | boolean | HTML content flag                              |
| `attachments`         | string  | Comma-separated file paths                     |
| `status`              | string  | Email status (`pending`, `processing`, `sent`) |

**Note:** Only include fields you want to update. All fields are optional except `id`.

#### Request Examples

##### 1. Update Single Field

**Request:**

```http
PUT /schedule_email_api.php?id=42
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

```json
{
  "subject": "Updated Subject Line"
}
```

##### 2. Update Multiple Fields

```json
{
  "subject": "New Subject",
  "message": "<p>Updated message content</p>",
  "scheduled_date_time": "2025-11-01 10:00:00"
}
```

##### 3. Reschedule Email

```json
{
  "scheduled_date_time": "2025-11-05 14:00:00"
}
```

##### 4. Change Status Manually

```json
{
  "status": "sent"
}
```

##### 5. Update with ID in Body

**Request:**

```http
PUT /schedule_email_api.php
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

```json
{
  "id": 42,
  "subject": "Updated via body ID",
  "to_group": "10"
}
```

#### Success Response

**HTTP Status:** `200 OK`

```json
{
  "status": "updated",
  "id": 42,
  "message": "Scheduled email updated successfully",
  "data": {
    "id": 42,
    "from_mail": "no-reply@4kfineart.com",
    "subject": "Updated Subject Line",
    "message": "<p>Dear {{name}},</p>...",
    "cc_emails": "hr@example.com",
    "scheduled_date_time": "2025-10-30 15:00:00",
    "attachments": "",
    "status": "pending",
    "to_group": "5",
    "htmlcontent": "true"
  }
}
```

#### Error Responses

**Missing ID - HTTP 422**

```json
{
  "error": "validation_error",
  "message": "ID is required for update (provide in JSON body or query string)"
}
```

**Not Found - HTTP 404**

```json
{
  "error": "not_found",
  "message": "Scheduled email with ID 42 not found"
}
```

**No Fields to Update - HTTP 422**

```json
{
  "error": "validation_error",
  "message": "No fields to update provided"
}
```

**Invalid Datetime Format - HTTP 422**

```json
{
  "error": "validation_error",
  "message": "scheduled_date_time format invalid"
}
```

---

### DELETE - Remove Scheduled Email

Delete a scheduled email campaign from the database.

#### Endpoint

```
DELETE /schedule_email_api.php?id={id}
```

#### Request Headers

```http
Authorization: Bearer YOUR_API_KEY
```

#### ID Parameter

The ID can be provided in two ways:

1. **In URL (Recommended):**

   ```
   DELETE /schedule_email_api.php?id=42
   ```

2. **In JSON Body:**
   ```json
   {
     "id": 42
   }
   ```

#### Request Examples

##### Option 1: ID in Query String

**Request:**

```http
DELETE /schedule_email_api.php?id=42
Authorization: Bearer YOUR_API_KEY
```

##### Option 2: ID in JSON Body

**Request:**

```http
DELETE /schedule_email_api.php
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

```json
{
  "id": 42
}
```

#### Success Response

**HTTP Status:** `200 OK`

```json
{
  "status": "deleted",
  "id": 42,
  "message": "Scheduled email deleted successfully"
}
```

#### Error Responses

**Missing ID - HTTP 422**

```json
{
  "error": "validation_error",
  "message": "ID is required for delete (provide in JSON body or query string)"
}
```

**Not Found - HTTP 404**

```json
{
  "error": "not_found",
  "message": "Scheduled email with ID 42 not found"
}
```

---

## Request & Response Examples

### Complete CRUD Workflow Example

#### Step 1: Create Scheduled Email

**Request:**

```bash
curl -X POST "http://localhost/bulkemail-git/fullstack/schedule_email_api.php" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1" \
  -d '{
    "subject": "Newsletter for {{name}}",
    "message": "<p>Hi {{name}}, your email is {{email}}</p>",
    "scheduled_date_time": "2025-10-30 15:00:00",
    "to_group": "5",
    "htmlcontent": true
  }'
```

**Response:**

```json
{
  "status": "created",
  "id": 42,
  "scheduled_date_time": "2025-10-30 15:00:00",
  "to_group": "5",
  "message": "Email scheduled successfully"
}
```

#### Step 2: Retrieve Created Email

**Request:**

```bash
curl -X GET "http://localhost/bulkemail-git/fullstack/schedule_email_api.php?id=42" \
  -H "Authorization: Bearer replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1"
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "from_mail": "no-reply@4kfineart.com",
    "subject": "Newsletter for {{name}}",
    "message": "<p>Hi {{name}}, your email is {{email}}</p>",
    "cc_emails": "",
    "scheduled_date_time": "2025-10-30 15:00:00",
    "attachments": "",
    "status": "pending",
    "to_group": "5",
    "htmlcontent": "true"
  }
}
```

#### Step 3: Update Email

**Request:**

```bash
curl -X PUT "http://localhost/bulkemail-git/fullstack/schedule_email_api.php?id=42" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1" \
  -d '{
    "subject": "Updated Newsletter for {{name}}",
    "scheduled_date_time": "2025-10-31 16:00:00"
  }'
```

**Response:**

```json
{
  "status": "updated",
  "id": 42,
  "message": "Scheduled email updated successfully",
  "data": {
    "id": 42,
    "subject": "Updated Newsletter for {{name}}",
    "scheduled_date_time": "2025-10-31 16:00:00",
    ...
  }
}
```

#### Step 4: Delete Email

**Request:**

```bash
curl -X DELETE "http://localhost/bulkemail-git/fullstack/schedule_email_api.php?id=42" \
  -H "Authorization: Bearer replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1"
```

**Response:**

```json
{
  "status": "deleted",
  "id": 42,
  "message": "Scheduled email deleted successfully"
}
```

---

## Error Handling

### HTTP Status Codes

| Code  | Status                | Meaning                       |
| ----- | --------------------- | ----------------------------- |
| `200` | OK                    | Request successful            |
| `201` | Created               | Resource created successfully |
| `401` | Unauthorized          | Invalid or missing API key    |
| `404` | Not Found             | Resource not found            |
| `405` | Method Not Allowed    | Invalid HTTP method           |
| `422` | Unprocessable Entity  | Validation failed             |
| `500` | Internal Server Error | Server/database error         |

### Error Response Format

All errors follow this JSON structure:

```json
{
  "error": "error_type",
  "message": "Human-readable error message",
  "errors": ["array", "of", "specific", "errors"]
}
```

### Common Errors

#### 1. Authentication Error (401)

```json
{
  "error": "unauthorized",
  "message": "Invalid or missing API key."
}
```

**Causes:**

- Missing Authorization header
- Incorrect API key
- Wrong header format

**Solution:**

- Add `Authorization: Bearer YOUR_API_KEY` header
- Verify API key matches server configuration

#### 2. Validation Error (422)

```json
{
  "error": "validation_error",
  "message": "Validation failed",
  "errors": [
    "subject is required",
    "to_group is required",
    "scheduled_date_time format invalid. Use: YYYY-MM-DD HH:MM:SS"
  ]
}
```

**Causes:**

- Missing required fields
- Invalid data format
- Invalid email address

**Solution:**

- Check all required fields are present
- Verify datetime format: `YYYY-MM-DD HH:MM:SS`
- Validate email addresses

#### 3. Not Found Error (404)

```json
{
  "error": "not_found",
  "message": "Scheduled email with ID 123 not found"
}
```

**Causes:**

- ID doesn't exist in database
- Email was already deleted
- Wrong ID provided

**Solution:**

- Verify ID exists using GET request
- Check database records

#### 4. Method Not Allowed (405)

```json
{
  "error": "method_not_allowed",
  "message": "Allowed methods: GET, POST, PUT, PATCH, DELETE"
}
```

**Causes:**

- Using wrong HTTP method
- Typo in method name

**Solution:**

- Use correct HTTP method for operation

#### 5. Database Error (500)

```json
{
  "error": "database_error",
  "message": "Failed to insert: SQLSTATE[HY000]..."
}
```

**Causes:**

- Database connection failed
- Table doesn't exist
- SQL syntax error
- Permissions issue

**Solution:**

- Check database connection in `common/dbpdo.php`
- Verify `scheduled_emails` table exists
- Check MySQL service is running

---

## Database Schema

### Table: `scheduled_emails`

```sql
CREATE TABLE `scheduled_emails` (
  `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
  `from_mail` VARCHAR(255) DEFAULT NULL,
  `subject` TEXT,
  `message` TEXT,
  `cc_emails` TEXT,
  `scheduled_date_time` DATETIME NOT NULL,
  `attachments` TEXT,
  `status` ENUM('pending', 'processing', 'sent') DEFAULT 'pending',
  `to_group` VARCHAR(50) NOT NULL,
  `htmlcontent` ENUM('true', 'false') DEFAULT 'false',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Field Descriptions

| Field                 | Type         | Description                                     |
| --------------------- | ------------ | ----------------------------------------------- |
| `id`                  | INT          | Primary key, auto-increment                     |
| `from_mail`           | VARCHAR(255) | Sender email address                            |
| `subject`             | TEXT         | Email subject line (supports placeholders)      |
| `message`             | TEXT         | Email body content (supports placeholders)      |
| `cc_emails`           | TEXT         | Comma-separated CC emails (used as Reply-To)    |
| `scheduled_date_time` | DATETIME     | When the email should be sent                   |
| `attachments`         | TEXT         | Comma-separated file paths                      |
| `status`              | ENUM         | Current status: `pending`, `processing`, `sent` |
| `to_group`            | VARCHAR(50)  | Contact group ID from `contacts` table          |
| `htmlcontent`         | ENUM         | `true` for HTML, `false` for plain text         |
| `created_at`          | TIMESTAMP    | Record creation time                            |
| `updated_at`          | TIMESTAMP    | Last modification time                          |

### Related Table: `contacts`

```sql
CREATE TABLE `contacts` (
  `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE,
  `email_group_name` INT(11),
  `status` ENUM('not_sent', 'sent') DEFAULT 'not_sent',
  -- Additional custom columns
  `company` VARCHAR(255),
  `phone` VARCHAR(50),
  ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Testing Examples

### Postman Collection

Import this collection into Postman for quick testing:

#### Environment Variables

```json
{
  "base_url": "http://localhost/bulkemail-git/fullstack",
  "api_key": "replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1",
  "schedule_id": "",
  "test_group": "5"
}
```

#### Test Requests

**1. Create Scheduled Email**

```
POST {{base_url}}/schedule_email_api.php
Headers:
  Content-Type: application/json
  Authorization: Bearer {{api_key}}
Body:
{
  "subject": "Test {{name}}",
  "message": "<p>Hello {{name}}</p>",
  "scheduled_date_time": "2025-10-30 15:00:00",
  "to_group": "{{test_group}}",
  "htmlcontent": true
}
```

**2. Get All Emails**

```
GET {{base_url}}/schedule_email_api.php
Headers:
  Authorization: Bearer {{api_key}}
```

**3. Get Single Email**

```
GET {{base_url}}/schedule_email_api.php?id={{schedule_id}}
Headers:
  Authorization: Bearer {{api_key}}
```

**4. Update Email**

```
PUT {{base_url}}/schedule_email_api.php?id={{schedule_id}}
Headers:
  Content-Type: application/json
  Authorization: Bearer {{api_key}}
Body:
{
  "subject": "Updated Subject"
}
```

**5. Delete Email**

```
DELETE {{base_url}}/schedule_email_api.php?id={{schedule_id}}
Headers:
  Authorization: Bearer {{api_key}}
```

### Python Example

```python
import requests
import json

BASE_URL = "http://localhost/bulkemail-git/fullstack/schedule_email_api.php"
API_KEY = "replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

# Create
data = {
    "subject": "Hello {{name}}",
    "message": "<p>Test message</p>",
    "scheduled_date_time": "2025-10-30 15:00:00",
    "to_group": "5",
    "htmlcontent": True
}
response = requests.post(BASE_URL, headers=headers, json=data)
print("Created:", response.json())
schedule_id = response.json()['id']

# Read
response = requests.get(f"{BASE_URL}?id={schedule_id}", headers=headers)
print("Retrieved:", response.json())

# Update
update_data = {"subject": "Updated Subject"}
response = requests.put(f"{BASE_URL}?id={schedule_id}", headers=headers, json=update_data)
print("Updated:", response.json())

# Delete
response = requests.delete(f"{BASE_URL}?id={schedule_id}", headers=headers)
print("Deleted:", response.json())
```

### JavaScript/Node.js Example

```javascript
const BASE_URL =
  "http://localhost/bulkemail-git/fullstack/schedule_email_api.php";
const API_KEY =
  "replace-with-a-strong-random-key-0d9d2c06b8b04e1aa7b8c6a8a2c2b3a1";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

// Create
async function createEmail() {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      subject: "Hello {{name}}",
      message: "<p>Test message</p>",
      scheduled_date_time: "2025-10-30 15:00:00",
      to_group: "5",
      htmlcontent: true,
    }),
  });
  const data = await response.json();
  console.log("Created:", data);
  return data.id;
}

// Read
async function getEmail(id) {
  const response = await fetch(`${BASE_URL}?id=${id}`, {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  console.log("Retrieved:", data);
}

// Update
async function updateEmail(id) {
  const response = await fetch(`${BASE_URL}?id=${id}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({ subject: "Updated Subject" }),
  });
  const data = await response.json();
  console.log("Updated:", data);
}

// Delete
async function deleteEmail(id) {
  const response = await fetch(`${BASE_URL}?id=${id}`, {
    method: "DELETE",
    headers: headers,
  });
  const data = await response.json();
  console.log("Deleted:", data);
}

// Run workflow
(async () => {
  const id = await createEmail();
  await getEmail(id);
  await updateEmail(id);
  await deleteEmail(id);
})();
```

---

## How It Works

### Workflow Diagram

```
┌─────────────────────────────────────────┐
│ 1. Client sends POST request            │
│    with scheduled email data            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. API validates:                       │
│    - Authentication (API key)           │
│    - Required fields                    │
│    - Data format                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Insert into scheduled_emails table   │
│    with status = 'pending'              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Cron runs scheduled_test.php         │
│    SELECT * WHERE status='pending'      │
│    AND scheduled_date_time <= NOW()     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. For each record:                     │
│    - Fetch contacts from to_group       │
│    - Replace placeholders               │
│    - Send personalized emails           │
│    - Update status to 'sent'            │
└─────────────────────────────────────────┘
```

### Email Processing

1. **Scheduling:** Email campaigns are created with `status='pending'`
2. **Cron Job:** `scheduled_test.php` runs every minute
3. **Time Check:** Cron checks if `scheduled_date_time <= current_time`
4. **Contact Fetch:** Retrieves all contacts in `to_group` with `status='not_sent'`
5. **Personalization:** Replaces `{{placeholders}}` with contact data
6. **Sending:** Sends individual emails via PHPMailer
7. **Tracking:** Updates recipient status and adds tracking pixel
8. **Completion:** Updates scheduled_emails status to `'sent'`

---

## Best Practices

### Security

1. **Change Default API Key**

   - Generate strong random key (32+ characters)
   - Use environment variables in production
   - Rotate keys periodically

2. **Use HTTPS**

   - Never send API keys over HTTP
   - Implement SSL/TLS certificates

3. **IP Whitelisting** (Optional)

   - Restrict API access to specific IPs
   - Add firewall rules

4. **Rate Limiting** (Optional)
   - Prevent API abuse
   - Implement request throttling

### Data Validation

1. **Always validate:**

   - Email addresses (format and domain)
   - Datetime formats
   - Required fields
   - Group IDs exist

2. **Sanitize input:**
   - HTML content (prevent XSS)
   - SQL injection protection (use prepared statements)
   - File paths for attachments

### Performance

1. **Use appropriate indexes:**

   ```sql
   CREATE INDEX idx_status ON scheduled_emails(status);
   CREATE INDEX idx_scheduled_time ON scheduled_emails(scheduled_date_time);
   ```

2. **Limit large queries:**

   - Use pagination
   - Add `LIMIT` to queries

3. **Optimize cron job:**
   - Run every minute
   - Process in batches
   - Add delay between emails

### Error Handling

1. **Log errors:**

   - Database errors
   - API errors
   - Email sending failures

2. **Graceful degradation:**
   - Return meaningful error messages
   - Don't expose sensitive information
   - Use appropriate HTTP status codes

---

## FAQ

### Q: How do I change the API key?

**A:** Edit `schedule_email_api.php` and change the `$CONFIG_API_KEY` value, or set the environment variable `SCHEDULED_TEST_API_KEY`.

### Q: Can I schedule emails in the past?

**A:** Yes, but they will be sent immediately when the cron job runs next.

### Q: What happens if the cron job isn't running?

**A:** Emails will remain in `pending` status and won't be sent until the cron job processes them.

### Q: How do I test without sending actual emails?

**A:** Modify `scheduled_test.php` to use a test mode or mock SMTP server.

### Q: Can I update an email after it's been sent?

**A:** Yes, but it won't resend. The status will remain `'sent'`.

### Q: What's the maximum number of recipients?

**A:** Limited by your database and SMTP server. Consider batching for large campaigns.

### Q: How do I add custom placeholder fields?

**A:** Add columns to the `contacts` table, then use `{{column_name}}` in your email content.

### Q: Can I use multiple attachment files?

**A:** Yes, provide comma-separated file paths: `"attachments/file1.pdf,attachments/file2.pdf,attachments/file3.pdf"`

### Q: How do I upload files from frontend?

**A:** Use the same API file with `?action=upload`:

1. POST files to `schedule_email_api.php?action=upload` using `multipart/form-data`
2. Get the `attachments` string from response
3. Use that string in `schedule_email_api.php` request

See `REACT_INTEGRATION_GUIDE.md` for complete React examples.  
See `SINGLE_FILE_API_GUIDE.md` for HTML/JavaScript examples.

---

## Support & Contact

For issues, questions, or feature requests:

1. Check this documentation
2. Review PHP error logs: `fullstack/error_log`
3. Verify database connection
4. Test with cURL or Postman
5. Contact development team

---

**Version:** 1.0  
**Last Updated:** October 29, 2025  
**License:** Proprietary  
**Maintained by:** Bulk Email API Development Team
