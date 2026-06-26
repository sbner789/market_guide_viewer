import { useEffect, useState } from 'react';
import axios from 'axios';

const INITIAL_GUIDE_MAP = {
    guide_width: 0,
    guide_height: 0,
    sectors: []
};

const useMarketGuideApi = () => {
    const [guideMap, setGuideMap] = useState<GuideInfoEntry>(INITIAL_GUIDE_MAP);
    const [storeNames, setStoreNames] = useState<StoreDetectorInstallationList[]>();

    useEffect(() => {
        const fetchMarketGuide = async () => {
            try { 
                const [ getStoreNamesResponse, getGuideMapResponse ] = await Promise.all([
                    axios.get('/local_data/test_store_name.json'),
                    axios.get('/local_data/gwangmyeong_guide_1_1.json')
                ]);
                const storeNamesData = getStoreNamesResponse.data;
                const guideData = getGuideMapResponse.data.sectors;
                const guideHeight = getGuideMapResponse.data.guide_height;
                const guideWidth = getGuideMapResponse.data.guide_width;

                setGuideMap({ 
                    guide_width: guideWidth, 
                    guide_height: guideHeight,
                    sectors: guideData 
                });
                setStoreNames(storeNamesData);
            } catch (error) {
                console.error('Error fetching market guide:', error);
            }
        }
        fetchMarketGuide();
    }, [])            

    return {
        storeNames,
        guideMap
    }
}
export default useMarketGuideApi