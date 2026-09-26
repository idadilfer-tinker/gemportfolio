import React from 'react';
import { X, Image, Video, Volume2, FileText, Github, CheckCircle2 } from 'lucide-react';

interface FormatGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormatGuideModal: React.FC<FormatGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141314]/50 backdrop-blur-xs">
      <div className="bg-[#FDFDFC] border border-[#E3DFD7] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E3DFD7] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-semibold text-[#141314]">
              Format & File Size Specification Guide
            </h2>
            <p className="text-xs text-[#8a857e]">
              Engineered specifically for fast loading on GitHub Pages without CDNs or Vercel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8a857e] hover:text-[#141314] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#4a4642] leading-relaxed">
          {/* Quick Notice */}
          <div className="p-3.5 bg-[#F5F2EC] rounded-xl border border-[#EDEAE4] flex items-start gap-3">
            <Github className="w-4 h-4 text-[#141314] mt-0.5 flex-shrink-0" />
            <div>
              <b className="text-[#141314]">Why do formats and sizes matter for GitHub hosting?</b>
              <p className="mt-0.5 text-[#4a4642]">
                Platforms like Vercel or Next.js resize and compress images on the fly via serverless edges. Because your portfolio lives purely on GitHub Pages, visitors download your files directly from GitHub. Keeping files light and correctly formatted ensures <b>instant sub-second loading</b> on mobile 4G/5G networks.
              </p>
            </div>
          </div>

          {/* Section 1: Visual Images */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#141314]">
              <Image className="w-4 h-4 text-[#C15A38]" />
              <span>1. Visual Images (.webp, .jpg, .png)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl space-y-1">
                <div className="font-semibold text-[#141314]">Home Reel Cards</div>
                <div><b>Aspect Ratio:</b> 4:3 (e.g. 1200×900 px or 1600×1200 px)</div>
                <div><b>Recommended Size:</b> &lt; 350 KB to 500 KB</div>
                <div><b>Format:</b> WebP (primary) or compressed JPG</div>
                <div className="text-[11px] text-[#8a857e] pt-1">
                  Folder: <code>assets/home/[project-slug].jpg</code>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl space-y-1">
                <div className="font-semibold text-[#141314]">Case Study Proof Figures</div>
                <div><b>Aspect Ratio:</b> 16:9 (1920×1080 px) or 4:3 (1600×1200 px)</div>
                <div><b>Recommended Size:</b> &lt; 600 KB to 800 KB</div>
                <div><b>Format:</b> WebP or 85% Quality JPG</div>
                <div className="text-[11px] text-[#8a857e] pt-1">
                  Folder: <code>assets/projects/[project-slug]-[step].jpg</code>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg text-[11px] text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span><b>Free compression tools:</b> Run screenshots through <b>Squoosh.app</b> (Google) or <b>TinyPNG</b> before uploading to drop file size by 70% with zero quality loss.</span>
            </div>
          </div>

          {/* Section 2: Video & Prototypes */}
          <div className="space-y-3 pt-3 border-t border-[#EDEAE4]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#141314]">
              <Video className="w-4 h-4 text-[#C15A38]" />
              <span>2. Video & Interactive Prototypes (.mp4, .webm)</span>
            </div>

            <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl space-y-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-[#8a857e]">Codec:</span> H.264 (universal support)
                </div>
                <div>
                  <span className="text-[#8a857e]">Resolution:</span> 1080p (1920×1080)
                </div>
                <div>
                  <span className="text-[#8a857e]">Max Size:</span> &lt; 10 MB (safe limit)
                </div>
              </div>
              <p className="text-[11px] text-[#4a4642] pt-1">
                GitHub rejects single files over 100 MB during <code>git push</code>. For video prototypes, keep clips under 20–30 seconds on an autoplay loop. Encode using <b>HandBrake</b> with Constant Quality (CRF) set between 22 and 26.
              </p>
            </div>
          </div>

          {/* Section 3: Spoken Audio Narration */}
          <div className="space-y-3 pt-3 border-t border-[#EDEAE4]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#141314]">
              <Volume2 className="w-4 h-4 text-[#C15A38]" />
              <span>3. Spoken Audio Narration (.mp3)</span>
            </div>

            <div className="p-3 bg-white border border-[#EDEAE4] rounded-xl space-y-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-[#8a857e]">Format:</span> MP3 (MPEG Audio)
                </div>
                <div>
                  <span className="text-[#8a857e]">Channels:</span> Mono (Voice)
                </div>
                <div>
                  <span className="text-[#8a857e]">Bitrate:</span> 96–128 kbps CBR
                </div>
              </div>
              <p className="text-[11px] text-[#4a4642] pt-1">
                Spoken descriptions do not need stereo. A 2-minute mono narration encoded at 112 kbps takes just ~1.6 MB, allowing instant playback without streaming buffering.
              </p>
            </div>
          </div>

          {/* Section 4: Isaac Blankensmith Minimal Case Study Rules */}
          <div className="space-y-3 pt-3 border-t border-[#EDEAE4]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#141314]">
              <FileText className="w-4 h-4 text-[#C15A38]" />
              <span>4. Isaac Blankensmith Case Study Copywriting Rules</span>
            </div>

            <ul className="list-disc list-inside space-y-1 pl-1 text-[11.5px]">
              <li><b>Exactly three sections:</b> The challenge / My approach / What I built.</li>
              <li><b>No em or en dashes anywhere:</b> Use commas, colons, or "to".</li>
              <li><b>Plain language:</b> Write as you would describe it to a friend.</li>
              <li><b>Single full-bleed figures:</b> Flat composite screenshots rather than fragile per-project CSS frames.</li>
              <li><b>No bottom CTA button:</b> The only "Visit product" link belongs in the clean top navigation.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E3DFD7] bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-[#141314] hover:bg-[#2b292b] rounded-lg transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
