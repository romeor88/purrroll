import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ShoppingBag, Star, Check, Truck, ShieldCheck, ChevronDown, ChevronLeft, ChevronRight, X, Plus, Minus, Gift, Lock, RotateCcw, Wind, Zap, Quote } from 'lucide-react';
import NotFound from '@/pages/not-found';
import { trackMetaPixelEvent } from '@/lib/meta-pixel';
import blueCatReviewImage from './assets/reviews/blue-cat.webp';
import backyardPlaypensReviewImage from './assets/reviews/backyard-playpens.webp';
import parkCatReviewImage from './assets/reviews/park-cat.webp';

type Color = 'black' | 'blue' | 'mint' | 'pink';
const COLORS: { id: Color; label: string; hex: string }[] = [
  { id: 'black', label: 'Black', hex: '#23262b' },
  { id: 'blue', label: 'Blue', hex: '#2a6fe0' },
  { id: 'mint', label: 'Mint', hex: '#9bdcc4' },
  { id: 'pink', label: 'Pink', hex: '#FDB2BF' },
];
const PRODUCT_IMAGES: Record<Color, string> = {
  black: 'https://rollymew.store/cdn/shop/files/Disenosintitulo_2_copia3.png?v=1791415562&width=1445',
  blue: 'https://rollymew.store/cdn/shop/files/Disenosintitulo_2.png?v=1791415561&width=1445',
  mint: 'https://rollymew.store/cdn/shop/files/Disenosintitulo_2_copia2.png?v=1791415562&width=1445',
  pink: 'https://rollymew.store/cdn/shop/files/Disenosintitulo_2_copia.png?v=1791415563&width=1445',
};
const img = (c: Color) => PRODUCT_IMAGES[c];
const BUNDLES = [
  { qty: 1, price: 29.99, was: 55.99, title: 'Buy 1, Get 1 Free Gift', tag: '' },
  { qty: 2, price: 45, was: 111.98, title: 'Buy 2, Get 5% Off and 1 Free Gift', tag: 'Most popular' },
  { qty: 3, price: 99.99, was: 167.97, title: 'Buy 3, Get 15% Off and 1 Free Gift', tag: 'Best value' },
];
const money = (n: number) => `$${n.toFixed(2)}`;

