// 397 Graphix — Studio Interactive Script

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

// Helper: Convert #RRGGBB to {r, g, b}
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: Cleanly toggle .is-active within a group of buttons
function setActiveInGroup(buttons, activeBtn) {
  buttons.forEach((b) => b.classList.toggle('is-active', b === activeBtn));
}

// Update copyright year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Hide placeholder links until real URLs are added (Google Review & Stripe Payment Link)
$$('[data-needs-link]').forEach((el) => {
  const href = el.getAttribute('href') || '';
  if (href.includes('REPLACE_ME')) {
    el.hidden = true;
    el.style.display = 'none';
    $$('[data-needs-link-text]').forEach((t) => t.remove());
  }
});

// Dynamic Cursor Spotlight on Material Cards
$$('.material-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// =========================================================================
// 1. HERO INTERACTIVE SQUEEGEE / MATERIAL LAB
// =========================================================================
const labStage = $('#lab-stage');
const labRange = $('#lab-range');
const labCaption = $('#lab-caption');
const labTabs = $$('.lab-tab');
const labPanels = $$('[data-lab-panel]');

const LAB_CAPTIONS = {
  frost: '// Drag the slider to test architectural privacy film',
  wrap: '// Drag slider to compare raw vehicle vs two-tone cast vinyl wrap',
  led: '// Drag slider to test perimeter LED halo illumination',
};

if (labStage && labRange) {
  const labDivider = $('#lab-divider');
  const labClipLayers = $$('.lab-clip-layer', labStage);
  const updateSplit = () => {
    const pct = `${labRange.value}%`;
    labStage.style.setProperty('--split', pct);
    if (labDivider) labDivider.style.left = pct;
    labClipLayers.forEach((layer) => {
      layer.style.clipPath = `inset(0 calc(100% - ${pct}) 0 0)`;
    });
  };
  labRange.addEventListener('input', updateSplit);
  updateSplit();

  labTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.labMode;
      setActiveInGroup(labTabs, tab);
      labPanels.forEach((p) => {
        p.hidden = p.dataset.labPanel !== mode;
      });
      if (labCaption && LAB_CAPTIONS[mode]) {
        labCaption.textContent = LAB_CAPTIONS[mode];
      }
    });
  });
}

// =========================================================================
// 2. INTERACTIVE VEHICLE & OFFICE GLASS CONFIGURATOR
// =========================================================================
const cfgModeBtns = $$('.cfg-mode-btn');
const cfgPanelVehicle = $('#cfg-panel-vehicle');
const cfgPanelGlass = $('#cfg-panel-glass');

