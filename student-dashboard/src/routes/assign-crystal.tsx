import "./assign-crystal.css";

/** Animated current-assignment crystal: light-to-sapphire colour cycle + glow, a shine sweep
    masked to the crystal, and 4 twinkling sparkles. Put it inside a `.pb-assign-crystal` button. */
export function AssignCrystalArt({ src }: { src: string }) {
  return (
    <>
      <span className="pb-ac-body" style={{ ["--crystal" as string]: `url(${src})` }}>
        <img src={src} alt="" className="pb-ac-img" />
        <span className="pb-ac-shine" />
      </span>
      <span className="pb-ac-spark s1" />
      <span className="pb-ac-spark s2" />
      <span className="pb-ac-spark s3" />
      <span className="pb-ac-spark s4" />
    </>
  );
}
