// Home.jsx
import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Instagram,
  Sparkles,
  FileText,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { supabase } from "../supabase";
import { useInView, fadeIn, fadeInRight, fadeInLeft, zoomIn } from "../hooks/useInView";
import { FadeIn } from "../hooks/AnimatedComponents";

// Memoized Components with Intersection Observer
const StatusBadge = memo(() => {
  const [ref, isInView] = useInView({ delay: 400, triggerOnce: true });

  return (
    <div
      ref={ref}
      className="inline-block animate-float lg:mx-0"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
            <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
            Ready to Innovate
          </span>
        </div>
      </div>
    </div>
  );
});

const MainTitle = memo(() => {
  const [ref, isInView] = useInView({ delay: 600, triggerOnce: true });

  return (
    <div
      ref={ref}
      className="space-y-2"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
        <span className="relative inline-block">
          <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
          <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            FullStack
          </span>
        </span>
        <br />
        <span className="relative inline-block mt-2">
          <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
          <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Developer
          </span>
        </span>
      </h1>
    </div>
  );
});

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon
            className={`w-4 h-4 text-gray-200 ${text === "Contact"
              ? "group-hover:translate-x-1"
              : "group-hover:rotate-45"
              } transform transition-all duration-300 z-10`}
          />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["FullStack Developer and prompt engineer", "Tech Enthusiast"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/abhijithwinddaa" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/batturaj-abhijith" },

];

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [techStack, setTechStack] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [shouldLoadLottie, setShouldLoadLottie] = useState(false);

  // Lazy load Lottie only when visible
  const [lottieRef, isLottieInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (isLottieInView) {
      // Small delay to ensure smooth loading
      const timer = setTimeout(() => setShouldLoadLottie(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLottieInView]);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  useEffect(() => {
    // Fetch tech stack from Supabase
    const fetchTechStack = async () => {
      try {
        const { data, error } = await supabase
          .from('tech_stack')
          .select('*')
          .order('display_order', { ascending: true })
          .order('category', { ascending: true });
        if (error) throw error;
        setTechStack(data || []);
      } catch (error) {
        setTechStack([]);
      }
    };

    // Fetch resume URL
    const fetchResume = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('resume_url')
          .single();
        if (error) throw error;
        if (data) setResumeUrl(data.resume_url);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchTechStack();
    fetchResume();
  }, []);

  // Optimized Lottie configuration - only created when needed and memoized
  const lottieOptions = useMemo(() => {
    if (!shouldLoadLottie) return null;

    return {
      src: "https://lottie.host/58753882-bb6a-49f5-a2c0-950eda1e135a/NLbpVqGegK.lottie",
      loop: true,
      autoplay: true,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
      },
      style: { width: "100%", height: "100%" },
      className: `w-full h-full transition-all duration-500 ${isHovering ? "scale-[105%] rotate-2" : "scale-[100%]"}`,
    };
  }, [shouldLoadLottie, isHovering]);

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Home">
      <div
        className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="container mx-auto px-[5%] sm:px-6 lg:px-[0%] min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <FadeIn direction="right" delay={200} className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Adjust the placement of StatusBadge */}
                <div className="mt-20 sm:mt-24 md:mt-28 lg:mt-32">
                  <StatusBadge />
                </div>
                <MainTitle />

                {/* Typing Effect */}
                <FadeIn delay={800} className="h-8 flex items-center">
                  <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                </FadeIn>

                {/* Description */}
                <FadeIn delay={1000}>
                  <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light">
                    I’m a Full-Stack Web Developer and Prompt Engineer, turning ideas into seamless digital experiences. From crafting responsive UIs to optimizing AI-driven prompts, I bridge the gap between humans and technology. Whether coding the backend or fine-tuning AI interactions, I build smart, scalable, and intuitive solutions. 🚀
                  </p>
                </FadeIn>

                {/* Tech Stack */}
                <FadeIn delay={1200} className="flex flex-wrap gap-3 justify-start">
                  {techStack.length > 0 ? (
                    techStack.map((tech, index) => (
                      <TechStack key={index} tech={tech.name} />
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No tech stack added yet.</span>
                  )}
                </FadeIn>

                {/* CTA Buttons */}


                {/* Social Links */}
                <FadeIn delay={1600} className="flex gap-4 items-center justify-start">
                  <div className="hidden sm:flex gap-4">
                    {SOCIAL_LINKS.map((social, index) => (
                      <SocialLink key={index} {...social} />
                    ))}
                  </div>
                  {resumeUrl && (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                      <button className="group relative px-6 py-3">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
                        <div className="relative h-full bg-[#030014] backdrop-blur-xl rounded-lg border border-green-500/30 leading-none overflow-hidden">
                          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20"></div>
                          <span className="relative flex items-center justify-center gap-2 text-sm font-medium">
                            <FileText className="w-4 h-4 text-green-400" />
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              View Resume
                            </span>
                          </span>
                        </div>
                      </button>
                    </a>
                  )}
                </FadeIn>
              </div>
            </FadeIn>

            {/* Right Column - Optimized Lottie Animation */}
            <FadeIn
              direction="left"
              delay={600}
              className="w-full py-[10%] sm:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0"
            >
              <div
                ref={lottieRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative w-full opacity-90"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"}`}
                ></div>

                <div
                  className={`relative z-10 w-full opacity-90 transform transition-transform duration-500 ${isHovering ? "scale-105" : "scale-100"}`}
                >
                  {shouldLoadLottie && lottieOptions ? (
                    <DotLottieReact {...lottieOptions} />
                  ) : (
                    // Loading skeleton
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-full aspect-square max-w-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full animate-pulse"></div>
                        <div className="absolute inset-[10%] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-pulse delay-75"></div>
                        <div className="absolute inset-[20%] bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`absolute inset-0 pointer-events-none transition-all duration-700 ${isHovering ? "opacity-50" : "opacity-20"}`}
                >
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${isHovering ? "scale-110" : "scale-100"}`}
                  ></div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
