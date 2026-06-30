import { useMarketGuideViewer, useGuideViewerUtils } from "@/hooks";
import { useState } from "react";

const MarketGuide = () => {
    const [market] = useState<string>("gwangmyeong");
    const { viewerRef } = useMarketGuideViewer({ market });
    const { handleFullScreen, selectFullscreenRef } = useGuideViewerUtils() ;

    return (
        <div
            id="market_viewer_container"
            ref={selectFullscreenRef}
            style={{
                position: 'relative',
                alignItems: 'center',
                // width: '66.66666666666667%',
                // height: '66.66666666666667%',
                width: '1280px',
                height: '720px',
            }}
        >
            <button 
                style={{ 
                    position: 'absolute',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    top: "20px",
                    left: "20px",
                    minWidth: "120px",
                    minHeight: "40px",
                    textAlign: "center",
                    fontSize: "20px",
                    borderRadius: "6px",
                    boxSizing: "border-box"
                }} 
                onClick={() => {
                    handleFullScreen()
                }}
            >
                Fullscreen
            </button>
            <svg
                id="market_viewer"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid black",
                    boxSizing: "border-box",
                }}
                ref={viewerRef}
                preserveAspectRatio="xMidYMid meet"
            ></svg>
        </div>
    )
}
export default MarketGuide;