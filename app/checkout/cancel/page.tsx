import Link from "next/link";
export default function Cancel() { return <section className="checkout-result container"><p className="eyebrow">CHECKOUT CANCELED</p><h1>Your bag is still here.</h1><p>No payment was made. Your selections are ready whenever you are.</p><Link href="/cart" className="button button-dark">Return to bag</Link></section>; }
