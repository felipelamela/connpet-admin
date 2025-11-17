export const VetSpecialty: Record<number, string> = {
  1: "Clínica Geral",
  2: "Ortopedia",
  3: "Neurologia",
  4: "Cardiologia",
  5: "Dermatologia",
  6: "Oftalmologia",
  7: "Otorrinolaringologia",
  8: "Nefrologia / Urologia",
  9: "Gastroenterologia",
  10: "Endocrinologia",
  11: "Oncologia",
  12: "Anestesiologia",
  13: "Reprodução e Obstetrícia",
  14: "Odontologia Veterinária",
  15: "Hematologia",
  16: "Infectologia",
  17: "Nutrição",
  18: "Comportamental",
  19: "Fisioterapia",
  20: "Acupuntura",
  21: "Hidroterapia",
  22: "Reabilitação",
  23: "Produção Animal",
};

export const getVetSpecialtyLabel = (specialty: number): string => {
  return VetSpecialty[specialty] || `Especialidade ${specialty}`;
};

export const getVetSpecialtyOptions = () => {
  return Object.entries(VetSpecialty).map(([key, value]) => ({
    value: Number(key),
    label: value,
  }));
};

