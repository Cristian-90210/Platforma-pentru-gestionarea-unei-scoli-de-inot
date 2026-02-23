# Întrebări de Control și Checklist Final

## 📘 Teorie (Răspunsuri pentru Nota 10)

### 1. Ce este React?
React este o librărie JavaScript open-source creată de Facebook pentru construirea interfețelor de utilizator (UI). Se bazează pe **componente** (blocuri reutilizabile de cod) și folosește un **Virtual DOM** pentru a actualiza eficient pagina doar acolo unde s-au schimbat datele, fără a reîncărca totul.

### 2. Ce înseamnă SPA (Single Page Application)?
O aplicație web care încarcă o singură pagină HTML inițială și actualizează dinamic conținutul pe măsură ce utilizatorul interacționează cu ea. Navigarea între "pagini" se face instantaneu prin JavaScript (routing), fără request-uri noi la server pentru fiecare pagină.

### 3. De ce folosim TypeScript?
TypeScript este un superset al JavaScript care adaugă **tipizare statică**. Ne ajută să prindem erorile în timpul scrierii codului (compile-time) în loc să apară la rulare (runtime). Oferă autocompletion mai bun și face codul mai ușor de înțeles și întreținut.

### 4. Ce este JSX/TSX?
JSX (JavaScript XML) este o extensie de sintaxă care ne permite să scriem cod asemănător cu HTML direct în JavaScript/TypeScript. TSX este varianta pentru TypeScript.
*Exemplu:* `const element = <h1>Salut!</h1>;`

### 5. Ce sunt props?
**Props** (proprietăți) sunt date transmise de la o componentă părinte către o componentă copil. Ele sunt "read-only" (nu pot fi modificate de copil).
*Exemplu:* `<Card title="Curs Înot" />` (titlul este un prop).

### 6. Ce este state?
**State** reprezintă datele interne ale unei componente care se pot schimba în timp (ex: textul dintr-un input, dacă un meniu e deschis sau nu). Când state-ul se schimbă, React randează din nou componenta pentru a reflecta modificările.

### 7. Ce sunt Hooks?
Funcții speciale în React (încep cu `use`) care ne permit să folosim state și alte caracteristici React în componente funcționale.
*   `useState`: Pentru managementul stării locale.
*   `useEffect`: Pentru efecte secundare (ex: fetch date, modificare titlu pagină).

### 8. Ce este Context?
Un mecanism pentru a transmite date prin arborele de componente fără a fi nevoie să pasăm props manual la fiecare nivel (prop drilling). Ideal pentru date globale: tema (dark/light), user logat, limbă.

### 9. Ce este Provider?
O componentă care "împachetează" o parte din aplicație și oferă acces la valorile din Context tuturor componentelor din interiorul ei.
*Exemplu:* `<ThemeProvider><App /></ThemeProvider>`

### 10. Ce este Mock Data?
Date false/simulate folosite în timpul dezvoltării pentru a testa interfața când nu avem încă un backend real.

### 11. Ce sunt Controlled Components?
Componente de formular (input, select) unde valoarea lor este controlată de React prin `state`. Orice modificare declanșează o funcție `onChange` care actualizează state-ul.

---

## ✅ Checklist Final (Pentru Nota 10)

Verifică următoarele puncte înainte de prezentare:

- [ ] **Structura Proiectului**: Folderele `components`, `pages`, `layout`, `context` sunt la locul lor.
- [ ] **TypeScript**: Nu ai erori de tip "any" și interfețele (`Student`, `Course`) sunt folosite corect.
- [ ] **Routing**: Navigarea funcționează fără refresh la pagină. Link-urile active sunt evidențiate.
- [ ] **Hooks**: `useState` și `useEffect` sunt folosite și demonstrate.
- [ ] **Componente Reutilizabile**: `Button`, `Card` sunt folosite în mai multe locuri.
- [ ] **Dark Mode**: Toggle-ul din header schimbă culorile în toată aplicația și preferința se salvează.
- [ ] **Responsive**: Meniul lateral se ascunde pe mobil (hamburger menu) și cardurile se așează pe coloane (grid).
- [ ] **Formulare**: Adăugarea unui elev funcționează și are validare (nu te lasă să adaugi gol).
- [ ] **Auth Simulat**: Poți intra ca Admin (vezi tot) sau User (vezi limitat).
