import WhatsNew from '@/components/WhatsNew';
import DownloadSection from '../components/DownloadSection';

export default function Home() {
  return (
    <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
      <DownloadSection />
      <WhatsNew />
    </main>
  );
}
