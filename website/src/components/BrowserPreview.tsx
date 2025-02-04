import Image from 'next/image';

export default function BrowserPreview() {
  return (
    <div className=" w-full max-w-5xl mx-auto ">
      <div className="aspect-[16/9] relative ">
        <Image src={`/preview.jpg`} alt="App Preview" fill className="object-cover rounded-lg" />
      </div>
    </div>
  );
}
