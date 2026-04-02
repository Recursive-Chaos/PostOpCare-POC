// toate textele din aplicatie sunt aici
// t("save") => "Salveaza"


const ro = {
  // general
  save: "Salveaza",
  cancel: "Anuleaza",
  delete: "Sterge",
  edit: "Editeaza",
  back: "Inapoi",
  continue: "Continua",
  loading: "Se incarca...",

};

// functia care returneaza valoarea unei chei
export function t(key: keyof typeof ro): string {
  return ro[key] ?? key;
}

export default ro; // pe viitor returneaza valoarea selectata, momentan hardcoded asa.
