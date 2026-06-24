declare global {
    type GuideInfoEntry = {
        guide_width: number;
        guide_height: number;
        sectors: MarketGuideSector[];
    };

    type MarketGuideSector = {
        sector: string;
        sections: MarketGuideSection[];
    };

    type MarketGuideSection = {
        section_name: string;
        stores: StoreShape[];
    };

    type StoreNameEntry ={
        id: string;
        store_name: string;
    };

    type StoreShape = {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        fill: string;
        stroke: string;
        strokeWidth: string;
    };
};