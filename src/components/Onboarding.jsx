import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types & Data ---
const PLANS = [
  {
    id: "starter",
    name: "Standard",
    price: "$2,500/mo",
    quality: "Good",
    resolution: "1080p Web",
    devices: "1 Active Project",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$5,000/mo",
    quality: "Better",
    resolution: "4K + App",
    devices: "2 Active Projects",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    quality: "Best",
    resolution: "Full Ecosystem",
    devices: "Unlimited",
  },
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("growth");
  // const [formData, setFormData] = useState({ email: "", password: "" });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Welcome to Damieus Architecture.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-obsidian text-white flex flex-col font-sans selection:bg-neon-cyan selection:text-black">
      {/* Header / Nav */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-tighter font-mono text-neon-cyan uppercase hover:opacity-80 transition-opacity"
        >
          Damieus_
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-bold hover:underline"
        >
          Back to Site
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto w-16 h-16 rounded-full border-2 border-neon-cyan flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-neon-cyan animate-pulse" />
                </div>
                <span className="uppercase text-xs font-mono tracking-widest text-gray-500">
                  Step 1 of 3
                </span>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Finish setting up your <br />
                  <span className="text-neon-cyan">Digital Architecture.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-md mx-auto">
                  Digital transformation is just a few clicks away. No commitments, cancel anytime.
                </p>
                <div className="pt-6">
                  <button
                    onClick={nextStep}
                    className="bg-neon-cyan text-black text-xl font-bold px-12 py-4 rounded-md hover:bg-white transition-colors flex items-center gap-2 mx-auto"
                  >
                    Next <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CHOOSE PLAN */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <span className="uppercase text-xs font-mono tracking-widest text-gray-500">
                    Step 2 of 3
                  </span>
                  <h2 className="text-3xl font-bold mt-2">Choose your plan.</h2>
                  <ul className="text-left max-w-xs mx-auto mt-4 space-y-3 text-gray-300">
                    <li className="flex gap-3">
                      <Check className="text-neon-cyan flex-shrink-0" /> No commitments, cancel anytime.
                    </li>
                    <li className="flex gap-3">
                      <Check className="text-neon-cyan flex-shrink-0" /> All-access to Damieus tech stack.
                    </li>
                    <li className="flex gap-3">
                      <Check className="text-neon-cyan flex-shrink-0" /> 24/7 architecture support.
                    </li>
                  </ul>
                </div>

                {/* Plan Selection Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-4 md:p-6 rounded-xl border-2 transition-all duration-300 relative ${
                        selectedPlan === plan.id
                          ? "bg-neon-cyan/10 border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)]"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-cyan text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Selected
                        </div>
                      )}
                      <div className="text-center">
                        <div
                          className={`w-full py-4 flex items-center justify-center mb-4 rounded-lg ${
                            selectedPlan === plan.id ? "bg-neon-cyan text-black" : "bg-white/10"
                          }`}
                        >
                          <span className="font-bold uppercase tracking-wider text-xs md:text-sm">
                            {plan.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">Monthly Price</p>
                        <p className="text-lg md:text-xl font-bold mb-4">{plan.price}</p>

                        <div className="space-y-2 text-xs md:text-sm text-gray-300 border-t border-white/10 pt-4">
                          <p>
                            <span className="text-gray-500 block text-[10px] uppercase">
                              Quality
                            </span>{" "}
                            {plan.quality}
                          </p>
                          <p>
                            <span className="text-gray-500 block text-[10px] uppercase">
                              Output
                            </span>{" "}
                            {plan.resolution}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    onClick={prevStep}
                    className="w-full md:w-1/4 border border-white/20 text-white text-xl font-bold px-8 py-4 rounded-md hover:border-white/40 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full md:w-3/4 bg-neon-cyan text-black text-xl font-bold px-8 py-4 rounded-md hover:bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CREATE ACCOUNT */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto space-y-6"
              >
                <div className="text-center mb-6">
                  <span className="uppercase text-xs font-mono tracking-widest text-gray-500">
                    Step 3 of 3
                  </span>
                  <h2 className="text-3xl font-bold mt-2">Create a password to start.</h2>
                  <p className="text-gray-400 mt-2">
                    Just a few more steps and you&apos;re done. <br />
                    We hate paperwork, too.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="group relative">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full bg-charcoal border border-white/20 rounded-md px-4 py-4 text-white focus:border-neon-cyan focus:outline-none transition-colors peer"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Add a password"
                      required
                      className="w-full bg-charcoal border border-white/20 rounded-md px-4 py-4 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="offers" className="accent-neon-cyan w-5 h-5" />
                    <label htmlFor="offers" className="text-sm text-gray-400">
                      Please do not email me special offers.
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-1/3 border border-white/20 text-white text-xl font-bold px-8 py-4 rounded-md hover:border-white/40 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-neon-cyan text-black text-xl font-bold px-8 py-4 rounded-md hover:bg-white transition-colors"
                    >
                      Start Membership
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/5 bg-black/50 text-gray-500 text-sm">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">Questions? Call 1-800-DAMIEUS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#" className="hover:underline">
              FAQ
            </a>
            <a href="#" className="hover:underline">
              Help Center
            </a>
            <a href="#" className="hover:underline">
              Terms of Use
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Cookie Preferences
            </a>
            <a href="#" className="hover:underline">
              Corporate Info
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
