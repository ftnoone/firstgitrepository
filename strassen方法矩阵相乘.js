var a = [
        [1,2,3],
        [1,1,1],
        [2,2,2]
    ], b = [
        [2,3,1],
        [2,1,1],
        [1,1,0]
    ], mya = strassenMatrix(a, 0, a[0].length - 1, 0, a.length - 1), myb = strassenMatrix(b, 0, b[0].length - 1, 0, b.length - 1); 
class strassenMatrix{
    //strassen方法需要填充矩阵至2的幂
    constructor(matrix, xStart, xEnd, yStart, yEnd){
        if(!(matrix instanceof Array) || !(matrix[0] instanceof Array)) throw new Error("第一个参数须为矩阵");
        if(xStart > xEnd || yStart > yEnd) throw new Error("矩阵行列参数错误");
        this.matrix = matrix;
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.yStart = yStart;
        this.yEnd = yEnd;
        this.x = this.xStart - this.xEnd + 1;
        this.y = this.yStart - this.yEnd + 1;
    }
    with(m, sign){
        if(!m instanceof strassenMatrix) throw new Error("参数不是strassenMatrix类型");
        if(this.x != m.x || this.y != m.y) throw new Error("相加的矩阵行列不一致");
        var result = createTwoDimArr(this.x, this.y);
        var calculate = (a, b)=>(a + b);
        if(sign == "-") calculate = (a, b)=>(a - b);
        for(let i = 0; i < this.y; i ++){
            for(let j = 0; j < this.x; j ++){
                result[i][j] = calculate(this.matrix[this.yStart + i][this.xStart + j], m[m.yStart + i][m.xStart + j]);
            }
        }
        return new strassenMatrix(result, 0, this.x - 1, 0, this.y - 1);
    }
    add(m){
        return this.with(m, "+");
    }
    reduce(m){
        return this.with(m, "-");
    }
}
function createTwoDimArr(x, y){
    var arr = new Array(x);
    for(let i = 0; i < x; i ++){
        arr[i] = new Array(y);
    }
    return arr;
}
var floor = Math.floor;
function strassenMatrixMultiplication(a, b){
    var ax = a.x(), ay = a.y(), bx = b.x(), by = b.y();
    var xmiddle = floor(a.);

}
