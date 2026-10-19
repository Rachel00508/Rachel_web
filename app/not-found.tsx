import Link from "next/link";
export default function NotFound() { return <section className="checkout-result container"><p className="eyebrow">404</p><h1>Lost in the notes?</h1><p>We could not find that page.</p><Link href="/shop" className="button button-dark">Explore fragrances</Link></section>; }
