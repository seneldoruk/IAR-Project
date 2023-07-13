export interface Salesman {
    _id: string;
    name: string;
    rating: number;
    href: string;
    orders: Order[][];
    salesBonus: number;
    id: string;
    evaluations: Evaluations;
    totalBonus: number;
    remarks?: string;
}

export interface Order {
    name: string;
    href: string;
    quantity: string;
    customerhref: string;
    customerName: string;
    customerRating: number;
    bonus: number;
}

export interface Evaluations {
    _id: string;
    id: number;
    year: number;
    openness: Evaluation;
    leadership: Evaluation;
    social: Evaluation;
    attitude: Evaluation;
    communication: Evaluation;
    integrity: Evaluation;
    evaluationBonus: number;
}

export interface Evaluation {
    value: number;
    bonus: number;
}
export interface BonusCalculationSalesman {
    name: string;
    id: string;
    calculatedBonus: number;
}
