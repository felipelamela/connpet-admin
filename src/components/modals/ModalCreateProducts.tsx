"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Package, X, Save } from "lucide-react"
import api from "@/services/api"

interface Product {
  id: string;
  name: string;
  description?: string;
  type: string;
  batchNumber?: string;
  manufacturer?: string;
  quantity: number;
  pricePay: number;
  priceSale: number;
  expirationDate: string;
  active: boolean;
}


interface ProductFormData {
  name: string;
  description: string;
  type: string;
  batchNumber: string;
  manufacturer: string;
  quantity: string;
  pricePay: string;
  priceSale: string;
  expirationDate: string;
  active: boolean;
}

interface ModalCreateProductsProps {
  trigger?: React.ReactNode;
  system: string;
  insertList: (item: Product) => void
}

export function ModalCreateProducts({ trigger, system, insertList}: ModalCreateProductsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    type: "",
    batchNumber: "",
    manufacturer: "",
    quantity: "0",
    pricePay: "",
    priceSale: "",
    expirationDate: "",
    active: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

      if (!formData.name.trim() || !formData.type || !formData.priceSale) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        type: formData.type,
        batchNumber: formData.batchNumber.trim() || null,
        manufacturer: formData.manufacturer.trim() || null,
        quantity: parseInt(formData.quantity) || 0,
        pricePay: parseFloat(formData.pricePay) || 0,
        priceSale: parseFloat(formData.priceSale) || 0,
        expirationDate: formData.expirationDate || new Date().toISOString(),
        active: formData.active,
      };

      api.post(`${system}/product`,productData).then((resp)=>{
        toast.success("Produto cadastrado com sucesso!");
        insertList(resp.data)
        setFormData({
          name: "",
          description: "",
          type: "",
          batchNumber: "",
          manufacturer: "",
          quantity: "0",
          pricePay: "",
          priceSale: "",
          expirationDate: "",
          active: true,
        });
        setOpen(false);
      }).catch((e)=>{
        toast.error("Erro ao cadastrar produto. Tente novamente.");

      }).finally(()=>{
        setIsSubmitting(false);
      })

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Cadastrar Produto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <DialogTitle>Cadastrar Produto</DialogTitle>
          </div>
          <DialogDescription>
            Preencha as informações abaixo para cadastrar um novo produto
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Nome do Produto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Ração Premium"
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrição detalhada do produto..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEDICINE">Medicamento</SelectItem>
                    <SelectItem value="TOY">Brinquedo</SelectItem>
                    <SelectItem value="FOOD">Alimento</SelectItem>
                    <SelectItem value="HYGIENE">Higiene</SelectItem>
                    <SelectItem value="ACCESSORY">Acessório</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Ex: 100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batchNumber">Lote</Label>
                <Input
                  id="batchNumber"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  placeholder="Ex: LOTE-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricante</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="Ex: Royal Canin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePay">
                  Preço de Compra (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pricePay"
                  name="pricePay"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePay}
                  onChange={handleInputChange}
                  placeholder="Ex: 40.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceSale">
                  Preço de Venda (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="priceSale"
                  name="priceSale"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceSale}
                  onChange={handleInputChange}
                  placeholder="Ex: 59.90"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Data de Validade</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Produto ativo
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Cadastrar Produto
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

