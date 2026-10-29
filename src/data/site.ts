export const SITE = {
  name: '397 Graphix',
  domain: 'https://397graphix.co.nz',
  phone: '022 500 3904',
  tel: 'tel:+64225003904',
  email: 'ryan@397graphix.co.nz',
  location: 'Wellington Region, New Zealand',
  owner: 'Ryan',
  stripeLink: 'https://buy.stripe.com/REPLACE_ME',
  googleReviewLink: 'https://g.page/r/REPLACE_ME/review',
  turnstileSiteKey: 'REPLACE_ME_TURNSTILE_SITE_KEY',
};

export const NAV_LINKS = [
  { href: '/', match: '/', label: 'Home' },
  { href: '/services', match: '/services', label: 'Services' },
  { href: '/studio', match: '/studio', label: 'Wrap Studio' },
  { href: '/gallery', match: '/gallery', label: 'Our Work' },
  { href: '/about', match: '/about', label: 'About' },
  { href: '/reviews', match: '/reviews', label: 'Reviews' },
  { href: '/contact', match: '/contact', label: 'Contact' },
];

export interface PhotoItem {
  id: string;
  src: string;
  srcSm: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  caption: string;
  category: 'vehicles' | 'fitouts' | 'signage';
  categories: string[];
  tag: string;
  location?: string;
}

export const PHOTOS: Record<string, PhotoItem> = {
  'wagon-wrap': {
    id: 'wagon-wrap',
    src: '/assets/img/wagon-wrap.webp',
    srcSm: '/assets/img/wagon-wrap-sm.webp',
    width: 978,
    height: 845,
    alt: 'Black and white two-tone station wagon wrap with 397 Graphix branding',
    title: 'Two-Tone Commercial Vehicle Wrap',
    caption: 'Custom two-tone gloss & matte vehicle wrap on our own 397 Graphix station wagon',
    category: 'vehicles',
    categories: ['vehicles'],
    tag: 'Vehicle Wrap',
    location: 'Wellington',
  },
  'frosting-office': {
    id: 'frosting-office',
    src: '/assets/img/frosting-office.webp',
    srcSm: '/assets/img/frosting-office-sm.webp',
    width: 1600,
    height: 1200,
    alt: 'Commercial glass office partition with frosted privacy band, pinstripe detail, and room number 9.7',
    title: 'Executive Office Privacy Band & Wayfinding',
    caption: 'Frosted glass privacy band with precision-cut pinstripes and room numbering (Suite 9.7)',
    category: 'fitouts',
    categories: ['fitouts'],
    tag: 'Office Fit-out',
    location: 'Wellington CBD',
  },
  'feature-wall': {
    id: 'feature-wall',
    src: '/assets/img/feature-wall.webp',
    srcSm: '/assets/img/feature-wall-sm.webp',
    width: 1600,
    height: 1928,
    alt: 'Halo-lit acoustic moss feature wall framed in timber inside an office breakout lounge',
    title: 'LED Halo-Lit Acoustic Moss Feature Wall',
    caption: 'Custom-framed acoustic moss wall with warm perimeter LED halo lighting for a staff breakout lounge',
    category: 'signage',
    categories: ['fitouts', 'signage'],
    tag: 'LED & Fit-out',
    location: 'Wellington CBD',
  },
  'ute-window-decal': {
    id: 'ute-window-decal',
    src: '/assets/img/ute-window-decal.webp',
    srcSm: '/assets/img/ute-window-decal-sm.webp',
    width: 1170,
    height: 1061,
    alt: 'GSR Electrical Industrial rear window decal installed on a commercial work ute',
    title: 'Commercial Trade Ute Branding',
    caption: 'High-contrast rear window decal for GSR Electrical Industrial work ute',
    category: 'vehicles',
    categories: ['vehicles'],
    tag: 'Vehicle Signage',
    location: 'Lower Hutt',
  },
  'corridor-signage': {
    id: 'corridor-signage',
    src: '/assets/img/corridor-signage.webp',
    srcSm: '/assets/img/corridor-signage-sm.webp',
    width: 1600,
    height: 1706,
    alt: 'Standoff-mounted acrylic display panels installed along a dark corporate corridor',
    title: 'Standoff Acrylic Corridor Signage',
    caption: 'Clear acrylic display frames mounted on stainless steel standoffs along an executive hallway',
    category: 'signage',
    categories: ['fitouts', 'signage'],
    tag: 'Interior Signage',
    location: 'Wellington CBD',
  },
  'frosting-door': {
    id: 'frosting-door',
    src: '/assets/img/frosting-door.webp',
    srcSm: '/assets/img/frosting-door-sm.webp',
    width: 1600,
    height: 1842,
    alt: 'Timber-framed office door and sidelight glass with frosted privacy film and room 11.05 decal',
    title: 'Meeting Room Door Frosting & Numbering',
    caption: 'Full-width etched glass film and cut-vinyl room numbering (Room 11.05)',
    category: 'fitouts',
    categories: ['fitouts'],
    tag: 'Window Frosting',
    location: 'Wellington CBD',
  },
  'frosting-meeting-room': {
    id: 'frosting-meeting-room',
    src: '/assets/img/frosting-meeting-room.webp',
    srcSm: '/assets/img/frosting-meeting-room-sm.webp',
    width: 1600,
    height: 1669,
    alt: 'Corner glass boardroom with frosted privacy film and room 11.01 numbering',
    title: 'Boardroom Glass Privacy Film',
    caption: 'Multi-panel boardroom privacy frosting with clean silicon-joint alignment (Room 11.01)',
    category: 'fitouts',
    categories: ['fitouts'],
    tag: 'Office Fit-out',
    location: 'Wellington CBD',
  },
  'frosting-open-plan': {
    id: 'frosting-open-plan',
    src: '/assets/img/frosting-open-plan.webp',
    srcSm: '/assets/img/frosting-open-plan-sm.webp',
    width: 1600,
    height: 772,
    alt: 'Full-height frosted glass partition walls and numbered storage lockers in an open-plan office',
    title: 'Full-Height Partition Frosting & Locker Graphics',
    caption: 'Floor-to-ceiling privacy frosting across angled partition walls with matching zone numbering',
    category: 'fitouts',
    categories: ['fitouts'],
    tag: 'Privacy Film',
    location: 'Wellington CBD',
  },
};

