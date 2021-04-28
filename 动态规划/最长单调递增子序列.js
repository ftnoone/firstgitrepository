function getLongestSeq(seq){
    var i, j, len = seq.length + 1, subarr = new Array(len), result = new Array(len), temp = new Array(len), max, box;
    subarr[0] = 0;
    subarr[1] = 1;//subarr i记录前i个元素的最长单调增序列的长度
    temp[0] = 0;
    temp[1] = 1;//temp i记录前i个元素中最长单调增序列的上一个元素索引
    result[0] = -Infinity;//result i记录前i个元素中最长单调增序列的最大元素
    result[1] = seq[0];
    for(i = 2, box = 0; i < len; i ++){
        j = i - 1;
        max = subarr[i - 1];//初始化最大单调增序列长度为前i-1个元素中最长的单调增序列长度
        temp[i] = box;//初始化单调增序列的上个元素索引为box
        result[i] = result[i - 1];//初始化最大元素为前i-1个元素最长单调增序列的最大元素
        while(j > 0){
            if(seq[i - 1] > result[j]){//优先确保单调增序列是以自己，即第i个元素为结尾的序列，所以等于max-1时，有以自己为结尾的单调增序列和前i-1个元素中最长单调增序列长度相同
                if(subarr[j] >= max - 1){
                    max = subarr[j] + 1;//记录最大的长度
                    temp[i] = j;//记录前一个元素的索引
                    box = i;//保证后面的temp的最长子序列的元素索引为本轮最大的单调增序列的最大元素的索引
                    result[i] = seq[i - 1];//最大元素的索引改为自己，即第i个元素
                }
            }
            j --;
        }
        subarr[i] = max;
    }
    return {
        subarr,
        temp
    }
}
getLongestSeq([1,5,4,5,6,4,7,5,2,1,2,4,5,7,8,9]);
