function cutRod(prices, length){
    const subarr = new Array(length + 1), last = new Array(length + 1);
    let i, j, max, temp;
    subarr[0] = 0;//0米长钢条收益为0，subarr第i索引数组存放i米长钢条的最大收益
    for(i = 1; i <= length; i ++){//外层for循环从1到len，对i长度的钢条求能卖出的最大收益，即切割的不同长度会有不同的收益
        max = 0;//设置最大值为0
        for(j = i >= prices.length ? 10 : i; j > 0; j --){//从j处切割，当i = j时意为不切割，所以j从1 到 i
            //好理解的割法为左最大收益加右最大收益，等同于左不分割的价格加上右最大收益，自己悟
            temp = prices[j] + subarr[i - j];//设置prices[j]为左边的j米不切割的价格加上右边钢条求最大收益，从subarr中拿意为右边为最大收益的割法，注意这里subarr索引为i - j，所以这里索引最小为0， 最大索引为 i-1，而0到i-1的subarr在之前的循环已经求出来了
            if(temp > max) {//和max比较，求最大收益的割法
                max = temp;
                last[i] = i - j;//记录割点
            }
        }
        subarr[i] = max;//记录i米长的钢条最大收益
    }
    return {subarr, last}
}
//               0,1,2,3,4, 5, 6, 7, 8, 9,10
let rodsPrice = [0,1,5,8,9,10,17,17,20,24,30];//分别是从1米到10米长的不同长度钢条的售价
cutRod(rodsPrice, 30);