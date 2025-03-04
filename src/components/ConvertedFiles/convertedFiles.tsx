import JSZip from 'jszip';
// import { Package  } from 'lucide-react';
import { type File } from '../../types/Files.ts'

import ConvertedFileList from "./ConvertedFileList/ConvertedFileList.tsx";
import {useCallback} from 'react';

import './ConvertedFiles.css'

type ConvertedFilesProps = {
    files: File[];
}

const zipAllFiles = async (files: File[]) => {
    const zip = new JSZip();

    files.forEach(file => {
        zip.file(file.name, fetch(file.url).then(res => res.blob()));
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);

    return zipUrl;
}

const downloadAll = async (files: File[]) => {
    const zipUrl = await zipAllFiles(files);

    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = 'converted_files.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
};

function ConvertedFiles(props: ConvertedFilesProps) {
    const { files } = props
    const handleDownloadAll = useCallback(() => {
        (async (files) => {
            await downloadAll(files)
        })(files)
    }, [files])

    if (!files.length) {
        return null
    }

    return (
        <div className="files-section">
            <div className="files-header">
                <h2 className="files-title">Converted Files</h2>
                <button onClick={handleDownloadAll} className="download-all">
                    {/*<Package size={16} />*/}
                    Download All
                </button>
            </div>

            <ConvertedFileList files={files} />
        </div>
    )
}

export default ConvertedFiles;