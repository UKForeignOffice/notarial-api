# API Endpoints

## Overview
This document describes the public API routes in the API workspace.

Base path roots used by the server:
- `GET /health-check` — simple health-check.
- `POST /forms` — submit a form payload.
- `POST /forms/emails/ses` — used by SES_PROCESS job to prepare/send case email.
- `POST /forms/emails/notify` — used by NOTIFY_PROCESS job to prepare/send user email.

---

## GET /health-check
- Description: Basic health endpoint used by uptime/monitoring checks.
- Request: No body required.
- Response: 200 OK  
  Example:
  ```json
  {
    "uptime": 123.456,
    "message": "OK",
    "timestamp": 1580500000000
  }

# Forms API

## POST `/forms`

**Description**  
Main form submission endpoint. Used to submit a form payload received from the front-end (or webhook). On success it enqueues two jobs (`SES_PROCESS` and `NOTIFY_PROCESS`) and returns a reference that identifies the submission (GOV.UK Pay reference or a generated reference).

**Middleware**
- `validationHandler` — validates the overall webhook/form shape (see **Validation** section).

### Request Body

The API expects a **“webhook output” style** payload with the following structure.

#### Required Top-Level Keys

- `name`: `string`
- `questions`: `array` of question objects
- `metadata`: `object` containing `type`, optional `pay`, etc.

#### Question Object

- `question`: `string`
- `fields`: `array` of `FormField` objects

#### FormField Object

- `key`: `string`
- `type`: `string`
- `title`: `string`
- `answer`: `string[] | string | boolean | null`

#### Metadata (partial)

- `type`: one of:
    - `affirmation`
    - `cni`
    - `exchange`
    - `certifyCopy`
    - `requestDocument`
    - `consularLetter`
- Optional `pay` object (see `FormDataBody` type in code)
- Optional `paymentSkipped`, `postal` flags

**Example request (simplified)**  
```
{
    "name": "example form",
    "questions":
    [
        {
            "question": "Applicant name",
            "fields":
            [
                {
                    "key": "applicantName",
                    "title": "Name",
                    "type": "text",
                    "answer": "Jane Doe"
                }
            ]
        }
    ],
    "metadata":
    {
        "type": "affirmation",
        "paymentSkipped": false,
        "pay":
        {
            "payId": "pay-123",
            "reference": "PAYREF-0001",
            "state":
            {
                "status": "submitted",
                "finished": true
            }
        }
    }
}
```
### Success Response

- **200 OK**

**Example**  
```
{
    "reference": "PAYREF-0001"
}
```

### Error Responses

- **400 Bad Request** — returned by `validationHandler` when the body fails validation, with a message describing invalid fields.
- **Other 4xx/5xx** — returned by error middleware when `submitService` fails.

### Notes

- Validation is implemented in `api/src/middlewares/validate.ts` using Joi.
- Ensures:
    - `questions` array exists
    - `question.fields` objects are present
    - `metadata.type` is one of the allowed types
- The handler calls `submitService.submitForm(req.body)` and returns the `reference` value from the service.

---

## POST `/forms/emails/ses`

**Path**  
`/forms/emails/ses`

**Description**  
Prepares case email to be sent to FCDO via SES. Called by the `SES_PROCESS` job (worker).

**Middleware**
- `caseEmailHandlers.validate` — validates the SES/email-case shape.

### Request Body Shape

Validated by Joi in `handlers/forms/emails/case/index.ts`.

- `fields`: **required** array of objects with:
    - `key`: `string` (required)
    - `type`: `string` (required)
    - `title`: `string` (optional)
    - `answer`: `any` (optional)
- `metadata` object must include:
    - `reference`: `string` (required)
    - `type`: optional; if present must be one of the allowed form types
    - Optional `payment` object

**Example request (simplified)**  
```
{
    "fields":
    [
        {
            "key": "applicantName",
            "type": "text",
            "title": "Applicant name",
            "answer": "Jane Doe"
        }
    ],
    "metadata":
    {
        "reference": "PAYREF-0001",
        "type": "affirmation",
        "payment":
        {
            "amount": 30
        }
    }
}
```

### Success Response

- **200 OK**

**Example**  
```
{
    "jobId": "pgboss-job-uuid"
}
```

### Error Responses

- **400 Bad Request** — validation failed  
  Wrapped in `ApplicationError("SES","PROCESS_VALIDATION",400, ...)`
- **5xx** — returned when `caseService.sendEmail` throws

### Notes

- After validation, the handler:
    1. Determines the case service via `getCaseServiceName(formType)`
    2. Fetches it from `res.app.services[caseServiceName]`
    3. Calls `sendEmail(req.body)`

---

## POST `/forms/emails/notify`

**Path**  
`/forms/emails/notify`

**Description**  
Prepares and sends a confirmation email to the user (Notify). Called by the `NOTIFY_PROCESS` job (worker).

**Middleware**
- `userEmailHandlers.validate` — validates the body before processing.

### Request Body Shape

Validated in `handlers/forms/emails/user/index.ts`.

- `answers`: `object` (required)
- `metadata` object must include:
    - `reference`: `string` (required)
    - `type`: one of the allowed form types (required)
    - Optional `payment` object
```
{
    "answers":
    {
        "applicantName": "Jane Doe",
        "email": "jane@example.com"
    },
    "metadata":
    {
        "reference": "PAYREF-0001",
        "type": "affirmation"
    }
}
```

### Success Response

- **200 OK**

**Example** 
```
{
    "jobId": "pgboss-job-uuid"
}
```

### Error Responses

- **400 Bad Request** — validation failed  
  Wrapped in `ApplicationError("NOTIFY","PROCESS_VALIDATION",400, ...)`
- **5xx** — returned when `userService.sendEmailToUser` throws

### Notes

- The handler calls `res.app.services.userService.sendEmailToUser(req.body)`
- Returns the created job ID

---

## Validation Summary

### `/forms`

Implemented in `api/src/middlewares/validate.ts`.

Key checks:

- `name`: required string
- `questions`: required array
    - Each question must have:
        - `question`: string
        - `fields`: array
- Field items must have:
    - `key`: string
    - `type`: string
- `metadata.type` must be one of the allowed form types

On failure, throws:  
`ApplicationError("WEBHOOK","VALIDATION",400, ...)`

### `/forms/emails/ses`

- Implemented in `handlers/forms/emails/case/index.ts`
- Expects:
    - `fields` array
    - `metadata.reference`
    - Optional `metadata.type` from allowed list

On failure, throws:  
`ApplicationError("SES","PROCESS_VALIDATION",400, ...)`

### `/forms/emails/notify`

- Implemented in `handlers/forms/emails/user/index.ts`
- Expects:
    - `answers` object
    - `metadata.reference`
    - `metadata.type` (required)

On failure, throws:  
`ApplicationError("NOTIFY","PROCESS_VALIDATION",400, ...)`

---

## Common Response / Error Format

- Success responses return **HTTP 200** with JSON containing the expected keys (e.g. `reference`, `jobId`).
- Validation and application errors are thrown or forwarded as `ApplicationError` instances.
- See `api/src/middlewares/error-handlers.ts` for the exact error response format.
  