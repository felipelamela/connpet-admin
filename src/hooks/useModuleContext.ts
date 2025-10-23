import { usePathname } from 'next/navigation';

/**
 * Hook para detectar o módulo atual baseado na URL
 * Retorna informações contextuais do módulo
 */
export function useModuleContext() {
  const pathname = usePathname();

  // Detectar módulo pela URL
  let module: 'petshop' | 'clinica' | 'grooming' | null = null;
  let moduleColor = 'text-gray-600';
  let moduleName = '';

  if (pathname.startsWith('/petshop')) {
    module = 'petshop';
    moduleColor = 'text-blue-600';
    moduleName = 'PetShop';
  } else if (pathname.startsWith('/clinica')) {
    module = 'clinica';
    moduleColor = 'text-green-600';
    moduleName = 'Clínica Veterinária';
  } else if (pathname.startsWith('/grooming')) {
    module = 'grooming';
    moduleColor = 'text-purple-600';
    moduleName = 'Grooming';
  }

  /**
   * Gera rota relativa ao módulo atual
   */
  const getModuleRoute = (path: string) => {
    if (!module) return path;
    // Remove barra inicial se houver
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `/${module}/${cleanPath}`;
  };

  return {
    module,
    moduleColor,
    moduleName,
    getModuleRoute,
    isInModule: module !== null,
  };
}

