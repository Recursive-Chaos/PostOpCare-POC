// toate textele din aplicatie sunt aici
// t("loading") => "Se incarca..."

const ro = {
  // auth
  loginTitle: "Autentificare",
  loginSubtitle: "Introdu adresa de email pentru a primi un cod.",
  patientLoginSubtitle:
    "Te rugam sa introduci adresa ta de email pentru a continua.",
  emailLabel: "Email",
  emailPlaceholder: "exemplu@email.com",
  sendCodeBtn: "Trimite cod",
  sendingBtn: "Se trimite...",
  enterCodeTitle: "Introdu codul",
  enterCodeSubtitle: "Codul a fost trimis la",
  codeLabel: "Cod de verificare",
  codePlaceholder: "XXXXXXXX",
  verifyBtn: "Verifica",
  verifyingBtn: "Se verifica...",
  goBack: "Inapoi",
  welcomeTitle: "Bun venit",
  successSubtitle: "Te-ai autentificat cu succes.",
  nameLabel: "Nume:",
  emailMetaLabel: "Email:",
  specLabel: "Spec:",
  dobLabel: "Data nasterii:",
  connError: "A aparut o eroare de conexiune.",
  invalidCode: "Cod invalid.",
  invalidOrExpiredCode: "Cod invalid sau expirat.",
  loading: "Se incarca...",
  emptyEmailError: "Te rugam sa introduci o adresa de email.",
  emptyCodeError: "Te rugam sa introduci codul primit pe email.",

  // home
  homeTitle: "Acasa",
  signOutBtn: "Deconectare",
  greeting: "Salut,",

  // mobile dashboard
  greetingPatient: "Buna ziua,",
  dayWord: "Ziua",
  recoverySuffix: "de recuperare",
  dailyQuestionnaireLabel: "CHESTIONAR ZILNIC",
  fillQuestionnaire: "Completeaza chestionar",
  searchPlaceholder: 'Cauta dupa data — ex. "4 mai" sau "luni"',
  monitoringHistory: "ISTORIC MONITORIZARE",
  painLabel: "Durere",
  tempLabel: "Temperatura",
};

// functia care returneaza valoarea unei chei
export function t(key: keyof typeof ro): string {
  return ro[key] ?? key;
}

export default ro; // pe viitor returneaza valoarea selectata, momentan hardcoded asa.
