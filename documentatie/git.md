# Cum lucram cu Git

## Prima data (setup)

```bash
git clone https://github.com/Recursive-Chaos/PostOpCare-POC
cd PostOpCare-POC
```

## Cand incepi sa lucrezi la ceva

```bash
# mergi pe branch-ul main si trage ultimele modificari de pe github
git checkout main
git pull

# creeaza un branch nou pt task-ul tau din main-ul actualizat
# format: initiale-ce-faci
git checkout -b dg-autentificare-medic
```

## Pe parcurs ce lucrezi

```bash
# cand ai facut modificari care au sens impreuna
git add .
git commit -m "am adaugat login pt medici"

# poti face mai multe commit-uri, nu e nicio problema
git add .
git commit -m "am adaugat validare email"
```

## Cand ai terminat

```bash
# push pe github
git push origin <nume-branch>
```

Dupa push o sa apara un link in terminal pt pull request. Daca nu, mergi pe github pe branch-ul tau si o sa vezi un buton "Compare & pull request".

## Reguli simple

- Nu lucra direct pe `main`
- Inainte sa incepi ceva nou: mergi pe `main` (`git checkout main`) si actualizeaza-l (`git pull`)
- Scrie mesaje de commit care au sens, nu "update" sau "fix"
- Un branch = un task
- Cere review la pull request-uri
