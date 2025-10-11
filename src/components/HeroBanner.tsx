"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { BANNER_CONTENT } from "@/context";

export const HeroBanner = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<div className="relative overflow-hidden h-full w-[500px] rounded-xl">
			<Swiper
				modules={[Navigation, Pagination, Autoplay, EffectFade]}
				spaceBetween={0}
				slidesPerView={1}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				fadeEffect={{
					crossFade: true,
				}}
				loop={true}
				onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
				className="h-full overflow-hidden"
			>
				{BANNER_CONTENT.map((item, index) => (
					<SwiperSlide key={index} className="relative">
						<Image
							src={item.image}
							alt={item.title}
							fill
							className="object-cover"
							priority={index === 0}
							sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
						/>

						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

						<div className="relative w-full h-full">
							<div className="absolute bg-white/20 backdrop-blur-xl rounded-xl overflow-hidden bottom-5 left-3 right-3 p-4 text-white">
								<div className="max-w-sm">
									<p className="text-md mb-3 font-extralight text-sm leading-relaxed">
										{item.text}
									</p>
									<h3 className="text-xl font-medium text-balance">
										{item.title}
									</h3>
									<p className="text-sm font-extralight">{item.role}</p>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<div className="absolute bottom-2 left-0 right-0 px-4 flex gap-2 z-10">
				{BANNER_CONTENT.map((_, index) => (
					<div
						key={index}
						className={`h-1 flex-1 rounded-full transition-all duration-300 ${
							index === activeIndex ? "bg-yelly" : "bg-white/50"
						}`}
					/>
				))}
			</div>
		</div>
	);
};
