import { useMarketGuideViewer } from "@/hooks";

const MarketGuide = () => {
    const { viewerRef } = useMarketGuideViewer();

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '66.66666666666667%',
                height: '66.66666666666667%',
                // minWidth: 0,
                // minHeight: 0,
                // maxWidth: '1280px',
                // maxHeight: '720px',
            }}
        >
            <svg
                style={{
                    width: "100%",
                    height: "100%",
                }}
                ref={viewerRef}
                viewBox={`0 0 ${1440} ${1080}`}
                preserveAspectRatio="xMidYMid meet"
            ></svg>
        </div>
    )
}
export default MarketGuide;