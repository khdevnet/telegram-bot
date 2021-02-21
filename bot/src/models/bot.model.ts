export interface ICmdArg {
    name: string;
    length: number;
}

export interface IListingCmd {
    add: ICmdArg;
    rmv: ICmdArg;
    all: ICmdArg;
}

const spaceLength = 1;

export const ListingCmd = <IListingCmd>{
    add: { name: "add", length: 3 + spaceLength },
    rmv: { name: "rmv", length: 3 + spaceLength },
    all: { name: "all", length: 3 + spaceLength }
};
