import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import { Downloader } from 'ytdl-mp3';
import { audioToTranscript } from './elevenLabsService';

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error('FFmpeg binary not found. Please install ffmpeg-static.');
}

const log = (...args: any[]) => console.log('[audioService]', ...args);

export const getVideoAudioTrack = async (url: string, outputDir?: string): Promise<string> => {
  log('Starting audio download and conversion');
  const defaultDir = path.resolve(__dirname, '../../audios');
  const saveDir = outputDir || defaultDir;

  if (!fs.existsSync(saveDir)) {
    log('Output directory does not exist, creating:', saveDir);
    fs.mkdirSync(saveDir, { recursive: true });
  }

  const fileName = `youtube_audio_${Date.now()}.webm`;
  const filePath = path.join(saveDir, fileName);

  const finalFileName = fileName.replace('.webm', '.wav');
  const finalFilePath = path.join(saveDir, finalFileName);

  log('Downloading audio stream from YouTube:', url);

  await new Promise<void>((resolve, reject) => {
    const audioStream = ytdl(url, { quality: 'highestaudio' });
    const writeStream = fs.createWriteStream(filePath);

    audioStream.pipe(writeStream);

    writeStream.on('finish', () => {
      log('Audio download finished, converting to WAV:', filePath);
      resolve();
    });

    writeStream.on('error', reject);
    audioStream.on('error', reject);
  });

  log('Setting up FFmpeg for WAV conversion');
  if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(filePath)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('start', (cmd: string) => log('FFmpeg started:', cmd))
      .on('progress', (progress: any) => log('FFmpeg progress:', progress))
      .on('end', () => {
        log('FFmpeg finished, file saved:', finalFilePath);
        resolve();
      })
      .on('error', reject)
      .save(finalFilePath);
  });

  try {
    fs.unlinkSync(filePath);
    log('Temporary file deleted:', filePath);
  } catch (err) {
    log('Error deleting temp file:', err);
  }

  return finalFilePath;
}

export const convertToWav = async (inputDir: string, outputDir?: string): Promise<string> => {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input file not found: ${inputDir}`);
  }

  const saveDir = outputDir || path.dirname(inputDir);
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  const outputFile = path.join(saveDir, `youtube_audio_${Date.now()}.wav`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputDir)
      .audioCodec('pcm_s16le') // 16-bit
      .audioChannels(1)        // mono
      .audioFrequency(16000)   // 16kHz
      .format('wav')
      .on('start', cmd => console.log('[convertToWav] FFmpeg started:', cmd))
      .on('progress', progress => console.log('[convertToWav] Progress:', progress))
      .on('end', () => {
        console.log('[convertToWav] Conversion finished:', outputFile);
        fs.unlinkSync(inputDir);   // xoá file gốc
        resolve(outputFile);
      })
      .on('error', err => {
        console.error('[convertToWav] Error:', err);
        reject(err);
      })
      .save(outputFile);
  });
}

export const analyzeAudio = async (url: string, outputDir?: string) => {
  if (!outputDir) {
    outputDir = path.resolve(__dirname, '../../audios');
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const downloader = new Downloader({
    outputDir,
    getTags: false
  })

  const mp3Path = (await downloader.downloadSong(url)).outputFile;
  const wavPath = await convertToWav(mp3Path, outputDir);

  return audioToTranscript(wavPath);
}