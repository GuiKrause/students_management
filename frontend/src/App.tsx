import { useForm } from "react-hook-form"

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

export default function App() {

  const form = useForm({
    defaultValues: {
      siape: "",
      senha: "",
    },
  });

  return (
    <div className="flex flex-row h-screen">
      <div className="bg-[#EC622C] w-1/2 min-h-full flex items-center justify-center">
      </div>
      <div className="bg-[#FFFFFF] w-1/2 min-h-full gap-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-poppins font-bold">Login</h1>
          <p className="font-poppins font-light">Entre com seu email e senha</p>
        </div>
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Enviando dados do formulário...');
          }} className="space-y-4 p-6 w-2/5">
            <FormField
              control={form.control}
              name="siape"
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
              name="senha"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Senha</FormLabel>
                  <FormControl className="focus-visible:ring-[#0000002b] bg-[#EEEEEE]">
                    <Input placeholder="Insira sua senha" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs cursor-pointer text-[#ec622cc4] w-fit">Esqueceu a senha?</p>
            <Button type="submit" className="w-full bg-[#EC622C] hover:bg-[#ec622ced]" >Login</Button>
            <p className="text-xs text-center">Não possui uma conta? <span className="text-[#ec622cc4] cursor-pointer">Registrar</span></p>
          </form>
        </Form>
      </div>
    </div>
  );
}