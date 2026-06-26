import * as d3 from 'd3';

type CreateGwangMyeongGuide = {
    viewer: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    guideEntry: GuideInfoEntry;
    storeName: Map<string, string>;
    fireStatus: Map<string, boolean>;
};

const useCreateMarketGuide = () => {
    const gwangmyeongGuide = ({ 
        viewer,
        guideEntry, 
        storeName, 
        fireStatus 
    } : Partial<CreateGwangMyeongGuide>) => {
        if (!viewer || !guideEntry || !storeName || !fireStatus) return;
        const viewerLayer = viewer.selectAll<SVGGElement, null>('g.viewer_layer')
            .data([null])
            .join('g')
            .attr('class', 'viewer_layer');

        const sectors = viewerLayer.selectAll<SVGGElement, MarketGuideSector>('g.sector')
            .data(guideEntry.sectors, (sector) => sector.sector)
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
            .attr('fill', (store) => storeName.get(store.store) ? 
                (fireStatus.get(store.store) ? 'red' : 'limegreen') : store.graphics.fire_status.fill);

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
            .text((store) =>  storeName.get(store.store) ?? '')
            .attr('letter-spacing', '0.5px');
    };

    return {
        gwangmyeongGuide
    }
}
export default useCreateMarketGuide;