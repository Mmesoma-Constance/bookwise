"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link"
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
  return (
   <header className="my-10 flex justify-between gap-5">
    <Link href="/">
    <Image src="/icons/logo.svg" alt="logo" width={40} height={40} className="cursor-pointer" />
    </Link>

    <ul className="flex flex-row items-center gap-5">
        <li>
            <Link href="/library" className={cn(
             pathname === "/library" ? "text-base cursor-pointer capitalize" : "text-light-100"
            )}>Library</Link>
        </li>
    </ul>
   </header>
  )
}

export default Header