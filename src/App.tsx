import { useCallback, useState } from "react";
import ConvertedFiles from "./components/ConvertedFiles/convertedFiles";
import Header from "./components/ui/layout/Header/Header";
import Loader from "./components/ui/Loader/Loader";
import FilesDropZone from "./components/FilesDropZone/FilesDropZone.tsx";
import FilesDropZonePlaceholder from "./components/FilesDropZone/FilesDropZonePlaceholder/FilesDropZonePlaceholder.tsx";
import useFFmpeg from "./hooks/useFFmpeg.ts";

type ConvertedFile = {
  name: string;
  url: string;
};

const isFlacFile = (file: File) =>
  file.type === "audio/flac" || file.name.endsWith(".flac");

function App() {
  const [loadedFilesCount, setLoadedFilesCount] = useState(0);
  const [processedFilesCount, setProcessedFilesCount] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  const { isReady, convertToMp3 } = useFFmpeg();

  const handleFiles = useCallback(
    async (files: FileList) => {
      console.log("handleFiles called with files: ", {
        files,
        isReady,
        isConverting,
      });

      if (!isReady || isConverting) return;

      setIsConverting(true);

      await Promise.allSettled(
        Array.from(files)
          .filter(isFlacFile)
          .map(async (file) => {
            try {
              const converted = await convertToMp3(file);
              console.log("File successfully converted", { file });
              setProcessedFilesCount((prev) => prev + 1);
              return converted;
            } catch (error) {
              console.error("Error processing file:", file);
            }
          })
      );

      setIsConverting(false);
    },
    [isReady, isConverting, convertToMp3]
  );

  const onDropFiles = useCallback(
    async (loadedFiles: FileList) => {
      setLoadedFilesCount(loadedFiles.length);
      await handleFiles(loadedFiles);
    },
    [handleFiles]
  );

  return (
    <div className="container">
      <Header />

      {isConverting ? (
        <div className="loading">
          <Loader />
          <p>
            Converting files {processedFilesCount + 1}/{loadedFilesCount}...
          </p>
        </div>
      ) : (
        <FilesDropZone
          onDrop={onDropFiles}
          disabled={!isReady}
          placeholder={<FilesDropZonePlaceholder />}
        />
      )}

      {convertedFiles.length > 0 && <ConvertedFiles files={convertedFiles} />}
    </div>
  );
}

export default App;
