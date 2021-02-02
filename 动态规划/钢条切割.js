function cutRod(p, n){
    var r = new Array(n + 1);
    r[0] = 0;
    for(let i = 1, q, j; i <= n; i ++){
        q = p[i];
        for(j = 1; j <= i; j ++){
            q = Math.max(q, p[j] + r[i - j]);
        }
        r[i] = q;
    }
    return r[n];
}