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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";

import { User } from "../features/types.ts";

import { useAuth } from "@/contexts/AuthProvider.tsx";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"


export default function Home() {
    const { authToken } = useAuth()

    const [alunos, setAlunos] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
            setAlunos(data);
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAlunos();
    }, [authToken]);

    const handleDelete = (aluno: any) => {
        // Add your delete logic here
        console.log('Deleted aluno:', aluno.id);

        // Close the dialog after deletion
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <header className="bg-[#EC622C] text-white text-center p-4 text-2xl justify-start flex">
                <h1 className="font-bold lg:ml-8 text-3xl">CODETECH</h1>
            </header>
            <main className="p-10 lg:mx-8">
                <section className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-semibold">Alunos</h2>
                    <Button size={"lg"} className="bg-[#EC622C] hover:bg-[#ec622ced]">Criar Registro</Button>
                </section>
                <div>
                    {loading && <p>Loading students...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && alunos.length === 0 && <p>No students found.</p>}
                    {!loading && !error && alunos.length > 0 && (
                        <Table className="w-full border-collapse">
                            <TableHeader key={'header'}>
                                <TableRow key={'header-row'} className="bg-gray-100">
                                    <TableHead className="text-left px-4">Nome</TableHead>
                                    <TableHead className="text-left px-4">Idade</TableHead>
                                    <TableHead className="text-left px-4">Turma</TableHead>
                                    <TableHead className="w-12 text-right px-4">Opções</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody key={'table-body'}>
                                {alunos.map((aluno) => (
                                    <TableRow key={aluno.id} className="border-t">
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
                                                    <DropdownMenuItem key={'edit'} className="cursor-pointer">
                                                        <Pencil />Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        key={'delete'}
                                                        className="cursor-pointer"
                                                        onClick={() => setOpenDeleteDialog(true)}
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
                                                            Esta ação não pode ser desfeita. Ela excluirá permanentemente sua conta e removerá seus dados dos nossos servidores.
                                                        </AlertDialogDescription>

                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(aluno)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </main>
        </>
    )
}