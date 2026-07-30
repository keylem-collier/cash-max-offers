type CalEmbedProps = {
  calLink: string;
  realtorName: string;
};

export function CalEmbed({ calLink, realtorName }: CalEmbedProps) {
  const src = `https://cal.com/${calLink}?embed=true&theme=light`;

  return (
    <iframe
      title={`Book a time with ${realtorName}`}
      src={src}
      loading="lazy"
      className="min-h-[640px] w-full border-0 bg-[var(--panel)] sm:min-h-[700px]"
    />
  );
}