if (cfgModeBtns.length && cfgPanelVehicle && cfgPanelGlass) {
  cfgModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isVehicle = btn.dataset.cfgMode === 'vehicle';
      setActiveInGroup(cfgModeBtns, btn);
      cfgPanelVehicle.hidden = !isVehicle;
      cfgPanelGlass.hidden = isVehicle;
    });
  });

  // Interactive Vehicle Wrap & Livery Designer State
  const DEFAULT_POSITIONS = {
    ute: {
      brand: { x: 48, y: 55 },
      contact: { x: 79, y: 47 },
      logo: { x: 38, y: 53 },
    },
    van: {
      brand: { x: 64, y: 37 },
      contact: { x: 35, y: 57 },
      logo: { x: 52, y: 37 },
    },
    wagon: {
      brand: { x: 47, y: 54 },
      contact: { x: 74, y: 35 },
      logo: { x: 36, y: 53 },
    },
  };

  const ZONE_LABELS = {
    brand: 'Door Title',
    sub: 'Door Tagline',
    phone: 'Rear Phone',
    web: 'Website Decal',
    all: 'All Text Areas',
  };

  let vState = {
    body: 'ute',
    pattern: 'diagonal',
    splitPos: 48,
    stripesOn: true,
    finish: 'Gloss',
    colorHex: '#E11D48',
    colorName: 'Motorsport Crimson',
    stripeHex: '#FFFFFF',
    basePaintHex: '#3B4252',
    brandText: '397 GRAPHIX',
    subText: 'WRAPS · SIGNAGE · WLG',
    phoneText: '022 500 3904',
    webText: '397GRAPHIX.CO.NZ',
    selectedZone: 'brand',
    zoneStyles: {
      brand: { font: 'wide', color: '#FFFFFF', scale: 100 },
      sub: { font: 'mono', color: '#FFFFFF', scale: 100 },
      phone: { font: 'wide', color: '#FFFFFF', scale: 100 },
      web: { font: 'mono', color: '#FFFFFF', scale: 100 },
    },
    logoDataUrl: '',
    logoScale: 100,
    positions: JSON.parse(JSON.stringify(DEFAULT_POSITIONS.ute)),
  };

  const DECAL_FONTS = {
    wide: {
      label: 'Wide Block',
      family: '"Archivo", sans-serif',
      variation: '"wdth" 120, "wght" 900',
      style: 'normal',
      spacing: '0.04em',
      canvasFont: (px) => `900 ${px}px Archivo, sans-serif`,
    },
    italic: {
      label: 'Speed Italic',
      family: '"Archivo", sans-serif',
      variation: '"wdth" 115, "wght" 900',
      style: 'italic',
      spacing: '0.03em',
      canvasFont: (px) => `italic 900 ${px}px Archivo, sans-serif`,
    },
    condensed: {
      label: 'Tall Trade',
      family: '"Archivo", sans-serif',
      variation: '"wdth" 68, "wght" 900',
      style: 'normal',
      spacing: '0.06em',
      canvasFont: (px) => `900 ${px}px Impact, "Arial Narrow", Archivo, sans-serif`,
    },
    clean: {
      label: 'Clean Sans',
      family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      variation: 'normal',
      style: 'normal',
      spacing: '0.05em',
      canvasFont: (px) => `800 ${px}px "Segoe UI", Roboto, sans-serif`,
    },
    serif: {
      label: 'Classic Serif',
      family: 'Georgia, "Times New Roman", serif',
      variation: 'normal',
      style: 'normal',
      spacing: '0.06em',
      canvasFont: (px) => `700 ${px}px Georgia, "Times New Roman", serif`,
    },
    mono: {
      label: 'Tech Mono',
      family: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      variation: 'normal',
      style: 'normal',
      spacing: '0.08em',
      canvasFont: (px) => `800 ${px}px Consolas, "Courier New", monospace`,
    },
  };

  const BODY_META = {
    ute: {
      label: 'Dual-Cab Ute',
      lengthText: '5370 MM · DUAL-CAB 4X4 UTE',
      baseSrc: '/assets/img/vehicles/ute-base.webp',
      maskSrc: '/assets/img/vehicles/ute-mask.webp',
      maskUrl: "url('/assets/img/vehicles/ute-mask.webp')",
    },
    van: {
      label: 'Commercial Trade Van',
      lengthText: '5540 MM · LWB CARGO VAN',
      baseSrc: '/assets/img/vehicles/van-base.webp',
      maskSrc: '/assets/img/vehicles/van-mask.webp',
      maskUrl: "url('/assets/img/vehicles/van-mask.webp')",
    },
    wagon: {
      label: 'Sport Wagon',
      lengthText: '4860 MM · EURO SPORT WAGON',
      baseSrc: '/assets/img/vehicles/wagon-base.webp',
      maskSrc: '/assets/img/vehicles/wagon-mask.webp',
      maskUrl: "url('/assets/img/vehicles/wagon-mask.webp')",
    },
  };

  const PATTERN_META = {
    diagonal: {
      name: '397 Diagonal Split Wrap',
      short: '397 DIAGONAL SPLIT',
      desc: 'Two-tone diagonal cast wrap + twin race stripes + custom die-cut branding',
      service: 'vehicle-wraps',
    },
    swept: {
      name: 'Swept Speed Livery Wrap',
      short: 'SWEPT SPEED CUT',
      desc: 'Aggressive forward-swept partial livery wrap + speed stripes + door signwriting',
      service: 'vehicle-wraps',
    },
    horizon: {
      name: 'Lower Rocker Two-Tone Wrap',
      short: 'LOWER ROCKER SPLIT',
      desc: 'Horizontal lower-body wrap split along the body line + contrasting pinstripe',
      service: 'vehicle-wraps',
    },
    rearblock: {
      name: 'Rear Quarter / Cargo Wrap',
      short: 'REAR CARGO BLOCK',
      desc: 'High-impact rear tray/cargo block wrap + vertical fleet stripe + door branding',
      service: 'vehicle-wraps',
    },
    full: {
      name: 'Full 100% Colour Wrap',
      short: 'FULL 100% WRAP',
      desc: '100% bumper-to-bumper cast vinyl transformation + full paint protection + branding',
      service: 'vehicle-wraps',
    },
    signwriting: {
      name: 'Signwriting & Decal Pack',
      short: 'SIGNWRITING ONLY',
      desc: 'Die-cut vinyl door logos + rear contact decals + pinstripe accents over factory paint',
      service: 'vehicle-signage',
    },
  };

  const FINISH_FILTERS = {
    Gloss: 'contrast(1.06) brightness(1.03)',
    Satin: 'contrast(1.0) brightness(0.97)',
    Matte: 'contrast(0.92) brightness(0.92) saturate(0.90)',
  };

  const getLiveryPolygons = (pattern, split, stripesOn) => {
    const s = Number(split) || 48;
    if (pattern === 'diagonal') {
      return {
        primary: [[s, 0], [100, 0], [100, 100], [s - 14, 100]],
        stripe1: stripesOn ? [[s - 3.6, 0], [s - 1.3, 0], [s - 15.3, 100], [s - 17.6, 100]] : [],
        stripe2: stripesOn ? [[s - 5.9, 0], [s - 4.7, 0], [s - 18.7, 100], [s - 19.9, 100]] : [],
        stripe1Color: vState.stripeHex,
        stripe2Color: vState.colorHex,
      };
    }
    if (pattern === 'swept') {
      return {
        primary: [[s + 10, 0], [100, 0], [100, 100], [s - 22, 100]],
        stripe1: stripesOn ? [[s + 4.5, 0], [s + 8.0, 0], [s - 24.0, 100], [s - 27.5, 100]] : [],
        stripe2: stripesOn ? [[s + 1.5, 0], [s + 3.0, 0], [s - 29.0, 100], [s - 30.5, 100]] : [],
        stripe1Color: vState.stripeHex,
        stripe2Color: vState.colorHex,
      };
    }
    if (pattern === 'horizon') {
      const yCut = 30 + s * 0.45;
      return {
        primary: [[0, yCut], [100, yCut - 4], [100, 100], [0, 100]],
        stripe1: stripesOn ? [[0, yCut - 3.2], [100, yCut - 7.2], [100, yCut - 5.2], [0, yCut - 1.2]] : [],
        stripe2: stripesOn ? [[0, yCut - 5.2], [100, yCut - 9.2], [100, yCut - 8.0], [0, yCut - 4.0]] : [],
        stripe1Color: vState.stripeHex,
        stripe2Color: vState.colorHex,
      };
    }
    if (pattern === 'rearblock') {
      return {
        primary: [[s + 12, 0], [100, 0], [100, 100], [s + 8, 100]],
        stripe1: stripesOn ? [[s + 8.5, 0], [s + 10.8, 0], [s + 6.8, 100], [s + 4.5, 100]] : [],
        stripe2: stripesOn ? [[s + 6.2, 0], [s + 7.4, 0], [s + 3.4, 100], [s + 2.2, 100]] : [],
        stripe1Color: vState.stripeHex,
        stripe2Color: vState.colorHex,
      };
    }
    if (pattern === 'full') {
      return {
        primary: [[0, 0], [100, 0], [100, 100], [0, 100]],
        stripe1: stripesOn ? [[s - 3.6, 0], [s - 1.0, 0], [s - 15.0, 100], [s - 17.6, 100]] : [],
        stripe2: stripesOn ? [[s - 6.2, 0], [s - 4.8, 0], [s - 18.8, 100], [s - 20.2, 100]] : [],
        stripe1Color: vState.stripeHex,
        stripe2Color: vState.stripeHex,
      };
    }
    // signwriting only
    return {
      primary: [],
      stripe1: stripesOn ? [[0, 58.5], [100, 55.5], [100, 57.0], [0, 60.0]] : [],
      stripe2: stripesOn ? [[0, 61.0], [100, 58.0], [100, 59.0], [0, 62.0]] : [],
      stripe1Color: vState.colorHex,
      stripe2Color: vState.stripeHex,
    };
  };

  const toClipPath = (pts) => {
    if (!pts || !pts.length) return 'polygon(0% 0%, 0% 0%, 0% 0%)';
    return `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`;
  };

  const vCanvas = $('#vehicle-canvas');
  const vStudioBase = $('#v-studio-base');
  const vWrapPrimary = $('#v-wrap-primary-layer');
  const vWrapStripe1 = $('#v-wrap-stripe-1');
  const vWrapStripe2 = $('#v-wrap-stripe-2');

  const vDragLogo = $('#v-drag-logo');
  const vLogoImg = $('#v-uploaded-logo-img');
  const vDragBrand = $('#v-drag-brand');
  const vDragContact = $('#v-drag-contact');

  const vDecalBrandText = $('#v-decal-brand-text');
  const vDecalSubText = $('#v-decal-sub-text');
  const vDecalPhoneText = $('#v-decal-phone-text');
  const vDecalWebText = $('#v-decal-web-text');

  const vSvgLength = $('#v-svg-length');
  const vTitle = $('#v-blueprint-title');
  const vDesc = $('#v-blueprint-desc');
  const vColorReadout = $('#v-color-readout');
  const vQuoteLink = $('#v-quote-link');
  const vSplitSlider = $('#v-split-slider');
  const vSplitReadout = $('#v-split-readout');

  const buildSpecSummary = () => {
    const bodyInfo = BODY_META[vState.body] || BODY_META.ute;
    const patInfo = PATTERN_META[vState.pattern] || PATTERN_META.diagonal;
    return [
      `${bodyInfo.label}`,
      `${patInfo.name} (Cut: ${vState.splitPos}%, Stripes: ${vState.stripesOn ? 'Yes' : 'No'})`,
      `Primary Vinyl: ${vState.finish} ${vState.colorName} (${vState.colorHex})`,
      `Stripe Colour: ${vState.stripeHex} | Base Paint: ${vState.basePaintHex}`,
      `Door Decal: "${vState.brandText}" / "${vState.subText}"`,
      `Rear Contact: "${vState.phoneText}" / "${vState.webText}"`,
      vState.logoDataUrl ? 'Custom Logo Uploaded: Yes' : '',
    ]
      .filter(Boolean)
      .join(' · ');
  };

  const renderVehicle = () => {
    const bodyInfo = BODY_META[vState.body] || BODY_META.ute;
    const patInfo = PATTERN_META[vState.pattern] || PATTERN_META.diagonal;
    const polys = getLiveryPolygons(vState.pattern, vState.splitPos, vState.stripesOn);

    if (vCanvas) {
      vCanvas.style.setProperty('--wrap-color', vState.colorHex);
      vCanvas.style.setProperty('--stripe-color', vState.stripeHex);
      vCanvas.style.setProperty('--base-paint', vState.basePaintHex);
      vCanvas.style.setProperty('--mask-url', bodyInfo.maskUrl);
    }

    const vPaintMask = $('#v-paint-mask');
    if (vPaintMask) {
      vPaintMask.style.webkitMaskImage = bodyInfo.maskUrl;
      vPaintMask.style.maskImage = bodyInfo.maskUrl;
      vPaintMask.style.webkitMaskSize = '100% 100%';
      vPaintMask.style.maskSize = '100% 100%';
      vPaintMask.style.webkitMaskRepeat = 'no-repeat';
      vPaintMask.style.maskRepeat = 'no-repeat';
      vPaintMask.style.mixBlendMode = 'multiply';
    }

    const vBasePaintLayer = $('#v-base-paint-layer');
    if (vBasePaintLayer) {
      vBasePaintLayer.style.backgroundColor = vState.basePaintHex;
    }

    if (vStudioBase) {
      if (vStudioBase.getAttribute('src') !== bodyInfo.baseSrc) {
        vStudioBase.setAttribute('src', bodyInfo.baseSrc);
      }
      vStudioBase.style.filter = FINISH_FILTERS[vState.finish] || FINISH_FILTERS.Gloss;
    }

    if (vWrapPrimary) {
      vWrapPrimary.style.clipPath = toClipPath(polys.primary);
      vWrapPrimary.style.backgroundColor = vState.colorHex;
    }
    if (vWrapStripe1) {
      vWrapStripe1.style.clipPath = toClipPath(polys.stripe1);
      vWrapStripe1.style.backgroundColor = polys.stripe1Color;
    }
    if (vWrapStripe2) {
      vWrapStripe2.style.clipPath = toClipPath(polys.stripe2);
      vWrapStripe2.style.backgroundColor = polys.stripe2Color;
    }

    const lScale = (vState.logoScale / 100).toFixed(2);

    if (vDragBrand) {
      vDragBrand.style.left = `${vState.positions.brand.x}%`;
      vDragBrand.style.top = `${vState.positions.brand.y}%`;
      vDragBrand.style.transform = 'translate(-50%, -50%)';
    }
    if (vDragContact) {
      vDragContact.style.left = `${vState.positions.contact.x}%`;
      vDragContact.style.top = `${vState.positions.contact.y}%`;
      vDragContact.style.transform = 'translate(-50%, -50%)';
    }
    if (vDragLogo) {
      vDragLogo.hidden = !vState.logoDataUrl;
      vDragLogo.style.left = `${vState.positions.logo.x}%`;
      vDragLogo.style.top = `${vState.positions.logo.y}%`;
      vDragLogo.style.transform = `translate(-50%, -50%) scale(${lScale})`;
    }

    const applyZoneStyleToEl = (el, textVal, zoneKey) => {
      if (!el) return;
      const zs = vState.zoneStyles[zoneKey] || vState.zoneStyles.brand;
      const fm = DECAL_FONTS[zs.font] || DECAL_FONTS.wide;
      const sc = (zs.scale / 100).toFixed(2);
      el.textContent = textVal;
      el.style.color = zs.color;
      el.style.fontFamily = fm.family;
      el.style.fontVariationSettings = fm.variation;
      el.style.fontStyle = fm.style;
      el.style.letterSpacing = fm.spacing;
      el.style.display = 'inline-block';
      el.style.transform = `scale(${sc})`;
      el.style.transformOrigin = 'left center';

      const isSelected = vState.selectedZone === zoneKey || vState.selectedZone === 'all';
      el.classList.toggle('ring-1', isSelected);
      el.classList.toggle('ring-volt/85', isSelected);
      el.classList.toggle('bg-obsidian/45', isSelected);
    };

    applyZoneStyleToEl(vDecalBrandText, vState.brandText, 'brand');
    applyZoneStyleToEl(vDecalSubText, vState.subText, 'sub');
    applyZoneStyleToEl(vDecalPhoneText, vState.phoneText, 'phone');
    applyZoneStyleToEl(vDecalWebText, vState.webText, 'web');

    if (vSplitReadout) {
      vSplitReadout.textContent = `${vState.splitPos}% SPLIT POSITION`;
    }
    if (vSvgLength) vSvgLength.textContent = bodyInfo.lengthText;
    if (vColorReadout) {
      vColorReadout.textContent = `${vState.finish.toUpperCase()} ${vState.colorName.toUpperCase()}`;
    }
    if (vTitle) {
      vTitle.textContent = `// ${bodyInfo.label.toUpperCase()} · ${patInfo.short} · ${vState.finish.toUpperCase()} ${vState.colorName.toUpperCase()}`;
    }
    if (vDesc) vDesc.textContent = patInfo.desc;

    if (vQuoteLink) {
      const specSummary = buildSpecSummary();
      vQuoteLink.href = `/contact?service=${encodeURIComponent(patInfo.service)}&tier=${encodeURIComponent(specSummary)}#quote`;
    }
  };

  // Studio Control Deck Tabs (1. Livery Style, 2. Colours, 3. Text & Logo)
  const vTabBtns = $$('.v-tab-btn');
  const vTabPanels = {
    livery: $('#v-tab-panel-livery'),
    colours: $('#v-tab-panel-colours'),
    graphics: $('#v-tab-panel-graphics'),
  };
  vTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.vTab;
      setActiveInGroup(vTabBtns, btn);
      Object.entries(vTabPanels).forEach(([key, panel]) => {
        if (panel) panel.hidden = key !== target;
      });
    });
  });

  // Vehicle Body Selector
  const vBodyBtns = $$('.v-body-btn');
  vBodyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      vState.body = btn.dataset.vBody;
      vState.positions = JSON.parse(JSON.stringify(DEFAULT_POSITIONS[vState.body] || DEFAULT_POSITIONS.ute));
      setActiveInGroup(vBodyBtns, btn);
      renderVehicle();
    });
  });

  // Reset Positions Button
  const vResetPosBtn = $('#v-reset-pos-btn');
  if (vResetPosBtn) {
    vResetPosBtn.addEventListener('click', () => {
      vState.positions = JSON.parse(JSON.stringify(DEFAULT_POSITIONS[vState.body] || DEFAULT_POSITIONS.ute));
      renderVehicle();
    });
  }

  // Livery Pattern Buttons
  const vPatternBtns = $$('.v-pattern-btn');
  vPatternBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      vState.pattern = btn.dataset.vPattern;
      setActiveInGroup(vPatternBtns, btn);
      renderVehicle();
    });
  });

  // Wrap Split Slider
  if (vSplitSlider) {
    vSplitSlider.addEventListener('input', () => {
      vState.splitPos = Number(vSplitSlider.value);
      renderVehicle();
    });
  }

  // Stripes On/Off Buttons
  const vStripesBtns = $$('.v-stripes-btn');
  vStripesBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      vState.stripesOn = btn.dataset.vStripes === 'on';
      setActiveInGroup(vStripesBtns, btn);
      renderVehicle();
    });
  });

  // Primary Wrap Colour Swatches & Custom Colour Picker
  const vSwatches = $$('.v-color-swatch');
  const vCustomColor = $('#v-custom-color');
  vSwatches.forEach((sw) => {
    sw.addEventListener('click', () => {
      vState.colorHex = sw.dataset.vColor;
      vState.colorName = sw.dataset.vColorName || sw.dataset.vColor;
      if (vCustomColor) vCustomColor.value = vState.colorHex;
      vSwatches.forEach((s) => {
        const on = s === sw;
        s.classList.toggle('border-2', on);
        s.classList.toggle('border-white', on);
        s.classList.toggle('scale-110', on);
        s.classList.toggle('border-white/40', !on);
      });
      renderVehicle();
    });
  });

  if (vCustomColor) {
    vCustomColor.addEventListener('input', () => {
      vState.colorHex = vCustomColor.value.toUpperCase();
      vState.colorName = `Custom (${vState.colorHex})`;
      vSwatches.forEach((s) => {
        s.classList.remove('border-2', 'border-white', 'scale-110');
        s.classList.add('border-white/40');
      });
      renderVehicle();
    });
  }

  // Film Finish Buttons
  const vFinishBtns = $$('.v-finish-btn');
  vFinishBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      vState.finish = btn.dataset.vFinish;
      setActiveInGroup(vFinishBtns, btn);
      renderVehicle();
    });
  });

  // Accent Stripe Colour Swatches & Custom Picker
  const vStripeSwatches = $$('.v-stripe-swatch');
  const vCustomStripeColor = $('#v-custom-stripe-color');
  vStripeSwatches.forEach((sw) => {
    sw.addEventListener('click', () => {
      vState.stripeHex = sw.dataset.vStripeColor;
      if (vCustomStripeColor) vCustomStripeColor.value = vState.stripeHex;
      vStripeSwatches.forEach((s) => {
        const on = s === sw;
        s.classList.toggle('border-2', on);
        s.classList.toggle('border-volt', on);
        s.classList.toggle('border-white/40', !on);
      });
      renderVehicle();
    });
  });

  if (vCustomStripeColor) {
    vCustomStripeColor.addEventListener('input', () => {
      vState.stripeHex = vCustomStripeColor.value.toUpperCase();
      vStripeSwatches.forEach((s) => {
        s.classList.remove('border-2', 'border-volt');
        s.classList.add('border-white/40');
      });
      renderVehicle();
    });
  }

  // Base Vehicle Paint Buttons & Custom Paint Picker
  const vBaseSwatches = $$('.v-base-swatch');
  const vCustomBasePaint = $('#v-custom-base-paint');
  vBaseSwatches.forEach((btn) => {
    btn.addEventListener('click', () => {
      vState.basePaintHex = btn.dataset.vBasePaint;
      if (vCustomBasePaint) vCustomBasePaint.value = vState.basePaintHex;
      setActiveInGroup(vBaseSwatches, btn);
      renderVehicle();
    });
  });

  if (vCustomBasePaint) {
    vCustomBasePaint.addEventListener('input', () => {
      vState.basePaintHex = vCustomBasePaint.value.toUpperCase();
      vBaseSwatches.forEach((b) => b.classList.remove('is-active'));
      renderVehicle();
    });
  }

  // Per-Zone Text Selection & Independent Style Controls
  const vZoneBtns = $$('.v-zone-btn');
  const vActiveZoneLabel = $('#v-active-zone-label');
  const vFontBtns = $$('.v-font-btn');
  const vTextSwatches = $$('.v-text-swatch');
  const vCustomTextColor = $('#v-custom-text-color');
  const vTextScale = $('#v-text-scale');

  const getTargetZones = () =>
    vState.selectedZone === 'all' ? ['brand', 'sub', 'phone', 'web'] : [vState.selectedZone];

  const syncZoneControlsUI = () => {
    const activeKey = vState.selectedZone === 'all' ? 'brand' : vState.selectedZone;
    const zs = vState.zoneStyles[activeKey] || vState.zoneStyles.brand;

    if (vActiveZoneLabel) {
      vActiveZoneLabel.textContent = ZONE_LABELS[vState.selectedZone] || 'Door Title';
    }
    vZoneBtns.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.vZone === vState.selectedZone);
    });
    vFontBtns.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.vFont === zs.font);
    });
    if (vCustomTextColor) vCustomTextColor.value = zs.color;
    vTextSwatches.forEach((s) => {
      const on = (s.dataset.vTextColor || '').toUpperCase() === zs.color.toUpperCase();
      s.classList.toggle('border-2', on);
      s.classList.toggle('border-volt', on);
      s.classList.toggle('border-white/40', !on);
    });
    if (vTextScale) vTextScale.value = String(zs.scale);
  };

  const selectTextZone = (zoneKey, switchToGraphicsTab = false) => {
    if (!zoneKey) return;
    vState.selectedZone = zoneKey;
    if (switchToGraphicsTab) {
      const graphicsTabBtn = vTabBtns.find((b) => b.dataset.vTab === 'graphics');
      if (graphicsTabBtn) graphicsTabBtn.click();
    }
    syncZoneControlsUI();
    renderVehicle();
  };

  vZoneBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectTextZone(btn.dataset.vZone, false);
    });
  });

  // Clicking directly on any text line on the vehicle selects that specific text area
  $$('.v-selectable-text').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const zone = el.dataset.textZone;
      selectTextZone(zone, true);
    });
  });

  // Text Inputs (focusing an input also selects that zone automatically)
  const bindTextInput = (sel, key, zoneKey) => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener('focus', () => {
      selectTextZone(zoneKey, false);
    });
    el.addEventListener('input', () => {
      vState[key] = el.value.toUpperCase();
      renderVehicle();
    });
  };
  bindTextInput('#v-brand-input', 'brandText', 'brand');
  bindTextInput('#v-sub-input', 'subText', 'sub');
  bindTextInput('#v-phone-input', 'phoneText', 'phone');
  bindTextInput('#v-web-input', 'webText', 'web');

  vFontBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const font = btn.dataset.vFont;
      getTargetZones().forEach((zk) => {
        vState.zoneStyles[zk].font = font;
      });
      setActiveInGroup(vFontBtns, btn);
      renderVehicle();
    });
  });

  vTextSwatches.forEach((sw) => {
    sw.addEventListener('click', () => {
      const col = sw.dataset.vTextColor;
      getTargetZones().forEach((zk) => {
        vState.zoneStyles[zk].color = col;
      });
      if (vCustomTextColor) vCustomTextColor.value = col;
      vTextSwatches.forEach((s) => {
        const on = s === sw;
        s.classList.toggle('border-2', on);
        s.classList.toggle('border-volt', on);
        s.classList.toggle('border-white/40', !on);
      });
      renderVehicle();
    });
  });

  if (vCustomTextColor) {
    vCustomTextColor.addEventListener('input', () => {
      const col = vCustomTextColor.value.toUpperCase();
      getTargetZones().forEach((zk) => {
        vState.zoneStyles[zk].color = col;
      });
      vTextSwatches.forEach((s) => {
        s.classList.remove('border-2', 'border-volt');
        s.classList.add('border-white/40');
      });
      renderVehicle();
    });
  }

  if (vTextScale) {
    vTextScale.addEventListener('input', () => {
      const sc = Number(vTextScale.value);
      getTargetZones().forEach((zk) => {
        vState.zoneStyles[zk].scale = sc;
      });
      renderVehicle();
    });
  }

  // Custom Logo Upload & Scale
  const vLogoUpload = $('#v-logo-upload');
  const vLogoClearBtn = $('#v-logo-clear-btn');
  const vLogoScale = $('#v-logo-scale');

  if (vLogoUpload) {
    vLogoUpload.addEventListener('change', () => {
      const file = vLogoUpload.files && vLogoUpload.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        vState.logoDataUrl = String(reader.result || '');
        if (vLogoImg) vLogoImg.src = vState.logoDataUrl;
        if (vLogoClearBtn) vLogoClearBtn.hidden = false;
        renderVehicle();
      };
      reader.readAsDataURL(file);
    });
  }

  if (vLogoClearBtn) {
    vLogoClearBtn.addEventListener('click', () => {
      vState.logoDataUrl = '';
      if (vLogoImg) vLogoImg.src = '';
      if (vLogoUpload) vLogoUpload.value = '';
      vLogoClearBtn.hidden = true;
      renderVehicle();
    });
  }

  if (vLogoScale) {
    vLogoScale.addEventListener('input', () => {
      vState.logoScale = Number(vLogoScale.value);
      renderVehicle();
    });
  }

  // Interactive Pointer Drag-and-Drop on Vehicle Stage
  let activeDragKey = null;
  $$('.v-draggable').forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      activeDragKey = el.dataset.draggable;
      el.setPointerCapture(e.pointerId);
      el.classList.add('border-dashed', 'border-volt');
    });

    el.addEventListener('pointermove', (e) => {
      if (!activeDragKey || activeDragKey !== el.dataset.draggable || !vCanvas) return;
      const rect = vCanvas.getBoundingClientRect();
      const xPct = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(12, Math.min(82, ((e.clientY - rect.top) / rect.height) * 100));
      vState.positions[activeDragKey] = { x: Number(xPct.toFixed(1)), y: Number(yPct.toFixed(1)) };
      renderVehicle();
    });

    const endDrag = () => {
      activeDragKey = null;
      el.classList.remove('border-volt');
    };
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
  });

  // High-Resolution HTML5 Canvas Studio Proof Renderer (for PNG Download & Quote Form Attachment)
  const loadImg = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const drawPolygonPct = (ctx, pts, w, h, fill) => {
    if (!pts || !pts.length) return;
    ctx.save();
    ctx.beginPath();
    pts.forEach(([px, py], idx) => {
      const x = (px / 100) * w;
      const y = (py / 100) * h;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.restore();
  };

  const renderStudioProofDataUrl = async () => {
    const bodyInfo = BODY_META[vState.body] || BODY_META.ute;
    const patInfo = PATTERN_META[vState.pattern] || PATTERN_META.diagonal;
    const polys = getLiveryPolygons(vState.pattern, vState.splitPos, vState.stripesOn);

    const W = 1376;
    const H = 768;
    const FOOTER_H = 76;

    const [baseImg, maskImg] = await Promise.all([
      loadImg(bodyInfo.baseSrc),
      loadImg(bodyInfo.maskSrc),
    ]);

    // 1. Offscreen Masked Paint Canvas
    const paintCanvas = document.createElement('canvas');
    paintCanvas.width = W;
    paintCanvas.height = H;
    const pCtx = paintCanvas.getContext('2d');

    pCtx.fillStyle = vState.basePaintHex;
    pCtx.fillRect(0, 0, W, H);

    drawPolygonPct(pCtx, polys.primary, W, H, vState.colorHex);
    drawPolygonPct(pCtx, polys.stripe1, W, H, polys.stripe1Color);
    drawPolygonPct(pCtx, polys.stripe2, W, H, polys.stripe2Color);

    pCtx.globalCompositeOperation = 'destination-in';
    pCtx.drawImage(maskImg, 0, 0, W, H);

    // 2. Main Composite Proof Canvas
    const outCanvas = document.createElement('canvas');
    outCanvas.width = W;
    outCanvas.height = H + FOOTER_H;
    const ctx = outCanvas.getContext('2d');

    ctx.fillStyle = '#07080B';
    ctx.fillRect(0, 0, W, H + FOOTER_H);

    ctx.drawImage(baseImg, 0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(paintCanvas, 0, 0, W, H);
    ctx.restore();

    // 3. Draw Uploaded Logo if present
    if (vState.logoDataUrl) {
      try {
        const logoImg = await loadImg(vState.logoDataUrl);
        const lScale = vState.logoScale / 100;
        const maxH = 110 * lScale;
        const ratio = logoImg.width / Math.max(1, logoImg.height);
        const drawH = maxH;
        const drawW = drawH * ratio;
        const lx = (vState.positions.logo.x / 100) * W - drawW / 2;
        const ly = (vState.positions.logo.y / 100) * H - drawH / 2;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 10;
        ctx.drawImage(logoImg, lx, ly, drawW, drawH);
        ctx.restore();
      } catch {
        // Ignore logo render error
      }
    }

    // 4. Draw Primary Door / Panel Brand Text (using per-zone styles)
    if (vState.brandText || vState.subText) {
      const bx = (vState.positions.brand.x / 100) * W;
      const by = (vState.positions.brand.y / 100) * H;
      const bStyle = vState.zoneStyles.brand;
      const sStyle = vState.zoneStyles.sub;
      const bFont = DECAL_FONTS[bStyle.font] || DECAL_FONTS.wide;
      const sFont = DECAL_FONTS[sStyle.font] || DECAL_FONTS.mono;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.92)';
      ctx.shadowBlur = 8;

      if (vState.brandText) {
        ctx.fillStyle = bStyle.color;
        ctx.font = bFont.canvasFont(Math.round(38 * (bStyle.scale / 100)));
        ctx.fillText(vState.brandText, bx, by);
      }

      if (vState.subText) {
        ctx.fillStyle = sStyle.color;
        ctx.font = sFont.canvasFont(Math.round(16 * (sStyle.scale / 100)));
        ctx.fillText(vState.subText, bx, by + Math.round(26 * (bStyle.scale / 100)));
      }
      ctx.restore();
    }

    // 5. Draw Secondary Contact Decal (using per-zone styles)
    if (vState.phoneText || vState.webText) {
      const cx = (vState.positions.contact.x / 100) * W;
      const cy = (vState.positions.contact.y / 100) * H;
      const pStyle = vState.zoneStyles.phone;
      const wStyle = vState.zoneStyles.web;
      const pFont = DECAL_FONTS[pStyle.font] || DECAL_FONTS.wide;
      const wFont = DECAL_FONTS[wStyle.font] || DECAL_FONTS.mono;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.92)';
      ctx.shadowBlur = 6;
      if (vState.phoneText) {
        ctx.fillStyle = pStyle.color;
        ctx.font = pFont.canvasFont(Math.round(19 * (pStyle.scale / 100)));
        ctx.fillText(vState.phoneText, cx, cy);
      }
      if (vState.webText) {
        ctx.fillStyle = wStyle.color;
        ctx.font = wFont.canvasFont(Math.round(14 * (wStyle.scale / 100)));
        ctx.fillText(vState.webText, cx, cy + Math.round(22 * (pStyle.scale / 100)));
      }
      ctx.restore();
    }

    // 6. Studio Spec Footer Bar
    ctx.fillStyle = '#13161F';
    ctx.fillRect(0, H, W, FOOTER_H);
    ctx.fillStyle = '#E11D48';
    ctx.fillRect(0, H, W, 3);

    ctx.fillStyle = '#F43F5E';
    ctx.font = '800 18px monospace';
    ctx.fillText(
      `397 GRAPHIX CUSTOM WRAP PROOF // ${bodyInfo.label.toUpperCase()} · ${patInfo.short}`,
      28,
      H + 32
    );

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 14px monospace';
    ctx.fillText(
      `PRIMARY FILM: ${vState.finish.toUpperCase()} ${vState.colorName.toUpperCase()} (${vState.colorHex}) · STRIPE: ${vState.stripeHex} · 397GRAPHIX.CO.NZ · 022 500 3904`,
      28,
      H + 56
    );

    return outCanvas.toDataURL('image/png');
  };

  // Download PNG Proof Button
  const vDownloadBtn = $('#v-download-png-btn');
  if (vDownloadBtn) {
    vDownloadBtn.addEventListener('click', async () => {
      const origText = vDownloadBtn.innerHTML;
      vDownloadBtn.textContent = 'Generating Studio Proof...';
      try {
        const dataUrl = await renderStudioProofDataUrl();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `397-Graphix-${vState.body}-wrap-design.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } finally {
        vDownloadBtn.innerHTML = origText;
      }
    });
  }

  // Save Custom Design to sessionStorage when clicking "Send Design to Ryan for Quote"
  if (vQuoteLink) {
    vQuoteLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetHref = vQuoteLink.href;
      vQuoteLink.textContent = 'Preparing Your Design Proof...';
      try {
        const dataUrl = await renderStudioProofDataUrl();
        sessionStorage.setItem('397_custom_wrap_png', dataUrl);
        sessionStorage.setItem('397_custom_wrap_summary', buildSpecSummary());
      } catch {
        // Proceed even if canvas export fails
      }
      window.location.href = targetHref;
    });
  }

  renderVehicle();

  // Office Glass Studio Controls
  let gState = {
    tier: '2',
    tint: 'silver',
  };

  const G_TIERS = {
    '1': {
      short: 'SPEC 01 COMPLIANCE STRIPS',
      light: 'LIGHT TRANSMISSION: 96%',
      desc: 'NZ building-code compliance manifestation strip + cut-vinyl room numbering',
      top: '43%',
      bottom: '43%',
      label: 'COMPLIANCE MANIFESTATION STRIP',
      heightText: '150MM STRIP',
      tierName: 'Spec 01 - Safety Manifestation & Room Numbering',
    },
    '2': {
      short: 'SPEC 02 BOARDROOM BAND',
      light: 'LIGHT TRANSMISSION: 88%',
      desc: 'Mid-height polymeric etched glass band + twin pinstripes + cut-vinyl room numbering',
      top: '26%',
      bottom: '24%',
      label: 'SUITE 9.7 // PRIVACY FROST',
      heightText: '1200MM BAND',
      tierName: 'Spec 02 - Mid-Height Boardroom Privacy Band',
    },
    '3': {
      short: 'SPEC 03 FULL-HEIGHT FROST',
      light: 'LIGHT TRANSMISSION: 82%',
      desc: 'Floor-to-ceiling etched privacy film across all glass panels + custom cutout signage',
      top: '3%',
      bottom: '3%',
      label: 'FULL-HEIGHT EXECUTIVE BLOCKOUT FROST',
      heightText: '2700MM FULL',
      tierName: 'Spec 03 - Full Floor-to-Ceiling Partition Frosting',
    },
  };

  const G_TINTS = {
    silver: { name: 'Silver Etch Film', bg: 'rgba(226, 232, 240, 0.36)', textColor: '#08090C' },
    ice: { name: 'Ice White Frost', bg: 'rgba(248, 250, 252, 0.52)', textColor: '#08090C' },
    smoke: { name: 'Smoked Charcoal Tint', bg: 'rgba(30, 35, 45, 0.72)', textColor: '#F8FAFC' },
  };

  const gTierBtns = $$('.g-tier-btn');
  const gTintBtns = $$('.g-tint-btn');
  const gCustomTintColor = $('#g-custom-tint-color');
  const gBand = $('#glass-sim-band');
  const gTitle = $('#g-blueprint-title');
  const gLight = $('#g-blueprint-light');
  const gDesc = $('#g-blueprint-desc');
  const gLink = $('#g-quote-link');

  const renderGlass = () => {
    const t = G_TIERS[gState.tier];
    let tint = G_TINTS[gState.tint];
    if (!tint && gState.customHex) {
      const { r, g, b } = hexToRgb(gState.customHex);
      tint = {
        name: `Custom Tint (${gState.customHex})`,
        bg: `rgba(${r}, ${g}, ${b}, 0.48)`,
        textColor: '#FFFFFF',
      };
    }
    if (!tint) tint = G_TINTS.silver;

    if (gBand) {
      gBand.style.top = t.top;
      gBand.style.bottom = t.bottom;
      gBand.style.backgroundColor = tint.bg;
      const spans = $$('span', gBand);
      if (spans[0]) {
        spans[0].textContent = t.label;
        spans[0].style.color = tint.textColor;
      }
      if (spans[1]) {
        spans[1].textContent = t.heightText;
        spans[1].style.color = tint.textColor;
      }
    }
    if (gTitle) gTitle.textContent = `// ${t.short} · ${tint.name.toUpperCase()}`;
    if (gLight) gLight.textContent = t.light;
    if (gDesc) gDesc.textContent = t.desc;
    if (gLink) {
      gLink.href = `/contact?service=office-fitouts&tier=${encodeURIComponent(`${t.tierName} (${tint.name})`)}#quote`;
    }
  };

  gTierBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      gState.tier = btn.dataset.gTier;
      setActiveInGroup(gTierBtns, btn);
      renderGlass();
    });
  });

  gTintBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      gState.tint = btn.dataset.gTint;
      gState.customHex = '';
      setActiveInGroup(gTintBtns, btn);
      renderGlass();
    });
  });

  if (gCustomTintColor) {
    gCustomTintColor.addEventListener('input', () => {
      gState.tint = 'custom';
      gState.customHex = gCustomTintColor.value.toUpperCase();
      gTintBtns.forEach((b) => b.classList.remove('is-active'));
      renderGlass();
    });
  }
}

