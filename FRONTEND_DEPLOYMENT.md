# Health Insight Suite - Frontend Deployment Guide

## 📋 Overview

This is a **frontend-only deployment** of the Health Insight Suite Hospital Management System using **Vercel** and **static mock data**. The backend API calls are intercepted and served by mock data stored in the client.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Health-Insight-Suite.git
cd Health-Insight-Suite
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Locally
```bash
cd artifacts/hims
pnpm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🏗️ Project Structure

```
Health-Insight-Suite/
├── artifacts/
│   ├── hims/                    # Frontend (Vite + React)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── mock-data/   # Mock data files
│   │   │   │   │   ├── admissions.ts
│   │   │   │   │   ├── appointments.ts
│   │   │   │   │   ├── beds.ts
│   │   │   │   │   ├── emergency-cases.ts
│   │   │   │   │   ├── invoices.ts
│   │   │   │   │   ├── lab-orders.ts
│   │   │   │   │   ├── medications.ts
│   │   │   │   │   ├── patients.ts
│   │   │   │   │   ├── prescriptions.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── api-mock.ts  # API interceptor
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx         # Updated with fetch interception
│   │   │   └── pages/
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── api-server/              # Backend (not deployed)
├── lib/                         # Shared libraries
├── vercel.json                  # Vercel configuration
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

---

## 🔄 How It Works

### Mock Data Flow
1. Frontend makes a fetch request to `/api/...`
2. The global `fetch` function is intercepted in `main.tsx`
3. The `mockFetch` function (from `lib/api-mock.ts`) checks if it's an API call
4. If it matches a known endpoint, it returns the corresponding mock data
5. React Query receives the data normally, component renders

### Mock Data Files
Each mock data file exports typed data arrays:
- `admissions.ts` - Hospital admissions
- `appointments.ts` - Patient appointments  
- `beds.ts` - Bed management
- `emergency-cases.ts` - Emergency department cases
- `invoices.ts` - Billing/invoices
- `lab-orders.ts` - Lab test orders
- `medications.ts` - Pharmacy medications
- `patients.ts` - Patient records
- `prescriptions.ts` - Prescriptions

---

## 📦 Build & Deploy

### Build for Production
```bash
pnpm run build
```

### Preview Build Locally
```bash
pnpm run serve
```

### Deploy to Vercel

#### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from root directory
vercel --prod
```

#### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New Project"
4. Select the GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `artifacts/hims`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"

---

## 🔧 Environment Variables

The app uses environment variables set in `vite.config.ts`:

```typescript
const port = Number(process.env.PORT || 5173);
const basePath = process.env.BASE_PATH || "/";
```

**For Vercel:**
- `PORT` is typically not needed (handled by Vercel)
- `BASE_PATH` defaults to `/`

---

## 📝 Available Pages

- **Dashboard** - Hospital statistics and bed overview
- **Admissions** - Active patient admissions
- **Appointments** - OPD/IPD appointments  
- **Emergency** - Emergency cases management
- **Beds** - Bed occupancy status
- **Patients** - Patient records
- **Pharmacy** - Medications and prescriptions
- **Lab Orders** - Laboratory test requests
- **Billing** - Invoices and payments
- **Analytics** - Revenue and performance charts

---

## 🔌 Switching to Real Backend

To connect to the real backend API:

1. **Remove fetch interception** in `src/main.tsx`:
   ```typescript
   // Comment out or remove the fetch interception code
   // window.fetch = mockFetch;
   ```

2. **Update API base URL**:
   - Set `BASE_PATH` environment variable to your backend URL
   - e.g., `BASE_PATH=https://api.example.com`

3. **Redeploy to Vercel**

---

## 🧪 Testing

### Local Testing
```bash
# Development server with HMR
pnpm run dev

# Build and preview production
pnpm run build && pnpm run serve
```

### Type Checking
```bash
pnpm run typecheck
```

---

## 📊 Performance

- **Static deployment** - No cold starts
- **Client-side mocking** - Instant responses
- **Vite bundling** - Optimized for fast loads
- **Tailwind CSS** - Minimal CSS footprint

---

## 🐛 Troubleshooting

### Issue: Blank page on load
- Check browser console for errors
- Verify `BASE_PATH` environment variable
- Ensure `artifacts/hims/dist` exists after build

### Issue: 404 on specific pages
- Vercel requires `vercel.json` config for SPA routing
- Already configured, but verify `"outputDirectory": "artifacts/hims/dist"`

### Issue: Mock data not loading
- Ensure `window.fetch` interception in `main.tsx`
- Check browser Network tab for API calls
- Verify mock data files exist in `src/lib/mock-data/`

---

## 📚 Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [TanStack Query (React Query)](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📝 Next Steps

1. ✅ Frontend deployed on Vercel
2. 🔄 When backend is ready:
   - Update `BASE_PATH` to backend URL
   - Remove fetch interception
   - Redeploy

3. 📱 Optional enhancements:
   - Add PWA support
   - Implement service workers
   - Add offline mode with service workers + mock data

---

## 👨‍💻 Development

### Adding New Mock Data
1. Create new file in `src/lib/mock-data/`
2. Export data array with type
3. Add to `src/lib/mock-data/index.ts`
4. Update `src/lib/api-mock.ts` to handle endpoint

### Modifying Mock Data
Edit the corresponding file in `src/lib/mock-data/` and rebuild.

---

## 📄 License

MIT License - See LICENSE file for details

---

**Questions?** Open an issue or check the documentation above.
