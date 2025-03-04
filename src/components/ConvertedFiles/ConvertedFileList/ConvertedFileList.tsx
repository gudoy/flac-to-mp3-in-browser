import { type File } from '../../../types/Files.ts'
import ConvertedFileItem from "./ConvertedFileItem/ConvertedFileItem.tsx";

type ConvertedFileListProps = {
    files: File[];
}

function ConvertedFileList(props: ConvertedFileListProps) {
    const { files } = props;

    return (
        <ul className="file-list converted-file-list">
            {files.map((file: File, index: number) => (
                <ConvertedFileItem key={index} file={file} />
            ))}
        </ul>
    )
}

export default ConvertedFileList;