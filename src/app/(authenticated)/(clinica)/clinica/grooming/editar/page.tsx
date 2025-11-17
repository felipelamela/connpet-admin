"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BreedCombobox } from "@/components/breadcombo";
import { ArrowLeft, Plus, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { DogBreedConst } from "@/consts/dogbreed.const";
import { CatBreedConst } from "@/consts/catbreed.const";
import { BirdBreedConst } from "@/consts/birdBreed.const";
import { ReptilesConst } from "@/consts/reptiles.const";
import { RodentBreedConst } from "@/consts/rodent.const";

type ComboboxOption = {
  value: string;
  label: string;
};

type GroomingPaymentItem = {
  id: string;
  serviceId?: string | null;
  productId?: string | null;
  service?: {
    id: string;
    name: string;
    price: string;
  } | null;
  product?: {
    id: string;
    name: string;
    priceSale: string;
  } | null;
};

type GroomingNote = {
  id: string;
  description?: string | null;
  vetId?: string | null;
  createdAt: string;
  updatedAt: string;
  vet?: {
    id: string;
    user?: {
      name: string;
    };
  } | null;
};

type GroomingDetails = {
  id: string;
  status: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  pet: {
    id: string;
    name: string;
    species: number | string;
    breed: number | string;
    birthDate?: string | null;
    color?: string | null;
    gender: string;
  };
  paymentOrder?: {
    id: string;
    amount: string;
    items: GroomingPaymentItem[];
  } | null;
  notesGroomings?: GroomingNote[];
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Não informado";
  try {
    return new Date(value).toLocaleString("pt-BR");
  } catch {
    return value;
  }
};

const calculateAge = (birthDate?: string | null) => {
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

const getSpeciesLabel = (species: number | string): string => {
  const speciesNum = typeof species === "string" ? parseInt(species, 10) : species;
  const speciesMap: { [key: number]: string } = {
    1: "Canino",
    2: "Felino",
    3: "Ave",
    4: "Réptil",
    5: "Roedor",
    0: "Outro",
  };
  return speciesMap[speciesNum] || `Espécie ${speciesNum}`;
};

const getBreedLabel = (species: number | string, breed: number | string): string => {
  const speciesNum = typeof species === "string" ? parseInt(species, 10) : species;
  const breedNum = typeof breed === "string" ? parseInt(breed, 10) : breed;
  
  if (breedNum === 0) return "Outro";

  switch (speciesNum) {
    case 1:
      return DogBreedConst[breedNum as keyof typeof DogBreedConst] || `Raça ${breedNum}`;
    case 2:
      return CatBreedConst[breedNum as keyof typeof CatBreedConst] || `Raça ${breedNum}`;
    case 3:
      return BirdBreedConst[breedNum as keyof typeof BirdBreedConst] || `Raça ${breedNum}`;
    case 4:
      return ReptilesConst[breedNum as keyof typeof ReptilesConst] || `Raça ${breedNum}`;
    case 5:
      return RodentBreedConst[breedNum as keyof typeof RodentBreedConst] || `Raça ${breedNum}`;
    default:
      return `Raça ${breedNum}`;
  }
};

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    IN_PROGRESS: "Em Andamento",
    DISCHARGED: "Finalizado",
    CANCELLED: "Cancelado",
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    DISCHARGED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

const getItemTypeLabel = (item: GroomingPaymentItem) =>
  item.serviceId ? "Serviço" : "Produto";

const getItemPrice = (item: GroomingPaymentItem) => {
  if (item.service?.price) {
    return Number(item.service.price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (item.product?.priceSale) {
    return Number(item.product.priceSale).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return "-";
};

export default function EditarGroomingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groomingId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [grooming, setGrooming] = useState<GroomingDetails | null>(null);
  const [serviceOptions, setServiceOptions] = useState<ComboboxOption[]>([]);
  const [productOptions, setProductOptions] = useState<ComboboxOption[]>([]);
  const [selectedItemType, setSelectedItemType] = useState<"SERVICE" | "PRODUCT">(
    "SERVICE",
  );
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState<GroomingNote[]>([]);
  const [newNoteDescription, setNewNoteDescription] = useState<string>("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState<GroomingNote | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const currentItems = useMemo(
    () => grooming?.paymentOrder?.items ?? [],
    [grooming],
  );

  const fetchGrooming = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`grooming/${id}`);
      // SuccessResponse retorna { success: true, message: string, data: any }
      const groomingData = response?.data?.data || response?.data;
      if (!groomingData) {
        setErrorMessage("Grooming não encontrado.");
        setGrooming(null);
      } else {
        setGrooming(groomingData);
        setNotes(groomingData?.notesGroomings || []);
        setErrorMessage(null);
      }
    } catch (error: any) {
      console.error("Erro ao carregar grooming:", error);
      setErrorMessage(error?.response?.data?.message || "Não foi possível carregar os detalhes do grooming.");
      setGrooming(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [servicesResponse, productsResponse] = await Promise.all([
        api.get("admin/services"),
        api.get("admin/product"),
      ]);

      const services =
        servicesResponse?.data?.services ??
        servicesResponse?.data ??
        servicesResponse?.services ??
        (Array.isArray(servicesResponse) ? servicesResponse : []);

      const formattedServices: ComboboxOption[] = (services as any[])
        .map((service: any) => ({
          value: service?.id ?? "",
          label: service?.name ?? "Serviço",
        }))
        .filter((service) => service.value);

      setServiceOptions(formattedServices);

      const products =
        productsResponse?.data?.products ??
        productsResponse?.data ??
        productsResponse?.products ??
        (Array.isArray(productsResponse) ? productsResponse : []);

      const formattedProducts: ComboboxOption[] = (products as any[])
        .map((product: any) => ({
          value: product?.id ?? "",
          label: product?.name ?? "Produto",
        }))
        .filter((product) => product.value);

      setProductOptions(formattedProducts);
    } catch (error) {
      console.error("Erro ao carregar listas auxiliares:", error);
      toast.error("Não foi possível carregar serviços e produtos.");
      setServiceOptions([]);
      setProductOptions([]);
    }
  };

  useEffect(() => {
    if (!groomingId) {
      setErrorMessage("Identificador do grooming inválido.");
      setIsLoading(false);
      return;
    }

    fetchGrooming(groomingId);
    fetchOptions();
  }, [groomingId]);

  const handleAddNote = async () => {
    if (!groomingId) return;

    if (!newNoteDescription.trim()) {
      toast.error("Digite uma descrição para a nota.");
      return;
    }

    setIsAddingNote(true);
    try {
      const response = await api.post(`grooming/${groomingId}/notes`, {
        description: newNoteDescription.trim(),
      });
      const newNote = response?.data?.data || response?.data;
      if (newNote) {
        setNotes((prev) => [newNote, ...prev]);
        setNewNoteDescription("");
        toast.success("Nota adicionada com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao adicionar nota:", error);
      toast.error(error?.response?.data?.message || "Não foi possível adicionar a nota.");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleOpenNoteModal = (note: GroomingNote) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleAddItem = async () => {
    if (!groomingId) return;

    if (!selectedItemId) {
      toast.error("Selecione um item para adicionar.");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        type: selectedItemType,
        itemId: selectedItemId,
      };

      const response = await api.post(`grooming/${groomingId}/items`, payload);
      const updatedGrooming = response?.data?.data || response?.data;
      if (updatedGrooming) {
        setGrooming(updatedGrooming);
        toast.success("Item adicionado com sucesso!");
        setSelectedItemId("");
      }
    } catch (error: any) {
      console.error("Erro ao adicionar item:", error);
      toast.error(error?.response?.data?.message || error?.message || "Não foi possível adicionar o item.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!groomingId) return;

    if (!confirm("Deseja remover este item do grooming?")) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.delete(
        `grooming/${groomingId}/items/${itemId}`,
      );
      const updatedGrooming = response?.data?.data || response?.data;
      if (updatedGrooming) {
        setGrooming(updatedGrooming);
        toast.success("Item removido com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao remover item:", error);
      toast.error(error?.response?.data?.message || error?.message || "Não foi possível remover o item.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Carregando detalhes do grooming...</p>
        </div>
      </main>
    );
  }

  if (!groomingId || errorMessage) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">
            {errorMessage || "Grooming não encontrado."}
          </p>
          <Button variant="ghost" onClick={() => router.push("/clinica/grooming/lista")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Button>
        </div>
      </main>
    );
  }

  if (!grooming) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">Grooming não encontrado.</p>
          <Button variant="ghost" onClick={() => router.push("/clinica/grooming/lista")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Button>
        </div>
      </main>
    );
  }

  const paymentAmount =
    grooming.paymentOrder?.amount !== undefined
      ? Number(grooming.paymentOrder.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "R$ 0,00";

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.push("/clinica/grooming/lista")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      <Card>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações do Pet</h3>
            <div className="flex flex-wrap gap-6">
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Nome</Label>
                <p className="font-medium">{grooming.pet.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">
                  Espécie
                </Label>
                <p className="font-medium">{getSpeciesLabel(grooming.pet.species)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Raça</Label>
                <p className="font-medium">{getBreedLabel(grooming.pet.species, grooming.pet.breed)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Idade</Label>
                <p className="font-medium">{calculateAge(grooming.pet.birthDate)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Cor</Label>
                <p className="font-medium">{grooming.pet.color || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Sexo</Label>
                <p className="font-medium">
                  {grooming.pet.gender === "MALE" ? "Macho" : "Fêmea"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Informações do Grooming</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">
                  Data de Início
                </Label>
                <p className="font-medium">{formatDateTime(grooming.startDate)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">
                  Data de Fim
                </Label>
                <p className="font-medium">{formatDateTime(grooming.endDate)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Status</Label>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(grooming.status)}`}
                >
                  {getStatusLabel(grooming.status)}
                </span>
              </div>
              {grooming.description && (
                <div className="md:col-span-2 space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Observações
                  </Label>
                  <p className="text-sm text-muted-foreground">{grooming.description}</p>
                </div>
              )}
              {grooming.paymentOrder && (
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Total da Ordem de Pagamento
                  </Label>
                  <p className="font-medium">{paymentAmount}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas do Grooming</CardTitle>
          <CardDescription>
            Adicione e visualize notas relacionadas ao grooming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-description">Nova Nota</Label>
              <Textarea
                id="note-description"
                placeholder="Digite uma nota sobre o grooming..."
                value={newNoteDescription}
                onChange={(e) => setNewNoteDescription(e.target.value)}
                rows={4}
                disabled={isAddingNote}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddNote}
              disabled={isAddingNote || !newNoteDescription.trim()}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isAddingNote ? "Adicionando..." : "Adicionar Nota"}
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Notas Registradas</h3>
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma nota registrada para este grooming.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border p-4 space-y-2 bg-card"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        {note.description && (
                          <p className="text-sm whitespace-pre-wrap">
                            {truncateText(note.description, 50)}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {formatDateTime(note.createdAt)}
                          </span>
                          {note.vet?.user?.name && (
                            <span>
                              Por: {note.vet.user.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {note.description && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenNoteModal(note)}
                          className="shrink-0"
                          title="Ver nota completa"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="!max-w-[95vw] !w-auto min-w-[300px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Detalhes da Nota</DialogTitle>
            <DialogDescription>
              Informações completas da nota do grooming
            </DialogDescription>
          </DialogHeader>
          {selectedNote && (
            <div className="space-y-4 w-full min-w-0">
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-medium">Descrição</Label>
                <div className="rounded-md border p-4 bg-muted/50 min-h-[100px] max-h-[60vh] overflow-y-auto overflow-x-hidden w-full min-w-0">
                  <p className="text-sm whitespace-pre-wrap break-words w-full min-w-0 overflow-wrap-anywhere word-break-break-word">
                    {selectedNote.description || "Sem descrição"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t w-full min-w-0">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Data de Criação
                  </Label>
                  <p className="text-sm font-medium">
                    {formatDateTime(selectedNote.createdAt)}
                  </p>
                </div>
                {selectedNote.vet?.user?.name && (
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-muted-foreground">
                      Criado por
                    </Label>
                    <p className="text-sm font-medium">
                      {selectedNote.vet.user.name}
                    </p>
                  </div>
                )}
                {selectedNote.updatedAt && selectedNote.updatedAt !== selectedNote.createdAt && (
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-muted-foreground">
                      Última Atualização
                    </Label>
                    <p className="text-sm font-medium">
                      {formatDateTime(selectedNote.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Serviços e Produtos Utilizados</CardTitle>
              <CardDescription>
                Adicione ou remova serviços e produtos relacionados ao grooming
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="item-type">Tipo do item</Label>
              <Select
                value={selectedItemType}
                onValueChange={(value: "SERVICE" | "PRODUCT") => {
                  setSelectedItemType(value);
                  setSelectedItemId("");
                }}
              >
                <SelectTrigger id="item-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SERVICE">Serviço</SelectItem>
                  <SelectItem value="PRODUCT">Produto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2 lg:col-span-2">
              <BreedCombobox
                value={selectedItemId}
                onValueChange={setSelectedItemId}
                options={
                  selectedItemType === "SERVICE" ? serviceOptions : productOptions
                }
                placeholder={
                  selectedItemType === "SERVICE"
                    ? "Selecione um serviço"
                    : "Selecione um produto"
                }
                label={
                  selectedItemType === "SERVICE"
                    ? "Serviços disponíveis"
                    : "Produtos disponíveis"
                }
                emptyMessage={
                  selectedItemType === "SERVICE"
                    ? "Nenhum serviço disponível"
                    : "Nenhum produto disponível"
                }
                disabled={
                  (selectedItemType === "SERVICE" && serviceOptions.length === 0) ||
                  (selectedItemType === "PRODUCT" && productOptions.length === 0)
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={
                  isProcessing ||
                  !selectedItemId ||
                  (selectedItemType === "SERVICE" && serviceOptions.length === 0) ||
                  (selectedItemType === "PRODUCT" && productOptions.length === 0)
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhum item registrado para este grooming.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{getItemTypeLabel(item)}</TableCell>
                      <TableCell>{item.service?.name ?? item.product?.name ?? "-"}</TableCell>
                      <TableCell>{getItemPrice(item)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
  );
}

