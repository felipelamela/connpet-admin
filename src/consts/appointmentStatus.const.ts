export const AppointmentStatus = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  INPROCESS: 'Em Andamento',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
} as const;

export type AppointmentStatusType = keyof typeof AppointmentStatus;

export const getAppointmentStatusLabel = (status: AppointmentStatusType): string => {
  return AppointmentStatus[status] || status;
};

export const getAppointmentStatusColor = (status: AppointmentStatusType): string => {
  const colors: Record<AppointmentStatusType, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    INPROCESS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
};

export const getAppointmentStatusOptions = () => {
  return Object.entries(AppointmentStatus).map(([key, value]) => ({
    value: key as AppointmentStatusType,
    label: value,
  }));
};



