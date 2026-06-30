import { useRef } from 'react';
import * as d3 from 'd3';

type UseGuideViewerUtils = {
    viewer: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    viewerData: GuideInfoEntry;
}

const useGuideViewerUtils = () => {
    const selectFullscreenRef = useRef<HTMLDivElement | null>(null);
    const handleZoomAndPanning = ({ viewer, viewerData } : UseGuideViewerUtils) => {
        const viewerLayer = viewer.selectAll<SVGGElement, null>('g.viewer_layer');
        const { guide_width, guide_height } = viewerData;

        const zoomAndPanningBehavior = d3.zoom<SVGSVGElement, unknown>();

        const snapToIdentity = () => {
            viewer.transition().duration(400).call(zoomAndPanningBehavior.transform, d3.zoomIdentity);
        };

        const adjustmentPanningEnd = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            if (event.sourceEvent === null) return;

            const { k, x, y } = event.transform;

            if (k < 1) {
                snapToIdentity();
                return;
            }

            const adjustmentX = Math.abs(x) / k;
            const adjustmentY = Math.abs(y) / k;

            const limitOptionX = guide_width - adjustmentX < guide_width * 0.1;
            const limitOptionY = guide_height - adjustmentY < guide_height * 0.1;

            if (limitOptionX || limitOptionY) snapToIdentity();
        };

        zoomAndPanningBehavior
            .scaleExtent([0.5, 8])
            .on('zoom', (event) => {
                viewerLayer.attr('transform', event.transform.toString());
            })
            .on('end', adjustmentPanningEnd);

        return zoomAndPanningBehavior;
    };

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            selectFullscreenRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen(); 
        };
    };

    return { handleZoomAndPanning, handleFullScreen, selectFullscreenRef };
};
export default useGuideViewerUtils;