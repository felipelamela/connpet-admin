"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Syringe, Plus, Search, Eye } from "lucide-react";

interface Vaccination {
  id: string;
  petName: string;
  vaccineType: string;
  applicationDate: string;
  nextDoseDate: string | null;
  doseNumber: number;
  veterinarian: string;
}

export default function ListaVacinacoesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    {
      id: "1",
      petName: "Rex",
      vaccineType: "V10",
      applicationDate: "2025-09-15",
      nextDoseDate: "2025-10-15",
      doseNumber: 1,
      veterinarian: "Dr. Carlos Silva",
    },
    {
      id: "2",
      petName: "Mimi",
      vaccineType: "Antirrábica",
      applicationDate: "2025-08-20",
      nextDoseDate: null,
      doseNumber: 1,
      veterinarian: "Dr. Carlos Silva",
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Você precisa fazer login primeiro");
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const filteredVaccinations = vaccinations.filter(
    (vac) =>
      vac.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vac.vaccineType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LayoutWrapper>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de Vacinações</h1>
          <p className="text-muted-foreground">Gerencie as vacinações dos pets</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                <CardTitle>Vacinações Cadastradas</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/vacinacoes/historico")}
                >
                  Histórico Completo
                </Button>
                <Button onClick={() => router.push("/vacinacoes/cadastrar")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Vacinação
                </Button>
              </div>
            </div>
            <CardDescription>
              Lista completa de vacinações registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por pet ou vacina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Vacina</TableHead>
                    <TableHead>Data Aplicação</TableHead>
                    <TableHead>Próxima Dose</TableHead>
                    <TableHead>Dose Nº</TableHead>
                    <TableHead>Veterinário</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVaccinations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Nenhuma vacinação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVaccinations.map((vac) => (
                      <TableRow key={vac.id}>
                        <TableCell className="font-medium">{vac.petName}</TableCell>
                        <TableCell>{vac.vaccineType}</TableCell>
                        <TableCell>
                          {new Date(vac.applicationDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {vac.nextDoseDate
                            ? new Date(vac.nextDoseDate).toLocaleDateString("pt-BR")
                            : "Completo"}
                        </TableCell>
                        <TableCell>{vac.doseNumber}</TableCell>
                        <TableCell>{vac.veterinarian}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/vacinacoes/detalhes?id=${vac.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </LayoutWrapper>
  );
}

