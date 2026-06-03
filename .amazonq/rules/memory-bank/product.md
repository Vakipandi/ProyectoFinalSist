# Product Overview

## Project Purpose
Sistema de Gestión de Consultas Administrativas — a full-stack web application for managing student administrative inquiries at an educational institution. Students submit queries, staff manages and responds to them, and a knowledge base (KMS) helps deflect repetitive questions.

## Value Proposition
- Centralizes student-to-administration communication in a structured, trackable workflow
- Reduces staff workload via an integrated Knowledge Management System (KMS) that surfaces relevant articles while students type their query
- Provides visibility into consultation volume, status, and priority through reporting dashboards

## Key Features

### Student (Alumno) Features
- Submit consultations categorized as: académico, financiero, infraestructura, sistemas
- Real-time KMS suggestions while composing a query (debounced search, 600ms)
- Track personal consultation history and status updates

### Admin / Secretaria Features
- View and filter all consultations by status (pendiente, en_proceso, resuelto)
- Update consultation status with optional comments (full audit trail via status_history)
- Respond to consultations (auto-sets status to "resuelto")
- Promote resolved consultation responses directly into the KMS
- Register new users (admin only)
- View summary reports: totals by status, category, and priority with optional date range filtering

### Knowledge Management System (KMS)
- Create and publish articles with keywords and category tags
- Full-text search with keyword scoring
- View count tracking per article
- Articles surfaced proactively during consultation creation

## Target Users
| Role | Capabilities |
|------|-------------|
| alumno | Submit and track own consultations, view KMS suggestions |
| secretaria | Manage all consultations, respond, update status, add to KMS, view reports |
| admin | All secretaria capabilities + register new users |

## Use Cases
1. Student submits an academic query → system auto-infers priority from keywords → staff responds → response optionally added to KMS
2. Staff filters pending high-priority consultations and processes them in order
3. Admin generates a report for a date range to review consultation volume by category
4. Student typing a new query sees a matching KMS article and resolves their own issue without submitting
