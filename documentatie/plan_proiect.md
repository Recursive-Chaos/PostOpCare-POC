# PostOpCare (POC) - Plan de Proiect

PostOpCare (POC) este un proiect pentru monitorizarea pacientilor dupa operatie. Ideea este simpla: pacientul trimite date de acasa prin aplicatie, iar medicul le vede intr-un dashboard si primeste alerte daca apar complicatii (febra, poze cu plaga care arata rau, etc).

## Ce folosim (Tech Stack)

- **Web (Medic):** Next.js
- **Mobile (Pacient):** React Native cu Expo
- **Backend:** Node.js + Express
- **Baza de date & Auth:** Supabase (PostgreSQL)
- **Hosting:** Vercel (Web) si northflank (Backend)

## Status

### 1. Infrastructura & Dev Setup

- [x] Setup repository si structura de foldere (web, server, mobile, shared)
- [x] Configurare CI/CD (GitHub Actions) pentru teste si lint
- [x] Setup Git Hooks (Husky) - nu lasa cod stricat sa ajunga in repo
- [x] Configurare Vercel pentru deploy automat la partea de web

### 2. Autentificare (Auth)

- [x] Login Medic: sistem cu cod primit pe email (OTP)
- [x] Protectie rute: medicii nu pot intra pe rute de pacienti si invers (backend checks)
- [x] Login Pacient: inregistrare cu cod de invitatie de la medic
- [x] Persistenta sesiune: sa nu te dea afara la refresh

### 3. Dashboard Medic (Web)

- [x] Pagina de Login (minimalista, fara diacritice)
- [x] Homepage simplu (Logout, date medic)
- [x] Lista de pacienti: tabel cu toti pacientii arondati
- [x] Invitatie pacient: buton de adaugat pacient nou (genereaza cod)
- [x] Detalii pacient: istoric check-in-uri si poze
- [x] Sistem de alerte: notificari vizuale pentru valori critice (ex: febra)
- [x] Dashboard creare chestionar pentru evolutie pacienti

### 4. Aplicatie Pacient (Mobile)

- [x] Setup initial Expo
- [x] Ecran login cu cod
- [x] Formular Check-in: durere (1-10), temperatura, observatii
- [x] Upload poza: trimitere poza cu plaga direct la Supabase Storage
- [x] Istoric trimiteri: ce a trimis pacientul in ultimele zile

### 5. Backend & Logica (Server)

- [x] Endpoint-uri Auth (request-code, verify-code)
- [x] Endpoint-uri Pacienti: get lista, post check-in
- [ ] Logica de alertare: serverul verifica datele si trimite email/notificare daca e ceva grav
- [x] Integrare Supabase Storage pentru poze
