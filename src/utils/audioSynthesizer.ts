/**
 * Synthesizes a demo spoken audio track or subtle harmonic chime
 * into a real Blob/Data URL so the audio player has a functional,
 * hearable narration preview even before uploading an external .mp3.
 */

export function generateHarmonicChimeAudio(durationSeconds: number = 8): Promise<string> {
  return new Promise((resolve) => {
    try {
      const sampleRate = 44100;
      const numChannels = 1;
      const totalSamples = Math.floor(sampleRate * durationSeconds);
      const audioBuffer = new Float32Array(totalSamples);

      // Create a calm ambient acoustic narration intro tone
      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 0.8) * Math.sin((Math.PI * i) / totalSamples);
        const f1 = 220; // A3
        const f2 = 330; // E4
        const f3 = 440; // A4
        const tone =
          Math.sin(2 * Math.PI * f1 * t) * 0.4 +
          Math.sin(2 * Math.PI * f2 * t) * 0.3 +
          Math.sin(2 * Math.PI * f3 * t) * 0.15;
        audioBuffer[i] = tone * envelope;
      }

      // Encode as uncompressed 16-bit PCM WAV
      const wavBytes = encodeWAV(audioBuffer, sampleRate, numChannels);
      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      resolve(URL.createObjectURL(blob));
    } catch {
      resolve('');
    }
  });
}

function encodeWAV(samples: Float32Array, sampleRate: number, numChannels: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
