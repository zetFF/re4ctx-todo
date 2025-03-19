import { Button } from "@/Components/ui/button";
import { ClipboardList, Plus } from "lucide-react";

export default function EmptyState({ openAddDialog }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-lg border border-dashed border-gray-300">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gray-50">
                <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No tasks yet
            </h3>

            <p className="max-w-sm mb-6 text-sm text-gray-500">
                Get started by creating your first task. Stay organized and
                boost your productivity!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={openAddDialog}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Your First Task
                </Button>

                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() =>
                        window.open("https://example.com/guide", "_blank")
                    }
                >
                    Learn how to get started
                </Button>
            </div>

            {/* Quick Tips */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-lg font-semibold">
                            1
                        </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Create Tasks
                    </h4>
                    <p className="text-xs text-gray-500 text-center">
                        Add your to-dos with details and priorities
                    </p>
                </div>

                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 mb-3 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-lg font-semibold">
                            2
                        </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Organize
                    </h4>
                    <p className="text-xs text-gray-500 text-center">
                        Categorize and set due dates for better management
                    </p>
                </div>

                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-lg font-semibold">
                            3
                        </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Track Progress
                    </h4>
                    <p className="text-xs text-gray-500 text-center">
                        Monitor and complete tasks to stay productive
                    </p>
                </div>
            </div>
        </div>
    );
}
