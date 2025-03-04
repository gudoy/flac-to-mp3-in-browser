import { type ChangeEvent, type DragEvent, type ReactNode, useCallback, useRef, useState} from 'react';

import './FilesDropZone.css'

type FilesDropZoneProps = {
    onDrop: (files: FileList) => Promise<void>;
    disabled?: boolean;
    placeholder?: string | ReactNode;
}

function FilesDropZone(props: FilesDropZoneProps) {
    const { onDrop, placeholder, disabled } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [dragActive, setDragActive] = useState(false);

    const handleDrop = useCallback(async (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const loadedFiles = e.dataTransfer.files || [];
        if (!loadedFiles.length) {
            return
        }

        await onDrop(loadedFiles)
    }, [onDrop])

    const handleFilesChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        await onDrop(e.target.files)
    }, [onDrop])



    return (
        <div
            className={`dropzone files-dropzone ${dragActive ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                accept=".flac"
                className="hidden"
                onChange={handleFilesChange}
            />
            <button
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
            >
                {/*<Upload className="upload-icon" />*/}
                {placeholder && placeholder}
            </button>
        </div>
    )
}

export default FilesDropZone;