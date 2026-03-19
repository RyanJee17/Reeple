import svgPaths from "./svg-c034zdx2by";

function Time() {
  return (
    <div className="basis-0 content-stretch flex grow h-[22px] items-center justify-center min-h-px min-w-px pb-0 pt-[2px] px-0 relative shrink-0" data-name="Time">
      <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[#f8f7ed] text-[17px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Battery() {
  return (
    <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 13">
        <g id="Battery">
          <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, #F8F7ED)" width="24" x="0.5" y="0.5" />
          <path d={svgPaths.p3bbd9700} fill="var(--fill-0, #F8F7ED)" id="Cap" opacity="0.4" />
          <rect fill="var(--fill-0, #F8F7ED)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="basis-0 content-stretch flex gap-[7px] grow h-[22px] items-center justify-center min-h-px min-w-px pb-0 pt-px px-0 relative shrink-0" data-name="Levels">
      <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 13">
          <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, #F8F7ED)" fillRule="evenodd" id="Cellular Connection" />
        </svg>
      </div>
      <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 13">
          <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, #F8F7ED)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <Battery />
    </div>
  );
}

function StatusBarIPhone() {
  return (
    <div className="absolute content-stretch flex gap-[154px] h-[50px] items-center justify-center left-0 pb-[19px] pt-[21px] px-[16px] top-0 w-[430px]" data-name="Status bar - iPhone">
      <Time />
      <Levels />
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px mr-[-16px] relative shrink-0" data-name="Content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[20px] py-0 relative size-full">
          <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#49454f] text-[16px] text-nowrap tracking-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px] whitespace-pre">|</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pc423380} fill="var(--fill-0, #49454F)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <Icon />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer />
    </div>
  );
}

function Component1stTrailingIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[48px]" data-name="1st trailing-icon">
      <Content1 />
    </div>
  );
}

function TrailingElements() {
  return (
    <div className="absolute content-stretch flex items-center justify-end right-[4px] top-1/2 translate-y-[-50%]" data-name="Trailing-Elements">
      <Component1stTrailingIcon />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="state-layer">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[4px] pr-[20px] py-[4px] relative size-full">
          <Content />
          <TrailingElements />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="basis-0 bg-[#ffda6b] content-stretch flex grow h-[56px] items-center max-w-[720px] min-h-px min-w-px overflow-clip relative rounded-[10px] shrink-0" data-name="Search bar">
      <StateLayer1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex items-center left-[24px] top-[522px] w-[382px]">
      <SearchBar />
    </div>
  );
}

function Background() {
  return (
    <div className="absolute h-[336px] left-0 right-0 top-1/2 translate-y-[-50%]" data-name="Background">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[rgba(85,85,85,0.9)] inset-0 mix-blend-luminosity" />
        <div className="absolute bg-[rgba(86,88,92,0.87)] inset-0" />
        <div className="absolute backdrop-blur-[75px] backdrop-filter bg-[#939393] inset-0 mix-blend-color-dodge" />
      </div>
    </div>
  );
}

function AutocompleteSuggestion() {
  return (
    <div className="basis-0 bg-[#ebedf0] grow h-full min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Autocomplete Suggestion">
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-black text-center text-nowrap tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[22px] overflow-ellipsis overflow-hidden">“The”</p>
      </div>
    </div>
  );
}

function SeparatorClear() {
  return (
    <div className="content-stretch flex h-[25px] items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Separator (Clear)">
      <div className="bg-black h-full opacity-0 shrink-0 w-px" data-name="Separator" />
    </div>
  );
}

function AutocompleteSuggestion1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Autocomplete Suggestion">
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-black text-center text-nowrap tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[22px] overflow-ellipsis overflow-hidden">the</p>
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="content-stretch flex h-[25px] items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Separator">
      <div className="bg-black h-full opacity-10 shrink-0 w-px" data-name="Separator" />
    </div>
  );
}

function AutocompleteSuggestion2() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Autocomplete Suggestion">
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-black text-center text-nowrap tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[22px] overflow-ellipsis overflow-hidden">to</p>
      </div>
    </div>
  );
}

