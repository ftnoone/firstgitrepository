function longestCommonSequence(x, y){
    var len1 = x.length + 1, len2 = y.length + 1, i, j, subarr = new Array(len1);
    for(i = 0; i < len1; i ++) {
        subarr[i] = new Array(len2);
    }
    for(i = 0; i < len2; i ++) subarr[0][i] = 0;
    for(i = 0; i < len1; i ++) subarr[i][0] = 0;
    for(i = 1; i < len1; i ++){
        for(j = 1; j < len2; j ++){
            if(x[i - 1] == y[j - 1]) {//对于i长序列a和j长序列b，如a序列尾元素和b尾元素相同，则i长和j长序列最长公共子串比i-1长和j-1长公共子串的长度多一
                subarr[i][j] = subarr[i - 1][j - 1] + 1;
            }
            else if(subarr[i][j - 1] > subarr[i - 1][j]) {//不同则等于i-1长和j长最长公共子串，i长和j-1长序列最长公共子串两者中最长的长度，而其中i-1和j长序列最长公共子串在上一轮i循环中已经得出，j-1长和i长序列最长公共子串在上一轮j循环中得出
                subarr[i][j] = subarr[i][j - 1];
            }else{
                subarr[i][j] = subarr[i - 1][j];
            }
        }
    }
    i = len1 - 1;
    j = len2 - 1;
    function getStr(i, j){
        if(i > 0 && j > 0){
            if(x[i - 1] == y[j - 1]) {
                return getStr(i - 1, j - 1) + " " + x[i - 1];
            }else if(subarr[i - 1][j] > subarr[i][j - 1]){
                return getStr(i - 1, j);
            }else return getStr(i, j - 1);
        }
        return "";
    }
    console.log(getStr(i, j));
    return subarr;
}
var obj = longestCommonSequence([1,2,4,5,6,8,9],[1,5,3,4,7,8,4,5,6]);