import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "jump | Explore the Site" };

const destinations = [
  { href: "/", number: "01", title: "Home", description: "Start with the Rachel collection and our point of view." },
  { href: "/shop", number: "02", title: "Shop", description: "Browse fragrances and find a scent that feels like you." },
  { href: "/about", number: "03", title: "Our Story", description: "Discover the idea and inspiration behind Rachel Parfums." },
  { href: "/contact", number: "04", title: "Contact", description: "Send us a note about a fragrance or your order." },
  { href: "/cart", number: "05", title: "Bag", description: "Review the fragrances you have added to your bag." },
];

export default function JumpPage() {
  return <>
    <section className="page-banner">
      <div className="container">
        <p className="eyebrow">EXPLORE RACHEL PARFUMS</p>
        <h1>Where to <em>next?</em></h1>
        <p>A simple guide to every part of the Rachel experience.</p>
      </div>
    </section>
    <section className="container jump-section" aria-labelledby="jump-heading">
      <div className="jump-intro">
        <p className="eyebrow">JUMP</p>
        <h2 id="jump-heading">Find your way.</h2>
        <p>Explore the collection, learn our story, or pick up where you left off.</p>
      </div>
      <div className="jump-list">
        {destinations.map(({ href, number, title, description }) =>
          <Link className="jump-item" href={href} key={href}>
            <span className="jump-number">{number}</span>
            <span className="jump-item-copy"><strong>{title}</strong><span>{description}</span></span>
            <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.4} />
          </Link>
        )}
      </div>
    </section>
  </>;
}
