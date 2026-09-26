import React, { useState, useRef } from 'react';
import { MediaAsset, MediaValidationResult } from '../../types/portfolio';
import {
  validateImage,
  validateVideo,
  getImageDimensions,
  getVideoMetadata,
  formatBytes,
} from '../../utils/fileValidation';
import {
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  FileImage,
  Video,
  Link,
  Sparkles,
  Info,
} from 'lucide-react';

interface MediaUploaderProps {
  label: string;
  asset: MediaAsset;
  recommendedSlot?: 'home' | 'case-study';
  allowVideo?: boolean;
  onChange: (updated: MediaAsset) => void;
}

// Preset assets available in the project
const PRESET_ASSETS = [
  {
    name: 'Oia Surgery Planner Mockup',
    url: '/src/assets/images/oia_surgery_planner_1790349765483.jpg',
    type: 'image' as const,
    label: 'assets/home/oia.jpg  ·  4:3',
  },
  {
    name: 'VCCP Vitality & Health Screens',
    url: '/src/assets/images/vccp_vitality_screens_1790349778524.jpg',
    type: 'image' as const,
    label: 'assets/home/vccp.jpg  ·  4:3',
  },
  {
    name: 'Connectd Marketplace Dashboard',
    url: '/src/assets/images/connectd_marketplace_1790349789329.jpg',
    type: 'image' as const,
    label: 'assets/home/connectd.jpg  ·  4:3',
  },
  {
    name: 'Candid Mobile Testing Photo',
    url: '/src/assets/images/candid_mobile_in_hand_1790349802556.jpg',
    type: 'image' as const,
    label: 'assets/home/project-04.jpg  ·  4:3',
  },
];

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  asset,
  recommendedSlot = 'home',
  allowVideo = true,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validation, setValidation] = useState<MediaValidationResult | null>(null);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(asset.url || '');
  const [showPresets, setShowPresets] = useState(false);

  const handleFileProcess = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) {
      alert('Please upload an image (WebP, JPG, PNG) or video (MP4, WebM) file.');
      return;
    }

    if (isVideo && !allowVideo) {
      alert('Video is not enabled for this slot. Please upload an image.');
      return;
    }

    // Read as Data URL or Object URL for instant in-browser preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;

      if (isImage) {
        const dims = await getImageDimensions(file);
        const vResult = validateImage(file, dims, recommendedSlot);
        setValidation(vResult);

        onChange({
          ...asset,
          type: 'image',
          url: dataUrl,
          fileSize: file.size,
          fileFormat: file.type,
          dimensions: dims,
          label: `assets/${recommendedSlot === 'home' ? 'home' : 'projects'}/${file.name}`,
        });
      } else if (isVideo) {
        const meta = await getVideoMetadata(file);
        const vResult = validateVideo(file, meta, meta.duration);
        setValidation(vResult);

        onChange({
          ...asset,
          type: 'video',
          url: dataUrl,
          fileSize: file.size,
          fileFormat: file.type,
          dimensions: { width: meta.width, height: meta.height },
          label: `assets/projects/${file.name}`,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    const isVideo = urlInput.endsWith('.mp4') || urlInput.endsWith('.webm');
    onChange({
      ...asset,
      type: isVideo ? 'video' : 'image',
      url: urlInput.trim(),
    });
    setIsUrlMode(false);
  };

  const applyPreset = (preset: typeof PRESET_ASSETS[0]) => {
    onChange({
      ...asset,
      type: preset.type,
      url: preset.url,
      label: preset.label,
    });
    setShowPresets(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#4a4642] flex items-center gap-1.5">
          <span>{label}</span>
          <span className="text-[10px] text-[#8a857e] lowercase font-normal">
            ({recommendedSlot === 'home' ? '4:3 recommended' : '16:9 or 4:3'})
          </span>
        </label>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex items-center gap-1 text-[#C15A38] hover:text-[#a8461f] font-medium transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Presets</span>
          </button>
          <span className="text-[#E3DFD7]">·</span>
          <button
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="inline-flex items-center gap-1 text-[#4a4642] hover:text-[#141314] transition-colors"
          >
            <Link className="w-3 h-3" />
            <span>{isUrlMode ? 'Upload File' : 'Enter URL / Path'}</span>
          </button>
        </div>
      </div>

      {/* Preset Picker Dropdown */}
      {showPresets && (
        <div className="p-3 bg-[#F5F2EC] border border-[#E3DFD7] rounded-xl space-y-2">
          <div className="text-[11px] font-semibold text-[#4a4642] uppercase tracking-wider">
            Choose Curated Asset
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_ASSETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-[#EDEAE4] hover:border-[#C15A38] text-left transition-colors group"
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-10 h-8 object-cover rounded bg-[#EDEAE4] flex-shrink-0"
                />
                <div className="truncate">
                  <div className="text-xs font-medium text-[#141314] group-hover:text-[#C15A38] truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[#8a857e] font-mono">{p.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* URL or Relative Path Input */}
      {isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="e.g. assets/home/oia.jpg or https://..."
            className="flex-1 px-3 py-2 text-xs bg-white border border-[#E3DFD7] rounded-lg focus:outline-none focus:border-[#C15A38]"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-3.5 py-2 text-xs font-medium bg-[#141314] text-white rounded-lg hover:bg-[#2b292b] transition-colors"
          >
            Apply
          </button>
        </div>
      ) : null}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border border-dashed rounded-xl p-4 sm:p-5 text-center transition-all ${
          isDragging
            ? 'border-[#C15A38] bg-[#C15A38]/5'
            : 'border-[#E3DFD7] hover:border-[#a8461f] bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowVideo ? 'image/*,video/mp4,video/webm' : 'image/*'}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        {asset.url ? (
          <div className="space-y-3">
            {/* Preview Box */}
            <div className="relative max-h-48 sm:max-h-56 mx-auto rounded-lg overflow-hidden bg-[#f4f1ec] border border-[#EDEAE4] flex items-center justify-center">
              {asset.type === 'video' ? (
                <video
                  src={asset.url}
                  playsInline
                  autoPlay
                  muted
                  loop
                  controls
                  className="max-h-52 w-full object-contain"
                />
              ) : (
                <img
                  src={asset.url}
                  alt={asset.alt || 'Uploaded media preview'}
                  className="max-h-52 w-full object-contain"
                />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ ...asset, url: '' });
                  setValidation(null);
                }}
                className="absolute top-2 right-2 p-1 bg-[#141314]/80 hover:bg-[#141314] text-white rounded-md shadow-xs transition-colors"
                title="Remove asset"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8a857e] px-1">
              <span className="font-mono text-[11px] truncate max-w-[240px]">
                {asset.label || 'Custom file loaded'}
              </span>
              <span className="hover:text-[#141314] underline text-[11px]">
                Click or drop to replace
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F5F2EC] flex items-center justify-center text-[#8a857e]">
              <UploadCloud className="w-5 h-5 text-[#C15A38]" />
            </div>
            <div className="text-xs font-medium text-[#141314]">
              Click to upload or drag & drop media
            </div>
            <div className="text-[11px] text-[#8a857e] max-w-sm">
              {allowVideo ? 'WebP, JPG, PNG or MP4/WebM' : 'WebP, JPG, or PNG'} · Max recommended: &lt;500 KB (images), &lt;10 MB (video)
            </div>
          </div>
        )}
      </div>

      {/* Real-time Format & Size Inspection / Guidance */}
      {validation ? (
        <div
          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
            validation.level === 'optimal'
              ? 'bg-[#F2F8F4] border-[#C8E4D3] text-[#1E5631]'
              : validation.level === 'warning'
              ? 'bg-[#FEF8ED] border-[#F2DEB9] text-[#7A4B00]'
              : 'bg-[#FDF2F2] border-[#F4C7C7] text-[#9E2A2B]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            {validation.level === 'optimal' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : validation.level === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{validation.title}</span>
          </div>

          <div className="text-[11.5px] opacity-90">{validation.message}</div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10.5px]">
            <div>
              <span className="opacity-70">Format:</span> {validation.specs.format}
            </div>
            <div>
              <span className="opacity-70">Size:</span> {validation.specs.sizeFormatted}
            </div>
            {validation.specs.dimensionsFormatted && (
              <div>
                <span className="opacity-70">Dims:</span> {validation.specs.dimensionsFormatted}
              </div>
            )}
            {validation.specs.aspectRatioFormatted && (
              <div>
                <span className="opacity-70">Ratio:</span> {validation.specs.aspectRatioFormatted}
              </div>
            )}
          </div>

          {/* Actionable recommendations */}
          {validation.recommendations.length > 0 && (
            <ul className="list-disc list-inside space-y-0.5 pt-1 text-[11px] opacity-90 border-t border-black/5">
              {validation.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        /* Static Advice Banner when no new file has been inspected yet */
        <div className="p-2.5 bg-[#F5F2EC] rounded-lg border border-[#EDEAE4] flex items-start gap-2 text-[11px] text-[#4a4642]">
          <Info className="w-3.5 h-3.5 text-[#8a857e] mt-0.5 flex-shrink-0" />
          <div>
            <b>GitHub Hosting Best Practice:</b> Keep images in <code>.webp</code> or compressed <code>.jpg</code> under 500 KB to guarantee instant loading without Vercel/CDN image optimization.
          </div>
        </div>
      )}
    </div>
  );
};
