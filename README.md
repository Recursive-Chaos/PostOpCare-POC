# PostOpCare
Aplicatie pentru monitorizarea pacientilor postoperator.

## Structura
- `server/` -> Backend (Node.js + Express) — port 3001
- `web/` -> Dashboard medici (Next.js) — port 3000
- `mobile/` -> App pacienti (React Native + Expo) — port 8081

## Setup rapid
```bash
# server
cd server && npm install && npm run dev

# dashboard
cd web && npm install && npm run dev

# mobile (ruleaza in browser pt dev)
cd mobile && npm install && npx expo start
```

## Documentatie
- [documentatie/git.md](documentatie/git.md)
