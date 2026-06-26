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
        section: string;
        stores: MarketGuideStore[];
    };

    type StoreNameEntry ={
        id: string;
        store_name: string;
    };

    type StoreDetectorInstallationList = {
        id: string;
        store_name: string;
        fire_status: "화재 경보" | "정상" | "미수신";
    };

    type MarketGuideStore = {
        "store": string;
        "graphics": StoreShape;
    };

    type StoreShape = {
        "space": SpaceShape;
        "fire_status": FireStatusShape;
    };

    type SpaceShape = {
        "type": string;
        "x": number;
        "y": number;
        "width": number;
        "height": number;
        "fill": string;
        "stroke": string;
        "strokeWidth": string;
    };

    type FireStatusShape = {
        "type": string;
        "cx": number;
        "cy": number;
        "r": number;
        "fill": string;
    };
};