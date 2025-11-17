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
    moduleColor = 'text-orange-600';
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

  /**
   * Retorna classes de cor para botões baseadas no módulo
   */
  const getButtonColors = () => {
    if (moduleColor === "text-blue-600") {
      return {
        default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        outline: "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 dark:border-blue-600 dark:text-blue-400"
      };
    } else if (moduleColor === "text-orange-600") {
      return {
        default: "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700",
        outline: "border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 dark:border-orange-600 dark:text-orange-400"
      };
    } else if (moduleColor === "text-purple-600") {
      return {
        default: "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700",
        outline: "border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 dark:border-purple-600 dark:text-purple-400"
      };
    }
    // Fallback
    return {
      default: "bg-gray-600 text-white hover:bg-gray-700",
      outline: "border-gray-600 text-gray-600 hover:bg-gray-50"
    };
  };

  return {
    module,
    moduleColor,
    moduleName,
    getModuleRoute,
    isInModule: module !== null,
    getButtonColors,
  };
}

