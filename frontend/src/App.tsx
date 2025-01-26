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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAuth } from "./contexts/AuthProvider.tsx"
import { useNavigate } from "react-router";
import { useEffect, useState } from "react"
import { toast } from "./hooks/use-toast.ts"

const loginFormSchema = z.object({
  email: z.string().email('Email deve seguir o padrão email@example.com'),
  password: z.string().min(8, 'Senha deve conter no mínimo 8 caracteres'),
})

const registerFormSchema = z.object({
  email: z.string().email('Email deve seguir o padrão email@example.com'),
  password: z.string().min(8, 'Senha deve conter no mínimo 8 caracteres'),
  confirmPassword: z.string().min(8, 'Senha deve conter no mínimo 8 caracteres'),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Senhas não conferem",
      path: ['confirmPassword']
    });
  }
});

export default function App() {
  const { authToken, handleLogin, handleRegister } = useAuth()
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onLoginSubmit(values: any) {
    setIsLoading(true);
    const loginSuccess = await handleLogin(values);
    setIsLoading(false);

    if (!loginSuccess) {
      toast({
        title: "Erro",
        description: "Ocorreu um problema ao tentar entrar no sistema",
        duration: 3000,
        className: "bg-red-300",
      })
    }
  }

  async function onRegisterSubmit(values: any) {
    setIsLoading(true);
    const registerSuccess = await handleRegister(values);
    setIsLoading(false);

    if (!registerSuccess) {
      toast({
        title: "Erro",
        description: "Ocorreu um problema ao tentar realizar o registro",
        duration: 3000,
        className: "bg-red-300",
      })
    } else {
      registerForm.reset();
      toast({
        title: "Sucesso!",
        description: "Registro realizado com sucesso, realize login para entrar no sistema",
        duration: 5000,
        className: "bg-green-300",
      })
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
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Entrar</TabsTrigger>
            <TabsTrigger value="password">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Entrar</CardTitle>
                <CardDescription>
                  Insira seu email e senha para acessar o sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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
                    <Button type="submit" className="w-full bg-orange-400 hover:bg-[#ec622ced] transition-none hover:scale-1">{isLoading ? "Entrando..." : "Entrar"}</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Registrar</CardTitle>
                <CardDescription>
                  Entre com seu email e senha para acessar o sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
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
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel>Confirmar senha</FormLabel>
                          <FormControl className="focus-visible:ring-[#0000002b] bg-[#EEEEEE]">
                            <Input placeholder="Repita sua senha" {...field} autoComplete="off" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-orange-400 hover:bg-[#ec622ced] transition-none hover:scale-1">{isLoading ? "Registrando..." : "Registrar"}</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="absolute bottom-0 mb-4">
          <p className="font-extralight text-sm relative bottom-0">desenvolvido por <span className="font-semibold">Guilherme Krause Ramos</span>, Codetech</p>
        </div>
      </div>
    </div>
  );
}