// =========================================================================
// 3. LIVE 3D LETTERING & LED HALO WALL SIMULATOR
// =========================================================================
const simInput = $('#sim-text-input');
const simSubInput = $('#sim-sub-input');
const simOutput = $('#sim-sign-output');
const simSubOutput = $('#sim-sub-output');
const simGlow = $('#sim-wall-glow');
const simBacking = $('#sim-backing-frame');
const simReadout = $('#sim-spec-readout');
const simLedName = $('#sim-led-name');
const simDimmer = $('#sim-dimmer');
const simDimmerVal = $('#sim-dimmer-val');
const simCustomColor = $('#sim-custom-color');
const simQuoteBtn = $('#sim-quote-btn');

if (simInput && simOutput) {
  let sState = {
    font: 'wide',
    depth: 2,
    finish: 'acrylic',
    ledHex: '#E11D48',
    ledLabel: 'Crimson Neon',
    brightness: 100,
    wall: 'slate',
  };

  const FONT_STYLES = {
    wide: {
      family: '"Archivo", sans-serif',
      variation: '"wdth" 120, "wght" 900',
      style: 'normal',
      label: 'Wide Block',
    },
    italic: {
      family: '"Archivo", sans-serif',
      variation: '"wdth" 115, "wght" 900',
      style: 'italic',
      label: 'Speed Italic',
    },
    condensed: {
      family: '"Archivo", sans-serif',
      variation: '"wdth" 68, "wght" 900',
      style: 'normal',
      label: 'Tall Trade',
    },
    clean: {
      family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      variation: 'normal',
      style: 'normal',
      label: 'Clean Sans',
    },
    serif: {
      family: 'Georgia, "Times New Roman", serif',
      variation: 'normal',
      style: 'normal',
      label: 'Classic Serif',
    },
    mono: {
      family: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      variation: 'normal',
      style: 'normal',
      label: 'Tech Mono',
    },
  };

  const FINISH_STYLES = {
    acrylic: { color: '#FFFFFF', sideColors: ['#cbd5e1', '#94a3b8', '#64748b', '#475569', '#1e293b'], name: 'Gloss White' },
    carbon: { color: '#1A1D24', sideColors: ['#2e3340', '#252934', '#1c1f28', '#14161d', '#0b0c10'], name: 'Matte Black' },
    steel: { color: '#E2E8F0', sideColors: ['#94a3b8', '#78869b', '#5c687a', '#424b59', '#272d36'], name: 'Brushed Steel' },
    gold: { color: '#FDE68A', sideColors: ['#d97706', '#b45309', '#92400e', '#78350f', '#451a03'], name: 'Brushed Brass' },
  };

  const buildExtrusion = (sideColors, depthLevel) => {
    const layers = depthLevel === 1 ? 3 : depthLevel === 2 ? 6 : 10;
    const parts = [];
    for (let i = 1; i <= layers; i++) {
      const c = sideColors[Math.min(Math.floor(((i - 1) / layers) * sideColors.length), sideColors.length - 1)];
      parts.push(`${i}px ${i}px 0 ${c}`);
    }
    return parts.join(', ');
  };

  const renderSign = () => {
    const mainText = (simInput.value.trim() || '397 GRAPHIX').toUpperCase();
    const subText = simSubInput ? simSubInput.value.trim().toUpperCase() : '';

    simOutput.textContent = mainText;
    if (simSubOutput) {
      simSubOutput.textContent = subText;
      simSubOutput.hidden = !subText;
    }

    const fontCfg = FONT_STYLES[sState.font] || FONT_STYLES.wide;
    simOutput.style.fontFamily = fontCfg.family;
    simOutput.style.fontVariationSettings = fontCfg.variation;
    simOutput.style.fontStyle = fontCfg.style;

    let finCfg = FINISH_STYLES[sState.finish];
    if (!finCfg && sState.customFaceHex) {
      const { r: fr, g: fg, b: fb } = hexToRgb(sState.customFaceHex);
      const shade = (f) => `rgb(${Math.round(fr * f)}, ${Math.round(fg * f)}, ${Math.round(fb * f)})`;
      finCfg = {
        color: sState.customFaceHex,
        sideColors: [shade(0.78), shade(0.64), shade(0.5), shade(0.38), shade(0.24)],
        name: `Custom Face (${sState.customFaceHex})`,
      };
    }
    if (!finCfg) finCfg = FINISH_STYLES.acrylic;
    const extrudeCss = buildExtrusion(finCfg.sideColors, sState.depth);

    const { r, g, b } = hexToRgb(sState.ledHex);
    const alpha = sState.brightness / 100;

    let haloCss = '';
    if (alpha > 0.02) {
      haloCss = `, 0 0 ${Math.round(28 * alpha)}px rgba(${r}, ${g}, ${b}, ${(0.92 * alpha).toFixed(2)}), 0 0 ${Math.round(70 * alpha)}px rgba(${r}, ${g}, ${b}, ${(0.55 * alpha).toFixed(2)})`;
    } else {
      haloCss = ', 8px 12px 24px rgba(0, 0, 0, 0.85)';
    }

    simOutput.style.color = finCfg.color;
    simOutput.style.textShadow = `${extrudeCss}${haloCss}`;

    if (simSubOutput) {
      simSubOutput.style.textShadow =
        alpha > 0.02 ? `0 0 ${Math.round(16 * alpha)}px rgba(${r}, ${g}, ${b}, ${(0.85 * alpha).toFixed(2)})` : 'none';
    }

    if (simGlow) {
      simGlow.style.background =
        alpha > 0.02
          ? `radial-gradient(circle at 50% 50%, rgba(${r}, ${g}, ${b}, ${(0.28 * alpha).toFixed(2)}) 0%, rgba(${r}, ${g}, ${b}, ${(0.08 * alpha).toFixed(2)}) 42%, transparent 72%)`
          : 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)';
    }

    if (simBacking) {
      simBacking.style.boxShadow =
        alpha > 0.02
          ? `0 0 ${Math.round(42 * alpha)}px rgba(${r}, ${g}, ${b}, ${(0.25 * alpha).toFixed(2)}), inset 0 0 ${Math.round(22 * alpha)}px rgba(${r}, ${g}, ${b}, ${(0.1 * alpha).toFixed(2)})`
          : '0 20px 50px rgba(0, 0, 0, 0.8)';
      simBacking.style.borderColor =
        alpha > 0.02 ? `rgba(${r}, ${g}, ${b}, ${(0.45 * alpha).toFixed(2)})` : 'rgba(255, 255, 255, 0.14)';
    }

    if (simLedName) {
      simLedName.textContent =
        sState.brightness === 0 ? 'UNLIT (3D ONLY)' : `${sState.ledLabel.toUpperCase()} (${sState.ledHex})`;
    }
    if (simDimmerVal) {
      simDimmerVal.textContent =
        sState.brightness === 0 ? 'OFF (UNLIT 3D)' : `${sState.brightness}% BRIGHTNESS`;
    }

    const depthLabel = sState.depth === 1 ? '10mm' : sState.depth === 2 ? '25mm' : '45mm';
    if (simReadout) {
      simReadout.textContent = `${finCfg.name.toUpperCase()} (${depthLabel}) + ${
        sState.brightness === 0 ? 'UNLIT' : sState.ledLabel.toUpperCase()
      }`;
    }

    if (simQuoteBtn) {
      const svc = sState.brightness === 0 ? '3d-lettering' : 'led-fixtures';
      const specText = `3D Sign "${mainText}"${subText ? ` / "${subText}"` : ''} — ${finCfg.name}, ${depthLabel} depth, ${fontCfg.label} style, LED Halo: ${
        sState.brightness === 0 ? 'None (Unlit)' : `${sState.ledLabel} (${sState.ledHex} at ${sState.brightness}%)`
      }`;
      simQuoteBtn.href = `/contact?service=${svc}&tier=${encodeURIComponent(specText)}#quote`;
    }
  };

  simInput.addEventListener('input', renderSign);
  simSubInput?.addEventListener('input', renderSign);

  const fontBtns = $$('.sim-font-btn');
  fontBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sState.font = btn.dataset.simFont;
      setActiveInGroup(fontBtns, btn);
      renderSign();
    });
  });

  const depthBtns = $$('.sim-depth-btn');
  depthBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sState.depth = Number(btn.dataset.simDepth);
      setActiveInGroup(depthBtns, btn);
      renderSign();
    });
  });

  const finishBtns = $$('.sim-finish-btn');
  const simCustomFaceColor = $('#sim-custom-face-color');
  finishBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sState.finish = btn.dataset.simFinish;
      sState.customFaceHex = '';
      setActiveInGroup(finishBtns, btn);
      renderSign();
    });
  });

  if (simCustomFaceColor) {
    simCustomFaceColor.addEventListener('input', () => {
      sState.finish = 'custom';
      sState.customFaceHex = simCustomFaceColor.value.toUpperCase();
      finishBtns.forEach((b) => b.classList.remove('is-active'));
      renderSign();
    });
  }

  const ledSwatches = $$('.sim-color-swatch');
  ledSwatches.forEach((sw) => {
    sw.addEventListener('click', () => {
      sState.ledHex = sw.dataset.ledHex;
      sState.ledLabel = sw.dataset.ledLabel || sw.dataset.ledHex;
      if (sState.brightness === 0) {
        sState.brightness = 100;
        if (simDimmer) simDimmer.value = '100';
      }
      if (simCustomColor) simCustomColor.value = sState.ledHex;
      ledSwatches.forEach((s) => {
        const on = s === sw;
        s.classList.toggle('border-2', on);
        s.classList.toggle('border-white', on);
        s.classList.toggle('scale-110', on);
        s.classList.toggle('border-white/40', !on);
      });
      renderSign();
    });
  });

  if (simCustomColor) {
    simCustomColor.addEventListener('input', () => {
      sState.ledHex = simCustomColor.value.toUpperCase();
      sState.ledLabel = 'Custom RGB';
      if (sState.brightness === 0) {
        sState.brightness = 100;
        if (simDimmer) simDimmer.value = '100';
      }
      ledSwatches.forEach((s) => {
        s.classList.remove('border-2', 'border-white', 'scale-110');
        s.classList.add('border-white/40');
      });
      renderSign();
    });
  }

  if (simDimmer) {
    simDimmer.addEventListener('input', () => {
      sState.brightness = Number(simDimmer.value);
      renderSign();
    });
  }

  const wallBtns = $$('.sim-wall-btn');
  const wallStage = $('#sim-wall');
  const wallSlats = $('#sim-wall-slats');
  const wallMoss = $('#sim-wall-moss');
  const simCustomWallColor = $('#sim-custom-wall-color');

  wallBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sState.wall = btn.dataset.simWall;
      setActiveInGroup(wallBtns, btn);
      if (wallStage) wallStage.style.backgroundColor = '#08090C';
      if (wallSlats) wallSlats.hidden = sState.wall !== 'slats';
      if (wallMoss) wallMoss.hidden = sState.wall !== 'moss';
    });
  });

  if (simCustomWallColor) {
    simCustomWallColor.addEventListener('input', () => {
      sState.wall = 'custom';
      wallBtns.forEach((b) => b.classList.remove('is-active'));
      if (wallSlats) wallSlats.hidden = true;
      if (wallMoss) wallMoss.hidden = true;
      if (wallStage) wallStage.style.backgroundColor = simCustomWallColor.value;
    });
  }
}

