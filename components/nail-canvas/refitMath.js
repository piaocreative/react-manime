// https://www.particleincell.com/2012/bezier-splines/ 
function computeControlPoints(K)
{
  let p1 = [];
  let p2 = [];
  let n = K.length - 1;

  /*rhs vector*/
  let a = [];
  let b = [];
  let c = [];
  let r = [];

  /*left most segment*/
  a[0] = 0;
  b[0] = 2;
  c[0] = 1;
  r[0] = K[0] + 2 * K[1];

  /*internal segments*/
  for (let i = 1; i < n - 1; i++)
  {
    a[i] = 1;
    b[i] = 4;
    c[i] = 1;
    r[i] = 4 * K[i] + 2 * K[i + 1];
  }

  /*right segment*/
  a[n - 1] = 2;
  b[n - 1] = 7;
  c[n - 1] = 0;
  r[n - 1] = 8 * K[n - 1] + K[n];

  /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
  for (let i = 1; i < n; i++)
  {
    let m = a[i] / b[i - 1];
    b[i] = b[i] - m * c[i - 1];
    r[i] = r[i] - m * r[i - 1];
  }

  p1[n - 1] = r[n - 1] / b[n - 1];
  for (let i = n - 2; i >= 0; --i)
    p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

  /*we have p1, now compute p2*/
  for (let i = 0; i < n - 1; i++)
    p2[i] = 2 * K[i + 1] - p1[i + 1];

  p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

  return {
    p1: p1,
    p2: p2
  };
}

function evaluateParamFromPoints(points, t)
{
  if (points.length === 2)
  {
	  return { x: interpolate(t, 0, 1, points[0].x, points[1].x),
	           y: interpolate(t, 0, 1, points[0].y, points[1].y) };
  }	  
	
  function computeBezier(bezier, t, i)
  {
    function aux1(v, i)
    {
      let w = computeControlPoints(v);

      return [v[i], w.p1[i], w.p2[i], v[i + 1]];
    }

    function aux2(b, t)
    {
      let p0 = b[0];
      let p1 = b[1];
      let p2 = b[2];
      let p3 = b[3];

      let u = 1 - t;

      let t2 = t * t;
      let t3 = t * t * t;
      let u2 = u * u;
      let u3 = u * u * u;

      return p0 * u3 + 3 * p1 * t * u2 + 3 * p2 * t2 * u + p3 * t3;
    }

    let x = [];
    let y = [];
    for (let j = 0; j < bezier.length; ++j){
      x.push(bezier[j].x);
      y.push(bezier[j].y);
    }

    x = aux1(x, i);
    y = aux1(y, i);

    return {
      x: aux2(x, t),
      y: aux2(y, t)
    }
  }

  if (t < 0) t = 0;
  if (t > 1) t = 1;

  if (t === 0)
  {
    return {
      x: points[0].x,
      y: points[0].y
    };
  }

  if (t === 1)
  {

    return {
      x: points[points.length - 1].x,
      y: points[points.length - 1].y
    };
  }

  t *= (points.length - 1)
  return computeBezier(points, t % 1, Math.floor(t))
}

function makeParamFromPoints(points)
{
  let copy = [];
  for (let i=0; i<points.length; i++)
    copy.push({ x: points[i].x, y: points[i].y }); 
	
  let g = function(t)
  {
    return evaluateParamFromPoints(copy, t)
  };

  return g;
}

function makeParamTranslate(p, x, y)
{
  let q = function(t)
  {
    let res = p(t);
    return {
      x: res.x + x,
      y: res.y + y
    };
  }

  return q;
}

function makeParamFrom2(p1, p2)
{
  let q = function(t)
  {
    if (t <= 0) return p1(0);
    if (t >= 1) return p2(1);

    t = t * 2;

    if (t <= 1)
      return p1(t);

    return p2(t - 1);
  }

  return q;
}

function makeParamFrom2RevisitedForBottom(p1, p2) {

  let q = function (t) {
    let ratio = 0.9;

    if (t <= 0) return p1(0);
    if (t >= 1) return p2(1);

    t = t * 2;

    if (t > ratio && t <= 2 - ratio) {
      let a = p1(ratio);
      let b = p2(1 - ratio);
      let p = {
        x: interpolate(t, ratio, 2 - ratio, a.x, b.x),
        y: interpolate(t, ratio, 2 - ratio, a.y, b.y),
        z: interpolate(t, ratio, 2 - ratio, a.z, b.z)
      };

      let q = null;
      if (t <= 1)
        q = p1(t);
      else
        q = p2(t - 1);

      if (q.z == null)
        q.z = 0;

      return p;
    }

    if (t <= 1)
      return p1(t);

    return p2(t - 1);
  }

  return q;
}

function interpolate(a, a1, a2, b1, b2) {
  return b1 + (b2 - b1) * (a - a1) / (a2 - a1);
}

export {
  computeControlPoints,
  evaluateParamFromPoints,
  makeParamFromPoints,
  makeParamTranslate,
  makeParamFrom2,
  makeParamFrom2RevisitedForBottom,
  interpolate
}