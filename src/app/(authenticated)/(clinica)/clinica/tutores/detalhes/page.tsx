"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, FileText, MapPin, PawPrint, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { useModuleContext } from "@/hooks/useModuleContext";

interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string | null;
  color: string | null;
  weight: number | null;
  microchipNumber: string | null;
  gender: string;
  active: boolean;
  observations: string | null;
}

interface Tutor {
  id: string;
  userId: string;
  document: string | null;
  phone: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: boolean;
  };
  address: Address | null;
  pets: Pet[];
}

export default function DetalhesTutorPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
  const searchParams = useSearchParams();
  const tutorId = searchParams.get("id");
  
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tutorId) {
      fetchTutorDetails();
    }
  }, [tutorId]);

  const fetchTutorDetails = async () => {
    if (!tutorId) return;
    
    setIsLoading(true);
    try {
      const response = await api.get(`admin/tutors/${tutorId}`);
      const tutorData = response?.data || {};
      setTutor(tutorData);
    } catch (error) {
      console.error("Erro ao carregar detalhes do tutor:", error);
      toast.error("Erro ao carregar detalhes do tutor");
      router.push("/clinica/tutores/lista");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calculateAge = (birthDate: string | null): string => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) return `${months} ${months === 1 ? "mês" : "meses"}`;
    if (months === 0) return `${years} ${years === 1 ? "ano" : "anos"}`;
    return `${years} ${years === 1 ? "ano" : "anos"} e ${months} ${months === 1 ? "mês" : "meses"}`;
  };

  const getGenderLabel = (gender: string): string => {
    const genderMap: { [key: string]: string } = {
      MALE: "Macho",
      FEMALE: "Fêmea",
    };
    return genderMap[gender] || gender;
  };

  const formatAddress = (address: Address | null): string => {
    if (!address) return "Não cadastrado";
    
    const parts = [
      address.street,
      address.number,
      address.complement && `(${address.complement})`,
      address.neighborhood,
      address.city,
      address.state,
    ].filter(Boolean);
    
    return parts.join(", ") + ` - CEP: ${address.cep}`;
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Tutor não encontrado</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/clinica/tutores/lista")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold mb-2">Detalhes do Tutor</h1>
        <p className="text-muted-foreground">Informações completas do tutor cadastrado</p>
      </div>

      <div className="grid gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Dados Pessoais</CardTitle>
            </div>
            <CardDescription>Informações básicas do tutor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{tutor.user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{tutor.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{tutor.document || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{tutor.phone || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">{formatDate(tutor.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-4 w-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tutor.user.status
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tutor.user.status ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Endereço</CardTitle>
            </div>
            <CardDescription>Localização do tutor</CardDescription>
          </CardHeader>
          <CardContent>
            {tutor.address ? (
              <div className="space-y-2">
                <p className="font-medium">{formatAddress(tutor.address)}</p>
                {tutor.address.complement && (
                  <p className="text-sm text-muted-foreground">
                    Complemento: {tutor.address.complement}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Endereço não cadastrado</p>
            )}
          </CardContent>
        </Card>

        {/* Pets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                <CardTitle>Pets</CardTitle>
              </div>
              <span className="text-sm text-muted-foreground">
                {tutor.pets.length} {tutor.pets.length === 1 ? "pet" : "pets"}
              </span>
            </div>
            <CardDescription>Lista de pets do tutor</CardDescription>
          </CardHeader>
          <CardContent>
            {tutor.pets.length === 0 ? (
              <p className="text-muted-foreground">Nenhum pet cadastrado</p>
            ) : (
              <div className="grid gap-4">
                {tutor.pets.map((pet) => (
                  <Card key={pet.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nome</p>
                          <p className="font-medium">{pet.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Espécie</p>
                          <p className="font-medium">{pet.species}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Raça</p>
                          <p className="font-medium">{pet.breed}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                          <p className="font-medium">{formatDate(pet.birthDate)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Idade</p>
                          <p className="font-medium">{calculateAge(pet.birthDate)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Gênero</p>
                          <p className="font-medium">{getGenderLabel(pet.gender)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Cor</p>
                          <p className="font-medium">{pet.color || "N/A"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Peso</p>
                          <p className="font-medium">
                            {pet.weight ? `${pet.weight} kg` : "N/A"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Microchip</p>
                          <p className="font-medium">{pet.microchipNumber || "N/A"}</p>
                        </div>
                        
                        {pet.observations && (
                          <div className="md:col-span-2 lg:col-span-3">
                            <p className="text-sm text-muted-foreground">Observações</p>
                            <p className="font-medium">{pet.observations}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pet.active
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pet.active ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


