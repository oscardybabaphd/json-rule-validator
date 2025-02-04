export class CustomOperation {

    public static arrayContainsAny(array1: Array<string | number>, array2: Array<string | number>) {
        const result = array1?.some(item1 => array2.includes(item1));
        return result;
    }
    
    public static between(value: number | string, range: Array<number | string>) {
        return +value >= +range[0] && +value < +range[1];
    }
}