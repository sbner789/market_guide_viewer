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
                // width: '100%',
                // height: '100%',
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