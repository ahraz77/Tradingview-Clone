import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthCallback({ onCallback }) {
  useEffect(() => {
    // Get authorization code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      onCallback(code);
    }
  }, [onCallback]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Authenticating...</h2>
        <p className="text-zinc-400">Please wait while we connect to Upstox</p>
      </div>
    </div>
  );
}
