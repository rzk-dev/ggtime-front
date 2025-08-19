export type Companies = {
    id: string;
    string: string;
    companyContibution: Contribution;
}

type Contribution = {
    publisher: boolean;
    supporter: boolean;
    porting: boolean;
}