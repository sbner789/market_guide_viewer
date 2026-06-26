import { useMarketGuideApi } from "@/hooks/api";
import { useGuideViewerUtils } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from 'd3';
import useCreateMarketGuide from "./marketGuide/useCreateMarketGuide";

const useMarketGuideViewer = () => {
    const viewerRef = useRef<SVGSVGElement | null>(null);

    const { gwangmyeongGuide } = useCreateMarketGuide();

    const { storeNames, guideMap } = useMarketGuideApi();

    const storeNameMap = useMemo(() =>  
            new Map((storeNames ?? []).map((store) => [store.id, store.store_name])),[storeNames]);
        
    const fireStatusMap = useMemo(() =>
            new Map((storeNames ?? []).map((store) => [store.id, store.fire_status === "화재 경보"])),[storeNames]);

    useEffect(() => {
        if (!guideMap || !viewerRef.current) return;
        const svg = d3.select<SVGSVGElement, unknown>(viewerRef.current)
            .attr('viewBox', `0 0 ${guideMap.guide_width} ${guideMap.guide_height}`);

        gwangmyeongGuide({ 
            viewer: svg, 
            guideEntry: guideMap,
            storeName: storeNameMap,
            fireStatus: fireStatusMap
        });
    }, [guideMap])

    return { viewerRef };
}
export default useMarketGuideViewer;