// =========================================================================
// 4. MOBILE NAVIGATION DRAWER
// =========================================================================
const navToggle = $('#nav-toggle');
const mobileNav = $('#mobile-nav');
const iconMenu = $('#icon-menu');
const iconClose = $('#icon-close');

if (navToggle && mobileNav) {
  const setOpen = (open) => {
    mobileNav.hidden = !open;
    navToggle.setAttribute('aria-expanded', String(open));
    if (iconMenu && iconClose) {
      iconMenu.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }
  };

  navToggle.addEventListener('click', () => {
    setOpen(mobileNav.hidden);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileNav.hidden) {
      setOpen(false);
      navToggle.focus();
    }
  });

  $$('a', mobileNav).forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  );
}

// =========================================================================
// 5. GALLERY FILTERS & LIGHTBOX VIEWER
// =========================================================================
const filters = $$('.filter');
if (filters.length > 0) {
  filters.forEach((btn) =>
    btn.addEventListener('click', () => {
      setActiveInGroup(filters, btn);
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      const category = btn.dataset.filter;
      $$('.gallery-item').forEach((item) => {
        const cats = (item.dataset.cat || '').split(' ');
        const match = category === 'all' || cats.includes(category);
        item.hidden = !match;
      });
    })
  );
}

const lb = $('#lightbox');
if (lb) {
  const lbImg = $('#lb-img', lb);
  const lbCap = $('#lb-cap', lb);
  const lbTag = $('#lb-tag', lb);
  const lbCount = $('#lb-count', lb);
  let list = [];
  let current = 0;
  let opener = null;

  const show = (index) => {
    if (!list.length) return;
    current = (index + list.length) % list.length;
    const item = list[current];
    const thumb = $('img', item);
    lbImg.src = item.getAttribute('href');
    lbImg.alt = thumb ? thumb.alt : '';
    if (lbCap) lbCap.textContent = item.dataset.caption || '';
    if (lbTag) {
      const tag = item.dataset.tag || '';
      lbTag.textContent = tag;
      lbTag.style.display = tag ? 'inline-block' : 'none';
    }
    if (lbCount) {
      lbCount.textContent = list.length > 1 ? `PHOTO ${current + 1} OF ${list.length}` : '';
    }
  };

  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (opener) opener.focus();
  };

  $$('a.shot').forEach((card) =>
    card.addEventListener('click', (e) => {
      e.preventDefault();
      list = $$('a.shot').filter((x) => !x.closest('[hidden]'));
      opener = card;
      show(list.indexOf(card));
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      const closeBtn = $('.lb-close', lb);
      if (closeBtn) closeBtn.focus();
    })
  );

  $('.lb-close', lb)?.addEventListener('click', close);
  $('.lb-prev', lb)?.addEventListener('click', () => show(current - 1));
  $('.lb-next', lb)?.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

