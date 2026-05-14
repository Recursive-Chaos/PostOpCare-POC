# PostOpCare Server

Aici e backend-ul pentru PostOpCare. E facut cu Node.js, Express si TypeScript.

## Cum il pornesti

1. Intra in folder: `cd server`
2. Instaleaza ce trebuie: `npm install`
3. Porneste server-ul (se restarteaza singur cand schimbi ceva): `npm run dev`

Server-ul ruleaza pe: `http://localhost:3001`

## Ce e prin foldere

- `src/index.ts` -> Fisierul principal, aici punem rutele si raspunsurile
- `src/config/` -> Setari (port, baze de date, etc)
- `src/middleware/` -> Functii care ajuta (ex: errorr handler de exemplu)
- `src/types/` -> Modele de date sa nu ne incurcam in cod

## Verificare

Poti sa intri pe: `http://localhost:3001/health`
Daca apare "ok", functioneaza