function Autocorrection() {
  return (
    <div className="basis-0 grow h-[39px] min-h-px min-w-px relative shrink-0" data-name="Autocorrection">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[2px] h-[39px] items-center px-px py-0 relative w-full">
          <AutocompleteSuggestion />
          <SeparatorClear />
          <AutocompleteSuggestion1 />
          <Separator />
          <AutocompleteSuggestion2 />
        </div>
      </div>
    </div>
  );
}

function AccessoryBar() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-0 py-[2px] relative shrink-0 w-full" data-name="Accessory Bar">
      <Autocorrection />
    </div>
  );
}

function Key() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.02px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Space() {
  return (
    <div className="absolute h-[42px] left-0 right-0 rounded-[4.6px] top-0" data-name="Space">
      <Key />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal h-[42px] justify-center leading-[0] left-0 right-[-0.02px] text-[16px] text-black text-center top-1/2 tracking-[-0.31px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[21px]">space</p>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="absolute bottom-0 h-[42px] left-[25.7%] right-[25.7%]" data-name="Row 4">
      <Space />
    </div>
  );
}

function Key1() {
  return <div className="absolute bg-[#8f8f8f] bottom-0 left-0 mix-blend-color-burn right-[-0.34px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Return() {
  return (
    <div className="absolute bottom-0 h-[42px] left-[75.83%] right-[0.76%] rounded-[4.6px]" data-name="Return">
      <Key1 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal h-[42px] justify-center leading-[0] left-0 right-[-0.34px] text-[16px] text-black text-center top-1/2 tracking-[-0.31px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[21px]">return</p>
      </div>
    </div>
  );
}

function Key2() {
  return <div className="absolute bg-[#8f8f8f] bottom-0 left-0 mix-blend-color-burn right-[-0.34px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function KeyboardSwitch() {
  return (
    <div className="absolute bottom-0 h-[42px] left-[0.76%] right-[75.83%] rounded-[4.6px]" data-name="Keyboard Switch">
      <Key2 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal h-[42px] justify-center leading-[0] left-0 right-[-0.34px] text-[16px] text-black text-center top-1/2 tracking-[-0.31px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[21px]">ABC</p>
      </div>
    </div>
  );
}

function Key3() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key4() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key3 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.45px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">z</p>
      </div>
    </div>
  );
}

function Key5() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key6() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key5 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.45px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">x</p>
      </div>
    </div>
  );
}

function Key7() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key8() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key7 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.05px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">c</p>
      </div>
    </div>
  );
}

function Key9() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key10() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key9 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.05px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">v</p>
      </div>
    </div>
  );
}

function Key11() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key12() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key11 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.05px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">b</p>
      </div>
    </div>
  );
}

function Key13() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key14() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key13 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.45px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">n</p>
      </div>
    </div>
  );
}

function Key15() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.1px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key16() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key15 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.05px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">m</p>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="absolute bottom-[54px] content-stretch flex gap-[6px] items-start left-[15.78%] right-[15.78%]" data-name="Row 3">
      <Key4 />
      <Key6 />
      <Key8 />
      <Key10 />
      <Key12 />
      <Key14 />
      <Key16 />
    </div>
  );
}

function Key17() {
  return <div className="absolute bg-[#8f8f8f] bottom-0 left-0 mix-blend-color-burn right-[0.14px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function DeleteKey() {
  return (
    <div className="absolute bottom-[54px] h-[42px] left-[88.04%] right-[0.76%] rounded-[4.6px]" data-name="Delete Key">
      <Key17 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.07px)] text-[20px] text-black text-center text-nowrap top-1/2 translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">􀆛</p>
      </div>
    </div>
  );
}

function Key18() {
  return <div className="absolute bg-[#8f8f8f] bottom-0 left-0 mix-blend-color-burn right-[0.14px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function ShiftKey() {
  return (
    <div className="absolute bottom-[54px] h-[42px] left-[0.76%] right-[88.04%] rounded-[4.6px]" data-name="Shift Key">
      <Key18 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.43px)] text-[20px] text-black text-center text-nowrap top-1/2 translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">􀆝</p>
      </div>
    </div>
  );
}

function Key19() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key20() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key19 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.07px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">a</p>
      </div>
    </div>
  );
}