// =========================================================================
// 6. QUOTE REQUEST FORM HANDLER + SPEC PRE-FILL
// =========================================================================
const form = $('#quote');
if (form) {
  const note = $('.form-note', form);
  const btn = $('button[type=submit]', form);
  const fileInput = $('#f-photos', form);
  const drop = $('.drop', form);
  const dropText = $('.drop-text', form);
  const msgArea = $('#f-message', form);
  const MAX_FILES = 5;
  const MAX_TOTAL = 20 * 1024 * 1024;

  const params = new URLSearchParams(location.search);
  const wantedService = params.get('service');
  const wantedTier = params.get('tier');

  if (wantedService) {
    const opt = $(`#f-service option[data-id="${CSS.escape(wantedService)}"]`, form);
    if (opt) opt.selected = true;
  }

  if (wantedTier && msgArea && !msgArea.value) {
    msgArea.value = `Configured Spec: ${wantedTier}\n\nJob Details: `;
  }

  // Display & attach custom vehicle wrap design if saved from the Studio Designer
  const designPreviewCard = $('#quote-design-preview-card', form);
  const designPreviewImg = $('#quote-design-preview-img', form);
  const designPreviewSummary = $('#quote-design-preview-summary', form);
  const designRemoveBtn = $('#quote-design-remove-btn', form);

  let savedDesignPng = '';
  try {
    savedDesignPng = sessionStorage.getItem('397_custom_wrap_png') || '';
    const savedSummary = sessionStorage.getItem('397_custom_wrap_summary') || '';
    if (savedDesignPng && designPreviewCard && designPreviewImg) {
      designPreviewImg.src = savedDesignPng;
      designPreviewCard.hidden = false;
      if (designPreviewSummary) {
        designPreviewSummary.textContent = savedSummary || wantedTier || '';
      }
    }
  } catch {
    // Ignore sessionStorage errors
  }

  if (designRemoveBtn && designPreviewCard) {
    designRemoveBtn.addEventListener('click', () => {
      savedDesignPng = '';
      designPreviewCard.hidden = true;
      try {
        sessionStorage.removeItem('397_custom_wrap_png');
        sessionStorage.removeItem('397_custom_wrap_summary');
      } catch {
        // Ignore
      }
    });
  }

  const showFiles = () => {
    if (!fileInput || !dropText) return;
    const n = fileInput.files.length;
    dropText.textContent =
      n === 0
        ? '+ Choose Files or Drag Them Here'
        : n === 1
          ? fileInput.files[0].name
          : `${n} Files Selected`;
  };

  if (fileInput && drop) {
    fileInput.addEventListener('change', showFiles);
    ['dragenter', 'dragover'].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.add('border-volt');
      })
    );
    ['dragleave', 'drop'].forEach((ev) =>
      drop.addEventListener(ev, () => {
        drop.classList.remove('border-volt');
      })
    );
  }

  const ts = $('.turnstile', form);
  if (ts && ts.dataset.sitekey && !ts.dataset.sitekey.startsWith('REPLACE_ME')) {
    window.onTurnstileLoad = () =>
      window.turnstile.render(ts, { sitekey: ts.dataset.sitekey, theme: 'dark' });
    const sc = document.createElement('script');
    sc.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
    sc.async = true;
    document.head.appendChild(sc);
  } else if (ts) {
    ts.remove();
  }

  const say = (msg, ok = false) => {
    if (!note) return;
    note.textContent = msg;
    note.classList.toggle('text-volt', !!ok);
    note.classList.toggle('font-bold', !!ok);
    note.classList.toggle('text-rose-300', !ok);
  };

  const mailtoFallback = (d) => {
    const body = [
      `Name: ${d.get('name')}`,
      `Business: ${d.get('business')}`,
      `Phone: ${d.get('phone')}`,
      `Email: ${d.get('email')}`,
      `Service: ${d.get('service')}`,
      `Timeframe: ${d.get('when')}`,
      `Location: ${d.get('location')}`,
      '',
      d.get('message'),
    ].join('\n');
    window.location.href = `mailto:ryan@397graphix.co.nz?subject=${encodeURIComponent(
      'Quote request: ' + d.get('service')
    )}&body=${encodeURIComponent(body)}`;
    say(
      'Your email app should open with the quote details filled in. Please attach any photos there before sending.',
      true
    );
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const val = (k) => String(d.get(k) || '').trim();

    if (!val('name')) {
      say('Please enter your name.');
      return $('#f-name')?.focus();
    }
    if (!val('phone') && !val('email')) {
      say('Please add a phone number or email address so we can reply.');
      return $('#f-phone')?.focus();
    }
    if (!val('message')) {
      say('Please add a few details about the job.');
      return $('#f-message')?.focus();
    }

    const files = fileInput ? fileInput.files : [];
    if (files.length > MAX_FILES) {
      return say(`Maximum ${MAX_FILES} files allowed.`);
    }
    if (Array.from(files).reduce((t, f) => t + f.size, 0) > MAX_TOTAL) {
      return say('Attached files must be under 20 MB in total.');
    }

    if (location.protocol === 'file:') return mailtoFallback(d);

    // Attach custom wrap studio PNG proof if present and file count allows
    if (savedDesignPng && files.length < MAX_FILES) {
      try {
        const blobRes = await fetch(savedDesignPng);
        const blob = await blobRes.blob();
        d.append('photos', blob, '397-custom-wrap-design.png');
      } catch {
        // Ignore blob conversion error
      }
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';
    say('');

    try {
      const r = await fetch(form.action, { method: 'POST', body: d });
      const res = await r.json().catch(() => null);
      if (r.ok && res && res.ok) {
        form.reset();
        showFiles();
        if (window.turnstile && ts) window.turnstile.reset(ts);
        say('Quote request sent! Ryan will be in touch soon.', true);
      } else if (res && res.error) {
        say(res.error);
        if (window.turnstile && ts) window.turnstile.reset(ts);
      } else {
        mailtoFallback(d);
      }
    } catch {
      mailtoFallback(d);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Quote Request</span> <span aria-hidden="true">&rarr;</span>';
    }
  });
}
