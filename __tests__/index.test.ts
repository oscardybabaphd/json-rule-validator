import { JsonRuleGenerator } from '../src/validator';
import { Condition, Rule } from '../src/types'
import { CustomOperation } from '../src/custom-operations'
import { Utils } from '../src/utility'

test('the fucntion should generte json logic structure, test all segement', () => {
    const ruleSchema: Condition = {
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



    const result = JsonRuleGenerator.GenerateRules(ruleSchema)
    //console.log(JsonRuleGenerator.GenerateIfStatment(ruleSchema))
    expect(JSON.stringify(result)).toBe(`{"and":[{"and":[{"and":[{"==":[{"var":"customer_type"},"New"]},{"==":[{"var":"segmentation"},"LOCATION"]},{"==":[{"var":"country"},"Nigeria"]},{"in":[{"var":"city"},["ikeja","shomolu","yaba"]]}]}]},{"and":[{"in":[{"var":"product_ordered"},["test","beans"]]}]},{"and":[{">=":[{"var":"last_order_date"},"2023-04-04"]},{"<=":[{"var":"last_order_date"},"2023-04-04"]}]},{"and":[{">=":[{"var":"amount"},"400"]},{"<=":[{"var":"amount"},"500"]}]}]}`);
});

test('the fucntion should generte json logic structure, only one segment', () => {
    const ruleSchema: Condition = {
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
            }
        ]
    };
    const result = JsonRuleGenerator.GenerateRules(ruleSchema)

    expect(JSON.stringify(result)).toBe(`{"and":[{"and":[{"and":[{"==":[{"var":"customer_type"},"New"]},{"==":[{"var":"segmentation"},"LOCATION"]},{"==":[{"var":"country"},"Nigeria"]},{"in":[{"var":"city"},["ikeja","shomolu","yaba"]]}]}]}]}`);
});


test('test if statement generator', () => {
    const ruleSchema: Condition = {
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
            }
        ]
    };
    const result = JsonRuleGenerator.GenerateIfStatment(ruleSchema)
    expect(result).toBe(`if(((customer_type === "New" && segmentation === "LOCATION" && country === "Nigeria" && ['ikeja','shomolu','yaba'].includes(city))))`);
});

test('test with data truthy', () => {
    const ruleSchema: Condition = {
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
            }
        ]
    };

    const data = {
        "customer_type": "New",
        "segmentation": "LOCATION",
        "country": "Nigeria",
        "city": "ikeja",
        "product_ordered": "test",
        "last_order_date": "2023-04-07",
        "amount": "501"
    }
    const result = JsonRuleGenerator.ExecuteRule(ruleSchema, data)
    expect(result).toBe(true);
});
test('test with data false', () => {
    const ruleSchema: Condition = {
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
            }
        ]
    };
    const data = {
        "customer_type": "New",
        "segmentation": "LOCATION",
        "country": "Nigeria",
        "city": "lekki",
        "product_ordered": "test",
        "last_order_date": "2023-04-07",
        "amount": "501"
    }
    const result = JsonRuleGenerator.ExecuteRule(ruleSchema, data)
    expect(result).toBe(false);
});

