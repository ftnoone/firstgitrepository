function getLarge(str){
    var len = str.length, subarr = new Array(len), i, seq = new Array(len);
    for(i = 0; i < len; i ++) {
        subarr[i] = new Array(len).fill(-1);//subarr作为备忘录，在递归过程中，根据最长回文的最优子结构发现并不是对所有的i（0到len-1）到j（0到len-1）都要求解，所有使用自顶向下备忘录递归算法较好
        seq[i] = new Array(len);
    }
    function large(str, i, j){//不需要连续
        if(i < j){
            /*
            large[i, j] = large[i + 1, j - 1] , (i < j && str[i] == str[j])
                        = max{large[i + 1, j], large[i, j - 1]} , (i < j && str[i] != str[j])
            */
            if(str[i] == str[j]){
                let temp = subarr[i + 1][j - 1];
                seq[i][j] = 0;
                if(temp != -1) {
                    return subarr[i][j] = temp + 1;//设置i到j字符的最长回文长度
                }
                return subarr[i][j] = large(str, i + 1, j - 1) + 1;//设置i到j字符的最长回文长度
            }else {
                let prior = subarr[i][j - 1], rear = subarr[i + 1][j];
                if(prior == -1){
                    prior = large(str, i, j - 1);
                }
                if(rear == -1){
                    rear = large(str, i + 1, j);
                }
                seq[i][j] = -1;
                if(prior < rear) {
                    seq[i][j] = 1;//设置字符串i到j的最长回文序列的构成，0表示i字符和j字符相等，-1表示i字符和j字符不相等，且取i到j-1的最长回文序列作为i到j的最长回文序列，1取i+1到j的最长回文序列
                    return subarr[i][j] = rear;//设置i到j字符的最长回文长度
                }
                return subarr[i][j] = prior;//设置i到j字符的最长回文长度
            }
        }else if(i == j) return 1;//如果相等则本身作为中间字符，返回即可
        else return 0;
    }
    let result = large(str, 0, str.length - 1);
    function print(i, j){//打印结果
        if(i < j){
            switch(seq[i][j]){//解构seq
                case 1: return print(i + 1, j);//-1表示i字符和j字符不相等，且取i到j-1的最长回文序列作为i到j的最长回文序列
                case 0: return str[i] + print(i + 1, j - 1) + str[i];//0表示i字符和j字符相等
                case -1: return print(i, j - 1);//1取i+1到j的最长回文序列
            }
        }else if(i == j) return str[i];
        else return "";
    }
    console.log(print(0, len - 1));
    return subarr[0][len - 1];
}
getLarge("character")