function Key21() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key22() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key21 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">s</p>
      </div>
    </div>
  );
}

function Key23() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key24() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key23 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.07px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">d</p>
      </div>
    </div>
  );
}

function Key25() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key26() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key25 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">f</p>
      </div>
    </div>
  );
}

function Key27() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key28() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key27 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">g</p>
      </div>
    </div>
  );
}

function Key29() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key30() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key29 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">h</p>
      </div>
    </div>
  );
}

function Key31() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key32() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key31 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">j</p>
      </div>
    </div>
  );
}

function Key33() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key34() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key33 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.07px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">k</p>
      </div>
    </div>
  );
}

function Key35() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.15px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key36() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key35 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">l</p>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="absolute bottom-[108px] content-stretch flex gap-[6px] items-start left-[5.85%] right-[5.85%]" data-name="Row 2">
      <Key20 />
      <Key22 />
      <Key24 />
      <Key26 />
      <Key28 />
      <Key30 />
      <Key32 />
      <Key34 />
      <Key36 />
    </div>
  );
}

function Key37() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key38() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key37 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">q</p>
      </div>
    </div>
  );
}

function Key39() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key40() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key39 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.03px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">w</p>
      </div>
    </div>
  );
}

function Key41() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key42() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key41 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">e</p>
      </div>
    </div>
  );
}

function Key43() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key44() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key43 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">r</p>
      </div>
    </div>
  );
}

function Key45() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key46() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key45 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">t</p>
      </div>
    </div>
  );
}

function Key47() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key48() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key47 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.03px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">y</p>
      </div>
    </div>
  );
}

function Key49() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key50() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key49 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">u</p>
      </div>
    </div>
  );
}

function Key51() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key52() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key51 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">i</p>
      </div>
    </div>
  );
}

function Key53() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key54() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key53 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">o</p>
      </div>
    </div>
  );
}

function Key55() {
  return <div className="absolute bg-white bottom-0 left-0 right-[-0.06px] rounded-[4.6px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)] top-0" data-name="Key" />;
}

function Key56() {
  return (
    <div className="basis-0 grow h-[42px] min-h-px min-w-px relative rounded-[4.6px] shrink-0" data-name="Key">
      <Key55 />
      <div className="absolute flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.47px)] text-[25px] text-black text-center text-nowrap top-[calc(50%-3px)] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[28px] whitespace-pre">p</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="absolute bottom-[162px] content-stretch flex gap-[6px] items-start left-[0.76%] right-[0.76%]" data-name="Row 1">
      <Key38 />
      <Key40 />
      <Key42 />
      <Key44 />
      <Key46 />
      <Key48 />
      <Key50 />
      <Key52 />
      <Key54 />
      <Key56 />
    </div>
  );
}

function KeyboardLayouts() {
  return (
    <div className="h-[204px] relative shrink-0 w-full" data-name="Keyboard Layouts">
      <Row3 />
      <Return />
      <KeyboardSwitch />
      <Row2 />
      <DeleteKey />
      <ShiftKey />
      <Row1 />
      <Row />
    </div>
  );
}

function EmojiAndMic() {
  return (
    <div className="h-[55px] relative shrink-0 w-full" data-name="Emoji and Mic">
      <div className="size-full">
        <div className="content-stretch flex h-[55px] items-start justify-between pb-0 pl-[20px] pr-[24px] pt-[27px] relative w-full">
          <div className="relative shrink-0 size-[26.92px]" data-name="Emoji">
            <div className="absolute inset-0" style={{ "--fill-0": "rgba(27, 31, 38, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
                <path d={svgPaths.p2d450400} fill="var(--fill-0, #1B1F26)" fillOpacity="0.72" id="Emoji" />
              </svg>
            </div>
          </div>
          <div className="h-[28.213px] relative shrink-0 w-[18.866px]" data-name="Mic">
            <div className="absolute inset-0" style={{ "--fill-0": "rgba(27, 31, 38, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 29">
                <path d={svgPaths.p10f8a600} fill="var(--fill-0, #1B1F26)" fillOpacity="0.72" id="Mic" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="h-[26px] relative shrink-0 w-[402px]" data-name="Home Indicator">
      <div className="absolute bottom-[8px] flex h-[5px] items-center justify-center left-1/2 translate-x-[-50%] w-[144px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-black h-[5px] rounded-[100px] w-[144px]" data-name="Home Indicator" />
        </div>
      </div>
    </div>
  );
}

function KeyboardIPhone() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-end left-0 pb-0 pt-[3px] px-0 top-[596px] w-[430px]" data-name="Keyboard - iPhone">
      <Background />
      <AccessoryBar />
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none scale-y-[-100%] w-full">
          <div className="h-[5px] opacity-60 w-full" data-name="Spacer" />
        </div>
      </div>
      <KeyboardLayouts />
      <EmojiAndMic />
      <HomeIndicator />
    </div>
  );
}

function ResearchAgain() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Research Again">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Research Again">
          <path d={svgPaths.p3219bc00} fill="var(--fill-0, #BDBDBD)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ResearchAgain />
      <div className="flex flex-col font-['Jaldi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#bdbdbd] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Anatole Saint-Yves</p>
      </div>
    </div>
  );
}

