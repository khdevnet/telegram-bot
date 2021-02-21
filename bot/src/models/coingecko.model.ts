export interface ITokenItem {
    id: number;
    name: string;
    symbol: string;
    platforms: { [key: string]: string };
};