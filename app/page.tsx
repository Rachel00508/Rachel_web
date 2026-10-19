import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Package } from "lucide-react";
import { Bottle } from "@/components/bottle";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  return <><section className="hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow light">THE RACHEL COLLECTION · EST. IN FEELING</p><h1>Wear what<br/><em>moves you.</em></h1><p>Modern fragrance for every version of you. Intimate, expressive, and impossible to forget.</p><Link href="/shop" className="button button-light">Explore the collection <ArrowRight size={17}/></Link><div className="hero-index">01 / 04 <span>SCENT AS SELF EXPRESSION</span></div></div><div className="hero-art"><div className="hero-art-title">AN INVITATION TO FEEL</div><Bottle variant="fleur" /></div></div></section>
  <section className="intro-band"><div className="container intro-inner"><span>YOUR STORY, IN SCENT</span><p>Some things are best left unspoken.<br/><em>Let your fragrance say the rest.</em></p><span>RACHEL PARFUMS</span></div></section>
  <section className="section container"><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Find your signature.</h2></div><Link href="/shop" className="text-link">Shop all fragrances <ArrowRight size={17}/></Link></div><div className="product-grid">{products.filter(p => p.is_featured).slice(0, 3).map(p => <ProductCard key={p.id} product={p}/>)}</div></section>
  <section className="story-section"><div className="story-image"><div className="story-shape story-shape-one"/><div className="story-shape story-shape-two"/><div className="story-caption">THE BEAUTY OF BECOMING</div></div><div className="story-copy"><p className="eyebrow">THE RACHEL PHILOSOPHY</p><h2>Made to be felt.<br/><em>Made to be yours.</em></h2><p>We believe fragrance is personal. A quiet ritual, a vivid memory, a way of arriving as yourself. Rachel is an invitation to choose what feels like you.</p><Link href="/about" className="text-link">Discover our story <ArrowRight size={17}/></Link></div></section>
  <section className="promise-section container"><div><Sparkles size={25}/><h3>Thoughtful by nature</h3><p>Considered compositions created to become part of your everyday.</p></div><div><Heart size={25}/><h3>Personal by design</h3><p>Each scent tells a different story. Make it your own.</p></div><div><Package size={25}/><h3>Made for giving</h3><p>A beautiful gesture for someone you love, including yourself.</p></div></section>
  <section className="closing-cta"><p className="eyebrow light">DISCOVER WHAT MOVES YOU</p><h2>Your next chapter<br/><em>starts with a scent.</em></h2><Link href="/shop" className="button button-light">Shop the collection <ArrowRight size={17}/></Link></section></>;
}
