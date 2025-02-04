import jsonLogic from 'json-logic-js'
import { Condition, Rule } from './types';
import { CustomOperation } from './custom-operations';

export class JsonRuleGenerator {

    private static variables: Array<any> = [];
    private static values: Array<any> = [];

    public static GenerateRules(ruleSchema: Condition): any {
        try {
            if (ruleSchema.condition === 'and') {
                return {
                    'and': ruleSchema.rules.map((rule) => JsonRuleGenerator.GenerateRules(rule as Condition)) //(O)n run time compexity
                };
            } else if (ruleSchema.condition === 'or') {
                return {
                    'or': ruleSchema.rules.map((rule) => JsonRuleGenerator.GenerateRules(rule as Condition)) //(O)n run time compexity
                };
            } else {
                const schema = ruleSchema as unknown as Rule;
                return {
                    [schema.operator]: [
                        { 'var': schema.field },
                        schema.value
                    ]
                };
            }
        } catch (error) {
            throw new Error('Invalid slide json schema')
        }
    }

    public static GenerateIfStatment(ruleSchema: Condition): string {
        try {
            if (ruleSchema == null || undefined)
                throw new Error('schema cannot be null or undefined')
            const if_statement = `if${this.ConvertJSONLogicToIfStatement(this.GenerateRules(ruleSchema))}`
            return if_statement;
        } catch (error) {
            throw error
        }
    }

    private static ConvertJSONLogicToIfStatement(jsonLogic: any): string {
        if (jsonLogic.and) {
            const conditions = jsonLogic.and.map((rule: any) => JsonRuleGenerator.ConvertJSONLogicToIfStatement(rule));  //(O)n run time compexity
            return `(${conditions.join(' && ')})`;
        } else if (jsonLogic.or) {
            const conditions = jsonLogic.or.map((rule: any) => JsonRuleGenerator.ConvertJSONLogicToIfStatement(rule));  //(O)n run time compexity
            return `(${conditions.join(' || ')})`;
        } else if (jsonLogic['==']) {
            const varName = jsonLogic['=='][0].var;
            const value = jsonLogic['=='][1];
            return `${varName} == "${value}"`;
        } else if (jsonLogic['>=']) {
            const varName = jsonLogic['>='][0].var;
            const value = jsonLogic['>='][1];
            return `${varName} >= "${value}"`;
        } else if (jsonLogic['<=']) {
            const varName = jsonLogic['<='][0].var;
            const value = jsonLogic['<='][1];
            return `${varName} <= "${value}"`;
        } else if (jsonLogic['in']) {
            const varName = jsonLogic['in'][0].var;
            const value = jsonLogic['in'][1];
            const array_value = value.map((item: Array<string | number>) => `'${item}'`)
            return `[${array_value}].includes(${varName})`;
        } else if (jsonLogic['===']) {
            const varName = jsonLogic['==='][0].var;
            const value = jsonLogic['==='][1];
            return `${varName} === "${value}"`;
        } else if (jsonLogic['arrayContainsAny']) {
            const varName = jsonLogic['arrayContainsAny'][0].var;
            const value = jsonLogic['arrayContainsAny'][1];
            const array_value = value.map((item: Array<string | number>) => `'${item}'`)
            return `[${array_value}].arrayContainsAny(${varName})`;
        } else if (jsonLogic['<']) {
            const varName = jsonLogic['<'][0].var;
            const value = jsonLogic['<'][1];
            return `${varName} < "${value}"`;
        } else if (jsonLogic['>']) {
            const varName = jsonLogic['>'][0].var;
            const value = jsonLogic['>'][1];
            return `${varName} > "${value}"`;
        } else if (jsonLogic['between']) {
            const varName = jsonLogic['between'][0].var;
            const value = jsonLogic['between'][1];
            const array_value = value.map((item: Array<string | number>) => item).join(",")
            return `${varName}.inRange(${array_value})`;
        }
        else {
            return 'Operation not yet supported'
        }
    }

    public static ExecuteRule(ruleSchema: Condition, data: object): boolean {
        try {
            const rule = this.GenerateRules(ruleSchema);
            this.AddOperations();
            const result = jsonLogic.apply(rule, data)
            return result;
        } catch (error) {
            throw new Error('Unexpected error')
        }
    }

    public static ExecuteJsonRule(jsonRule: any, data: object): boolean {
        try {
            this.AddOperations();
            const result = jsonLogic.apply(jsonRule, data)
            return result;
        } catch (error) {
            throw new Error('Unexpected error')
        }
    }

    private static AddOperations() {
        jsonLogic.add_operation("arrayContainsAny", CustomOperation.arrayContainsAny);
        jsonLogic.add_operation("between", CustomOperation.between);
    }

    private static GetVaraibles(logic: any) {
        if (logic && typeof logic === 'object') {
            for (const key in logic) {
                if (key === 'var') {
                    const variable = logic[key];
                    if (typeof variable === 'string') {
                        this.variables.push(variable);
                    }
                } else {
                    JsonRuleGenerator.GetVaraibles(logic[key]);
                }
            }
        }
    }

    public static GetSchemaVariables(json_rule: any) {
        try {
            this.variables = [];
            this.GetVaraibles(json_rule);
            if (this.variables.length <= 0)
                throw new Error('No variable found in json-rule schema')

            return [...new Set(this.variables)];
        } catch (error) {
            throw new Error('Unexpected error')
        }
    }


    private static GetValues(logic: any) {
        if (logic && typeof logic === 'object') {
            for (const key in logic) {
                if (Array.isArray(logic[key]) && logic[key].length == 2) {
                    if (typeof logic[key][0] === 'object' && logic[key][0].var !== undefined) {
                        const value = {
                            var: logic[key][0].var,
                            value: logic[key][1]
                        }
                        const index = this.values.findIndex(x => x.var === value.var);
                        if (index == -1) {
                            this.values.push(value)
                        }
                    }
                }
                if (key !== 'var') {
                    JsonRuleGenerator.GetValues(logic[key]);
                }
            }
        }
    }

    public static GetVariablesValues(json_rule: any) {
        try {
            this.values = [];
            this.GetValues(json_rule);
            if (this.values.length <= 0)
                throw new Error('No variables values found in json-rule schema')
            return this.values;
        } catch (error) {
            throw new Error('Unexpected error')
        }
    }
}

//TODO - handle multiple schema validate using the map option in json-logic
//TODO - the if statement generator and more operator support base on business need

