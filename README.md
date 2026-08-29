# Oneness CRM Contacts UI

A full-stack, responsive CRM Contacts management application built with:
- **Frontend**: React 18, TanStack Table v8, TanStack Query v5, Tailwind CSS, Lucide Icons, and `@google/genai` (Breeze AI assistant).
- **Backend**: Express REST API (`/api/contacts`), TypeScript runtime, mock persistent data engine with multi-criteria search, filtering, pagination, bulk operations, and Gemini AI interaction summaries.
- **Design**: Inspired by Oneness UI with dark teal navigation rails, clean table density, responsive drawer panels, and smooth modal forms.

## Features
- **Contacts Data Table**: Multiselect rows, column sorting, customizable pagination, priority badges, stage tags, and direct inline actions.
- **Filtering & Search**: Global search across name, company, email, and phone + multi-select stage/owner filtering + deal value range filtering.
- **Contact Details Drawer**: Tabs for overview notes, interaction history timeline, deal attributes, and Breeze AI summarization.
- **Breeze AI Integration**: AI-driven contact summary and next-best-action generator powered by Gemini.
- **Create & Edit Modal**: Form validation, status selection, assigned owner assignment, and deal value calculation.

## Quick Start

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm start
```