export const GALLERY_ORDER = [
  'wagon-wrap',
  'frosting-office',
  'feature-wall',
  'ute-window-decal',
  'corridor-signage',
  'frosting-door',
  'frosting-meeting-room',
  'frosting-open-plan',
] as const;

export interface ServiceItem {
  id: string;
  number: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  bullets: string[];
  photoId: string | null;
  specs: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'vehicle-wraps',
    number: '01',
    name: 'Vehicle Wraps',
    shortDesc: 'Full and partial wraps that turn cars, utes, and vans into high-impact mobile advertising.',
    longDesc:
      'A vehicle wrap is the hardest-working sign your business can own—seen in traffic, on job sites, and parked outside clients’ premises every day. We design specifically around the body lines of your vehicle so every angle reads cleanly, then print and install using cast automotive vinyl with tight, tucked edges that stay down.',
    bullets: [
      'Full & partial commercial wraps',
      'Matte, satin & gloss colour-change wraps',
      'Custom layout tailored to your vehicle model',
      'Paint protection & clean removal at end of lease',
    ],
    photoId: 'wagon-wrap',
    specs: 'Cast automotive-grade vinyl · UV laminated',
  },
  {
    id: 'vehicle-signage',
    number: '02',
    name: 'Commercial Vehicle Signage',
    shortDesc: 'Sharp door logos, contact details, and window graphics for single tradie utes through to entire fleets.',
    longDesc:
      'Good trade signage tells people who you are, what you do, and how to call you before the traffic lights change. We keep layouts bold, legible from across the street, and templated accurately so your first ute and your tenth van match seamlessly.',
    bullets: [
      'Cut-vinyl door logos & contact details',
      'Rear & side window decals (including one-way vision)',
      'Consistent multi-vehicle fleet branding',
      'Cars, utes, vans, trucks & trailers',
    ],
    photoId: 'ute-window-decal',
    specs: 'High-tack fleet vinyl · Weather & wash resistant',
  },
  {
    id: 'office-fitouts',
    number: '03',
    name: 'Office Fit-outs & Window Frosting',
    shortDesc: 'Architectural frosted glass, privacy bands, room numbering, acrylic displays, and custom feature walls.',
    longDesc:
      'We help commercial interiors feel cohesive and complete. Whether you are moving into a new floor or refreshing an existing workspace, we supply and install optically clean glass frosting, building-code safety manifestations, wayfinding numbers, and standout reception pieces.',
    bullets: [
      'Etched & frosted glass privacy film',
      'Safety manifestations & pinstripe detailing',
      'Room numbering, zone labels & wayfinding',
      'Standoff acrylic signs & acoustic feature walls',
    ],
    photoId: 'frosting-office',
    specs: 'Architectural polymeric etch film · Bubble-free wet/dry install',
  },
  {
    id: 'external-signage',
    number: '04',
    name: 'External Signage',
    shortDesc: 'Durable building facades, shopfront signs, and site boards engineered to handle Wellington wind and rain.',
    longDesc:
      'Outdoor signage in Wellington has to look sharp from the street and stand up to harsh coastal wind, salt, and UV. We fabricate and mount rigid ACM panels, shopfront fascias, directional boards, and exterior window graphics built for long-term durability.',
    bullets: [
      'Building facade & shopfront fascia signs',
      'Commercial site, parking & directional signage',
      'Exterior window & entrance door graphics',
      'Weather-rated ACM, aluminium & UV-stable inks',
    ],
    photoId: null,
    specs: 'ACM composite & marine-grade fixings · UV-cured print',
  },
  {
    id: '3d-lettering',
    number: '05',
    name: '3D Lettering & Reception Logos',
    shortDesc: 'Precision-cut raised lettering and dimensional logos for reception walls, entrances, and building exteriors.',
    longDesc:
      'Dimensional lettering gives your brand immediate physical presence and shadow depth. Ideal for client-facing reception lobbies, boardrooms, and building entrances, each letter is router- or laser-cut and installed with a precision alignment template.',
    bullets: [
      'Reception & lobby statement logos',
      'Flush-mounted or pin-mounted standoff lettering',
      'Acrylic, ACM, brushed metal & painted finishes',
      'Pairs seamlessly with halo LED backlighting',
    ],
    photoId: null,
    specs: 'CNC / laser-cut acrylic & composite · Template-aligned install',
  },
  {
    id: 'led-fixtures',
    number: '06',
    name: 'LED Light Fixtures & Illuminated Signs',
    shortDesc: 'Halo-lit signage, backlit logos, and custom illuminated feature pieces that stand out day and night.',
    longDesc:
      'Thoughtful illumination turns signage or architectural panelling into a focal point. We build halo-lit reception signs, backlit frames, and custom LED-integrated feature walls for indoor commercial spaces and exterior shopfronts.',
    bullets: [
      'Halo-lit & backlit dimensional signage',
      'LED-integrated feature walls & framing',
      'Warm, neutral, or cool commercial colour temperatures',
      'Low-voltage, energy-efficient LED drivers',
    ],
    photoId: 'feature-wall',
    specs: 'Commercial-grade 12V/24V LED systems · Concealed wiring',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Talk It Through',
    description:
      'Give Ryan a call or send through a quote request with a few photos and rough measurements. We can also visit your site or measure your vehicle in person.',
  },
  {
    step: '02',
    title: 'Design & Fixed Quote',
    description:
      'We put together visual proofs and a clear, itemised price. You deal directly with the person doing the work—nothing goes to production until you sign it off.',
  },
  {
    step: '03',
    title: 'In-House Production',
    description:
      'Once approved, we print, cut, laminate, and fabricate your graphics using trusted commercial-grade films, substrates, and hardware.',
  },
  {
    step: '04',
    title: 'Clean Installation',
    description:
      'We prep the surfaces properly, install on schedule, tidy up completely after ourselves, and walk you through the finished job.',
  },
];

