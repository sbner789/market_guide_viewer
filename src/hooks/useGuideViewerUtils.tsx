import * as d3 from 'd3';

type UseGuideViewerUtils = {
    viewer: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    viewerData: GuideInfoEntry;
}

const useGuideViewerUtils = () => {
    const handleZoom = ({ viewer, viewerData } : UseGuideViewerUtils) => {
        if (!viewer) return;

        const viewerLayer = viewer.selectAll<SVGGElement, null>('g.viewer_layer');

        const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            viewerLayer.attr('transform', event.transform.toString());
        }

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 40])
            .translateExtent([
                [-100, -100],
                [viewerData.guide_width + 100, viewerData.guide_height + 100]
            ])
            .on('zoom', zoomed);

        return zoom;
    }

    return { handleZoom }
}
export default useGuideViewerUtils;