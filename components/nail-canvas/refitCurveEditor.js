import {
  evaluateParamFromPoints,
  interpolate
} from './refitMath';

class refitEditor
{
    constructor(canvasName)
    {
      this.canvasElement = document.getElementById(canvasName);
      this.context = this.canvasElement.getContext("2d");
      this.curves = [];
        
      this.left = 0;
      this.right = 1;
      this.top = 1;
      this.bottom = 0;
        
      this.divisions = 64;
        
      this.needRedrawCallback = function (that) { this.draw(); }

    }
    
    addCurve(curve)
    {
        let temp = [];
        for (let i = 0; i < curve.length; ++i){
            temp.push({x: curve[i].x, y: curve[i].y}); // break link
        }
        this.curves.push(temp);
        this.needRedrawCallback(this);
    }
    
    draw()
    {         
      for (let i = 0; i <this.curves.length; i++)
        this.drawCurve(this.curves[i]);    
    }
     
    drawLine(x1, y1, x2, y2)
    {  
      let u1 = this.xToCanvas(x1, y1);
      let v1 = this.yToCanvas(x1, y1);
      
      let u2 = this.xToCanvas(x2, y2);
      let v2 = this.yToCanvas(x2, y2);

      this.context.beginPath();
      this.context.moveTo(u1, v1);
      this.context.lineTo(u2, v2);
      this.context.stroke();
    } 
    
    drawCurve(curve)
    {            
        this.drawParametric(function (t) { return evaluateParamFromPoints(curve, t); });
   }
    
    drawParametric(p)
    {    
      for (let a=0; a<this.divisions; a++)
      {
          if (a === this.divisions - 1){
          }
          let t1 = interpolate(a, 0, this.divisions, 0, 1);
          let t2 = interpolate(a+1, 0, this.divisions, 0, 1);
        
          let xy1 = p(t1);
          let xy2 = p(t2);
            
          this.drawLine(xy1.x, xy1.y, xy2.x, xy2.y);
      } 
   }    
    
   xFromCanvas(x, y)
   {
     return interpolate(x, 0, this.canvasElement.width, this.left, this.right);
   }
    
   yFromCanvas(x, y)
   {
     return interpolate(y, this.canvasElement.height, 0, this.bottom, this.top);
   }
    
   xToCanvas(x, y)
   {
     return interpolate(x, this.left, this.right, 0, this.canvasElement.width);
   }
    
   yToCanvas(x, y)
   {
     return interpolate(y, this.bottom, this.top, this.canvasElement.height, 0); 
   }
}

export default refitEditor;