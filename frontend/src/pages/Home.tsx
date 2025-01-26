import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AppSidebar } from "@/components/AppSidebar.tsx"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";

import { User } from "../features/types.ts";

import { useAuth } from "@/contexts/AuthProvider.tsx";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { useNavigate } from "react-router";

import { useToast } from "@/hooks/use-toast"

export default function Home() {
    const { authToken } = useAuth()

    const { toast } = useToast()

    const [alunos, setAlunos] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>(null);

    const navigate = useNavigate();

    async function getAlunos() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/student/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data: User[] = await response.json();
            const reversedList = data.reverse();
            setAlunos(reversedList);
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAlunos();
    }, [authToken]);

    async function deleteAluno(studentId: string) {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/student/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete: ${response.statusText}`);
            }

            // Remove the deleted student from the list locally
            setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno._id !== studentId));

            toast({
                title: "Sucesso!",
                description: "Aluno removido com sucesso",
                duration: 3000,
                className: "bg-green-300",
            })
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
            // Close the delete confirmation dialog after the operation
            setOpenDeleteDialog(false);
        }

    }

    function handleNavigate() {
        navigate("/student");
    }

    const handleEdit = (alunoId: string) => {
        const alunoToEdit = alunos.find((aluno: any) => aluno._id === alunoId);
        navigate(`/student/${alunoId}`, { state: { alunoToEdit } });
    }; 

    return (
        <>
            {/* <header className="bg-[#EC622C] text-white text-center p-4 text-2xl justify-start flex">
                <h1 className="font-bold lg:ml-8 text-3xl">CODETECH</h1>
            </header> */}
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SidebarTrigger />
                    <main className="p-10 lg:mx-8">
                        <section className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-semibold">Alunos</h2>
                            <Button onClick={handleNavigate} size={"lg"} className="bg-orange-400 hover:bg-orange-600">Criar Registro</Button>
                        </section>
                        <section>
                            {loading && <p>Loading students...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {!loading && !error && alunos.length === 0 && <p>No students found.</p>}
                            {!loading && !error && alunos.length > 0 && (
                                <Table className="w-full border-collapse">
                                    <TableHeader key={'header'} >
                                        <TableRow key={'header-row'} className="bg-[#EEEEEE] cursor-default">
                                            <TableHead className="text-left px-4">Nome</TableHead>
                                            <TableHead className="text-left px-4">Idade</TableHead>
                                            <TableHead className="text-left px-4">Turma</TableHead>
                                            <TableHead className="w-12 text-right px-4">Opções</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody key={'table-body'}>
                                        {alunos.map((aluno) => (
                                            <TableRow
                                                key={aluno._id}
                                                className={'border-t cursor-default'}
                                            >
                                                <TableCell className="font-medium px-4">{aluno.name}</TableCell>
                                                <TableCell className="px-4">{aluno.age}</TableCell>
                                                <TableCell className="px-4">{aluno.grade}</TableCell>
                                                <TableCell className="text-right flex justify-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="focus-visible:ring-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem 
                                                                key={'edit'} 
                                                                className="cursor-pointer"
                                                                onClick={() => handleEdit(aluno._id)}
                                                            >
                                                                <Pencil />Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                key={'delete'}
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    setStudentIdToDelete(aluno._id);
                                                                    setOpenDeleteDialog(true)
                                                                }}
                                                            >
                                                                <Trash2 />Deletar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. Ela excluirá permanentemente os dados do aluno.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                                                                    Cancelar
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                    onClick={() => {
                                                                        if (studentIdToDelete) {
                                                                            deleteAluno(studentIdToDelete);  // Use the specific student ID
                                                                        }
                                                                    }}
                                                                >
                                                                    Continue
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </section>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}