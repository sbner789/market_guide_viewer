import { useEffect } from "react";

type UseGuideViewerNavigator = {
    viewer: SVGSVGElement | null;
};

const useGuideViewerNavigator = ({ 
    viewer 
} : UseGuideViewerNavigator) => {
    useEffect(() => {
        if (!viewer) return;
        console.log({ viewer });
    }, [])
    return {}
}
export default useGuideViewerNavigator;