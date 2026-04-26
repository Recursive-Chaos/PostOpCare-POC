// toate textele din aplicatie sunt aici
// t("save") => "Salveaza"


const ro = {

  // auth
  loginTitle: "Autentificare",
  loginSubtitle: "Introdu adresa de email pentru a primi un cod.",
  emailLabel: "Email",
  sendCodeBtn: "Trimite cod",
  sendingBtn: "Se trimite...",
  enterCodeTitle: "Introdu codul",
  enterCodeSubtitle: "Codul a fost trimis la",
  codeLabel: "Cod",
  verifyBtn: "Verifica",
  verifyingBtn: "Se verifica...",
  goBack: "Inapoi",
  welcomeTitle: "Bun venit",
  successSubtitle: "Te-ai autentificat cu succes.",
  nameLabel: "Nume:",
  emailMetaLabel: "Email:",
  specLabel: "Spec:",
  dobLabel: "Data nasterii:",
  connError: "Eroare de conexiune.",
  invalidCode: "Cod invalid.",
  emptyEmailError: "Te rog sa introduci un email.",
  emptyCodeError: "Te rog sa introduci codul.",

  // home
  homeTitle: "Acasa",
  signOutBtn: "Deconectare",
  greeting: "Salut,",
};

// functia care returneaza valoarea unei chei
export function t(key: keyof typeof ro): string {
  return ro[key] ?? key;
}

export default ro; // pe viitor returneaza valoarea selectata, momentan hardcoded asa.
