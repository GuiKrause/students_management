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

const formSchema = z.object({
    name: z.string().min(2).max(50),
    age: z
        .string()
        .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
        .transform((val) => Number(val)),
    grade: z.string().min(1).max(50),
})

export default function UserForm() {
    const { authToken } = useAuth()

    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            age: 0,
            grade: "",
        },
    })

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
                color: "#10B981",
                duration: 5000,
            })

        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um problema ao cadastrar o aluno",
                variant: "destructive",
                duration: 5000,
            })
        }

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
                                <Button size={"lg"} className="w-fit bg-orange-400 hover:bg-orange-600 self">Cadastrar</Button>
                            </form>
                        </Form>
                    </section>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}