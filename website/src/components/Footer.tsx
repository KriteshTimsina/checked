import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-center w-full bg-black/10 backdrop-blur-sm py-3 border-t border-white/10">
      <div className="container mx-auto px-4 text-center text-white flex flex-col items-center gap-1">
        <p className="flex items-center justify-center text-sm">
          Created with <Heart className="mx-1 fill-red-400 text-red-400" size={14} /> by{' '}
          <a
            href="https://kriteshtimsina.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold ms-1 hover:underline"
          >
            Kritesh Timsina
          </a>
        </p>
        <Link href="/privacy" className="text-white/60 hover:text-white text-xs transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
