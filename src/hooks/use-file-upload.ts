import { useCallback, useRef } from "react";
import { toast } from "sonner";

export interface FileData {
    content: string;
    name: string;
}

export function useFileUpload(options?: {
    accept?: string;
    multiple?: boolean;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const accept = options?.accept || ".txt,.json,.md,.csv";
    const multiple = options?.multiple || false;

    const handleFiles = async (
        files: FileList | null,
        onFilesLoaded: (files: FileData[]) => void
    ) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const filesToProcess = multiple ? fileArray : [fileArray[0]];

        try {
            const results = await Promise.all(
                filesToProcess.map(
                    (file) =>
                        new Promise<FileData>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (e) =>
                                resolve({ content: e.target?.result as string, name: file.name });
                            reader.onerror = (e) => reject(e);
                            reader.readAsText(file);
                        })
                )
            );

            onFilesLoaded(results);
            if (results.length > 1) {
                toast.success(`成功读取 ${results.length} 个文件`);
            } else {
                toast.success(`成功读取文件: ${results[0].name}`);
            }
        } catch (e) {
            toast.error("读取文件失败");
        }
    };

    const createDropHandler = (onFilesLoaded: (files: FileData[]) => void) => {
        return {
            onDragOver: (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
            },
            onDrop: (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                handleFiles(e.dataTransfer.files, onFilesLoaded);
            },
        };
    };

    const createChangeHandler = (onFilesLoaded: (files: FileData[]) => void) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files, onFilesLoaded);
            if (e.target) {
                e.target.value = "";
            }
        };
    };

    const triggerDialog = () => {
        fileInputRef.current?.click();
    };

    return {
        fileInputRef,
        accept,
        multiple,
        createDropHandler,
        createChangeHandler,
        triggerDialog,
    };
}
