import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [muted, setMuted] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const nextVdRef = useRef(null);
  const audioRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);

    // On first click, unmute and play video and audio
    if (muted) {
      setMuted(false);
      if (nextVdRef.current) {
        nextVdRef.current.muted = false;
        nextVdRef.current.play();
      }
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play();
      }
      // Dispatch to global for sync (optional)
      window.dispatchEvent(new CustomEvent("global-audio-mute", { detail: { muted: false } }));
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    // The effect below will sync media elements accordingly

    // Dispatch global mute event for synchronization
    window.dispatchEvent(new CustomEvent("global-audio-mute", { detail: { muted: newMuted } }));
  };

  // Ensure muted state is properly enforced on videos and audio every time currentIndex or muted changes
  useEffect(() => {
    if (nextVdRef.current) {
      nextVdRef.current.muted = muted;
      if (muted) {
        nextVdRef.current.pause();
      } else {
        nextVdRef.current.play();
      }
    }
    if (audioRef.current) {
      audioRef.current.muted = muted;
      if (muted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [muted, currentIndex]);

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos]);

  // Listen to global audio mute events for sync with other components
  useEffect(() => {
    const onGlobalMute = (e) => {
      setMuted(e.detail.muted);
      if (nextVdRef.current) {
        nextVdRef.current.muted = e.detail.muted;
        if (e.detail.muted) {
          nextVdRef.current.pause();
        } else {
          nextVdRef.current.play();
        }
      }
      if (audioRef.current) {
        audioRef.current.muted = e.detail.muted;
        if (e.detail.muted) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
    };

    window.addEventListener("global-audio-mute", onGlobalMute);
    return () => window.removeEventListener("global-audio-mute", onGlobalMute);
  }, []);

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current?.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* Audio element for hero section */}
      <audio ref={audioRef} src="/audio/game-trailer.mp3" loop muted={muted} preload="auto" />

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 via-pink-900 to-black"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted={muted}
                  id="current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />
              </div>
            </VideoPreview>
          </div>

          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted={muted}
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
            autoPlay
            loop
            muted={muted}
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* Mute/Unmute button in hero section */}
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute video and audio" : "Mute video and audio"}
          className="absolute top-20 right-5 z-[100] rounded-full bg-black bg-opacity-50 p-3 text-white hover:bg-opacity-80 transition"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-white">
          G<b>A</b>MING
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-white">
              avy<b>r</b>a
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-white">
              The ultimate game hub <br /> Unleash the power of gaming
            </p>

            <Button
              id="watch-trailer"
              title="START YOUR ADVENTURE🎮"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;
