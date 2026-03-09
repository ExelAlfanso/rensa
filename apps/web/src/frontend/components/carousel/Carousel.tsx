import { carouselData } from "@/frontend/datas/carouselDatas";
import Image from "next/image";
export default function Carousel() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };
  return (
    <div className="carousel w-full h-[76vh]">
      {carouselData.map((slide, index) => {
        const prevId =
          carouselData[(index - 1 + carouselData.length) % carouselData.length]
            .id;
        const nextId = carouselData[(index + 1) % carouselData.length].id;

        return (
          <div
            key={slide.id}
            id={slide.id}
            className="carousel-item relative w-full h-[40vh] md:h-[52vh]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>

            <div className="absolute top-[25vh] md:top-[30vh] xl:right-[5vw] right-[5vw] w-[40vw] md:w-[25vw] xl:w-[15vw] bg-[#fafafa] z-20 rounded-3xl shadow-lg overflow-visible">
              <div className="p-6 md:text-[18px] flex flex-col font-figtree text-[12px] font-semibold text-primary">
                {slide.title}
                <div className="text-[8px] md:text-[10px] lg:text-[12px]">
                  {slide.specs.map((s, i) => (
                    <div key={i} className="mt-2 font-light text-black-200">
                      {s.label}
                      <div className="font-thin text-black lg:mt-1">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute flex justify-between -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                onClick={() => handleScroll(prevId)}
                className="flex items-center justify-center w-8 h-8 transition rounded-full cursor-pointer bg-white/70 text-black/70 hover:bg-white/90 hover:text-black/90"
              >
                ❮
              </button>
              <button
                onClick={() => handleScroll(nextId)}
                className="flex items-center justify-center w-8 h-8 transition rounded-full cursor-pointer bg-white/70 text-black/70 hover:bg-white/90 hover:text-black/90"
              >
                ❯
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
