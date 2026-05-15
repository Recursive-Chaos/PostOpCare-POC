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
  loading: "Se incarca...",
  emptyEmailError: "Te rog sa introduci un email.",
  emptyCodeError: "Te rog sa introduci codul.",

  // nav / general
  signOutBtn: "Deconectare",

  // home
  patientsTitle: "Pacienti",

  // questionnaires
  questionnairesTitle: "Chestionare",

  // invite
  inviteTitle: "Invita pacient",
  inviteSubmitBtn: "Invita",
  inviteSubmitting: "Se trimite...",
  inviteSuccess:
    "Pacientul a fost creat. Poate intra in aplicatia mobila cu acest email.",
  inviteExisted: "Pacientul exista deja in sistem. Datele au fost actualizate.",
  inviteError: "Eroare la trimiterea invitatiei.",
  inviteConnError: "Eroare de conexiune cu serverul.",
  fieldEmail: "Email pacient",
  fieldEmailPlaceholder: "pacient@example.com",
  fieldFirstName: "Prenume pacient",
  fieldFirstNamePlaceholder: "Prenume",
  fieldLastName: "Nume pacient",
  fieldLastNamePlaceholder: "Nume",
  fieldPhone: "Numar de telefon",
  fieldPhonePlaceholder: "07xx xxx xxx",
  fieldDob: "Data nasterii",
  fieldNotes: "Note",
  fieldNotesPlaceholder: "observatii",
  fieldSurgeryType: "Tip operatie",
  fieldSurgeryTypePlaceholder: "ex: Proteza de genunchi",
  fieldSurgeryDate: "Data operatiei",
  fieldDischargeDate: "Data externarii",
  fieldMonitoringEnd: "Data final monitorizare",
  fieldQuestionnaire: "Chestionar",
  fieldSelectQuestionnaire: "Alege chestionar",
};

export function t(key: keyof typeof ro): string {
  return ro[key] ?? key;
}

export default ro;
