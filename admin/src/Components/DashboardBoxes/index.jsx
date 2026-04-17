import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { AiOutlineGift, AiTwotonePieChart } from "react-icons/ai";
import { IoStatsChartSharp } from "react-icons/io5";
import { SiProducthunt } from "react-icons/si";

const DashboardBoxes = (props) => {
  const cards = useMemo(
    () => [
      {
        label: "Total Users",
        shortLabel: "Total Users",
        value: props?.users,
        icon: <AiOutlineGift className="text-[24px]" />,
        accentIcon: <IoStatsChartSharp className="text-[30px]" />,
        gradient: "from-[#10b981] via-[#1dc997] to-[#34d399]",
        iconBg: "bg-white/18",
      },
      {
        label: "Total Orders",
        shortLabel: "Total Orders",
        value: props?.orders,
        icon: <AiTwotonePieChart className="text-[26px]" />,
        accentIcon: <IoStatsChartSharp className="text-[30px]" />,
        gradient: "from-[#3872fa] via-[#4b7fff] to-[#6aa3ff]",
        iconBg: "bg-white/18",
      },
      {
        label: "Total Product",
        shortLabel: "Total Product",
        value: props?.products,
        icon: <SiProducthunt className="text-[22px]" />,
        accentIcon: <IoStatsChartSharp className="text-[30px]" />,
        gradient: "from-[#4f46e5] via-[#5b4df1] to-[#7c6bff]",
        iconBg: "bg-white/18",
      },
      {
        label: "Total Category",
        shortLabel: "Total Category",
        value: props?.categorry,
        icon: <SiProducthunt className="text-[22px]" />,
        accentIcon: <IoStatsChartSharp className="text-[28px]" />,
        gradient: "from-[#f43f5e] via-[#f53367] to-[#ff5f7f]",
        iconBg: "bg-white/18",
      },
    ],
    [props?.categorry, props?.orders, props?.products, props?.users],
  );

  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={12}
      navigation
      breakpoints={{
        0: { slidesPerView: 1.15 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      modules={[Navigation]}
      className="dashboadrBoxesSlider"
    >
      {cards.map((card) => (
        <SwiperSlide key={card.label}>
          <div
            className={`group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[24px] border border-white/30 bg-gradient-to-br ${card.gradient} p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="absolute right-[-24px] top-[-24px] h-[120px] w-[120px] rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-36px] left-[-16px] h-[110px] w-[110px] rounded-full bg-black/10 blur-3xl" />

            <div className="relative flex min-h-[92px] items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ${card.iconBg} text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.22)]`}
                >
                  {card.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-[700] uppercase tracking-[0.14em] text-white/78">
                    Overview
                  </p>
                  <h3 className="mt-2 min-h-[48px] text-[20px] font-[800] leading-6 text-white">
                    {card.shortLabel}
                  </h3>
                </div>
              </div>

              <div className="rounded-[16px] bg-white/12 p-3 text-white/90">
                {card.accentIcon}
              </div>
            </div>

            <div className="relative mt-6 flex items-end justify-between">
              <div>
                <p className="text-[34px] font-[900] leading-none tracking-tight">
                  {card.value ?? 0}
                </p>
                <p className="mt-2 text-[13px] font-[600] text-white/72">
                  Updated from dashboard data
                </p>
              </div>

              <div className="flex items-end gap-1.5 opacity-90">
                <span className="block h-5 w-2 rounded-full bg-white/60" />
                <span className="block h-9 w-2 rounded-full bg-white/75" />
                <span className="block h-6 w-2 rounded-full bg-white/60" />
                <span className="block h-11 w-2 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default DashboardBoxes;
