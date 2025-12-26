import React, { CSSProperties } from 'react';
import { z } from 'zod';

const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable();

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
  padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;

export const VideoPropsSchema = z.object({
  style: z
    .object({
      padding: PADDING_SCHEMA,
      backgroundColor: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional()
        .nullable(),
      textAlign: z.enum(['center', 'left', 'right']).optional().nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      url: z.string().optional().nullable(),
      alt: z.string().optional().nullable(),
      width: z.string().optional().nullable(),
      height: z.string().optional().nullable(),
      contentAlignment: z.enum(['top', 'middle', 'bottom']).optional().nullable(),
      linkHref: z.string().optional().nullable(),
      autoplay: z.boolean().optional().nullable(),
      loop: z.boolean().optional().nullable(),
      muted: z.boolean().optional().nullable(),
      controls: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type VideoProps = z.infer<typeof VideoPropsSchema>;

export function Video({ style, props }: VideoProps) {
  const sectionStyle: CSSProperties = {
    padding: getPadding(style?.padding),
    backgroundColor: style?.backgroundColor ?? undefined,
    textAlign: style?.textAlign ?? undefined,
    display: 'flex',
    justifyContent: 'center',
    alignItems: props?.contentAlignment === 'top' ? 'flex-start' :
      props?.contentAlignment === 'bottom' ? 'flex-end' : 'center',
    width: '100%',
  };

  // 如果没有 URL，不渲染任何内容
  if (!props?.url) {
    return null;
  }

  const videoUrl = props.url;
  const width = props.width || '100%';
  const height = props.height || 'auto';
  const autoplay = props.autoplay ?? false;
  const loop = props.loop ?? false;
  const muted = props.muted ?? false;
  const controls = props.controls ?? true;

  const videoStyle: CSSProperties = {
    maxWidth: '100%',
    height: height === 'auto' ? 'auto' : height,
  };

  const videoElement = (
    <video
      src={videoUrl}
      width={width}
      height={height}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      controls={controls}
      style={videoStyle}
    >
      Your browser does not support the video tag.
    </video>
  );

  const linkHref = props.linkHref ?? null;

  if (!linkHref) {
    return <div style={sectionStyle}>{videoElement}</div>;
  }

  return (
    <div style={sectionStyle}>
      <a href={linkHref} style={{ textDecoration: 'none' }} target="_blank">
        {videoElement}
      </a>
    </div>
  );
}
