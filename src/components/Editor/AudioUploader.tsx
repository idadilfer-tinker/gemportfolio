import React, { useState, useRef } from 'react';
import { AudioConfig } from '../../types/portfolio';
import { validateAudio, getAudioDuration, formatBytes } from '../../utils/fileValidation';
import { generateHarmonicChimeAudio } from '../../utils/audioSynthesizer';
import {
  Volume2,
  Play,
  Pause,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

interface AudioUploaderProps {
  audio: AudioConfig;
  projectSlug: string;
  onChange: (updated: AudioConfig) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  audio,
  projectSlug,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [validationNote, setValidationNote] = useState<string | null>(null);

  const handleAudioFile = async (file: File) => {
    const isAudio = file.type.startsWith('audio/') || file.name.endsWith('.mp3');
    if (!isAudio) {
      alert('Please upload an audio file (.mp3, .m4a, or .wav).');
      return;
    }

    const duration = await getAudioDuration(file);
    const vResult = validateAudio(file, duration);
    setValidationNote(
      `${vResult.specs.format} · ${vResult.specs.sizeFormatted} · ${
        duration ? Math.round(duration) + 's' : ''
      } (${vResult.level === 'optimal' ? 'Optimal for mobile' : vResult.title})`
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange({
        ...audio,
        enabled: true,
        url: dataUrl,
        duration,
        fileSize: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSyntheticNarration = async () => {
    const chimeUrl = await generateHarmonicChimeAudio(12);
    onChange({
      ...audio,
      enabled: true,
      url: chimeUrl,
      duration: 12,
    });
    setValidationNote('Generated ambient voiceover sample (12s WAV)');
  };

  const togglePreviewPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlaying) {
      audioPreviewRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPreviewRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn(e));
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white border border-[#E3DFD7] rounded-xl">
      {/* Header and Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#C15A38]" />
          <div>
            <h4 className="text-xs font-semibold text-[#141314] uppercase tracking-wider">
              Spoken Audio Narration Bar
            </h4>
            <p className="text-[11px] text-[#8a857e]">
              Optional sticky narration bar with scrubber and synchronized transcript
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={audio.enabled}
            onChange={(e) => onChange({ ...audio, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-[#EDEAE4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E3DFD7] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C15A38]" />
        </label>
      </div>

      {audio.enabled && (
        <div className="space-y-4 pt-2 border-t border-[#EDEAE4]">
          {/* Audio Player and Upload Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#F5F2EC] rounded-lg border border-[#EDEAE4]">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleAudioFile(e.target.files[0]);
                }
              }}
            />

            {audio.url && (
              <audio
                ref={audioPreviewRef}
                src={audio.url}
                onEnded={() => setIsPlaying(false)}
              />
            )}

            <div className="flex items-center gap-3">
              {audio.url ? (
                <button
                  type="button"
                  onClick={togglePreviewPlay}
                  className="w-8 h-8 rounded-full bg-[#141314] text-white flex items-center justify-center hover:bg-[#2b292b] transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#EDEAE4] flex items-center justify-center text-[#8a857e]">
                  <Volume2 className="w-4 h-4" />
                </div>
              )}

              <div className="text-xs">
                <div className="font-medium text-[#141314]">
                  {audio.url
                    ? 'Audio Track Ready'
                    : `Expected at: assets/audio/${projectSlug}-narration.mp3`}
                </div>
                <div className="text-[11px] text-[#8a857e]">
                  {validationNote || 'Mono MP3 · 96-128 kbps recommended (<3 MB)'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-medium bg-white text-[#141314] border border-[#E3DFD7] hover:border-[#141314] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3 h-3 text-[#C15A38]" />
                <span>Upload .MP3</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateSyntheticNarration}
                title="Generate an ambient preview chime"
                className="px-2.5 py-1.5 text-xs text-[#4a4642] hover:text-[#141314] border border-[#E3DFD7] hover:bg-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#C15A38]" />
                <span>Test Narration</span>
              </button>
            </div>
          </div>

          {/* Size & Format Guideline Notice */}
          <div className="p-2.5 bg-[#FDFDFC] rounded-lg border border-[#EDEAE4] text-[11px] text-[#4a4642] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#C15A38] mt-0.5 flex-shrink-0" />
            <div>
              <b>Audio Format Guide:</b> For GitHub Pages, use <b>Mono MP3 at 96 kbps or 128 kbps</b>. Voice narration does not need stereo. A 2-minute spoken case study encoded in mono MP3 is only ~1.4 MB, which starts playing with zero latency on mobile.
            </div>
          </div>

          {/* Transcript Sections (Isaac Blankensmith Minimal Style) */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-[#141314] uppercase tracking-wider">
              Accessible Transcript (Read as text)
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                  1. The Challenge (Transcript)
                </label>
                <textarea
                  rows={2}
                  value={audio.transcript.challenge}
                  onChange={(e) =>
                    onChange({
                      ...audio,
                      transcript: { ...audio.transcript, challenge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                  2. My Approach (Transcript)
                </label>
                <textarea
                  rows={2}
                  value={audio.transcript.approach}
                  onChange={(e) =>
                    onChange({
                      ...audio,
                      transcript: { ...audio.transcript, approach: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8a857e] mb-1">
                  3. What I Built (Transcript)
                </label>
                <textarea
                  rows={2}
                  value={audio.transcript.built}
                  onChange={(e) =>
                    onChange({
                      ...audio,
                      transcript: { ...audio.transcript, built: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
