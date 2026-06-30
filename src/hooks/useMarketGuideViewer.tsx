import { useMarketGuideApi } from "@/hooks/api";
import { useGuideViewerUtils } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from 'd3';
import useCreateMarketGuide from "./marketGuide/useCreateMarketGuide";

type SelectMarket = {
    market: string
}

const useMarketGuideViewer = ({
    market
} : SelectMarket) => {
    const viewerRef = useRef<SVGSVGElement | null>(null);

    const { gwangmyeongGuide } = useCreateMarketGuide();

    const { storeNames, guideMap } = useMarketGuideApi();

    const { handleZoomAndPanning } = useGuideViewerUtils();

    const storeNameMap = useMemo(() =>  
            new Map((storeNames ?? []).map((store) => [store.id, store.store_name])),[storeNames]);
        
    const fireStatusMap = useMemo(() =>
            new Map((storeNames ?? []).map((store) => [store.id, store.fire_status === "화재 경보"])),[storeNames]);

    useEffect(() => {
        if (!viewerRef.current) return;
        const svg = d3.select<SVGSVGElement, unknown>(viewerRef.current);

        switch (market) {
            case "gwangmyeong":
                if (!guideMap) return;
                svg.attr('viewBox', `0 0 ${guideMap.guide_width} ${guideMap.guide_height}`);
                svg.call(handleZoomAndPanning({ viewer: svg, viewerData: guideMap }));
                gwangmyeongGuide({ 
                    viewer: svg, 
                    guideEntry: guideMap,
                    storeName: storeNameMap,
                    fireStatus: fireStatusMap
                });
                break;
            default:
                console.log(`we are missing market.`);
        }
    }, [guideMap])

    return { viewerRef };
}
export default useMarketGuideViewer;