test('the fucntion should generte json logic structure, test all segement truthy', () => {
    const ruleSchema: Condition = {
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
                        "value": "2023-04-11"
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
    const data = {
        "customer_type": "New",
        "segmentation": "LOCATION",
        "country": "Nigeria",
        "city": "yaba",
        "product_ordered": "test",
        "last_order_date": "2023-04-07",
        "amount": "500"
    }
    const result = JsonRuleGenerator.ExecuteRule(ruleSchema, data)
    expect(result).toBe(true);
});

test('the fucntion should generte json logic structure, test all segement truthy ====>', () => {
    const ruleSchema: Condition = {
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
                        "operator": "arrayContainsAny",
                        "value": ['test', 'beans', 'rice', 'banana']
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
                        "value": "2023-04-11"
                    }
                ]
            },
            {
                "condition": "and",
                "rules": [
                    {
                        "field": "amount",
                        "operator": ">=",
                        "value": "500"
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

    const data = {
        "customer_type": "New",
        "segmentation": "LOCATION",
        "country": "Nigeria",
        "city": "yaba",
        "product_ordered": ["garri", 'casava', 'rice'],
        "last_order_date": "2023-04-07",
        "amount": "500"
    }

    const json_rule = JsonRuleGenerator.GenerateRules(ruleSchema)
    const result = JsonRuleGenerator.GenerateIfStatment(ruleSchema)
    console.log("oscard ===>", result)
    const result2 = JsonRuleGenerator.ExecuteJsonRule(json_rule, data)
    expect(result2).toBe(true);
});

test('test identical operator', () => {
    const ruleSchema: Condition = {
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
                                "operator": "===",
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
            }
        ]
    };

    const data = {
        "customer_type": "New",
        "segmentation": "LOCATION",
        "country": "Nigeria",
        "city": "yaba",
        "product_ordered": "test",
        "last_order_date": "2023-04-07",
        "amount": "501"
    }
    const result = JsonRuleGenerator.ExecuteRule(ruleSchema, data)
    expect(result).toBe(true);
});


test('ectract varaibles', () => {
    const ruleSchema: Condition = {
        "condition": "and",
        "rules": [
            {
                "condition": "or",
                "rules": [
                    {
                        field: "order_amount",
                        operator: ">",
                        value: 600
                    }
                ]
            },
            {
                "condition": "or",
                "rules": [
                    {
                        field: "orders_in_last_day",
                        operator: "<=",
                        value: 6
                    }
                ]
            }
        ]
    };
    const data = {
        "customer_type": "New",
        "segmentation": "LOCATION",
        "country": "Nigeria",
        "city": "yaba",
        "product_ordered": "test",
        "last_order_date": "2023-04-07",
        "amount": "501"
    }
    const result = JsonRuleGenerator.GenerateRules(ruleSchema)
    const varaibles = JsonRuleGenerator.GetSchemaVariables(result)

    // console.log('generated if statement ==>', JsonRuleGenerator.GenerateIfStatment(ruleSchema))
    console.log("Variables =====>>>>>>>.", varaibles)
    //expect(result).toBe(true);
});

test('complex rule structure', () => {
    const ruleSchema: Condition = {
        "condition": "and",
        "rules": [
            {
                "condition": "or",
                "rules": [
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "customer_type",
                                "operator": "===",
                                "value": "new"
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "segmentation",
                                "operator": "===",
                                "value": "location"
                            },
                            {
                                "field": "country",
                                "operator": "===",
                                "value": "221"
                            },
                            {
                                "field": "city",
                                "operator": "in",
                                "value": [
                                    "46465",
                                    "46464"
                                ]
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "product_ordered",
                                "operator": "arrayContainsAny",
                                "value": [
                                    "684",
                                    "680"
                                ]
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "last_order_date",
                                "operator": "===",
                                "value": "2023-10-25"
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "amount",
                                "operator": ">=",
                                "value": "10"
                            },
                            {
                                "field": "amount",
                                "operator": "<=",
                                "value": "1000"
                            }
                        ]
                    }
                ]
            },
            {
                "condition": "or",
                "rules": [
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "customer_type",
                                "operator": "===",
                                "value": "new"
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "segmentation",
                                "operator": "===",
                                "value": "location"
                            },
                            {
                                "field": "country",
                                "operator": "===",
                                "value": "221"
                            },
                            {
                                "field": "city",
                                "operator": "in",
                                "value": [
                                    "46465",
                                    "46475"
                                ]
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "product_ordered",
                                "operator": "arrayContainsAny",
                                "value": [
                                    "95",
                                    "94"
                                ]
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "last_order_date",
                                "operator": "===",
                                "value": "2023-10-25"
                            }
                        ]
                    },
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "amount",
                                "operator": "===",
                                "value": "10000"
                            }
                        ]
                    }
                ]
            }
        ]
    }

    const data = {
        last_order_date: '2023-11-25',
        customer_type: 'existing',
        segmentation: 'location',
        country: '222',
        city: ['464641'],
        product_ordered: ['6841'],
        amount: '3'
    }


    const result = JsonRuleGenerator.GenerateRules(ruleSchema)
    const varaibles = JsonRuleGenerator.GetVariablesValues(result)
    const test_result = JsonRuleGenerator.ExecuteJsonRule(result, data);
    // console.log('generated if statement ==>', JsonRuleGenerator.GenerateIfStatment(ruleSchema))
    console.log("Variables from json rules =====>>>>>>>.", varaibles)
    expect(test_result).toBe(false);
})