const REVIEWS = [
  { n: 'Clara G.', l: 'Miami, USA', t: 'My cat finally enjoys the backyard and I stopped watching the fence.' },
  { n: 'Mark W.', l: 'New York, USA', t: 'He used to bolt out the door. Now he is calmer every day.' },
  { n: 'Emily M.', l: 'Miami, USA', t: 'Our backyard has a 6-foot fence and my cat still found a way over it. Now she spends her afternoons rolling around the lawn while I have my coffee on the patio.' },
  { n: 'Sarah A.', l: 'Quebec, Canada', t: 'Every afternoon at five, my neighbor and I put our cats out on the lawn together. They roll side by side and sniff each other through the mesh.' },
  { n: 'Tina W.', l: 'Chicago, USA', t: 'With PurrRoll he gets real outdoor time on the balcony and at the park, he is calmer at home, and I finally stopped worrying.' },
];
const TESTIMONIAL_CARDS = [
  { review: REVIEWS[0], image: blueCatReviewImage, alt: 'Cat enjoying a blue PurrRoll playpen in a backyard' },
  { review: REVIEWS[3], image: backyardPlaypensReviewImage, alt: 'Two cats relaxing in PurrRoll playpens in a backyard' },
  { review: REVIEWS[4], image: parkCatReviewImage, alt: 'Cat exploring a park from inside a black PurrRoll playpen' },
];
const HAPPY_CAT_CLIPS = [
  {
    id: 'patio-play',
    src: 'https://rollymew.store/cdn/shop/videos/c/vp/7527265ada234c22899696cea4c66baf/7527265ada234c22899696cea4c66baf.HD-1080p-4.8Mbps-96749612.mp4?v=0',
    poster: 'https://rollymew.store/cdn/shop/files/preview_images/7527265ada234c22899696cea4c66baf.thumbnail.0000000000.jpg?v=1791418987',
    label: 'Cats playing in their playpens on a sunny patio',
  },
  {
    id: 'backyard-play',
    src: 'https://rollymew.store/cdn/shop/videos/c/vp/250d22c715234c9487256ffa16a6842c/250d22c715234c9487256ffa16a6842c.HD-1080p-7.2Mbps-96749533.mp4?v=0',
    poster: 'https://rollymew.store/cdn/shop/files/preview_images/250d22c715234c9487256ffa16a6842c.thumbnail.0000000000.jpg?v=1791418889',
    label: 'Cats enjoying playpens together in a backyard',
  },
];
const FAQ = [
  ['What size is it, and will my cat fit?', 'PurrRoll opens to about 27 in (68 cm) across, with room for most adult cats to stand, turn around, stretch and lie down comfortably. It comes in one universal size, so you only need to choose your color.'],
  ['Is it safe for my cat?', 'Yes. PurrRoll is made with tough, breathable mesh that keeps fresh air flowing and gives your cat a full 360-degree view. Use it on a flat surface, keep it in the shade on warm days and always stay nearby while your cat is inside.'],
  ['Can my cat escape or climb out?', 'PurrRoll is enclosed on every side, top and bottom, and closes with a zippered door, so there are no gaps to squeeze through. Make sure the zipper is fully closed and supervise your cat while they play.'],
  ['Can I use it indoors and outdoors?', 'Absolutely. Use it in the backyard, on the patio or balcony, at the park, or while camping. Indoors, it also works as a cozy playpen or quiet space.'],
  ['Is it a good gift for a cat lover?', 'It is fun, useful and something most cat owners do not already have. It works well for birthdays, holidays or a new kitten.'],
];

function Stars({ s = 14 }: { s?: number }) {
  return <span className="inline-flex gap-0.5">{[0, 1, 2, 3, 4].map(i => <Star key={i} size={s} className="fill-[#FFC21A] text-[#FFC21A]" />)}</span>;
}
function Wordmark({ light = false, size = 'text-2xl' }: { light?: boolean; size?: string }) {
  return (
    <span className={`font-extrabold tracking-tight leading-none inline-flex items-center gap-1 ${size}`} data-testid="logo-purrroll">
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden><path d="M3 3l5 4h8l5-4v10a9 9 0 0 1-18 0z" fill="#FDB2BF" stroke={light ? '#fff' : '#16181d'} strokeWidth="1.6" strokeLinejoin="round" /></svg>
      <span style={{ color: light ? '#fff' : '#4D8FDC' }}>Purr</span><span style={{ color: light ? '#FDB2BF' : '#16181d' }}>Roll</span>
    </span>
  );
}
function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`px-5 py-14 md:py-20 ${className}`}><div className="mx-auto max-w-[1080px]">{children}</div></section>;
}
function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center text-ink mb-3">{children}</h2>;
}

function HappyCatVideo({ clip }: { clip: (typeof HAPPY_CAT_CLIPS)[number] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setNearViewport(true);
    }, { rootMargin: '240px 0px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion || !visible) {
      video.pause();
      return;
    }
    void video.play().catch(() => {});
  }, [nearViewport, prefersReducedMotion, visible]);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-lg bg-muted">
      <video
        ref={videoRef}
        src={nearViewport ? clip.src : undefined}
        poster={nearViewport ? clip.poster : undefined}
        muted
        loop
        playsInline
        controls={prefersReducedMotion && nearViewport}
        preload={nearViewport ? 'metadata' : 'none'}
        className="block w-full aspect-[0.86] object-cover"
        aria-label={clip.label}
      />
    </div>
  );
}

