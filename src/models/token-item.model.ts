export interface ITokenItem {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    is_active: boolean;
    num_market_pairs: number;
    market_pairs: IMarketPair[];
};

export interface IMarketPair {
    exchange: IExchange;
    outlier_detected: number;
    exclusions: any;
    market_pair_base: [];
    market_pair_quote: [];
    quote: [];
    market_id: number;
    market_pair: string;
    market_score: number;
    market_reputation: number;
}

export interface IExchange {
    id: number;
    name: string,
    slug: string;
}