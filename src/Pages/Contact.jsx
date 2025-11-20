import React, { useEffect } from "react";
import SocialLinks from "../components/SocialLinks";
import KomentarSupabase from "../components/CommentarSupabase";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  return (
    <>
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          <span
            style={{
              color: "#6366f1",
              backgroundImage:
                "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Contact Me
          </span>
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Connect with me on LinkedIn and GitHub.
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center px-[5%] md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 gap-12">
          <div
            data-aos="fade-right"
            data-aos-duration="1200"
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-300 hover:shadow-[#6366f1]/10 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 justify-center">
              <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
              Connect With Me
            </h3>

            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>

          {/* Comments Section */}
          <div
            data-aos="fade-up"
            data-aos-duration="1400"
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-300 hover:shadow-[#6366f1]/10"
          >
            <KomentarSupabase />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