test('bug test', () => {
    const ruleSchema: Condition = {
        "condition": "or",
        "rules": [
            {
                "condition": "or",
                "rules": [
                    {
                        "condition": "and",
                        "rules": [
                            {
                                "field": "amount",
                                "operator": "between",
                                "value": [100, 1500]
                            }

                        ]
                    },
                    {
                        "condition": "or",
                        "rules": [
                            {
                                "field": "segmentation",
                                "operator": "===",
                                "value": "location"
                            },
                            {
                                "field": "country",
                                "operator": "===",
                                "value": "59"
                            },
                            {
                                "field": "city",
                                "operator": "in",
                                "value": ["0"]
                            }
                        ]
                    }

                ]
            }
        ]
    }

    const data = {
        "store_id": "236",
        "customer_type": "existing",
        "amount": 711.678,
        "cart_content": ["17017", "15360", "16254"],
        "country": "70",
        "city": ["4717"],
    }


    const result = JsonRuleGenerator.GenerateRules(ruleSchema)
    // const varaibles = JsonRuleGenerator.GetSchemaVariables(result)
    const test_result = JsonRuleGenerator.ExecuteJsonRule(result, data);
    console.log('generated if statement ==>', JsonRuleGenerator.GenerateIfStatment(ruleSchema))
    // console.log("Variables from json rules =====>>>>>>>.", varaibles)
    expect(test_result).toBe(true);
})


test('testing text extractor from hmtl', () => {


    const html = `<p><strong style="color: rgb(0, 0, 0);">باقة الشتاء - نساء</strong></p><p><span style="color: rgb(0, 0, 0);">مجموعة من العطور النسائية لشتاء تناسب إطلالتكِ</span></p><p><span style="color: rgb(0, 0, 0);">بروائح مختلفة ومثيرة</span></p><p><br></p><p><strong style="color: rgb(0, 0, 0);">محتويات الباقة:</strong></p><p><span style="color: rgb(0, 0, 0);">. </span>عطر 195 - بازل اليكساندريا II</p><p><span style="color: rgb(0, 0, 0);">. </span>عطر 183 - بازل ياسمين</p><p><span style="color: rgb(0, 0, 0);">. </span>عطر 259 - بازل بلاك اوركيد</p><p><span style="color: rgb(0, 0, 0);">. </span>عطر 281 - بازل جادور</p><p><span style="color: rgb(0, 0, 0);">. </span>عطر 294 - بازل كوكو نوار</p><p><span style="color: rgb(0, 0, 0);">. هدية ريفييل يرافقك اين ماكنت</span></p>`

    const parsed = Utils.extractTextFromHTML(html)
    console.log("============>>> parsed text ===============>>>", parsed)
    expect(true).toBe(true);
})


test('testing ',()=>{
    const rule: Condition = {

        "rules": [
      
          {
      
            "rules": [
      
              {
      
                "rules": [
      
                  {
      
                    "field": "last_abandoned_cart_in_days",
      
                    "value": "38",
      
                    "operator": "=="
      
                  }
      
                ],
      
                "condition": "or"
      
              }
      
            ],
      
            "condition": "or"
      
          }
      
        ],
      
        "condition": "or"
      
      }
      const result = JsonRuleGenerator.GenerateRules(rule)
       console.log('new generated if statement ==>', JsonRuleGenerator.GenerateIfStatment(rule))
      // console.log("Variables from json rules =====>>>>>>>.", varaibles)
      //expect(test_result).toBe(false);
})
