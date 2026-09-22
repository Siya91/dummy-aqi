import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function SectionWrapper({ id, title, icon, children }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className="min-h-screen scroll-mt-16 flex flex-col py-6 px-4 md:px-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="flex-shrink-0">{icon}</span>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--airsense-text)' }}>
          {title}
        </h2>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}
