export const getPriorityColor = (priority) => {
    switch (priority) {
        case "high":
            return {
                bg: "bg-red-100",
                text: "text-red-700",
                border: "border-red-200",
            };
        case "medium":
            return {
                bg: "bg-yellow-100",
                text: "text-yellow-700",
                border: "border-yellow-200",
            };
        case "low":
            return {
                bg: "bg-green-100",
                text: "text-green-700",
                border: "border-green-200",
            };
        default:
            return {
                bg: "bg-gray-100",
                text: "text-gray-700",
                border: "border-gray-200",
            };
    }
};

export const getCategoryColor = (categoryId) => {
    const colors = [
        {
            bg: "bg-blue-100",
            text: "text-blue-700",
            border: "border-blue-200",
        },
        {
            bg: "bg-purple-100",
            text: "text-purple-700",
            border: "border-purple-200",
        },
        {
            bg: "bg-pink-100",
            text: "text-pink-700",
            border: "border-pink-200",
        },
        {
            bg: "bg-indigo-100",
            text: "text-indigo-700",
            border: "border-indigo-200",
        },
        {
            bg: "bg-cyan-100",
            text: "text-cyan-700",
            border: "border-cyan-200",
        },
    ];

    return colors[categoryId % colors.length];
};
