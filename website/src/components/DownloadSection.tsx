import { Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function DownloadSection() {
  return (
    <section className="py-10 md:py-20 text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-12">
        {'Todos and notes. Never miss a thing. Checked✅'}
      </h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="https://github.com/KriteshTimsina/checked/releases/download/v0.0.1/Checked-0.0.1.apk"
          download={true}
          className="group flex items-center bg-white text-[#4B4ACF] px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors w-full sm:w-auto justify-center"
        >
          <Smartphone className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform group-hover:rotate-12 " />
          Download for android
        </Link>
        {/* <Link
          href="#"
          className="flex items-center bg-[#3838A8] text-white px-6 py-3 rounded-full font-medium hover:bg-[#32327E] transition-colors w-full sm:w-auto justify-center"
        >
          <Github className="mr-2 h-5 w-5" />
          Download from github
        </Link> */}
      </div>
    </section>
  );
}
