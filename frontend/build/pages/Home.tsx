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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

import { User } from "../features/types.ts";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider.tsx";
import { useCurrentPage } from '@/contexts/CurrentPageContext.tsx';
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input.tsx"

export default function Home() {
    const { authToken } = useAuth()

    const { toast } = useToast()

    const { currentPage, setCurrentPage } = useCurrentPage();
    const [students, setStudents] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [studentIdToDelete, setStudentIdToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [previousPage, setPreviousPage] = useState<number | null>(null);

    const navigate = useNavigate();

    const fetchStudents = async (page: number, query: string) => {
        setLoading(true);
        try {
            const url = query
                ? `http://localhost:3000/student/?page=${page}&name=${query}`
                : `http://localhost:3000/student/?page=${page}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();

            setStudents(data.data);
            setCurrentPage(data.page);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            if (currentPage !== 1) {
                setPreviousPage(currentPage);
                setCurrentPage(1);
            }
        } else if (previousPage !== null) {
            setCurrentPage(previousPage);
            setPreviousPage(null);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage) {
            fetchStudents(currentPage, debouncedSearchQuery);
            navigate(`?page=${currentPage}`, { replace: true });
        }
    }, [currentPage, debouncedSearchQuery, navigate]);

    useEffect(() => {
        const debounced = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(debounced);
    }, [searchQuery]);

    async function deleteStudent(studentId: string) {
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

            fetchStudents(currentPage, debouncedSearchQuery);

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
            setOpenDeleteDialog(false);
        }

    }

    function handleNavigate(route: string) {
        if (route === "") {
            return navigate("/");
        } else {
            navigate(`/${route}`);
        }
    }

    const handleEdit = (alunoId: string) => {
        const alunoToEdit = students.find((aluno: any) => aluno._id === alunoId);
        navigate(`/student/${alunoId}`, { state: { alunoToEdit } });
    };

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SidebarTrigger />
                    <main className="p-4 lg:mx-8">
                        <section className="flex flex-col sm:flex-row justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Alunos</h2>
                            <Button onClick={() => handleNavigate('student')} size={"lg"} className="bg-orange-400 hover:bg-orange-600">Criar Registro</Button>
                        </section>
                        <section>
                            <Input
                                type="text"
                                placeholder="Buscar por nome..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-4 p-2 border rounded-md w-1/2"
                            />
                            {loading && (
                                <Table className="w-full border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-[#EEEEEE] cursor-default">
                                            <TableHead className="w-4/12 text-left px-4">Nome</TableHead>
                                            <TableHead className="w-1/4 text-center px-4">Idade</TableHead>
                                            <TableHead className="w-1/4 text-center px-4">Turma</TableHead>
                                            <TableHead className="w-1/12 px-4 text-center">Opções</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <TableRow key={index} className="border-t">
                                                <TableCell className="px-4">
                                                    <Skeleton className="h-10 w-full rounded" />
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <Skeleton className="h-10 self-center w-1/2 rounded" />
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <Skeleton className="h-10 w-20 rounded" />
                                                </TableCell>
                                                <TableCell className="px-4 text-center">
                                                    <Skeleton className="h-10 w-10 rounded" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            {error && <p className="text-red-500">{error}</p>}
                            {!loading && !error && students.length === 0 && <p>Nenhum estudante econtrado</p>}
                            {!loading && !error && students.length > 0 && (
                                <div className="flex flex-col space-y-4 justify-between">
                                    <Table className="w-full border-collapse">
                                        <TableHeader key={'header'} >
                                            <TableRow key={'header-row'} className="bg-[#EEEEEE] cursor-default">
                                                <TableHead className="w-4/12 text-left px-4">Nome</TableHead>
                                                <TableHead className="w-1/4 text-center px-4">Idade</TableHead>
                                                <TableHead className="w-1/4 text-center px-4">Turma</TableHead>
                                                <TableHead className="w-1/12 px-4 text-center">Opções</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody key={'table-body'}>
                                            {students.map((student) => (
                                                <TableRow
                                                    key={student._id}
                                                    className={'border-t cursor-default'}
                                                >
                                                    <TableCell className="font-medium px-4">{student.name}</TableCell>
                                                    <TableCell className="text-center px-4">{student.age}</TableCell>
                                                    <TableCell className="text-center px-4">{student.grade}</TableCell>
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
                                                                    onClick={() => handleEdit(student._id)}
                                                                >
                                                                    <Pencil />Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    key={'delete'}
                                                                    className="cursor-pointer"
                                                                    onClick={() => {
                                                                        setStudentIdToDelete(student._id);
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
                                                                                deleteStudent(studentIdToDelete);  // Use the specific student ID
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
                                    <Pagination >
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    className="cursor-pointer"
                                                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                                    isActive={false}
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: Math.min(3, totalPages) }).map((_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        className="cursor-pointer"
                                                        isActive={currentPage === index + 1}
                                                        onClick={() => setCurrentPage(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}

                                            {currentPage > 4 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            {currentPage > 3 && currentPage <= totalPages - 3 && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        className="cursor-pointer"
                                                        isActive={true}
                                                        onClick={() => setCurrentPage(currentPage)}
                                                    >
                                                        {currentPage}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}

                                            {currentPage < totalPages - 3 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            {totalPages > 3 && (
                                                <>
                                                    {Array.from({ length: 3 }).map((_, index) => (
                                                        <PaginationItem key={totalPages - 2 + index}>
                                                            <PaginationLink
                                                                className="cursor-pointer"
                                                                isActive={currentPage === totalPages - 2 + index}
                                                                onClick={() => setCurrentPage(totalPages - 2 + index)}
                                                            >
                                                                {totalPages - 2 + index}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    ))}
                                                </>
                                            )}

                                            <PaginationItem>
                                                <PaginationNext
                                                    className="cursor-pointer"
                                                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                                    isActive={false}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </section>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}