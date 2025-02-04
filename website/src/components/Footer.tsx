import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-6 absolute bottom-0 flex justify-center w-full">
      <div className="container mx-auto px-4 text-center text-white flex items-center justify-center space-x-5 ">
        <p className="flex items-center justify-center">
          Created with love <Heart className="mx-1 fill-red-500 " size={16} /> by
          <Link className="text-[#4B4ACF] ms-1" href="https://kriteshtimsina.com.np">
            Kritesh Timsina
          </Link>
        </p>
      </div>
    </footer>
  );
}
