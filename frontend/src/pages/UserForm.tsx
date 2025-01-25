import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar.tsx"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const formSchema = z.object({
    name: z
        .string()
        .min(2, "Nome deve conter no mínimo 2 caracteres")
        .max(256, "Nome deve conter no máximo 256 caracteres")
        .regex(/^[A-Za-zÁ-Úá-úÀ-ùÊ-îò-ôôœãõç\s]+$/, "Nome deve conter apenas letras e espaços com acentos"),

        age: z
        .string({
            required_error: "Idade é obrigatória",
            invalid_type_error: "Idade deve ser um valor válido",
        })
        .min(1, "Idade é obrigatória")
        .refine((val) => !isNaN(Number(val)), { message: "Idade deve ser um número" })
        .transform((val) => val.trim())  // Ensure it's a string after transformation
        .transform((val) => Number(val)),

    grade: z
        .string()
        .min(1, "Nota deve conter no mínimo 1 caractere")
        .max(50, "Nota deve conter no máximo 50 caracteres")
        .regex(/^[A-Za-zÁ-Úá-úÀ-ùÊ-îò-ôôœãõç\s]+$/, "Nota deve conter apenas letras e espaços com acentos"),
})

export default function UserForm() {
    const { state } = useLocation();
    
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (state != null) {
            setUser(state.alunoToEdit);
        }
    }, [state]);

    const { authToken } = useAuth()

    const { toast } = useToast()

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            grade: "",
            age: undefined,
        },
    })

    useEffect(() => {
        if (user != null) {
            form.reset({ name: user.name, grade: user.grade, age: user.age }); // Set form values if user data is available
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch("http://localhost:3000/student/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(values), // Send the form data as JSON
            });

            if (!response.ok) {
                throw new Error("Failed to submit the form");
            }

            toast({
                title: "Sucesso!",
                description: "Aluno cadastrado com sucesso",
                duration: 3000,
                className: "bg-green-300",
            })

        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um problema ao cadastrar o aluno",
                duration: 3000,
                className: "bg-red-300",
            })
        }
    }

    function handleNavigate() {
        navigate("/home");
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger />
                <main className="p-10 lg:mx-8">
                    <section className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-semibold">Cadastrar Aluno</h2>
                    </section>
                    <section>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite o nome" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                                    <FormField
                                        control={form.control}
                                        name="grade"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col w-8/12">
                                                <FormLabel>Turma</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite a turma" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Idade</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite a idade" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex gap-4 self-end">
                                    <Button onClick={handleNavigate} size={"lg"} className="w-fit bg-white text-orange-600 border-orange-600 border-[1px] hover:bg-orange-600 hover:text-white">Cancelar</Button>
                                    <Button size={"lg"} className="w-fit bg-orange-400 hover:bg-orange-600">{user == null ? "Cadastrar" : "Editar"}</Button>
                                </div>
                            </form>
                        </Form>
                    </section>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}