function Home() {
  const [color, setColor] = useState<Color>('black');
  const [active, setActive] = useState(0);
  const [bundle, setBundle] = useState(0);
  const [picks, setPicks] = useState<Color[]>(['black', 'blue', 'mint']);
  const [cartOpen, setCartOpen] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [rv, setRv] = useState(0);
  const [stickyShow, setStickyShow] = useState(false);
  const buyRef = useRef<HTMLButtonElement>(null);
  const b = BUNDLES[bundle];
  const gallery: Color[] = ['black', 'blue', 'mint', 'pink'];
  const colors = Array.from({ length: b.qty }, (_, i) => (i === 0 ? color : picks[i - 1]));

  useEffect(() => {
    trackMetaPixelEvent('ViewContent', {
      content_ids: ['purrroll-playpen'],
      content_name: 'PurrRoll Outdoor Pet Playpen',
      content_type: 'product',
      currency: 'USD',
      value: BUNDLES[0].price,
    });

    const url = new URL(window.location.href);
    if (url.searchParams.get('checkout') !== 'success') return;

    const orderId = url.searchParams.get('order_id');
    const value = Number(url.searchParams.get('value'));
    if (!orderId || !Number.isFinite(value) || value <= 0) return;

    const storageKey = `purrroll-meta-purchase-${orderId}`;
    let alreadyTracked = false;
    try {
      alreadyTracked = window.localStorage.getItem(storageKey) === '1';
    } catch {
      // Continue tracking if browser storage is unavailable.
    }

    if (!alreadyTracked) {
      trackMetaPixelEvent(
        'Purchase',
        {
          content_ids: ['purrroll-playpen'],
          content_name: 'PurrRoll Outdoor Pet Playpen',
          content_type: 'product',
          currency: 'USD',
          value,
        },
        orderId,
      );
      try {
        window.localStorage.setItem(storageKey, '1');
      } catch {
        // The URL cleanup below still prevents repeat fires after refresh.
      }
    }

    url.searchParams.delete('checkout');
    url.searchParams.delete('order_id');
    url.searchParams.delete('value');
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => setStickyShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    if (buyRef.current) o.observe(buyRef.current);
    return () => o.disconnect();
  }, []);
  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { document.body.style.overflow = cartOpen ? 'hidden' : ''; }, [cartOpen]);
  useEffect(() => { const t = setInterval(() => setRv(r => (r + 1) % REVIEWS.length), 5000); return () => clearInterval(t); }, []);

  const pickColor = (c: Color) => { setColor(c); setActive(gallery.indexOf(c)); };
  const addToCart = () => {
    trackMetaPixelEvent('AddToCart', {
      content_ids: ['purrroll-playpen'],
      content_name: 'PurrRoll Outdoor Pet Playpen',
      content_type: 'product',
      currency: 'USD',
      num_items: b.qty,
      value: b.price,
    });
    setInCart(true);
    setCartOpen(true);
    setMsg('');
  };
  const checkout = async () => {
    trackMetaPixelEvent('InitiateCheckout', {
      content_ids: ['purrroll-playpen'],
      content_name: 'PurrRoll Outdoor Pet Playpen',
      content_type: 'product',
      currency: 'USD',
      num_items: b.qty,
      value: b.price,
    });
    setBusy(true); setMsg('');
    try {
      const r = await fetch('/.netlify/functions/paypal-create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundle: b.qty, quantity: b.qty, colors, amount: Number(b.price.toFixed(2)) }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.approveUrl) { window.location.href = d.approveUrl; return; }
      setMsg('Secure checkout is not connected in this preview yet. Your order summary is saved here; PayPal checkout will work once the store function is deployed.');
    } catch {
      setMsg('Secure checkout is not connected in this preview yet. Your order summary is saved here; PayPal checkout will work once the store function is deployed.');
    }
    setBusy(false);
  };

  const bar = ['FREE GIFT ONLY TODAY', 'SAVE 30% OFF', 'LAST UNITS IN STOCK'];
  return (
    <div className="min-h-[100dvh] text-ink">
      <div className="bg-brand text-white overflow-hidden text-[11px] md:text-xs font-semibold tracking-wide h-7 flex items-center">
        <div className="marquee flex whitespace-nowrap w-max">
          {[0, 1, 2, 3].flatMap(k => bar.map((t, i) => <span key={`${k}${i}`} className="px-8 md:px-14">{t}</span>))}
        </div>
      </div>
      <header className="border-b bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-[1080px] h-14 px-5 grid grid-cols-3 items-center">
          <nav className="flex items-center gap-3 text-xs">
            <a href="#top" className="hidden sm:inline bg-brand text-white font-semibold px-2 py-1 rounded-sm" data-testid="link-nav-home">PurrRoll</a>
            <a href="#faq" className="hover:text-brand transition-colors" data-testid="link-contact">Contact</a>
          </nav>
          <div className="justify-self-center"><Wordmark /></div>
          <button onClick={() => setCartOpen(true)} className="justify-self-end relative p-2 hover:text-brand transition-colors" aria-label="Open cart" data-testid="button-open-cart">
            <ShoppingBag size={20} />
            {inCart && <span className="pop absolute -top-0.5 -right-0.5 bg-cta text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">{b.qty}</span>}
          </button>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1080px] px-5 py-6 md:py-10 grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12">
        <div className="md:sticky md:top-20 self-start">
          <div className="relative rounded-lg overflow-hidden aspect-square bg-brand-soft">
            {gallery.map((c, i) => (
              <img key={c} src={img(c)} alt={`PurrRoll playpen in ${c}`} className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} data-testid={`img-main-${c}`} />
            ))}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[38%] min-w-[140px] h-[10%] grid place-items-center bg-white rounded-sm shadow-sm"><Wordmark size="text-base" /></div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="p-1 text-muted-foreground hover:text-brand" onClick={() => pickColor(gallery[(active + 3) % 4])} aria-label="Previous" data-testid="button-prev-image"><ChevronLeft size={18} /></button>
            <div className="grid grid-cols-4 gap-2 flex-1">
              {gallery.map((c, i) => (
                <button key={c} onClick={() => pickColor(c)} className={`relative rounded-md overflow-hidden aspect-square border-2 transition-all ${i === active ? 'border-brand scale-100' : 'border-transparent opacity-70 hover:opacity-100'}`} data-testid={`button-thumb-${c}`}>
                  <img src={img(c)} alt={c} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 min-w-[60%] rounded-sm bg-white/95 px-1 py-0.5 text-[6px] font-bold text-ink">PurrRoll</span>
                </button>
              ))}
            </div>
            <button className="p-1 text-muted-foreground hover:text-brand" onClick={() => pickColor(gallery[(active + 1) % 4])} aria-label="Next" data-testid="button-next-image"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="rise">
          <div className="flex justify-center md:justify-end mb-3">
            <span className="border-2 border-brand text-brand text-xs font-bold px-3 py-1 rounded-sm" data-testid="badge-stock">91% SOLD OUT | LOW STOCK!</span>
          </div>
          <div className="flex items-center gap-2 text-xs"><Stars s={13} /><span>4.9/5 | +73 Verified Reviews</span></div>
          <h1 className="text-2xl md:text-[28px] font-bold leading-tight mt-2" data-testid="text-title">PurrRoll™ - Outdoor Pet Playpen</h1>
          <ul className="mt-4 space-y-2 text-[13px]">
            {['Cat-safe and secure', 'Tough, breathable mesh', '4 colors available'].map(t => (
              <li key={t} className="flex items-center gap-2"><span className="bg-brand rounded-full w-4 h-4 grid place-items-center"><Check size={10} className="text-white" strokeWidth={3} /></span>{t}</li>
            ))}
          </ul>

          <div className="mt-5">
            <p className="text-xs font-semibold mb-2">Color: <span className="text-brand">{COLORS.find(c => c.id === color)!.label}</span></p>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button key={c.id} onClick={() => pickColor(c.id)} aria-label={c.label} className={`w-9 h-9 rounded-full border-2 border-white ring-2 transition-all hover:scale-110 ${color === c.id ? 'ring-brand' : 'ring-border'}`} style={{ background: c.hex }} data-testid={`button-color-${c.id}`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 text-xs font-bold"><span className="h-px flex-1 bg-brand/30" />Bundle &amp; Save<span className="h-px flex-1 bg-brand/30" /></div>
          <div className="mt-3 space-y-3">
            {BUNDLES.map((x, i) => {
              const sel = bundle === i;
              return (
                <div key={x.qty} className={`rounded-lg border-2 overflow-hidden transition-all ${sel ? 'border-brand shadow-[0_6px_20px_-8px_rgba(77,143,220,.5)]' : 'border-border hover:border-brand/50'}`}>
                  <button onClick={() => setBundle(i)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white" data-testid={`button-bundle-${x.qty}`}>
                    <span className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 ${sel ? 'border-brand' : 'border-muted-foreground/50'}`}>{sel && <span className="pop w-2.5 h-2.5 rounded-full bg-brand" />}</span>
                    <span className="flex-1">
                      <span className="font-bold text-[15px]">{x.title}</span>
                      {x.tag && <span className="ml-2 bg-blush text-ink text-[10px] font-bold px-1.5 py-0.5 rounded-sm align-middle">{x.tag}</span>}
                    </span>
                    <span className="text-right leading-tight"><span className="block font-bold text-base" data-testid={`text-bundle-price-${x.qty}`}>{money(x.price)}</span><span className="block text-[11px] text-muted-foreground line-through">{money(x.was)}</span></span>
                  </button>
                  {sel && x.qty > 1 && (
                    <div className="px-4 pb-3 bg-white pop grid gap-2">
                      {Array.from({ length: x.qty - 1 }, (_, k) => (
                        <div key={k} className="flex items-center gap-2 text-xs"><span className="font-semibold w-16">Item {k + 2}</span>
                          {COLORS.map(c => (
                            <button key={c.id} aria-label={c.label} onClick={() => setPicks(p => p.map((v, j) => (j === k ? c.id : v)))} className={`w-6 h-6 rounded-full border-2 border-white ring-2 ${picks[k] === c.id ? 'ring-brand' : 'ring-border'}`} style={{ background: c.hex }} data-testid={`button-bundle-color-${k}-${c.id}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="bg-brand text-white text-[11px] font-semibold px-4 py-1.5 flex justify-between"><span className="flex items-center gap-1.5"><Gift size={13} />+ FREE Surprise Gift</span><span className="line-through opacity-80">$6.99</span></div>
                </div>
              );
            })}
          </div>

          <div className="relative mt-3 rounded-lg overflow-hidden h-24 bg-gradient-to-br from-brand/30 via-brand-soft to-blush/60 grid place-items-center">
            <p className="font-extrabold text-lg text-white drop-shadow-sm">Scratch more special offers</p>
            <p className="absolute bottom-2 text-[11px] font-semibold text-brand-dark">Today only: 30% off while stock lasts</p>
          </div>

          <button ref={buyRef} onClick={addToCart} className="relative overflow-hidden shimmer mt-3 w-full bg-cta hover:brightness-95 active:scale-[.99] transition-all rounded-md py-3 font-bold text-white text-[15px]" data-testid="button-add-to-cart">
            Add to cart - {money(b.price)}
          </button>
          <div className="flex justify-end gap-1.5 mt-3 text-[9px] font-bold text-muted-foreground">
            {['AMEX', 'Pay', 'GPay', 'MC', 'PayPal', 'shop', 'VISA'].map(p => <span key={p} className="border rounded-sm px-1.5 py-1 bg-white">{p}</span>)}
          </div>
          <div className="mt-4 pt-4 border-t min-h-[88px]">
            <div key={rv} className="pop flex gap-3 items-start">
              <span className="w-10 h-10 rounded-full bg-blush grid place-items-center font-bold shrink-0">{REVIEWS[rv].n[0]}</span>
              <div className="text-[13px]"><p>&ldquo;{REVIEWS[rv].t}&rdquo;</p><p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Check size={11} className="text-brand" />{REVIEWS[rv].n} ({REVIEWS[rv].l}) <Stars s={10} /></p></div>
            </div>
          </div>
        </div>
      </main>

      <Section id="happy-cats">
        <H2><span className="text-[#d66d85]">Our happy cats</span></H2>
        <div className="mx-auto mt-8 grid max-w-[980px] grid-cols-1 gap-5 md:grid-cols-2">
          {HAPPY_CAT_CLIPS.map(clip => <HappyCatVideo key={clip.id} clip={clip} />)}
        </div>
      </Section>

      <div className="bg-brand-soft border-y">
        <div className="mx-auto max-w-[1080px] px-5 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          {[[Truck, 'Free shipping on every order'], [ShieldCheck, 'Support for damaged or lost orders'], [Wind, 'Tough, breathable mesh'], [Lock, 'Secure PayPal checkout']].map(([I, t], i) => {
            const Ic = I as typeof Truck; return <div key={i} className="flex items-center gap-2"><Ic size={20} className="text-brand shrink-0" />{t as string}</div>;
          })}
        </div>
      </div>

      <Section>
        <H2>Fresh air, zero escape routes</H2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10 text-sm">PurrRoll turns the backyard, patio, park or living room into a secure place for fresh air, sunshine and play.</p>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={img('pink')} alt="Cat relaxing inside a pink PurrRoll" className="rounded-lg w-full aspect-square object-cover" loading="lazy" />
          <div className="space-y-5">
            {[[Zap, 'Pops up in seconds', 'No tools and no assembly. Open it whenever your cat is ready to explore.'], [ShieldCheck, 'Cat-safe and secure', 'A zippered door keeps your cat inside while they walk, roll, sniff and watch the world.'], [Wind, 'Tough, breathable mesh', 'Fresh airflow and a full 360-degree view help your cat stay comfortable.'], [RotateCcw, 'Folds flat for storage', 'Fold it into an approximately 11-inch disc for a drawer, closet or car trunk.']].map(([I, t, d], i) => {
              const Ic = I as typeof Zap; return (
                <div key={i} className="flex gap-4"><span className="w-11 h-11 rounded-lg bg-brand text-white grid place-items-center shrink-0"><Ic size={20} /></span><div><h3 className="font-bold">{t as string}</h3><p className="text-sm text-muted-foreground">{d as string}</p></div></div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <H2>Why cats (and owners) love it</H2>
        <div className="mt-8 grid md:grid-cols-[1.4fr_1fr] gap-6">
          <div className="rounded-lg bg-brand-soft p-7">
            <h3 className="font-bold text-xl mb-3">Product description</h3>
            <p className="text-sm leading-relaxed mb-3">PurrRoll is a pop-up mesh playpen that lets your cat enjoy fresh air, grass and sunshine safely. The zippered door keeps your cat inside while the breathable mesh gives them a full view of the world.</p>
            <ul className="text-sm space-y-1.5">
              {['Tough, breathable mesh with a secure zippered door', 'Open size: approximately 27 in (68 cm) across', 'Folded size: approximately 11 in (28 cm) across', 'Designed for indoor and outdoor use', 'Available in Black, Blue, Pink and Mint Green'].map(t => <li key={t} className="flex gap-2"><Check size={15} className="text-brand mt-0.5 shrink-0" />{t}</li>)}
            </ul>
          </div>
          <img src={img('blue')} alt="Blue PurrRoll playpen" className="rounded-lg w-full h-full object-cover min-h-[260px]" loading="lazy" />
        </div>
      </Section>

      <Section id="shipping" className="bg-muted/60">
        <H2>Shipping details</H2>
        <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
          {[['Prepared in 2-3 business days', 'Every PurrRoll is checked and packed with care before it ships.'], ['Estimated delivery in 6-9 business days', 'Delivery timing depends on location and may be affected by public holidays or unexpected circumstances.'], ['Free shipping on every order', 'If an order arrives damaged or defective, or is lost in transit, contact us within 48 hours of confirmed delivery.']].map(([t, d]) => (
            <div key={t} className="bg-white rounded-lg border p-6"><Truck className="mx-auto text-brand mb-3" /><h3 className="font-bold">{t}</h3><p className="text-sm text-muted-foreground mt-1">{d}</p></div>
          ))}
        </div>
      </Section>

      <Section id="testimonials" className="scroll-mt-24">
        <H2>Testimonials</H2>
        <p className="text-center text-sm text-muted-foreground mb-8">4.9/5 from +73 verified reviews</p>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIAL_CARDS.map(({ review, image, alt }) => (
            <figure key={review.n} className="overflow-hidden rounded-xl border bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="relative">
                <img src={image} alt={alt} loading="lazy" className="block w-full aspect-[1.075] object-cover" />
                <span className="absolute -bottom-5 right-4 grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-brand text-white shadow-sm" aria-hidden="true">
                  <Quote size={18} fill="currentColor" strokeWidth={1.5} />
                </span>
              </div>
              <div className="p-5 pt-7">
                <Stars />
                <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{review.t}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-2 text-xs">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blush font-bold">{review.n[0]}</span>
                  <span><b>{review.n}</b><br /><span className="text-muted-foreground">{review.l} - Verified buyer</span></span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="faq" className="bg-brand-soft">
        <H2>Frequently asked questions</H2>
        <div className="mt-8 max-w-2xl mx-auto space-y-2">
          {FAQ.map(([q, a], i) => (
            <div key={q} className="bg-white rounded-lg border overflow-hidden">
              <button onClick={() => setFaq(faq === i ? null : i)} className="w-full flex justify-between items-center gap-3 text-left px-5 py-4 font-semibold text-sm" aria-expanded={faq === i} data-testid={`button-faq-${i}`}>{q}<ChevronDown size={18} className={`text-brand shrink-0 transition-transform ${faq === i ? 'rotate-180' : ''}`} /></button>
              <div className={`grid transition-all duration-300 ${faq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><div className="overflow-hidden"><p className="px-5 pb-4 text-sm text-muted-foreground">{a}</p></div></div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-ink text-white !py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold mb-2">Give your cat the great outdoors</h2>
          <p className="text-white/70 text-sm mb-6">Free surprise gift while stock lasts.</p>
          <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-cta text-white font-bold rounded-md px-8 py-3 hover:brightness-95 transition" data-testid="button-footer-cta">Shop PurrRoll</button>
        </div>
      </Section>
      <footer className="bg-ink text-white/70 border-t border-white/10 px-5 py-10 text-xs">
        <div className="mx-auto max-w-[1080px] grid sm:grid-cols-3 gap-8">
          <div><Wordmark light /><p className="mt-3 max-w-[240px]">Safe fresh-air time for indoor cats.</p></div>
          <div className="space-y-2"><p className="text-white font-semibold">Help</p><a href="#faq" className="block hover:text-white">FAQ</a><a href="#shipping" className="block hover:text-white">Shipping</a><a href="#faq" className="block hover:text-white">Returns</a></div>
          <div className="space-y-2"><p className="text-white font-semibold">Company</p><a href="#top" className="block hover:text-white">Contact</a><a href="#top" className="block hover:text-white">Privacy policy</a><a href="#top" className="block hover:text-white">Terms of service</a></div>
        </div>
        <p className="mx-auto max-w-[1080px] mt-8 pt-5 border-t border-white/10">&copy; 2026 PurrRoll. All rights reserved.</p>
      </footer>

      {stickyShow && !cartOpen && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t p-3 md:hidden pop"><button onClick={addToCart} className="w-full bg-cta text-white font-bold rounded-md py-3" data-testid="button-sticky-add">Add to cart - {money(b.price)}</button></div>
      )}

      <div className={`fixed inset-0 z-50 ${cartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cartOpen}>
        <div onClick={() => setCartOpen(false)} className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute right-0 top-0 h-full w-full max-w-[400px] bg-white flex flex-col transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`} data-testid="drawer-cart">
          <div className="flex items-center justify-between px-5 h-14 border-b"><h2 className="font-bold">Your cart</h2><button onClick={() => setCartOpen(false)} aria-label="Close cart" data-testid="button-close-cart"><X size={20} /></button></div>
          <div className="flex-1 overflow-y-auto p-5">
            {!inCart ? (
              <div className="text-center py-16"><ShoppingBag className="mx-auto text-brand mb-3" size={36} /><p className="font-semibold">Your cart is empty</p><p className="text-sm text-muted-foreground">Your cat is waiting for sunshine.</p></div>
            ) : (
              <div>
                <div className="flex gap-1 mb-3">
                  {BUNDLES.map((x, i) => <button key={x.qty} onClick={() => setBundle(i)} className={`flex-1 text-xs font-semibold rounded-md py-1.5 border transition-colors ${bundle === i ? 'bg-brand text-white border-brand' : 'hover:border-brand'}`} data-testid={`button-cart-bundle-${x.qty}`}>{x.qty} pack</button>)}
                </div>
                <div className="space-y-3">
                  {colors.map((c, i) => (
                    <div key={i} className="flex gap-3 items-center"><img src={img(c)} alt={c} className="w-16 h-16 rounded-md object-cover" /><div className="flex-1 text-sm"><p className="font-semibold">PurrRoll Playpen</p><p className="text-xs text-muted-foreground capitalize">Color: {c}</p></div></div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm"><span className="font-semibold">Quantity</span>
                  <button className="w-7 h-7 border rounded-md grid place-items-center disabled:opacity-40" disabled={bundle === 0} onClick={() => setBundle(bundle - 1)} aria-label="Decrease" data-testid="button-qty-minus"><Minus size={14} /></button>
                  <span className="w-6 text-center font-bold" data-testid="text-qty">{b.qty}</span>
                  <button className="w-7 h-7 border rounded-md grid place-items-center disabled:opacity-40" disabled={bundle === 2} onClick={() => setBundle(bundle + 1)} aria-label="Increase" data-testid="button-qty-plus"><Plus size={14} /></button>
                </div>
                <div className="mt-5 rounded-md bg-brand-soft p-3 text-xs flex items-center gap-2"><Gift size={16} className="text-brand" />Free surprise gift included with your order</div>
              </div>
            )}
          </div>
          {inCart && (
            <div className="border-t p-5 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground"><span>Regular price</span><span className="line-through">{money(b.was)}</span></div>
              <div className="flex justify-between text-sm text-brand font-semibold"><span>You save</span><span>{money(b.was - b.price)}</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span data-testid="text-cart-total">{money(b.price)}</span></div>
              {msg && <p className="pop text-xs bg-[#FFF4E0] border border-cta/50 rounded-md p-3" role="alert" data-testid="text-checkout-message">{msg}</p>}
              <button onClick={checkout} disabled={busy} className="w-full bg-cta hover:brightness-95 disabled:opacity-60 text-white font-bold rounded-md py-3 transition" data-testid="button-checkout">{busy ? 'Connecting to PayPal...' : 'Checkout with PayPal'}</button>
              <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1"><Lock size={11} />Secure checkout powered by PayPal.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
