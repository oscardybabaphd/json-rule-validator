# rule-validator
This is light weight library that give you ability to embed logic within a json schema and uses json-logic to parse your schema

# Rule and Condition Interfaces

This document describes two TypeScript interfaces: `Rule` and `Condition`. These interfaces are used to define rules and conditions for filtering data.

## Rule Interface

The `Rule` interface represents a single filtering rule with the following properties:

- `field`: A string representing the field or attribute on which the condition is applied.
- `operator`: A string representing the operator used for comparison.
- `value`: The value to compare against, which can be a string, an array of strings, a number, or an array of numbers.

### Example Rule

```typescript
interface Rule {
    field: string;
    operator: string;
    value: string | string[] | number | number[];
}
````
## Condition Interface

The `Condition` interface represents a complex condition that can be composed of multiple rules and sub-conditions. It has the following properties:

- `condition`: A string specifying the logical condition, which can be either "and" or "or." It determines how the rules within this condition are combined.
- `rules`: An array of `Condition` and `Rule` objects, allowing you to create nested conditions and define filtering criteria.

### Example Condition

```typescript
interface Condition {
    condition: "and" | "or";
    rules: (Condition | Rule)[];
}
````

## Supported Operators
- `in`: in operator use for array element it generate the equalent of array.includes checks.
- `==`: equals to is use for comparism of string value or integer value
- `< or >`: less than or greater than is use for comparism of integer value or date
- `<= or >=`: less than or equal to or greater than or equal to is use for comparism of integer value or date
- `===`: Identical comparism of string values
- `arrayContainsAny`: Compare two arrays and return true is array1 containt any element in array2

# Rule Schema

The `ruleSchema` object defines a complex condition using a nested structure. It represents a set of conditions that can be used for filtering data. Each condition consists of a combination of logical operators and rules.

## Example Condition

```javascript
const ruleSchema = {
    "condition": "and",
    "rules": [
        {
            "condition": "and",
            "rules": [
                {
                    "condition": "and",
                    "rules": [
                        {
                            "field": "customer_type",
                            "operator": "==",
                            "value": "New"
                        },
                        {
                            "field": "segmentation",
                            "operator": "==",
                            "value": "LOCATION"
                        },
                        {
                            "field": "country",
                            "operator": "==",
                            "value": "Nigeria"
                        },
                        {
                            "field": "city",
                            "operator": "in",
                            "value": ["ikeja", "shomolu", "yaba"]
                        }
                    ]
                }
            ]
        },
        {
            "condition": "and",
            "rules": [
                {
                    "field": "product_ordered",
                    "operator": "in",
                    "value": ['test', 'beans']
                }
            ]
        },
        {
            "condition": "and",
            "rules": [
                {
                    "field": "last_order_date",
                    "operator": ">=",
                    "value": "2023-04-04"
                },
                {
                    "field": "last_order_date",
                    "operator": "<=",
                    "value": "2023-04-04"
                }
            ]
        },
        {
            "condition": "and",
            "rules": [
                {
                    "field": "amount",
                    "operator": ">=",
                    "value": "400"
                },
                {
                    "field": "amount",
                    "operator": "<=",
                    "value": "500"
                }
            ]
        }
    ]
};
````

## Utility Methods
```typescript
static GenerateRules(ruleSchema: Condition): any //generate json-logic rule from json schema
````
```typescript
static GenerateIfStatment(ruleSchema: Condition): string // generate human understandable if statement from json schema
````
```typescript
static ExecuteSlideRule(ruleSchema: Condition, data: object): boolean // Execute json schema directly
````
```typescript
static ExecuteJsonRule(jsonRule: any, data: object): boolean // Execute json rule using json-logic light weight library, this option is faster because we dont need to parse the json anymore
````

```typescript
static GetSchemaVariables(jsonRule: any): string[] // Get all variables present in the rule schema
````

## Sample Output (Rule to Json-logic)

````json
{
    "and": [
        {
            "and": [
                {
                    "and": [
                        {
                            "==": [
                                {
                                    "var": "customer_type"
                                },
                                "New"
                            ]
                        },
                        {
                            "==": [
                                {
                                    "var": "segmentation"
                                },
                                "LOCATION"
                            ]
                        },
                        {
                            "==": [
                                {
                                    "var": "country"
                                },
                                "Nigeria"
                            ]
                        },
                        {
                            "in": [
                                {
                                    "var": "city"
                                },
                                [
                                    "ikeja",
                                    "shomolu",
                                    "yaba"
                                ]
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "and": [
                {
                    "in": [
                        {
                            "var": "product_ordered"
                        },
                        [
                            "test",
                            "beans"
                        ]
                    ]
                }
            ]
        },
        {
            "and": [
                {
                    ">=": [
                        {
                            "var": "last_order_date"
                        },
                        "2023-04-04"
                    ]
                },
                {
                    "<=": [
                        {
                            "var": "last_order_date"
                        },
                        "2023-04-04"
                    ]
                }
            ]
        },
        {
            "and": [
                {
                    ">=": [
                        {
                            "var": "amount"
                        },
                        "400"
                    ]
                },
                {
                    "<=": [
                        {
                            "var": "amount"
                        },
                        "500"
                    ]
                }
            ]
        }
    ]
}
````
## Sample Output (Rule  to If Statement)
````typescript
if(((customer_type === "New" && segmentation === "LOCATION" && country === "Nigeria" && ['ikeja','shomolu','yaba'].includes(city))) && (['test','beans'].includes(product_ordered)) && (last_order_date >= "2023-04-04" && last_order_date <= "2023-04-04") && (amount >= "400" && amount <= "500"))
{
    console.log(true)
}else{
    console.log(false)
}

````