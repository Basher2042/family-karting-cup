import Image from "next/image";

type ExpandableAvatarProps = {
  src: string;
  alt: string;
  modalId: string;
  size?: "sm" | "md";
};

const sizes = {
  sm: {
    thumb: 40,
    className: "size-10",
  },
  md: {
    thumb: 44,
    className: "size-11",
  },
};

function safeId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

export function ExpandableAvatar({ src, alt, modalId, size = "md" }: ExpandableAvatarProps) {
  const config = sizes[size];
  const id = safeId(modalId);

  return (
    <>
      <a
        href={`#${id}`}
        className="rounded-md outline-none ring-red-400/70 transition hover:scale-105 focus-visible:ring-2"
        aria-label={`Expand ${alt} profile picture`}
      >
        <Image
          src={src}
          alt={alt}
          width={config.thumb}
          height={config.thumb}
          className={`${config.className} rounded-md border border-white/10 object-cover`}
        />
      </a>

      <div
        id={id}
        className="fixed inset-0 z-[80] hidden place-items-center bg-black/86 p-5 backdrop-blur-sm target:grid"
        role="dialog"
        aria-modal="true"
        aria-label={`${alt} profile picture`}
      >
        <a
          href="#"
          className="absolute inset-0"
          aria-label="Close profile picture"
        />
        <a
          href="#"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-md border border-white/15 bg-white/10 text-2xl font-black text-white"
          aria-label="Close profile picture"
        >
          ×
        </a>
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1000}
          className="relative max-h-[82vh] w-full max-w-3xl rounded-lg object-contain shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
          priority={false}
        />
      </div>
    </>
  );
}
