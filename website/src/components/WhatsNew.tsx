import { ScrollText, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const updates = [
  {
    version: '0.0.1',
    date: 'February 2024',
    highlights: [
      'Complete UI redesign with notes and checklist support',
      'Complete App preferences',
      'Offline support',
    ],
    type: 'major',
  },
];

export default function WhatsNew() {
  return (
    <div className="py-12 w-1/2">
      <div className="mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScrollText className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">What&apos;s New</h1>
          </div>
        </div>

        <div className="space-y-8">
          {updates.map(update => (
            <div
              key={update.version}
              className="rounded-lg bg-white/95 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-black">Version {update.version}</h2>
                  <Badge variant={update.type === 'major' ? 'destructive' : 'secondary'}>
                    {update.type}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{update.date}</span>
              </div>
              <ul className="space-y-2">
                {update.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#4ADE80]" />
                    <span className="text-black">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
