import { useEffect, useState } from 'react';
import axios from 'axios';

const useMarketGuideApi = () => {
    const [marketGuide, setMarketGuide] = useState<MarketGuideSector[]>();
    const [storeNames, setStoreNames] = useState<StoreNameEntry[]>();

    useEffect(() => {
        const fetchMarketGuide = async () => {
            try { 
                const [ getMarketGuideResponse, getStoreNamesResponse ] = await Promise.all([
                    axios.get('/local_data/sector.json'),
                    axios.get('/local_data/test_store_name.json')
                ]);
                const marketGuideData = getMarketGuideResponse.data;
                const storeNamesData = getStoreNamesResponse.data;

                setMarketGuide(marketGuideData);
                setStoreNames(storeNamesData);
            } catch (error) {
                console.error('Error fetching market guide:', error);
            }
        }
        fetchMarketGuide();
    }, [])            

    return {
        marketGuide,
        storeNames,
    }
}
export default useMarketGuideApi