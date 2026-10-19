import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return <>
    <div className="page-banner"><div className="container">
      <p className="eyebrow">GET IN TOUCH</p>
      <h1>We’d love to <em>hear from you.</em></h1>
      <p>We are preparing a direct contact channel for Rachel.</p>
    </div></div>
    <section className="container contact-grid">
      <div>
        <p className="eyebrow">A PERSONAL NOTE</p>
        <h2>Let’s talk fragrance.</h2>
        <p>This static catalog does not collect messages or process orders. A customer contact address will appear here when the store is ready to serve you.</p>
        <div className="contact-line"><span>LOCATION</span><p>Online · United States</p></div>
        <div className="contact-line"><span>STATUS</span><p>Catalog preview · Contact channel coming soon</p></div>
      </div>
      <div className="contact-panel">
        <p className="eyebrow">EXPLORE IN THE MEANTIME</p>
        <h2>Find your next feeling.</h2>
        <p>Browse the collection and save fragrances to your bag while we prepare the full shopping experience.</p>
        <Link href="/shop" className="button button-dark">View fragrances <ArrowRight size={16}/></Link>
      </div>
    </section>
  </>;
}
