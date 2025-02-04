export type Rule = {
    field: string;
    operator: "in" | "==" | "===" | ">" | "<" | ">=" | "<=" | "arrayContainsAny" | "between";
    value: string | string[] | number | number[];
}

export type Condition = {
    condition: "and" | "or";
    rules: (Condition | Rule)[];
}
