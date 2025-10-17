"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PawPrint,
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Package,
  FlaskConical,
  LogOut,
  User,
  Settings,
  Users,
  Pill,
  Syringe,
  Bed,
  DollarSign,
  Building2,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Pets",
    icon: PawPrint,
    items: [
      { title: "Lista de Pets", href: "/pets/lista" },
      { title: "Cadastrar Pet", href: "/pets/cadastrar" },
      { title: "Lista de Tutores", href: "/tutores/lista" },
      { title: "Cadastrar Tutor", href: "/tutores/cadastrar" },
    ],
  },
  {
    title: "Consultas",
    icon: Stethoscope,
    items: [
      { title: "Nova Consulta", href: "/consultas/nova" },
      { title: "Lista de consultas", href: "/consultas/lista" },
      { title: "Histórico", href: "/consultas/historico" },
    ],
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    href: "/agendamentos",
  },
  {
    title: "Produtos",
    icon: Package,
    items: [
      { title: "Lista de Produtos", href: "/produtos/lista" },
      { title: "Cadastrar Produto", href: "/produtos/cadastrar" },
    ],
  },
  {
    title: "Exames",
    icon: FlaskConical,
    items: [
      { title: "Cadastrar Pedido", href: "/exames/cadastrar" },
      { title: "Listagem Exames | Resultados", href: "/exames/listagem" },
    ],
  },
  {
    title: "Vacinações",
    icon: Syringe,
    items: [
      { title: "Lista de Vacinações", href: "/vacinacoes/lista" },
      { title: "Cadastrar Vacinação", href: "/vacinacoes/cadastrar" },
      { title: "Tipos de Vacina", href: "/tipos-vacina/lista" },
    ],
  },
  {
    title: "Medicamentos",
    icon: Pill,
    items: [
      { title: "Lista de Medicamentos", href: "/medicamentos/lista" },
      { title: "Cadastrar Medicamento", href: "/medicamentos/cadastrar" },
    ],
  },
  {
    title: "Internações",
    icon: Bed,
    items: [
      { title: "Lista de Internações", href: "/internacoes/lista" },
      { title: "Cadastrar Internação", href: "/internacoes/cadastrar" },
    ],
  },
  {
    title: "Equipe",
    icon: Users,
    items: [
      { title: "Lista de Funcionários", href: "/funcionarios/lista" },
      { title: "Cadastrar Funcionário", href: "/funcionarios/cadastrar" },
      { title: "Lista de Serviços", href: "/servicos/lista" },
      { title: "Cadastrar Serviço", href: "/servicos/cadastrar" },
    ],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    items: [
      { title: "Lista de Pagamentos", href: "/pagamentos/lista" },
      { title: "Planos", href: "/planos/lista" },
    ],
  },
  {
    title: "Clínica",
    icon: Building2,
    items: [
      { title: "Perfil da Clínica", href: "/clinica/perfil" },
      { title: "Configurações", href: "/configuracoes" },
    ],
  },
];

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">ConnPet Admin</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {menuItems.map((menuItem) => (
              <NavigationMenuItem key={menuItem.title}>
                {menuItem.items ? (
                  <>
                    <NavigationMenuTrigger>
                      <menuItem.icon className="mr-2 h-4 w-4" />
                      {menuItem.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className={menuItem.className}>
                        {menuItem.items.map((item) => (
                          <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                        />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link href={menuItem.href || "#"} className="flex items-center gap-2">
                      {menuItem.icon && <menuItem.icon className="mr-2 h-4 w-4" />}
                      {menuItem.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar.png" alt="Usuário" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@connpet.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

const ListItem = ({
  className,
  title,
  href,
}: {
  className?: string;
  title: string;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

