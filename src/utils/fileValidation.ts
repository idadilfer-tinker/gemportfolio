import { MediaValidationResult } from '../types/portfolio';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  dimensions?: { width: number; height: number };
  aspectRatio?: string;
  duration?: number;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Validate an image file for portfolio usage on GitHub Pages
 */
export function validateImage(
  file: File,
  dimensions?: { width: number; height: number },
  slot: 'home' | 'case-study' = 'home'
): MediaValidationResult {
  const recommendations: string[] = [];
  let level: 'optimal' | 'warning' | 'error' = 'optimal';
  let title = 'Asset looks great!';
  let message = 'File format and size are well-optimized for static GitHub hosting.';

  const isWebp = file.type === 'image/webp';
  const isJpg = file.type === 'image/jpeg' || file.type === 'image/jpg';
  const isPng = file.type === 'image/png';
  const isSvg = file.type === 'image/svg+xml';

  if (!isWebp && !isJpg && !isPng && !isSvg) {
    level = 'error';
    title = 'Unsupported image format';
    message = `Format "${file.type || 'unknown'}" may not render reliably across web browsers.`;
    recommendations.push('Convert to WebP or high-quality JPG for maximum compatibility.');
  }

  // Size guidelines:
  // GitHub Pages has no on-the-fly image optimization server.
  // < 450 KB is optimal for fast loading.
  // > 1.2 MB gets a warning.
  // > 5 MB gets an alert.
  if (file.size > 5 * 1024 * 1024) {
    level = 'error';
    title = 'Heavy image file (>5 MB)';
    message = 'This large file will cause noticeable lag and high data usage on mobile devices.';
    recommendations.push('Compress using Squoosh.app, TinyPNG, or Photoshop "Save for Web".');
    recommendations.push('Target under 500 KB to ensure near-instant load times on GitHub Pages.');
  } else if (file.size > 1.2 * 1024 * 1024) {
    if (level !== 'error') level = 'warning';
    title = 'Heavier than recommended (>1.2 MB)';
    message = 'Consider compressing to under 500 KB for optimal performance without Vercel/CDN image optimization.';
    recommendations.push('Convert to .webp format for 30-50% smaller file size at identical quality.');
  } else {
    recommendations.push('Under 1.2 MB target: Perfect for GitHub Pages static hosting.');
  }

  // Dimension & Aspect ratio checks
  let aspectRatioFormatted = '';
  let dimensionsFormatted = '';
  if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
    const ratio = dimensions.width / dimensions.height;
    dimensionsFormatted = `${dimensions.width} × ${dimensions.height} px`;

    // 4:3 is ~1.333, 16:9 is ~1.777, 1:1 is 1.0, 3:2 is 1.5
    if (Math.abs(ratio - 4 / 3) < 0.08) {
      aspectRatioFormatted = '4:3 (Optimal)';
    } else if (Math.abs(ratio - 16 / 9) < 0.08) {
      aspectRatioFormatted = '16:9 (Landscape)';
    } else if (Math.abs(ratio - 1) < 0.05) {
      aspectRatioFormatted = '1:1 (Square)';
    } else {
      aspectRatioFormatted = `${ratio.toFixed(2)}:1 (Custom)`;
    }

    if (slot === 'home') {
      if (Math.abs(ratio - 4 / 3) > 0.15) {
        if (level === 'optimal') level = 'warning';
        recommendations.push('Your home reel layout looks most harmonious with 4:3 images (e.g. 1200×900px).');
      } else {
        recommendations.push('Aspect ratio matches 4:3 reel standard.');
      }
    } else if (slot === 'case-study') {
      recommendations.push('Case study proof figures display at full width (16:9 or 4:3 recommended).');
    }
  }

  return {
    isValid: level !== 'error',
    level,
    title,
    message,
    specs: {
      format: file.type.replace('image/', '').toUpperCase() || 'IMAGE',
      sizeFormatted: formatBytes(file.size),
      dimensionsFormatted,
      aspectRatioFormatted,
    },
    recommendations,
  };
}

/**
 * Validate a video file
 */
