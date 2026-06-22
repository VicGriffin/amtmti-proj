# AMTMTI Email Templates

This document describes how the site sends emails for form submissions, including the actual subjects, recipients, and the rendered HTML presentation.

## Email Delivery

- All outbound email is sent through the centralized email service in `lib/email/service.ts`.
- The provider is selected in this order: `EMAIL_PROVIDER`, then `RESEND_API_KEY`, then `SENDGRID_API_KEY`, then SMTP via Nodemailer.
- Notification emails go to the company/admin address configured as `COMPANY_EMAIL`, `NEXT_PUBLIC_AMTMTI_EMAIL`, or `info@amtmti.africa`.
- Confirmation emails go to the user who submitted the form.
- HTML emails are rendered with simple inline styles and a consistent AMTMTI branding palette.

## SMTP Setup

- If you use Nodemailer, set `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, and `EMAIL_SMTP_PASSWORD`.
- Gmail users can keep `EMAIL_SMTP_HOST=smtp.gmail.com` and `EMAIL_SMTP_PORT=465`.
- Set `EMAIL_FROM` to the verified sender inbox for API-based providers such as Resend or SendGrid.

---

## 1. Contact Form

### Admin notification
- Subject: `New Website Contact Message`
- Recipient: `COMPANY_EMAIL`
- Body includes:
  - Sender name and email
  - Optional phone
  - Inquiry type
  - Optional subject
  - Submission date/time
  - Full message content in a gray, padded block

### User confirmation
- Subject: `We Have Received Your Message`
- Recipient: the submitter's email
- Body includes:
  - Greeting by name
  - Thank-you message
  - Confirmation that the message was received
  - AMTMTI support signoff and website link

### Presentation
- Large heading with color `#0F4C81`
- Block-style message area using `background-color: #f5f5f5; padding: 15px; border-radius: 5px`
- Compact list layout with no bullets
- Footer text in smaller gray font

---

## 2. Membership Application

### Admin notification
- Subject: `New Membership Application`
- Recipient: `COMPANY_EMAIL`
- Body includes:
  - Applicant name and email
  - Country, profession, and organization when provided
  - Membership tier
  - Submission timestamp
  - Optional reason for joining in a pre-wrapped styled box

### Member confirmation
- Subject: `Your AMTMTI Membership Application Has Been Received`
- Recipient: applicant email
- Body includes:
  - Applicant name greeting
  - Confirmation of successful receipt
  - Summary of membership tier and optional profile details
  - Optional reason for joining
  - AMTMTI website link signoff

### Presentation
- Same AMTMTI branding styling
- Notification and confirmation both use structured lists and optional text blocks

---

## 3. Newsletter Signup

### Admin notification
- Subject: `New Newsletter Subscriber`
- Recipient: `COMPANY_EMAIL`
- Body includes:
  - Subscriber email
  - Optional first and last name
  - Subscription date/time

### Subscriber confirmation
- Subject: `Welcome to the AMTMTI Newsletter`
- Recipient: subscriber email
- Body includes:
  - Friendly greeting (`Hi there` or `Hi <FirstName>`)
  - Thank-you note for subscribing
  - Confirmation of newsletter delivery
  - Website link for future visits

### Presentation
- Clean heading and compact list style
- Simple plain HTML with inline fonts and company color accent

---

## 4. Enrollment Application

### Admin notification
- Subject: `New AMTMTI Enrollment Application`
- Recipient: `COMPANY_EMAIL`
- Body includes:
  - Applicant full name and email
  - Optional phone
  - Program name and type
  - Preferred intake/start date
  - Submission timestamp
  - Optional details block for country, region, date of birth, gender

### Applicant confirmation
- Subject: `Your AMTMTI Application Has Been Received`
- Recipient: applicant email
- Body includes:
  - Applicant full name greeting
  - Confirmation of receipt for the program application
  - Summary of the selected program and optional contact details
  - Optional message details
  - AMTMTI website link and signoff

### Presentation
- Headings and list items use the same AMTMTI style
- Message details are rendered in a styled `pre-wrap` block when present

---

## Notes

- The templates are located under `lib/email/templates/`.
- `sendNotificationEmail` and `sendConfirmationEmail` are the two reusable helpers that dispatch admin and user emails.
- Email appearance is intentionally simple and accessible, using standard HTML with inline styling for email client compatibility.
