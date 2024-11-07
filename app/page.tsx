import { SpeedReader } from "@/components/speed-reader";

export default function Home() {
  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
        Blitzz
      </h1>
      <SpeedReader />
    </main>
  );
}