export function validateVideo(file: File, dimensions?: { width: number; height: number }, duration?: number): MediaValidationResult {
  const recommendations: string[] = [];
  let level: 'optimal' | 'warning' | 'error' = 'optimal';
  let title = 'Video file inspected';
  let message = 'Compatible video format for web portfolios.';

  const isMp4 = file.type === 'video/mp4';
  const isWebm = file.type === 'video/webm';

  if (!isMp4 && !isWebm) {
    level = 'error';
    title = 'Unsupported video container';
    message = `Format "${file.type}" may not play in Safari or mobile browsers.`;
    recommendations.push('Export as MP4 (H.264 video codec + AAC audio) or WebM.');
  }

  // Size guidelines:
  // GitHub repo hard limit is 100MB per file.
  // Recommended for GitHub Pages web playback: < 10 MB.
  if (file.size > 95 * 1024 * 1024) {
    level = 'error';
    title = 'Exceeds GitHub 100 MB Limit';
    message = 'GitHub will reject this git push because individual files cannot exceed 100 MB.';
    recommendations.push('Compress video using Handbrake or ffmpeg to under 15 MB.');
  } else if (file.size > 15 * 1024 * 1024) {
    level = 'warning';
    title = 'Large video file (>15 MB)';
    message = 'GitHub Pages has no streaming server; large videos will take a long time to buffer on mobile.';
    recommendations.push('Recommend Handbrake with CRF 22-26 and 1080p resolution to reach ~5-8 MB.');
  } else {
    recommendations.push('Under 15 MB: Fast streaming without buffering delays.');
  }

  if (duration) {
    recommendations.push(`Duration: ${formatDuration(duration)}`);
    if (duration > 60) {
      recommendations.push('Design portfolio prototypes perform best as 10-30s focused loops.');
    }
  }

  return {
    isValid: level !== 'error',
    level,
    title,
    message,
    specs: {
      format: file.type.replace('video/', '').toUpperCase() || 'VIDEO',
      sizeFormatted: formatBytes(file.size),
      dimensionsFormatted: dimensions ? `${dimensions.width} × ${dimensions.height} px` : undefined,
    },
    recommendations,
  };
}

/**
 * Validate an audio narration file
 */
export function validateAudio(file: File, duration?: number): MediaValidationResult {
  const recommendations: string[] = [];
  let level: 'optimal' | 'warning' | 'error' = 'optimal';
  let title = 'Audio file inspected';
  let message = 'Compatible voiceover audio for case study narration.';

  const isMp3 = file.type === 'audio/mpeg' || file.type === 'audio/mp3';
  const isM4a = file.type === 'audio/mp4' || file.type === 'audio/x-m4a' || file.type === 'audio/aac';
  const isOgg = file.type === 'audio/ogg';

  if (!isMp3 && !isM4a && !isOgg) {
    level = 'warning';
    title = 'Format notice';
    message = `Format "${file.type}" may have variable support in older iOS Safari versions.`;
    recommendations.push('MP3 is the universal gold standard for HTML5 <audio> across all devices.');
  }

  if (file.size > 80 * 1024 * 1024) {
    level = 'error';
    title = 'Audio file exceeds GitHub limit (>80 MB)';
    message = 'GitHub will reject this file during git push. Voiceover narration should be under 3 MB.';
    recommendations.push('Encode as Mono MP3 at 96 kbps or 128 kbps.');
  } else if (file.size > 10 * 1024 * 1024) {
    level = 'warning';
    title = 'Large audio file (>10 MB)';
    message = 'Uncompressed WAV or 320kbps music-grade audio is too heavy for spoken voiceover.';
    recommendations.push('Encode as Mono MP3 at 96 kbps or 128 kbps (typically 1.5MB for a 2-minute narration).');
  } else {
    recommendations.push('Mono MP3 @ 96-128 kbps ensures instant playback on cellular networks.');
  }

  if (duration) {
    recommendations.push(`Narration duration: ${formatDuration(duration)}`);
  }

  return {
    isValid: level !== 'error',
    level,
    title,
    message,
    specs: {
      format: file.type.replace('audio/', '').toUpperCase() || 'AUDIO',
      sizeFormatted: formatBytes(file.size),
    },
    recommendations,
  };
}

/**
 * Extract image dimensions from a File
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Extract video metadata from a File
 */
export function getVideoMetadata(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      resolve({ width: 0, height: 0, duration: 0 });
      URL.revokeObjectURL(url);
    };
    video.src = url;
  });
}

/**
 * Extract audio duration from a File
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = 'metadata';
    const url = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(url);
    };
    audio.src = url;
  });
}
