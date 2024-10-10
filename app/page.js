"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-screen min-h-screen">
      <div className="flex flex-col space-y-16">
        <div className="text-3xl text-center md:text-5xl">
          Choose the Layout of your{" "}
          <span className="font-bold">Dome Suite</span>
        </div>
        <div className="w-screen py-4 bg-gray-200">
          <div className="flex flex-col items-center justify-center gap-4 px-10 space-y-10 xl:px-56 xl:py-10 md:flex-row md:flex-wrap md:space-y-0 md:justify-between">
            {["layout_1", "layout_2", "layout_3"].map((layout, index) => (
              <div
                key={layout}
                className="flex justify-center hover:cursor-pointer"
                onClick={() => router.push(`/${layout}`)}
              >
                <div className="max-w-[250px] max-h-[250px] flex flex-col space-y-4 items-center">
                  <Image
                    src={`/GrowIt/Snapshots/layouts/${layout}.png`}
                    width={250}
                    height={250}
                    className="w-auto h-auto hover:outline hover:outline-offset-4 hover:outline-green-500"
                    alt={layout}
                  />
                  <p className="text-xl font-medium text-center">{`Layout ${
                    index + 1
                  }`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