export const VALUES = [
  {
    title: 'Direct Owner Communication',
    description: 'You deal directly with Ryan from the initial measure and proof through to the final squeegee pass—nothing gets lost between sales and install.',
  },
  {
    title: 'One Crew, Cohesive Brand',
    description: 'Because we handle vehicles, exterior signs, and interior fit-outs in-house, your ute, your building, and your reception all match.',
  },
  {
    title: 'Meticulous Prep & Materials',
    description: 'Long-lasting vinyl and signage comes down to surface preparation, proper post-heating, and using film rated for New Zealand conditions.',
  },
  {
    title: 'Straightforward Pricing',
    description: 'Free, no-obligation quotes with honest advice on where to spend for maximum impact and where you can keep things simple.',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

export const FAQS: FaqItem[] = [
  {
    tag: 'DOWNTIME',
    question: 'How long will my work ute or van be off the road?',
    answer:
      'Cut-vinyl door logos and rear window decals are typically completed in 3 to 5 hours (same-day turnaround). Partial livery wraps take 1 to 2 days, and full colour-change or commercial wraps take 2 to 4 days so the film can be properly post-heated and cured.',
  },
  {
    tag: 'PAINT & LEASES',
    question: 'Will a vinyl wrap damage factory paint when removed at the end of a lease?',
    answer:
      'No—in fact, it does the opposite. Cast automotive wrap film acts as a sacrificial shield against stone chips, UV fading, and light brush scratches. When heated and peeled off at the end of your lease, the factory paint underneath is preserved in day-one condition.',
  },
  {
    tag: 'DESIGN & LOGOS',
    question: 'Do I need print-ready artwork, or can you design it from scratch?',
    answer:
      'We handle the design in-house. If you already have brand guidelines and vector files (.AI, .EPS, or .PDF), we will work directly from them. If you only have a rough sketch or an old photo of your logo, Ryan can redraw it cleanly and lay out full vehicle or office proofs for your approval.',
  },
  {
    tag: 'OFFICE HOURS',
    question: 'Can you install office window frosting without disrupting our team?',
    answer:
      'Yes. Our wet and dry film application is clean, quiet, and odour-free. For busy boardrooms or open-plan floors in the Wellington CBD, we can also schedule installation early in the morning or outside normal office hours.',
  },
  {
    tag: 'DURABILITY',
    question: 'How well do your wraps and exterior signs hold up to Wellington weather?',
    answer:
      'We only use commercial-grade polymeric and cast films paired with UV-cured inks, optical overlaminates, and marine-grade ACM panels. With basic washing and care, vehicle graphics and exterior signage stay sharp for 5 to 7+ years in New Zealand coastal wind and sun.',
  },
  {
    tag: 'FLEET MATCHING',
    question: 'What if I add another vehicle to my fleet next year?',
    answer:
      'We keep every client’s cut files, colour profiles, and vehicle measurements on file. When you buy a new ute or van down the track, we can reproduce the exact branding package so your whole fleet matches.',
  },
];


