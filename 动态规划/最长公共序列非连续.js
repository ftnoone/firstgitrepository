function longestCommonSequence(x, y){
    var m = x.length, n = y.length;
    var c = new Array(m).forEach(()=>new Array(n));
    for(let i = 1; i < m; i ++) c[i][0] = 0;
    for(let i = 0; i < n; i ++) c[0][i] = 0;
    for(let i = 1, j; i < m; i ++){
        for(j = 1; j < n; j ++){
            if(x[i] == y[j]) c[i][j] = c[i - 1][j - 1] + 1;
            else if(c[i - 1][j] <= c[i][j - 1]) c[i][j] = c[i][j - 1];
            else c[i][j] = c[i - 1][j];
        }
    }
    return c;
}