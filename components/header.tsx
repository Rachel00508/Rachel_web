"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return <><div className="announcement">RACHEL FRAGRANCE CATALOG · PREVIEW ONLY</div><header className="site-header"><div className="header-inner container">
    <Link href="/" className="wordmark" onClick={() => setOpen(false)}>RACHEL<span>PARFUMS</span></Link>
    <nav className={`main-nav ${open ? "nav-open" : ""}`} aria-label="Main navigation"><Link href="/shop" onClick={() => setOpen(false)}>Shop</Link><Link href="/about" onClick={() => setOpen(false)}>Our Story</Link><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link><Link href="/jump" onClick={() => setOpen(false)}>jump</Link></nav>
    <div className="header-actions"><Link href="/cart" className="bag-link" aria-label={`Shopping bag with ${count} items`}><ShoppingBag size={19} strokeWidth={1.5} /><span>Bag ({count})</span></Link><button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={22}/> : <Menu size={22}/>}</button></div>
  </div></header></>;
}
