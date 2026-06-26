import { useMarketGuideApi } from "@/hooks/api";
import { useGuideViewerNavigator } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from 'd3';

const useMarketGuideViewer = () => {
    const viewerRef = useRef<SVGSVGElement | null>(null);
    const { storeNames, guideMap } = useMarketGuideApi();

    const {  } = useGuideViewerNavigator({ viewer: viewerRef.current });

    const storeNameMap = useMemo(() =>  
        new Map((storeNames ?? []).map((store) => [store.id, store.store_name])),[storeNames]);

    const fireStatusMap = useMemo(() =>
        new Map((storeNames ?? []).map((store) => [store.id, store.fire_status === "화재 경보"])),[storeNames]);

    useEffect(() => {
        if (!guideMap || !storeNames || !viewerRef.current) return;

        const svg = d3.select<SVGSVGElement, unknown>(viewerRef.current);

        svg.attr('viewBox', `0 0 ${guideMap.guide_width} ${guideMap.guide_height}`);

        const zoomLayer = svg.selectAll<SVGGElement, null>('g.zoom-layer')
            .data([null])
            .join('g')
            .attr('class', 'zoom-layer');

        const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            zoomLayer.attr('transform', event.transform.toString());
        }

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 40])
            .translateExtent([
                [-100, -100],
                [guideMap.guide_width + 100, guideMap.guide_height + 100]
            ])
            .on('zoom', zoomed);

        svg.call(zoom);

        const sectors = zoomLayer.selectAll<SVGGElement, MarketGuideSector>('g.sector')
            .data(guideMap.sectors, (sector) => sector.sector)
            .join('g')
            .attr('class', 'sector')
            .attr('id', (sector) => sector.sector);

        const sectionGroups = sectors.selectAll<SVGGElement, MarketGuideSection>('g.section')
            .data((sector) => sector.sections, (section) => section.section)
            .join('g')
            .attr('class', 'section')
            .attr('id', (section) => section.section);

        const storeGroups = sectionGroups.selectAll<SVGGElement, MarketGuideStore>('g.store')
            .data((section) => section.stores, (store) => store.store)
            .join('g')
            .attr('class', 'store')
            .attr('id', (store) => store.store);

        storeGroups
            .selectAll<SVGRectElement, SpaceShape>('rect')
            .data((store) => [store.graphics.space])
            .join('rect')
            .attr('x', (store) => store.x)
            .attr('y', (store) => store.y)
            .attr('width', (store) => store.width)
            .attr('height', (store) => store.height)
            .attr('fill', (store) => store.fill)
            .attr('stroke', (store) => store.stroke)
            .attr('stroke-width', (store) => store.strokeWidth);

        storeGroups
            .selectAll<SVGCircleElement, MarketGuideStore>('circle')
            .data((store) => store.graphics.fire_status ? [store] : [])
            .join('circle')
            .attr('cx', (store) => store.graphics.fire_status.cx)
            .attr('cy', (store) => store.graphics.fire_status.cy)
            .attr('r', (store) => store.graphics.fire_status.r)
            .attr('fill', (store) => storeNameMap.get(store.store) ? 
                (fireStatusMap.get(store.store) ? 'red' : 'limegreen') : store.graphics.fire_status.fill);

        storeGroups
            .selectAll<SVGTextElement, MarketGuideStore>('text')
            .data((store) => [store])
            .join('text')
            .attr('x', (store) => store.graphics.space.x + store.graphics.space.width / 2)
            .attr('y', (store) => store.graphics.space.y + store.graphics.space.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 6)
            .attr('writing-mode', (store) => (store.graphics.space.height > store.graphics.space.width ? 'tb' : ''))
            .text((store) =>  storeNameMap.get(store.store) ?? '')
            .attr('letter-spacing', '0.5px');

    },[guideMap, storeNameMap, fireStatusMap]);

    return { viewerRef };
}
export default useMarketGuideViewer;