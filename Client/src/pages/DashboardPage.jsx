import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import Header from '../components/dashboard/Header.jsx';
import MetricCards from '../components/dashboard/MetricCards.jsx';
import WatchedVideos from '../components/dashboard/WatchedVideos.jsx';
import PerformanceChart from '../components/dashboard/PerformanceChart.jsx';
import WatchTimeMetrics from '../components/dashboard/WatchTimeMetrics.jsx';
import CreatorCard from '../components/CreatorCard';
import PipelineModal from '../components/PipelineModal';
import { ArrowRight, Terminal } from 'lucide-react';

export default function DashboardPage({ user }) {
  const [dashboardData, setDashboardData] = useState(null);

  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const backendReadyRef = useRef(false);
  const derivedIdRef = useRef(''); 

  const activeUserId = user?.id || 'anonymous';
  const activeUserName = user?.name || 'Guest User';
  const activeUserEmail = user?.email || 'Local Session';

  const pipelineSteps = [
    "Triggering YouTube iFrame API...",
    "Extracting Video Context & Telemetry...",
    "Fetching Transcript Records...",
    "AI Layer: Generating Learning Modules...",
    "AI Layer: Compiling Checkpoint Questions...",
    "Success! Loading Workspace Suite..."
  ];

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
  }, [isProcessing, navigate]);

  const handleGenerate = (e) => {
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

      fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: derivedId, youtubeUrl: videoUrl, userId: activeUserId })
      })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Server error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if(data.success) {
          backendReadyRef.current = true;
        } else {
          console.error(data.error);
          alert("Error processing video: " + data.error);
          setIsProcessing(false);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Failed to connect to the server: " + err.message);
        setIsProcessing(false);
      });
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/dashboard/user/${activeUserId}`);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error(`Dashboard fetch failed: ${res.status} ${text}`);
          throw new Error(`Dashboard fetch failed: ${res.status}`);
        }
        const json = await res.json();
        
        if (json.success) {
          setDashboardData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [activeUserId]);

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden relative bg-neutral-950 text-neutral-100">
      <Sidebar userName={activeUserName} userEmail={activeUserEmail} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 lg:p-10 space-y-8 z-10">
        <Header userName={activeUserName} />
        
        {/* Swiss Workspace Generator Banner */}
        <div className="p-6 sm:p-8 border border-neutral-800 bg-neutral-900/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">
                <Terminal className="w-3.5 h-3.5" /> GENERATE NEW RETENTION SUITE
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                LAUNCH NEW WORKSPACE FROM YOUTUBE
              </h2>
              <p className="text-xs mt-1 max-w-xl font-mono text-neutral-400">
                Auto-generates interactive checkpoints, Feynman verification tests, and tracking milestones.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube Video URL..."
                className="w-full sm:w-80 px-4 py-2.5 font-mono text-xs border outline-none transition-all bg-neutral-950 border-neutral-700 focus:border-white text-white placeholder:text-neutral-600"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border shrink-0 bg-white text-neutral-950 border-white hover:bg-neutral-200"
              >
                <span>INITIALIZE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Metric Cards Component */}
        <MetricCards dashboardData={dashboardData} />

        {/* Analytics & Registry Split Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <PerformanceChart dashboardData={dashboardData} />
          </div>
          <div className="xl:col-span-1 flex flex-col">
            <WatchTimeMetrics dashboardData={dashboardData} />
          </div>
        </div>

        {/* Watched / Active Courses Component */}
        <WatchedVideos 
          recentSessions={dashboardData?.recentSessions || []} 
        />
        
        <div className="pt-4">
          <CreatorCard className="ml-auto w-fit max-w-full" />
        </div>
      </div>

      {isProcessing && <PipelineModal currentStep={currentStep} pipelineSteps={pipelineSteps} />}
    </div>
  );
}
