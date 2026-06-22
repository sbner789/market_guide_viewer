import useMarketGuideApi from '@/hooks/api/useMarketGuideApi';

const MarketGuide = () => {

    const { marketGuide, storeNames } = useMarketGuideApi();

    return (
        <div>
            MarketGuide
        </div>
    )
}
export default MarketGuide;