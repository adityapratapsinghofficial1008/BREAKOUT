import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';

import Navbar from '../components/Navbar';
import UrlForm from '../components/UrlForm';
import FeaturesGrid from '../components/FeaturesGrid';
import WorkflowTimeline from '../components/WorkflowTimeline';
import Footer from '../components/Footer';
import CreatorCard from '../components/CreatorCard';
import PipelineModal from '../components/PipelineModal';
import AuthModal from '../components/AuthModal';
import { authClient } from '../lib/auth';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({ user, setUser }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const backendReadyRef = useRef(false);
  const derivedIdRef = useRef('');
  
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [authView, setAuthView] = useState(null); // 'login' | 'signup' | null

  const pipelineSteps = [
    "Triggering YouTube iFrame API...",
    "Extracting Video Context & Telemetry...",
    "Fetching Transcript Records...",
    "AI Layer: Generating Learning Modules...",
    "AI Layer: Compiling Checkpoint Questions...",
    "Success! Loading Workspace Suite..."
  ];

  // Pipeline execution loop tracker
  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < pipelineSteps.length - 1) {
            return prev + 1;
          } else {
            if (backendReadyRef.current) {
              clearInterval(interval);
              setTimeout(() => {
                setIsProcessing(false);
                setVideoUrl('');
                navigate(`/workspace/${derivedIdRef.current}`);
              }, 800);
            }
            return prev;
          }
        });
      }, 1200); 
    }
    return () => clearInterval(interval);
  }, [isProcessing, videoUrl, navigate, pipelineSteps.length]);

  useGSAP(() => {
    const reveals = gsap.utils.toArray('.scroll-reveal');
    reveals.forEach((element) => {
      gsap.fromTo(element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, { scope: containerRef });

  const handleStartProcessing = (e) => {
    e.preventDefault(); 
    if (videoUrl.trim()) { 
      setCurrentStep(0); 
      setIsProcessing(true); 
      backendReadyRef.current = false;

      let derivedId = "default-video"; 
      try {
        if (videoUrl.includes("v=")) {
          derivedId = videoUrl.split("v=")[1].split("&")[0];
        } else if (videoUrl.includes("youtu.be/")) {
          derivedId = videoUrl.split("youtu.be/")[1].split("?")[0];
        }
      } catch (err) {
        console.error("Error parsing video ID", err);
      }
      derivedIdRef.current = derivedId;

      const activeUserId = user?.id || 'anonymous';

      fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: derivedId, youtubeUrl: videoUrl, userId: activeUserId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          backendReadyRef.current = true;
        } else {
          console.error(data.error);
          alert("Error processing video: " + data.error);
          setIsProcessing(false);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Failed to connect to the server.");
        setIsProcessing(false);
      });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen font-sans overflow-x-hidden bg-neutral-950 text-neutral-100"
    >
      <div className={`transition-all duration-500 ${authView || isProcessing ? 'blur-xl scale-[0.99] pointer-events-none' : ''}`}>
        <Navbar 
          user={user} 
          setAuthView={setAuthView}
          onLogout={() => setUser(null)}
        />
        
        <UrlForm 
          videoUrl={videoUrl} 
          setVideoUrl={setVideoUrl} 
          onSubmit={handleStartProcessing} 
        />
        
        <FeaturesGrid />
        <WorkflowTimeline />
        
        {/* Swiss Editorial CTA Banner */}
        <section className="scroll-reveal py-28 sm:py-36 px-4 sm:px-6 text-center border-t border-neutral-800 bg-neutral-950">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">
              // READY TO MASTER TECHNICAL CONTENT?
            </span>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.05] text-white">
              ESCAPE TUTORIAL HELL. FOREVER.
            </h2>

            <p className="mt-6 text-base sm:text-lg font-normal max-w-lg leading-relaxed text-neutral-400">
              No more passive watching. BREAKOUT verifies retention after every concept and builds real portfolio proof.
            </p>

            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-10 px-8 py-4 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-3 border bg-white text-neutral-950 border-white hover:bg-neutral-200"
              >
                <span>OPEN DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setAuthView('signup')}
                className="mt-10 px-8 py-4 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-3 border bg-white text-neutral-950 border-white hover:bg-neutral-200"
              >
                <span>CREATE FREE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        <Footer />
      </div>

      <CreatorCard className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]" />

      {isProcessing && <PipelineModal currentStep={currentStep} pipelineSteps={pipelineSteps} />}
      
      {authView && (
        <AuthModal 
          authView={authView} 
          setAuthView={setAuthView} 
          onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
        />
      )}
    </div>
  );
}
