import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAuth } from "./contexts/AuthProvider.tsx"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"

const formSchema = z.object({
  email: z.string().email('Email deve seguir o padrão email@example.com'),
  password: z.string().min(8, 'Senha deve conter no mínimo 8 caracteres'),
})

export default function App() {
  const { authToken, handleLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: any) {
    setIsLoading(true);
    const loginSuccess = await handleLogin(values);
    setIsLoading(false);

    if (!loginSuccess) {
      alert("Credenciais inválidas");
    }
  }

  useEffect(() => {
    if (authToken) {
      navigate("/home");
    }
  }, [authToken, navigate]);


  return (
    <div className="flex flex-row h-screen">
      <div className="bg-[#EC622C] w-1/2 min-h-full flex items-center justify-center">
      </div>
      <div className="bg-[#FFFFFF] w-1/2 min-h-full gap-4 flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold">Login</h1>
          <p className="font-light">Entre com seu email e senha</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 w-4/5 lg:w-4/6 2xl:w-6/12 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl className="focus-visible:ring-[#0000002b] bg-[#EEEEEE]">
                    <Input placeholder="Insira seu email" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 pb-2">
                  <FormLabel>Senha</FormLabel>
                  <FormControl className="focus-visible:ring-[#0000002b] bg-[#EEEEEE]">
                    <Input placeholder="Insira sua senha" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#EC622C] hover:bg-[#ec622ced]">{isLoading ? "Logging in..." : "Login"}</Button>
            <p className="text-xs text-center">Não possui uma conta? <span className="text-[#ec622cc4] cursor-pointer">Registrar</span></p>
          </form>
        </Form>
        <div className="absolute bottom-0 mb-4">
          <p className="font-extralight text-sm relative bottom-0">desenvolvido por <span className="font-semibold">Guilherme Krause Ramos</span>, Codetech</p>
        </div>
      </div>
    </div>
  );
}