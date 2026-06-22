declare global {
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

    type StoreNameEntry ={
        id: string;
        store_name: string;
    };

    type MarketGuideSection = {
        section_name: string;
        stores: StoreShape[];
    };

    type MarketGuideSector = {
        sector: string;
        sections: MarketGuideSection[];
    };
};