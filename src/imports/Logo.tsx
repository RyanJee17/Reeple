import svgPaths from "./svg-7z84z6c71p";

function Group() {
  return (
    <div className="absolute inset-[-0.02%_69.42%_11.44%_1.38%]" data-name="Group">
      <div className="absolute bottom-[-3.73%] left-[-4.72%] right-[-4.72%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 117 112">
          <g id="Group">
            <path d={svgPaths.p4db4600} fill="var(--fill-0, #FFDA6B)" id="Vector" />
            <path d={svgPaths.p14377a00} id="Vector_2" stroke="var(--stroke-0, #FFDA6B)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="8" />
            <path d={svgPaths.p3e04f400} id="Vector_3" stroke="var(--stroke-0, #FFDA6B)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="10" />
            <path d={svgPaths.p37ec2600} fill="var(--fill-0, #FFDA6B)" id="Vector_4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function Logo() {
  return (
    <div className="relative size-full" data-name="Logo">
      <Group />
      <p className="absolute bottom-[9.09%] font-['Capriola:Regular',sans-serif] leading-[normal] left-[38.02%] not-italic right-0 text-[#ffda6b] text-[64px] text-nowrap top-[24.79%] whitespace-pre">Reeple</p>
    </div>
  );
}