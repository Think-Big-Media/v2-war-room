export default function Index() {
  return (
    <div className="min-h-screen bg-war-room-background text-war-room-text">
      {/* Header - 40px height */}
      <header className="h-10 bg-war-room-header border-b border-war-room-border/8">
        <div className="h-full px-6 flex items-center">
          <h1 className="text-lg font-bold">WAR ROOM DASHBOARD V2</h1>
        </div>
      </header>
      
      {/* Main Content - Two equal columns */}
      <main className="h-[calc(100vh-40px)] p-[15px] flex gap-[15px]">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-[15px]">
          {/* Political Map Card - 300px height */}
          <div className="h-[300px] bg-war-room-card border border-war-room-border/8 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Political Map</h2>
            <div className="h-full flex items-center justify-center text-war-room-text/60">
              <div className="text-center">
                <div className="w-48 h-32 mx-auto mb-4 bg-war-room-border/5 rounded-lg flex items-center justify-center">
                  <span className="text-sm">Interactive Map Component</span>
                </div>
                <p className="text-sm">Electoral map visualization</p>
              </div>
            </div>
          </div>
          
          {/* SWOT Radar Card - Remaining height */}
          <div className="flex-1 bg-war-room-card border border-war-room-border/8 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">SWOT Analysis Radar</h2>
            <div className="h-full flex items-center justify-center text-war-room-text/60">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 bg-war-room-border/5 rounded-full flex items-center justify-center">
                  <span className="text-sm">Radar Chart</span>
                </div>
                <p className="text-sm">Strengths, Weaknesses, Opportunities, Threats</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-[15px]">
          {/* Phrase Cloud Card - 250px height */}
          <div className="h-[250px] bg-war-room-card border border-war-room-border/8 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Trending Phrases</h2>
            <div className="h-full flex items-center justify-center text-war-room-text/60">
              <div className="text-center">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["Healthcare", "Economy", "Security", "Jobs", "Climate", "Immigration"].map((phrase, i) => (
                    <div key={i} className="px-3 py-1 bg-war-room-border/5 rounded text-xs">
                      {phrase}
                    </div>
                  ))}
                </div>
                <p className="text-sm">Word cloud visualization</p>
              </div>
            </div>
          </div>
          
          {/* Metrics Grid - 130px height */}
          <div className="h-[130px] bg-war-room-card border border-war-room-border/8 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3 text-war-room-text/80">Key Metrics</h3>
            <div className="grid grid-cols-4 gap-3 h-full">
              {[
                { label: "Approval", value: "68%", color: "text-green-400" },
                { label: "Swing States", value: "7", color: "text-blue-400" },
                { label: "Fundraising", value: "$2.4M", color: "text-purple-400" },
                { label: "Volunteers", value: "15.2K", color: "text-orange-400" }
              ].map((metric, i) => (
                <div key={i} className="bg-war-room-border/5 rounded p-2 text-center">
                  <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                  <div className="text-xs text-war-room-text/60">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions Card - 215px height */}
          <div className="h-[215px] bg-war-room-card border border-war-room-border/8 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Launch Campaign", "Schedule Event", "Send Alert", "Update Status",
                "Generate Report", "Contact Volunteers"
              ].map((action, i) => (
                <button key={i} className="p-3 bg-war-room-border/5 hover:bg-war-room-border/10 rounded transition-colors text-sm">
                  {action}
                </button>
              ))}
            </div>
          </div>
          
          {/* Performance Metrics Card - 215px height */}
          <div className="h-[215px] bg-war-room-card border border-war-room-border/8 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              {[
                { label: "Media Mentions", value: "1,247", change: "+12%" },
                { label: "Social Engagement", value: "89.2K", change: "+8%" },
                { label: "Poll Average", value: "52.3%", change: "+2.1%" },
                { label: "Voter Registration", value: "23.1K", change: "+15%" }
              ].map((metric, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-war-room-text/80">{metric.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{metric.value}</div>
                    <div className="text-xs text-green-400">{metric.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