function ResearchAgain1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Research Again">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Research Again">
          <path d={svgPaths.p3219bc00} fill="var(--fill-0, #BDBDBD)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ResearchAgain1 />
      <div className="flex flex-col font-['Jaldi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d8d8d8] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Nicolas Serbource</p>
      </div>
    </div>
  );
}

function ResearchAgain2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Research Again">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Research Again">
          <path d={svgPaths.p3219bc00} fill="var(--fill-0, #BDBDBD)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ResearchAgain2 />
      <div className="flex flex-col font-['Jaldi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d8d8d8] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Ryan Jeewooth</p>
      </div>
    </div>
  );
}

function ResearchAgain3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Research Again">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Research Again">
          <path d={svgPaths.p3219bc00} fill="var(--fill-0, #BDBDBD)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ResearchAgain3 />
      <div className="flex flex-col font-['Jaldi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d8d8d8] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Kone Stella</p>
      </div>
    </div>
  );
}

function ResearchAgain4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Research Again">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Research Again">
          <path d={svgPaths.p3219bc00} fill="var(--fill-0, #BDBDBD)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ResearchAgain4 />
      <div className="flex flex-col font-['Jaldi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d8d8d8] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Saimati Soufou</p>
      </div>
    </div>
  );
}

function ResearchAgain5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Research Again">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Research Again">
          <path d={svgPaths.p3219bc00} fill="var(--fill-0, #BDBDBD)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <ResearchAgain5 />
      <div className="flex flex-col font-['Jaldi:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#d8d8d8] text-[16px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Carole Lymer</p>
      </div>
    </div>
  );
}

function SearchResults() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[22px] top-[101px] w-[386px]" data-name="Search results">
      <Frame1 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 386 1">
            <line id="Line 2" stroke="var(--stroke-0, #696969)" strokeOpacity="0.2" x2="386" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame2 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 386 1">
            <line id="Line 2" stroke="var(--stroke-0, #696969)" strokeOpacity="0.2" x2="386" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame3 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 386 1">
            <line id="Line 2" stroke="var(--stroke-0, #696969)" strokeOpacity="0.2" x2="386" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame4 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 386 1">
            <line id="Line 2" stroke="var(--stroke-0, #696969)" strokeOpacity="0.2" x2="386" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame5 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 386 1">
            <line id="Line 2" stroke="var(--stroke-0, #696969)" strokeOpacity="0.2" x2="386" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame6 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 386 1">
            <line id="Line 2" stroke="var(--stroke-0, #696969)" strokeOpacity="0.2" x2="386" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Retour() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[48px] w-[77px]" data-name="Retour">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 77 24">
        <g id="Retour">
          <path d={svgPaths.p187cf400} fill="var(--fill-0, #F8F7ED)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

export default function RechercherUnJoueur() {
  return (
    <div className="bg-[#0d1b1e] overflow-clip relative rounded-[20px] size-full" data-name="Rechercher un joueur 6">
      <StatusBarIPhone />
      <Frame />
      <KeyboardIPhone />
      <SearchResults />
      <Retour />
    </div>
  );
}