// function matrixChainOder(arr){
//     var len = arr.length, i, j, subarr = new Array(len);
//     for(i = 0; i < len; i ++) subarr[i] = new Array(len);
//     // for(i = 2; i <= len; i ++){
//     //     subarr[1][i] = subarr[1][i - 1] + arr[0][0] * arr[i - 1][0] * arr[i - 1][1];
//     // }
//     subarr[1][2] = arr[1][0]*arr[1][1]*arr[2][1];
//     for(i = 1; i < len; i ++) {
//         subarr[i][i] = 0;
//         subarr[0][i] = 0;
//     }
//     var min, temp, product;
//     for(i = 3; i < len; i ++){
//         min = subarr[1][i - 1] + arr[1][0] * arr[i][0] * arr[i][1];
//         subarr[0][i] = i - 1;
//         for(j = 1; j < i - 1; j ++){
//             product =  subarr[i - 1][j + 1] + arr[j + 1][0] * arr[i][0] * arr[i][1];
//             subarr[i][j + 1] = product;
//             temp = subarr[1][j] + product + arr[1][0] * arr[j + 1][0] * arr[i][1];
//             if(temp < min) {
//                 min = temp;
//                 subarr[0][i] = j;
//             }
//         }
//         subarr[1][i] = min;
//     }
//     return subarr;
// }
//错误版本 ↑，矩阵不一定可以分为前最小乘法代价加上后顺序相乘的代价 比如 ((m1 * m2) * (m7 * m8)) * ((m3 * m4) * (m5 * m6))
var matrixs = [
    [0, 0],
    [30, 35],
    [35, 15],
    [15, 5],
    [5, 10],
    [10, 20],
    [20, 25]
]
//时间复杂度为n^3
function matrixChainOder2(arr){
    var len = arr.length, i, j, subarr = new Array(len), k, memo = new Array(len);//subarr记录最小乘法代价，memo记录最小代价的括号划分点
    for(i = 0; i < len; i ++) {
        subarr[i] = new Array(len);
        memo[i] = new Array(len);
    }
    for(i = 1; i < len; i ++) {//初始化i到i的代价为0
        subarr[i][i] = 0;
    }
    var min, temp;
    for(len --, i = 2; i <= len; i ++){//i从2到len，i代表计算前i割矩阵(1到i矩阵)相乘的最小代价
        subarr[i - 1][i] = arr[i - 1][0] * arr[i][0] * arr[i][1];//初始化i - 1 到 i的代价，直接用原矩阵计算即可
        memo[i - 1][i] = i - 1;
        for(j = i - 2; j >= 1; j --){//计算j到i的矩阵的最小代价，而两个矩阵相乘是不可划分的所以需要至少三个矩阵相乘
        //而j是从i - 2到1，因为计算1到i矩阵相乘的代价，假如从k处划分，则要计算1到k的最小代价和k+1到i的最小代价，而k取值是1到i-1
        //则1到k的最小代价是前几轮已经求出来，所以需要操心的是k+1到i的最小代价，而我们将k从i-1到1递减，计算k到i矩阵最小代价
        //如取i = 9，则先计算8到9矩阵相乘的最小代价，在下一轮k循环时，k等于7，计算7到9矩阵的代价为从7划分的代价和从8划分的最小代价的最小值，而7到8的代价在上一轮i循环已经给出，8到9的最小代价在上一轮k循环给出，自己悟吧
            min = Infinity;//初始化min为最大值
            for(k = j; k < i; k ++){//k从j到i - 1，然后从k出两边加括号求j到i的最小代价，从k处划分
                temp = subarr[j][k] + subarr[k + 1][i] + arr[j][0] * arr[k + 1][0] * arr[i][1];
                if(temp < min){//找到最小值
                    min = temp;
                    memo[j][i] = k;//记录划分点
                }
            }
            subarr[j][i] = min;//记录j到i的最小代价
        }
    }
    return {subarr, memo};
}



function recursivePrint2(arr, start, end){//打印矩阵链乘最小代价的括号划分
    if(start == end) return "M" + start;
    let k = arr[start][end];
    return "(" + recursivePrint2(arr, start, k) + " * " + recursivePrint2(arr, k + 1, end) + ")";
}

var result = matrixChainOder2(matrixs);
console.log(result);
console.log(recursivePrint2(result.memo, 1, 6));