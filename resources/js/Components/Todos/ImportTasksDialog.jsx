import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function ImportTasksDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("file", file);
            // Preview first few rows
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split('\n').slice(0, 5); // Preview first 5 rows
                setPreview(rows);
            };
            reader.readAsText(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("todos.import"), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
                setPreview(null);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import Tasks
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Import Tasks</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to bulk import tasks. The file should have the following columns: title, description, priority, category_id, due_date, due_time
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileText className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">CSV file (max. 10MB)</p>
                                </div>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {errors.file && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.file}</AlertDescription>
                            </Alert>
                        )}

                        {preview && (
                            <div className="space-y-2">
                                <h4 className="font-medium">Preview:</h4>
                                <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
                                    <pre className="text-sm">
                                        {preview.join('\n')}
                                    </pre>
                                </div>
                            </div>
                        )}

                        <Alert>
                            <FileText className="h-4 w-4" />
                            <AlertDescription>
                                CSV format: title,description,priority,category_id,due_date,due_time
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.file}
                            className="gap-2"
                        >
                            {processing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Import
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 