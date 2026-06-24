import { useMarketGuideApi } from "@/hooks/api";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from 'd3';

const useMarketGuideViewer = () => {
    const viewerRef = useRef<SVGSVGElement | null>(null);
    const { storeNames, guideMap } = useMarketGuideApi();

    const storeNameMap = useMemo(() =>  
        new Map((storeNames ?? []).map((store) => [store.id, store.store_name])),[storeNames]);

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
            .data((sector) => sector.sections, (section) => section.section_name)
            .join('g')
            .attr('class', 'section')
            .attr('id', (section) => section.section_name);

        const storeGroups = sectionGroups.selectAll<SVGGElement, StoreShape>('g.store')
            .data((section) => section.stores, (store) => store.id)
            .join('g')
            .attr('class', 'store')
            .attr('id', (store) => store.id);

        storeGroups
            .selectAll<SVGRectElement, StoreShape>('rect')
            .data((store) => [store])
            .join('rect')
            .attr('x', (store) => store.x)
            .attr('y', (store) => store.y)
            .attr('width', (store) => store.width)
            .attr('height', (store) => store.height)
            .attr('fill', (store) => store.fill)
            .attr('stroke', (store) => store.stroke)
            .attr('stroke-width', (store) => store.strokeWidth);

        storeGroups
            .selectAll<SVGTextElement, StoreShape>('text')
            .data((store) => [store])
            .join('text')
            .attr('x', (store) => store.x + store.width / 2)
            .attr('y', (store) => store.y + store.height / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 6)
            .attr('writing-mode', (store) => (store.height > store.width ? 'tb' : ''))
            .text((store) => storeNameMap.get(store.id) ?? '')
            .attr('letter-spacing', '0.5px')

    },[guideMap, storeNameMap]);

    return { viewerRef };
}
export default useMarketGuideViewer;