import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { AlertCircle, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";

export default function DeleteConfirmDialog({ todoToDelete, setTodoToDelete }) {
    const confirmDelete = () => {
        if (todoToDelete) {
            router.delete(route("todos.destroy", todoToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setTodoToDelete(null);
                },
                onError: () => {
                    // Error handling
                },
            });
        }
    };

    return (
        <AlertDialog
            open={!!todoToDelete}
            onOpenChange={() => setTodoToDelete(null)}
        >
            <AlertDialogContent className="max-w-[400px]">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-red-100">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-xl">
                            Delete Task
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border mb-4">
                            <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-medium text-gray-900">
                                    {todoToDelete?.title}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {todoToDelete?.description ||
                                        "No description provided"}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600">
                            Are you sure you want to delete this task? This
                            action cannot be undone.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        <AlertDialogCancel
                            className="mt-0 w-full sm:w-auto"
                            onClick={() => setTodoToDelete(null)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            onClick={confirmDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Task
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
