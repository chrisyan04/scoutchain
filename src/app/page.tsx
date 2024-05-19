import Test from "@/components/Test";
import Dashboard from "@/components/Dashboard";
import Image from "next/image";
import logo from "@/public/logo.png";

export default function Home() {
  return (
    <main className="">
      <div className="flex justify-between">
        <Test />
        <Image src={logo} alt="logo" height={100} width={100} className="rounded-full" />
      </div>
      <Dashboard />
    </main>
  );
}
