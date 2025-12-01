import React, { useState, useEffect, cloneElement } from "react";

export function Select({
    value,
    defaultValue,
    onValueChange,
    children,
    className,
}: any) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || value || "");

    const handleSelect = (val: string) => {
        setSelected(val);
        onValueChange && onValueChange(val);
        setOpen(false);
    };

    useEffect(() => {
        if (value) setSelected(value);
    }, [value]);

    let trigger: any = null;
    let content: any = null;

    React.Children.forEach(children, (child: any) => {
        if (!child) return;

        if (child.type.displayName === "SelectTrigger") {
            trigger = cloneElement(child, {
                selected,
                onClick: () => setOpen(!open),
                className,
            });
        }

        if (child.type.displayName === "SelectContent") {
            content = open
                ? cloneElement(child, {
                    children: React.Children.map(child.props.children, (item: any) =>
                        cloneElement(item, {
                            onSelect: handleSelect,
                        })
                    ),
                })
                : null;
        }
    });

    return (
        <div className="relative w-full">
            {trigger}
            {content}
        </div>
    );
}

export function SelectTrigger({ children, selected, onClick, className }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 w-full border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 text-left ${className}`}
        >
            {selected || children}
        </button>
    );
}
SelectTrigger.displayName = "SelectTrigger";

export function SelectContent({ children }: any) {
    return (
        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {children}
        </div>
    );
}
SelectContent.displayName = "SelectContent";

export function SelectItem({ value, children, onSelect }: any) {
    return (
        <div
            onClick={() => onSelect(value)}
            className="px-3 py-2 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            {children}
        </div>
    );
}
SelectItem.displayName = "SelectItem";

export function SelectValue({ placeholder }: any) {
    return <span>{placeholder}</span>;
}
