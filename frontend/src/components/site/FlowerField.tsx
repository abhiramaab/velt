const FLOWERS = [
  { src: "/flowers/flower_1.png", className: "left-[2%] top-[19%] w-[30px] opacity-50 sm:left-[4%] sm:w-[46px] lg:left-[6%] lg:w-[58px]", delay: "1.3s", dur: "6.8s", from: "5deg", to: "15deg" },
  { src: "/flowers/flower_2.png", className: "right-[2%] top-[20%] w-[30px] opacity-50 sm:right-[4%] sm:w-[46px] lg:right-[6%] lg:w-[58px]", delay: "0.4s", dur: "7.2s", from: "-15deg", to: "-3deg" },
  { src: "/flowers/flower_5.png", className: "hidden left-[11%] top-[21%] w-[40px] opacity-40 lg:block lg:w-[50px]", delay: "0.2s", dur: "7.4s", from: "-12deg", to: "1deg" },
  { src: "/flowers/flower_4.png", className: "hidden right-[11%] top-[23%] w-[40px] opacity-40 lg:block lg:w-[50px]", delay: "0.6s", dur: "7.5s", from: "11deg", to: "-4deg" },
  { src: "/flowers/flower_7.png", className: "left-[2%] top-[25%] w-[30px] opacity-50 sm:left-[4%] sm:w-[44px] lg:left-[6%] lg:w-[54px]", delay: "1.2s", dur: "8s", from: "8deg", to: "19deg" },
  { src: "/flowers/flower_2.png", className: "right-[2%] top-[26%] w-[32px] opacity-50 sm:right-[4%] sm:w-[48px] lg:right-[6%] lg:w-[58px]", delay: "1.7s", dur: "7.9s", from: "-8deg", to: "7deg" },
  { src: "/flowers/flower_1.png", className: "left-[2%] top-[46.5%] w-[30px] opacity-40 sm:left-[4%] sm:w-[44px] lg:left-[6%] lg:w-[54px]", delay: "0.3s", dur: "7.7s", from: "13deg", to: "-1deg" },
  { src: "/flowers/flower_4.png", className: "right-[2%] top-[47.5%] w-[30px] opacity-40 sm:right-[4%] sm:w-[44px] lg:right-[6%] lg:w-[54px]", delay: "1s", dur: "8.3s", from: "-16deg", to: "-2deg" },
  { src: "/flowers/flower_7.png", className: "right-[2%] top-[59%] w-[30px] opacity-50 sm:right-[4%] sm:w-[46px] lg:right-[6%] lg:w-[56px]", delay: "1.4s", dur: "8s", from: "-6deg", to: "8deg" },
  { src: "/flowers/flower_2.png", className: "left-[2%] top-[60%] w-[30px] opacity-50 sm:left-[4%] sm:w-[44px] lg:left-[6%] lg:w-[54px]", delay: "1.5s", dur: "7.7s", from: "7deg", to: "-7deg" },
  { src: "/flowers/flower_3.png", className: "hidden right-[12%] top-[61.5%] w-[42px] opacity-40 lg:block lg:w-[52px]", delay: "1.2s", dur: "8.1s", from: "-13deg", to: "3deg" },
  { src: "/flowers/flower_5.png", className: "hidden left-[12%] top-[63%] w-[42px] opacity-40 lg:block lg:w-[52px]", delay: "1.6s", dur: "8.2s", from: "10deg", to: "-2deg" },
  { src: "/flowers/flower_4.png", className: "right-[2%] top-[64.5%] w-[30px] opacity-50 sm:right-[4%] sm:w-[46px] lg:right-[6%] lg:w-[56px]", delay: "1.4s", dur: "8.2s", from: "5deg", to: "18deg" },
  { src: "/flowers/flower_6.png", className: "left-[2%] top-[66%] w-[30px] opacity-50 sm:left-[4%] sm:w-[44px] lg:left-[6%] lg:w-[56px]", delay: "0.8s", dur: "7.2s", from: "-14deg", to: "0deg" },
  { src: "/flowers/flower_3.png", className: "hidden left-[6%] top-[82px] w-[44px] opacity-40 sm:block sm:left-[8%] sm:w-[54px] xl:left-[10%]", delay: "0.4s", dur: "7.5s", from: "-10deg", to: "4deg" },
  { src: "/flowers/flower_5.png", className: "hidden right-[6%] top-[140px] w-[44px] opacity-40 sm:block sm:right-[8%] sm:w-[54px] xl:right-[10%]", delay: "1.1s", dur: "7.9s", from: "8deg", to: "-6deg" },
];

export function FlowerField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      {FLOWERS.map((f, i) => (
        <img
          key={i}
          src={f.src}
          alt=""
          className={`flower-sway absolute select-none ${f.className}`}
          style={{
            animationDelay: f.delay,
            animationDuration: f.dur,
            ["--flower-from" as string]: f.from,
            ["--flower-to" as string]: f.to,
          }}
        />
      ))}
    </div>
  );
}
