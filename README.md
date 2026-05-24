# 🚀 Next.js SSR Authentication Boilerplate

A **Next.js (App Router) Template** frontend with **fully SSR authentication** using **Mobile Number + OTP** authentication powered by a **.NET Core Web API** backend.

Built for secure production-grade authentication using:

- 📱 Mobile Number Login
- 🔐 OTP Verification
- 🍪 HttpOnly Secure Cookies
- ♻️ Silent Token Refresh
- ⚡ Fully SSR Architecture
- 🛡️ JWT + Refresh Token Strategy
- 🔄 Auto Re-authentication using `proxy.ts`

---

# 📦 Tech Stack

## Frontend
- Next.js (App Router)
- TypeScript
- Server Components
- SSR Authentication
- Tailwind CSS

## Backend
- ASP.NET Core Web API
- API Versioning
- JWT Authentication
- Refresh Token Authentication
- Cookie-based Security

---

# 🌐 URLs

| Service | URL |
|---|---|
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:5031` |
| Swagger | `http://localhost:5031/swagger/index.html` |

---

# 🔐 Authentication Flow

```text
1. User enters mobile number
        ↓
2. Backend sends OTP
        ↓
3. User verifies OTP
        ↓
4. Backend generates:
      - AuthToken (Short-lived)
      - RefToken (Long-lived)
        ↓
5. Both tokens are stored as:
      - HttpOnly Cookies
      - Secure Cookies (HTTPS)
        ↓
6. User accesses protected SSR routes
        ↓
7. If AuthToken expires:
      proxy.ts silently refreshes token
      using RefToken
        ↓
8. New AuthToken generated automatically
```

---

# 🧠 Token Strategy

## AuthToken
Short-lived JWT access token.

Used for:
- API authorization
- SSR authentication
- User identity

### Characteristics
- Expires quickly
- Stored in HttpOnly cookie
- Never accessible from JavaScript

---

## RefToken
Long-lived refresh token.

Used for:
- Generating new AuthTokens
- Silent re-authentication

### Characteristics
- Long expiration
- HttpOnly cookie
- Secure cookie
- Automatically used by `proxy.ts`

---

# 🛡️ Security Features

✅ HttpOnly Cookies  
✅ Secure Cookies (HTTPS)  
✅ Silent Token Refresh  
✅ SSR Protected Routes  
✅ No LocalStorage Tokens  
✅ No Client-side JWT Handling  
✅ Automatic Session Recovery  
✅ API Versioning Support  

---

# 🏗️ Project Structure

```bash
app/
│
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── signup/
│   │   └── page.tsx
│   │
│   └── verify-otp/
│       ├── layout.tsx
│       └── page.tsx
│
├── (protected)/
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   └── layout.tsx
│
├── api/
│   └── auth/
│       └── logout/
│           └── route.ts
│
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx

lib/
├── api.ts
├── auth.actions.ts
├── otp.ts
└── session.ts

types/
└── auth.ts

proxy.ts

.env.local
next.config.ts
```

---

# ⚙️ Backend API Versioning

Backend APIs use ASP.NET Core API versioning.

Example:

```http
/api/v1/Authorization/Login
/api/v1/Authorization/VerifyOTP
```

---

# 📲 Login APIs

## Send OTP

```http
POST /api/v1/Authorization/Login
```

### Request

```json
{
  "MobileNumber": "stringstri"
}
```

---

## Verify OTP

```http
POST /api/v1/Authorization/VerifyOTP
```

### Request

```json
{
  "MobileNumber": "string",
  "OTP": "string"
}
```

### Response

Backend automatically sets:

```http
Set-Cookie:
  AuthToken=xxx;
  HttpOnly;
  Secure

Set-Cookie:
  RefToken=xxx;
  HttpOnly;
  Secure
```

---

# ♻️ Silent Authentication Refresh

`proxy.ts` automatically handles expired access tokens.

## Flow

```text
Request arrives
      ↓
AuthToken expired?
      ↓
YES
      ↓
Use RefToken
      ↓
Call refresh endpoint
      ↓
Generate new AuthToken
      ↓
Continue request
```


---

# 🔥 Why SSR Authentication?

## Benefits

- Better SEO
- Better security
- Faster first load
- Protected server-rendered pages
- No client-side token exposure
- Cleaner architecture

---

# 🚀 Running Frontend

```bash
npm install
npm run dev
```

Frontend starts at:

```text
http://localhost:3000
```

---

# 🔧 Recommended Production Setup

## Frontend
- Vercel
- Docker
- Nginx

## Backend
- IIS
- Docker
- Linux VPS

## HTTPS
Always use HTTPS in production because secure cookies require it.

---

# 📌 Notes

- Tokens are never stored in LocalStorage
- All authentication is cookie-based
- Refresh is fully automatic
- Frontend remains SSR-first
- Optimized for scalable enterprise applications

---

# 🏁 Future Improvements

- Role-based authentication
- Device tracking
- Session management
- Rate limiting
- CAPTCHA
- Multi-factor authentication
- Audit logs

---

# 📄 License

MIT License

---

# ❤️ Built With

- Next.js
- ASP.NET Core
- TypeScript
- JWT
- SSR Architecture