import storyImg from "@/assets/our-story.jpg";

const OurStory = () => (
  <section className="bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Decorative background elements */}
    <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-float"></div>
    <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-float animation-delay-2000"></div>
    
    <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
      {/* Image Section */}
      <div className="relative reveal group">
        <div className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-purple-200/50">
          <img 
            src={storyImg} 
            alt="Our Story" 
            loading="lazy" 
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105" 
            style={{ height: 560 }} 
          />
        </div>
        {/* Decorative overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* Established Badge */}
        <div className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-4 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-purple-400/30">
          <span className="block text-[0.6rem] uppercase tracking-[0.1em] opacity-80 mb-0.5">Est.</span>
          <span className="font-['Cormorant_Garamond',serif] text-xl font-semibold">Since 2023</span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="reveal reveal-d2">
        <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Our Journey
        </span>
        <h2 className="text-3xl md:text-4xl font-light font-heading mb-6 bg-gradient-to-r from-[#1e1b4b] to-[#5b21b6] bg-clip-text text-transparent">
          Our Story
        </h2>
        <p className="font-body text-gray-600 leading-relaxed mb-4 text-[0.92rem]">
          Aazhi grew from a mother's relentless pursuit of perfection in baby fashion. With the arrival of our second little miracle, finding exquisitely crafted, cozy clothing became an obsession. Dissatisfied with the choices, we decided to create our own.
        </p>
        <p className="font-body text-gray-600 leading-relaxed mb-4 text-[0.92rem]">
          Nurtured with love and dedication, Aazhi emerged, offering a collection designed for ages 0 to 5. Each piece embodies our belief that every baby and toddler deserves to be wrapped in comfort and dressed in elegance.
        </p>
        <p className="font-body text-gray-600 leading-relaxed mb-8 text-[0.92rem]">
          Every stitch is guided by a mother's instinct — safe, soft, sustainable, and simply beautiful.
        </p>
        <p className="font-['Cormorant_Garamond',serif] text-foreground font-medium italic text-lg mb-8 relative pl-6 border-l-4 border-purple-400">
          "Where love, comfort, and style unite to dress your little ones in nothing but the finest."
        </p>
        <a 
          href="#" 
          className="inline-block px-8 py-3.5 rounded-full font-bold text-white text-[0.72rem] uppercase tracking-[0.16em] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-purple-300/30 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400"
        >
          Read Our Story
        </a>
      </div>
    </div>

    <style>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) translateX(0px);
        }
        25% {
          transform: translateY(-10px) translateX(5px);
        }
        50% {
          transform: translateY(-20px) translateX(0px);
        }
        75% {
          transform: translateY(-10px) translateX(-5px);
        }
      }
      
      .animate-float {
        animation: float 8s ease-in-out infinite;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
    `}</style>
  </section>
);

export default OurStory;