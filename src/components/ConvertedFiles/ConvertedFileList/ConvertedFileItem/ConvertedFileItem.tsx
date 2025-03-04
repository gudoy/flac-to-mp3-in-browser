import { type File } from '../../../../types/Files.ts'

type ConvertedFileItemProps = {
    file: File;
}

function ConvertedFileItem(props: ConvertedFileItemProps) {
    const { file } = props;
    const { name, url } = file;

    return (
        <li className="file-item converted-file-item">
            <span className="file-name">{name}</span>
            <a
                href={url}
                download={name}
                className="download-button"
            >
                {/*<Download size={16} />*/}
                Download
            </a>
        </li>
    )
}

export default ConvertedFileItem;