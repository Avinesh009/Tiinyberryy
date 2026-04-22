import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 py-16 md:py-20 px-4 text-center relative overflow-hidden">
      {/* Decorative animated blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-slow animation-delay-1000"></div>
      
      <div className="max-w-xl mx-auto relative z-10">
        <div className="animate-fadeInUp">
          <span className="inline-block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/80 mb-1 animate-pulse-slow">
            Stay in the loop
          </span>
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl md:text-4xl font-light text-white mb-3 drop-shadow-md">
            Join the Aazhi Family
          </h2>
          <p className="text-white/80 text-[0.88rem] mb-7">
            Subscribe for exclusive offers, new arrivals, parenting tips & early access to seasonal collections.
          </p>
          
          {submitted ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 text-white font-semibold animate-scaleIn border border-white/30 shadow-lg">
              🎉 Thank you for subscribing! Welcome to the family.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-md mx-auto overflow-hidden rounded-full border border-white/40 shadow-lg transition-all duration-300 hover:shadow-white/20 focus-within:shadow-white/30">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/15 text-white placeholder-white/55 px-5 py-3 text-[0.85rem] outline-none border-none rounded-l-full focus:bg-white/25 transition-all duration-300"
                required
              />
              <button 
                type="submit" 
                className="bg-white text-purple-600 font-bold text-[0.7rem] uppercase tracking-[0.14em] px-6 rounded-r-full hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex-shrink-0 shadow-md"
              >
                Subscribe
              </button>
            </form>
          )}
          
          <p className="text-white/60 text-[0.65rem] mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default Newsletter;