"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email) {
      toast.error("Por favor, insira seu email");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de chamada à API (substitua pela sua lógica real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulando sucesso
      toast.success("Email de recuperação enviado com sucesso!");
      setEmailEnviado(true);
      
    } catch (error) {
      toast.error("Erro ao enviar email. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltarLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-center">
            {emailEnviado
              ? "Verifique sua caixa de entrada"
              : "Insira seu email para receber instruções"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailEnviado ? (
            <form onSubmit={handleRecuperarSenha} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                  autoComplete="email"
                  autoFocus
                />
                <p className="text-sm text-muted-foreground">
                  Enviaremos um link de recuperação para este email
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Email de Recuperação"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleVoltarLogin}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o Login
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ Email enviado com sucesso para <strong>{email}</strong>
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  Não esqueça de verificar a pasta de spam.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleVoltarLogin}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o Login
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailEnviado(false)}
                >
                  Enviar para outro email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

