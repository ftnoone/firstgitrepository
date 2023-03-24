function kmp(str, substr){
    let nextarr = next(substr);
    for (let i = 0, j = 0; i < str.length;) {
        if(j == -1 || str[i] == substr[j]){
            i ++;
            j ++;
            if(j == substr.length) return i - j;
        }else {
            j = nextarr[j];
        }
    }
    return -1;
}
function next(substr){
    let next = new Array(substr.length);
    next[0] = -1;
    let i = 0, k = -1;
    while(i < substr.length - 1){
        if(k == -1 || substr[i] == substr[k]){
            i ++;
            k ++;
            if(substr[i] == substr[k]){
                next[i] = next[k];
            }else next[i] = k;
        }else{
            k = next[k];
        }
    }
    return next;
}
next("abbaaa")