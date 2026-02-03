"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";
import img1  from "/img1.png"
import img2  from "/img2.png"
import img3  from "/img3.jpg"
export function ImagesSliderDemo() {
  const images = [
    '/img1.png',
    '/img2.png',
    '/img3.jpg',
  ];
  return (
    <ImagesSlider className="h-[30rem] rounded-2xl my-10 " images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Discover Asia
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Discover Asia →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
