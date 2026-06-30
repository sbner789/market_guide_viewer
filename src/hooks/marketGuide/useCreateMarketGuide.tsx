import * as d3 from 'd3';

type CreateGwangMyeongGuide = {
    viewer: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    guideEntry: GuideInfoEntry;
    storeName: Map<string, string>;
    fireStatus: Map<string, boolean>;
};

const useCreateMarketGuide = () => {
    const truncateText = (text: string, maxChars: number) => {
        if (text.length <= maxChars) return text;
        return text.slice(0, maxChars) + '···';
    };

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

        const showTooltip = (event: MouseEvent, store: MarketGuideStore) => {
            const title = storeName.get(store.store) ?? '';
            if (!title) return;

            d3.selectAll('div#market_viewer_container')
                .selectAll<HTMLDivElement, null>('div.store-tooltip')
                .data([null])
                .join('div')
                .attr('class', 'store-tooltip')
                .style('position', 'fixed')
                .style('pointer-events', 'none')
                .style('background', 'rgba(0, 0, 0, 0.75)')
                .style('color', '#fff')
                .style('padding', '4px 8px')
                .style('border-radius', '4px')
                .style('font-size', '20px')
                .style('white-space', 'nowrap')
                .style('z-index', '9999')
                .style('left', `${event.clientX + 10}px`)
                .style('top', `${event.clientY + 10}px`)
                .text(title);
        };

        const hideTooltip = () => {
            d3.select('div.store-tooltip').remove();
        };

        //const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const storeGroups = sectionGroups.selectAll<SVGGElement, MarketGuideStore>('g.store')
            .data((section) => section.stores, (store) => store.store)
            .join('g')
            .attr('class', 'store')
            .attr('id', (store) => store.store)
            .attr("title", (store) => storeName.get(store.store) ?? '')
            .attr('cursor', "pointer")
            .on('click', (event: MouseEvent, store: MarketGuideStore) => {
                event.stopPropagation();
                showTooltip(event, store);
            })
            .on('mouseleave', () => {
                hideTooltip();
            })

        storeGroups
            .selectAll<SVGRectElement, SpaceShape>('rect')
            .data((store) => [store])
            .join('rect')
            .attr('x', (store) => store.graphics.space.x)
            .attr('y', (store) => store.graphics.space.y)
            .attr('width', (store) => store.graphics.space.width)
            .attr('height', (store) => store.graphics.space.height)
            .attr('fill', (store) => store.graphics.space.fill)
            .attr('stroke', (store) => store.graphics.space.stroke)
            .attr('stroke-width', (store) => store.graphics.space.strokeWidth)
    
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
            .text((store) =>  truncateText(storeName.get(store.store) ?? '', 6))
            .attr('letter-spacing', '1px')
            .attr('cursor', "pointer")
            .attr('pointerEvents', 'none')
    };

    return {
        gwangmyeongGuide
    }
}
export default useCreateMarketGuide;