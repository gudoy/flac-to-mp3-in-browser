import { useCallback, useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";


// ST
// const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
// const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
// const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'

// MT (version 0.12.10 not avail)
// const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd'
// const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'
const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.9/dist/esm'


const useFFmpeg = () => {

    // const [ffmpeg] = useState(() => new FFmpeg());
    const ffmpegRef = useRef(new FFmpeg());
    // const inputRef = useRef<HTMLInputElement>(null);

    const [isReady, setIsReady] = useState(false);

    const canUseWorkers = window.crossOriginIsolated && window.isSecureContext // && WorkerGlobalScope.crossOriginIsolated;
    console.log('canUseWorkers', canUseWorkers)

    const loadFFmpeg = async () => {

        console.log('should load ffmpeg')

        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        ffmpeg.on('progress', ({ progress, time }) => {
            // messageRef.current.innerHTML = `${progress * 100} % (transcoded time: ${time / 1000000} s)`;
            console.log({progress, time})
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
            });
            console.log('ffmpeg successfully loaded')
            setIsReady(true);
        } catch (error) {
            console.error('Error loading FFmpeg:', error);
        }
    };

    const ffmpeg = ffmpegRef.current;

    const convertToMp3 = useCallback(async (file: File) => {
        try {
            const inputFileName = file.name;
            const outputFileName = inputFileName.replace(/\.[^/.]+$/, '.mp3');

            await ffmpeg.writeFile(inputFileName, await fetchFile(file));
            await ffmpeg.exec(['-i', inputFileName, '-c:a', 'libmp3lame', '-q:a', '2', outputFileName]);

            const data = await ffmpeg.readFile(outputFileName);
            const blob = new Blob([data], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);

            return { name: outputFileName, url };
        } catch (error) {
            console.error('Error converting file:', error);
            throw error;
        }
    }, [ffmpeg]);

    useEffect(() => {
        (async () => {
            await loadFFmpeg();
        })()
    }, []);

    return {
        isReady,
        convertToMp3
    }
}

export default useFFmpeg