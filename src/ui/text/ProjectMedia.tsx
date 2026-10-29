import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Project } from '../../content/portfolio';
import { motion } from '../../lib/motion';

/** Only one demo clip plays at a time, whatever started it (hover, focus, scroll or the button). */
let activeVideo: HTMLVideoElement | null = null;

function start(video: HTMLVideoElement) {
  if (activeVideo && activeVideo !== video) activeVideo.pause();
  activeVideo = video;
  // Muted clips may still be refused (data saver, battery mode): the play button stays as the fallback.
  void video.play().catch(() => undefined);
}

function stop(video: HTMLVideoElement, rewind: boolean) {
  video.pause();
  if (rewind) video.currentTime = 0;
  if (activeVideo === video) activeVideo = null;
}

/** Tint of the stage behind the clip, in the color of the case file. */
const STAGE_TINT: Record<Project['id'], string> = {
  argos: 'var(--accent)',
  segundoaire: 'var(--success)',
  arcofisio: 'var(--accent-warm)',
};

/**
 * Demo clip of a project card. The full frame is always visible (never cropped or stretched) on a stage
 * tinted with the case-file color, so phone and watch clips stay large and sharp.
 *
 * Playback: pointer hover or keyboard focus on a mouse device, ≥ 50 % visible on a touch device
 * (IntersectionObserver), and only the play button with `prefers-reduced-motion`. `enabled` is false
 * while the text version is hidden (sr-only), so nothing is observed or loaded in the background.
 */
export function ProjectMedia({ project, enabled }: { project: Project; enabled: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Touch devices have no hover: play while the card is mostly on screen.
  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!enabled || !stage || !video || motion.reduced) return;
    if (!window.matchMedia('(hover: none)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start(video);
        else stop(video, false);
      },
      { threshold: 0.5 },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      stop(video, false);
    };
  }, [enabled]);

  // Leaving the text version (or hiding it) always stops the clip.
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled && video) stop(video, true);
  }, [enabled]);

  const canAutoplay = enabled && !motion.reduced;
  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) start(video);
    else stop(video, false);
  };

  return (
    <div
      ref={stageRef}
      data-testid={`media-${project.id}`}
      className="relative aspect-[4/3] overflow-hidden"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${STAGE_TINT[project.id]} 26%, var(--surface-raised)), var(--surface-raised))`,
      }}
      onPointerEnter={(event) => {
        if (canAutoplay && event.pointerType === 'mouse' && videoRef.current) start(videoRef.current);
      }}
      onPointerLeave={(event) => {
        if (canAutoplay && event.pointerType === 'mouse' && videoRef.current) stop(videoRef.current, true);
      }}
      onFocusCapture={() => {
        if (canAutoplay && videoRef.current && window.matchMedia('(hover: hover)').matches) start(videoRef.current);
      }}
      onBlurCapture={(event) => {
        if (!videoRef.current || event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        if (canAutoplay) stop(videoRef.current, true);
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={project.poster}
        aria-label={`Demo en video de ${project.name}`}
        className="h-full w-full object-contain"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={project.video} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={`${playing ? 'Pausar' : 'Reproducir'} el video de ${project.name}`}
        className="absolute bottom-3 right-3 grid h-11 w-11 cursor-pointer place-items-center rounded-pill border border-glass-border bg-[rgba(5,6,10,.7)] text-ink backdrop-blur-md transition-colors hover:border-white/40"
      >
        {playing ? (
          <Pause size={18} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Play size={18} strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
