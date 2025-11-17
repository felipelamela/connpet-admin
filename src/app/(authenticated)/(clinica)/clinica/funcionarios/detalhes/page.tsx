"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User, Mail, Phone, FileText, MapPin, Calendar, Edit, Save, X, Briefcase, Hash } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { EstadoCodeToUF, EstadoConst } from "@/consts/estado.const";
import { StateCombobox } from "@/components/stateComboBox";
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

interface Employee {
  id: string;
  userId: string;
  document: string | null;
  phone: string | null;
  crmv: string | null;
  crmvState: string | null;
  roles: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: boolean;
  };
  address: Address | null;
}

export default function DetalhesFuncionarioPage() {
  const router = useRouter();
  const { getButtonColors } = useModuleContext();
  const buttonColors = getButtonColors();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("id");
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: "",
    phone: "",
    roles: "",
    crmv: "",
    crmvState: "",
    address: {
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil",
    },
  });

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    if (!employeeId) return;
    
    setIsLoading(true);
    try {
      const response = await api.get(`admin/clinic-vet-user/${employeeId}`);
      const employeeData = response?.data || {};
      setEmployee(employeeData);
      
      // Preencher formulário com dados atuais
      setFormData({
        name: employeeData.user?.name || "",
        email: employeeData.user?.email || "",
        document: employeeData.document || "",
        phone: employeeData.phone || "",
        roles: employeeData.roles || "",
        crmv: employeeData.crmv || "",
        crmvState: employeeData.crmvState || "",
        address: employeeData.address ? {
          cep: employeeData.address.cep || "",
          street: employeeData.address.street || "",
          number: employeeData.address.number || "",
          complement: employeeData.address.complement || "",
          neighborhood: employeeData.address.neighborhood || "",
          city: employeeData.address.city || "",
          state: employeeData.address.state || "",
          country: employeeData.address.country || "Brasil",
        } : {
          cep: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          country: "Brasil",
        },
      });
    } catch (error) {
      console.error("Erro ao carregar detalhes do funcionário:", error);
      toast.error("Erro ao carregar detalhes do funcionário");
      router.push("/clinica/funcionarios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.replace("address.", "");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!employee) return;

    setIsSaving(true);
    try {
      // Preparar dados para atualização
      const updateData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        document: formData.document.trim() || null,
        phone: formData.phone.trim() || null,
        roles: formData.roles,
        crmv: formData.crmv.trim() || null,
        crmvState: formData.crmvState || null,
      };

      // Se houver endereço, adicionar dados do endereço
      if (formData.address.cep || employee.address) {
        updateData.address = {
          cep: formData.address.cep.trim(),
          street: formData.address.street.trim(),
          number: formData.address.number.trim(),
          complement: formData.address.complement.trim() || null,
          neighborhood: formData.address.neighborhood.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state,
          country: formData.address.country || "Brasil",
        };
      }

      await api.put(`admin/clinic-vet-user/${employee.id}`, updateData);
      toast.success("Funcionário atualizado com sucesso!");
      setIsEditing(false);
      fetchEmployeeDetails();
    } catch (error: any) {
      console.error("Erro ao atualizar funcionário:", error);
      toast.error(error.message || "Erro ao atualizar funcionário. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getRoleLabel = (role: string): string => {
    const roles: { [key: string]: string } = {
      ADMIN: "Administrador",
      CLINIC_ADMIN: "Administrador da Clínica",
      CLINIC_VET: "Veterinário",
      CLINIC_STAFF: "Equipe",
      CLINIC_RECEPTIONIST: "Recepcionista",
    };
    return roles[role] || role;
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

  if (!employee) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Funcionário não encontrado</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/clinica/funcionarios")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detalhes do Funcionário</h1>
            <p className="text-muted-foreground">Informações completas do funcionário cadastrado</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)} className={buttonColors.outline}> 
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                 className={buttonColors.default}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className={buttonColors.default}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Dados Pessoais</CardTitle>
            </div>
            <CardDescription>Informações básicas do funcionário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nome completo"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{employee.user.name}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{employee.user.email}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">CPF</Label>
                {isEditing ? (
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => handleInputChange("document", e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={20}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{employee.document || "Não informado"}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{employee.phone || "Não informado"}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roles">Cargo</Label>
                {isEditing ? (
                  <Select
                    value={formData.roles}
                    onValueChange={(value) => handleInputChange("roles", value)}
                  >
                    <SelectTrigger id="roles">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLINIC_ADMIN">Administrador da Clínica</SelectItem>
                      <SelectItem value="CLINIC_VET">Veterinário</SelectItem>
                      <SelectItem value="CLINIC_STAFF">Equipe</SelectItem>
                      <SelectItem value="CLINIC_RECEPTIONIST">Recepcionista</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{getRoleLabel(employee.roles)}</p>
                  </div>
                )}
              </div>

              {(employee.crmv || isEditing) && (
                <div className="space-y-2">
                  <Label htmlFor="crmv">CRMV</Label>
                  {isEditing ? (
                    <Input
                      id="crmv"
                      value={formData.crmv}
                      onChange={(e) => handleInputChange("crmv", e.target.value)}
                      placeholder="CRMV"
                      maxLength={20}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{employee.crmv || "Não informado"}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Data de Cadastro</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{formatDate(employee.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.user.status
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.user.status ? "Ativo" : "Inativo"}
                </span>
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
            <CardDescription>Localização do funcionário</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.cep">CEP</Label>
                  <Input
                    id="address.cep"
                    value={formData.address.cep}
                    onChange={(e) => handleInputChange("address.cep", e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address.street">Rua</Label>
                  <Input
                    id="address.street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    placeholder="Nome da rua"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.number">Número</Label>
                  <Input
                    id="address.number"
                    value={formData.address.number}
                    onChange={(e) => handleInputChange("address.number", e.target.value)}
                    placeholder="Número"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.complement">Complemento</Label>
                  <Input
                    id="address.complement"
                    value={formData.address.complement}
                    onChange={(e) => handleInputChange("address.complement", e.target.value)}
                    placeholder="Apto, Bloco, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.neighborhood">Bairro</Label>
                  <Input
                    id="address.neighborhood"
                    value={formData.address.neighborhood}
                    onChange={(e) => handleInputChange("address.neighborhood", e.target.value)}
                    placeholder="Nome do bairro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.city">Cidade</Label>
                  <Input
                    id="address.city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.state">Estado</Label>
                  <StateCombobox
                    value={formData.address.state}
                    onValueChange={(value) => handleInputChange("address.state", value)}
                    options={Object.entries(EstadoConst).map(([key, label]) => ({
                      value: key,
                      label,
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.country">País</Label>
                  <Input
                    id="address.country"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange("address.country", e.target.value)}
                    placeholder="País"
                  />
                </div>
              </div>
            ) : (
              employee.address ? (
                <div className="space-y-2">
                  <p className="font-medium">{formatAddress(employee.address)}</p>
                  {employee.address.complement && (
                    <p className="text-sm text-muted-foreground">
                      Complemento: {employee.address.complement}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Endereço não cadastrado</p>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


