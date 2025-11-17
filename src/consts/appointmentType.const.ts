export const TypeAppointment: Record<number, string> = {
    1: 'Consulta de Rotina',
    2: 'Emergência',
    3: 'Urgência',
    4: 'Retorno',
    5: 'Avaliação Especializada',
  };

export const getAppointmentTypeLabel = (type: number): string => {
  return TypeAppointment[type] || `Tipo ${type}`;
};

export const getAppointmentTypeOptions = () => {
  return Object.entries(TypeAppointment).map(([key, value]) => ({
    value: Number(key),
    label: value,
  }));
};

