# Patient Tracker Web App - Blueprint

## 📋 Project Overview
A simple web application for a pediatric dentist to track and manage patient records. Single-user application with basic add and view functionality.

---

## 🎯 Core Features (MVP)
1. **Add New Patient** - Form to add patient information
2. **View All Patients** - List/table view of all patients
3. **Basic Patient Info** - Name, age, contact details, visit history

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **Tailwind CSS** - Styling
- **React** - UI components

### Backend
- **Next.js API Routes** - Backend endpoints
- **Prisma ORM** - Database management
- **SQLite** - Database (simple, file-based, no server needed)

### Deployment
- **Vercel** - Free hosting optimized for Next.js

---

## 📦 Required Packages

### Already Installed ✅
- `next` - Next.js framework
- `react` & `react-dom` - React library
- `@prisma/client` - Prisma client for database operations
- `tailwindcss` - Utility-first CSS framework

### Need to Install 📥
```bash
npm install prisma --save-dev
npm install date-fns  # For date formatting
```

---

## 🗄️ Database Schema

### Patient Model
```prisma
model Patient {
  id            String   @id @default(cuid())
  firstName     String
  lastName      String
  dateOfBirth   DateTime
  parentName    String
  phoneNumber   String
  email         String?
  address       String?
  medicalNotes  String?
  lastVisit     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 📁 Project Structure

```
patient-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database file (auto-generated)
├── src/
│   ├── pages/
│   │   ├── index.js           # Home page - View patients
│   │   ├── add-patient.js     # Add new patient form
│   │   └── api/
│   │       └── patients/
│   │           ├── index.js   # GET all, POST new patient
│   │           └── [id].js    # GET, PUT, DELETE single patient
│   ├── components/
│   │   ├── PatientForm.js     # Reusable patient form
│   │   ├── PatientList.js     # Patient list/table
│   │   └── Layout.js          # Common layout wrapper
│   ├── lib/
│   │   └── prisma.js          # Prisma client instance
│   └── styles/
│       └── globals.css        # Global styles
├── public/
├── package.json
└── PROJECT_BLUEPRINT.md
```

---

## 🚀 Implementation Steps

### Phase 1: Database Setup (15 min)
1. ✅ Install Prisma CLI: `npm install prisma --save-dev`
2. ✅ Initialize Prisma: `npx prisma init --datasource-provider sqlite`
3. ✅ Define Patient schema in `prisma/schema.prisma`
4. ✅ Run migration: `npx prisma migrate dev --name init`
5. ✅ Generate Prisma Client: `npx prisma generate`

### Phase 2: Backend API Routes (20 min)
1. ✅ Create Prisma client singleton (`lib/prisma.js`)
2. ✅ Create `/api/patients` - GET all & POST new
3. ✅ Create `/api/patients/[id]` - GET one, UPDATE, DELETE (for future)

### Phase 3: Frontend Components (30 min)
1. ✅ Create Layout component with navigation
2. ✅ Create PatientForm component (controlled form)
3. ✅ Create PatientList component (table view)
4. ✅ Build add-patient page
5. ✅ Update home page to show patient list

### Phase 4: Styling & UX (15 min)
1. ✅ Style forms with Tailwind CSS
2. ✅ Add responsive design
3. ✅ Add loading states and error handling
4. ✅ Add success messages

### Phase 5: Testing & Deployment (20 min)
1. ✅ Test locally: `npm run dev`
2. ✅ Build for production: `npm run build`
3. ✅ Deploy to Vercel
4. ✅ Configure environment variables (if needed)

**Total Estimated Time: ~2 hours**

---

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended - Free & Easy)

#### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)

#### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial patient tracker app"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Database Consideration for Production**
   - SQLite works locally but NOT on Vercel (file system is read-only)
   - For production, switch to **Vercel Postgres** (free tier available)
   - Or use **PlanetScale** (MySQL), **Supabase** (PostgreSQL) - all have free tiers

#### Vercel Postgres Setup (Free Tier):
```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create Postgres database
# 3. Copy connection string
# 4. Add to environment variables
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

### Option 2: Other Hosting Options
- **Netlify** - Similar to Vercel
- **Railway** - Good for apps with databases
- **Render** - Free tier available

---

## 🔐 Security Considerations

Since this is a single-user app handling patient data:

1. **Add Authentication** (Phase 2 - Future)
   - Use `next-auth` for simple password protection
   - Or Vercel authentication

2. **Environment Variables**
   - Never commit database URL to Git
   - Use `.env` file (already gitignored)

3. **Data Privacy**
   - Consider HIPAA compliance if in US
   - Add terms of service
   - Implement data backup strategy

---

## 🎨 UI/UX Wireframe

### Home Page (View Patients)
```
+----------------------------------------+
| Patient Tracker         [+ Add Patient]|
+----------------------------------------+
| Search: [________]                      |
|                                         |
| Name          | Age | Phone    | Last  |
|               |     |          | Visit |
|---------------|-----|----------|-------|
| John Doe      | 8   | 555-0100 | 2/1/26|
| Jane Smith    | 6   | 555-0101 | 1/28  |
+----------------------------------------+
```

### Add Patient Page
```
+----------------------------------------+
| Add New Patient              [Cancel]  |
+----------------------------------------+
| First Name: [____________]             |
| Last Name:  [____________]             |
| Date of Birth: [__/__/____]            |
| Parent/Guardian: [____________]        |
| Phone: [____________]                  |
| Email: [____________] (optional)       |
| Address: [____________] (optional)     |
| Medical Notes:                         |
| [_____________________________]        |
|                                         |
|              [Save Patient]            |
+----------------------------------------+
```

---

## 📈 Future Enhancements (Phase 2+)

1. **Search & Filter** - Search patients by name, filter by age
2. **Patient Details Page** - Individual patient view with full history
3. **Visit Management** - Add/track dental visits for each patient
4. **Appointment Scheduling** - Calendar integration
5. **Treatment Plans** - Track treatment progress
6. **File Uploads** - Store X-rays, documents
7. **Reports** - Generate patient reports
8. **Reminders** - Email/SMS appointment reminders
9. **Data Export** - Export patient data to CSV/PDF
10. **Authentication** - Password protection for the app

---

## 🐛 Common Issues & Solutions

### Issue: Prisma not generating client
**Solution:** Run `npx prisma generate` after any schema changes

### Issue: Database locked (SQLite)
**Solution:** Close any database viewers (Prisma Studio, DB Browser)

### Issue: API routes not working
**Solution:** Ensure files are in `src/pages/api/` folder

### Issue: Styles not applying
**Solution:** Restart dev server after Tailwind config changes

---

## 📚 Helpful Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Visual database editor
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema without migration

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
```

---

## ✅ Pre-Launch Checklist

- [ ] All patient data displays correctly
- [ ] Forms validate input properly
- [ ] Error messages are user-friendly
- [ ] Mobile responsive design works
- [ ] Database backup strategy in place
- [ ] Environment variables configured
- [ ] Test on different browsers
- [ ] Add loading indicators
- [ ] Implement error boundaries
- [ ] Set up monitoring (optional)

---

## 📞 Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 🎯 Success Criteria

Your MVP is complete when:
1. ✅ Dentist can add a new patient
2. ✅ All patients display in a clean list
3. ✅ Data persists (saved to database)
4. ✅ App is accessible online (deployed)
5. ✅ UI is simple and intuitive

---

**Ready to start? Let's begin with Phase 1: Database Setup!**
