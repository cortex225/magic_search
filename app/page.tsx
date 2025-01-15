import Image from "next/image";
import { Suspense } from "react";


export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=""></div>
    </Suspense>
  );
}
