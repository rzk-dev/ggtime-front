export type Companies = {
    id: string;
    string: string;
    companyContribution: Contribution;
}

type Contribution = {
    publisher: boolean;
    supporter: boolean;
    porting: boolean;
}