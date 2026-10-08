/* ============================================================================
   LOGO CHE GALLEGGIA CON LE BOLLE
   Riproduce l'effetto della pagina di presentazione di Baggo: il logo dondola
   piano mentre percorre una piccola orbita, e dal basso salgono bolle di
   sapone. Valori presi dall'originale (pagina di 290 px): le misure sono
   convertite in unità del contenitore (cqw/cqh) così l'effetto scala con la card.
   Gli stili sono in index.css (classi .polpo-* e .bolla-*).
   ========================================================================== */

// left: posizione orizzontale in %; size/dx/dy in px della pagina originale
const BOLLE = [
  { left: 27, size: 10, dx: 28, dy: -242, durata: 8.0, ritardo: 1.4 },
  { left: 45, size: 25, dx: -36, dy: -241, durata: 8.1, ritardo: 0.5 },
  { left: 72, size: 11, dx: -33, dy: -335, durata: 8.5, ritardo: 0.6 },
  { left: 68, size: 10, dx: -34, dy: -258, durata: 9.0, ritardo: 8.5 },
  { left: 71, size: 18, dx: -22, dy: -299, durata: 6.7, ritardo: 7.7 },
  { left: 31, size: 14, dx: 34, dy: -303, durata: 7.0, ritardo: 2.8 },
  { left: 26, size: 26, dx: 32, dy: -237, durata: 9.4, ritardo: 3.4 },
  { left: 72, size: 26, dx: 0, dy: -289, durata: 9.3, ritardo: 4.5 },
  { left: 49, size: 18, dx: -17, dy: -319, durata: 9.1, ritardo: 4.1 },
  { left: 79, size: 18, dx: -13, dy: -331, durata: 7.2, ritardo: 6.2 },
  { left: 82, size: 14, dx: 27, dy: -260, durata: 8.6, ritardo: 8.7 },
]

const ORIGINALE = 290 // lato del logo nella pagina originale, in px

export function LogoConBolle({ lavoro }) {
  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: lavoro.sfondo }}>
      {/* Macchie sfocate di sfondo, come nella pagina originale */}
      <span className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-white/55 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-20 -right-16 size-56 rounded-full bg-[#6B4A9E]/35 blur-3xl" />

      <div className="relative flex size-full items-center justify-center p-8">
        <span className="polpo-zona relative inline-block h-full max-h-full aspect-square">
          <span className="polpo-orbita block size-full">
            <img
              src={lavoro.logo}
              alt={lavoro.titolo}
              loading="lazy"
              draggable="false"
              className="polpo-dondolio size-full rounded-full border-[3px] border-[#6B4A9E] object-cover"
            />
          </span>

          {/* Le bolle partono dal basso e salgono oltre il logo */}
          <span className="bolle-contenitore pointer-events-none absolute inset-0 z-10" aria-hidden="true">
            {BOLLE.map((b, i) => (
              <span
                key={i}
                className="bolla-sapone"
                style={{
                  left: `${b.left}%`,
                  bottom: '22%',
                  width: `${(b.size / ORIGINALE) * 100}cqw`,
                  height: `${(b.size / ORIGINALE) * 100}cqw`,
                  '--dx': `${(b.dx / ORIGINALE) * 100}cqw`,
                  '--dy': `${(b.dy / ORIGINALE) * 100}cqw`,
                  animation: `bolla-sale ${b.durata}s linear ${b.ritardo}s infinite`,
                }}
              />
            ))}
          </span>
        </span>
      </div>
    </div>
  )
}
