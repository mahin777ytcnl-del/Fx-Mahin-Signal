export const ema=(a,p)=>{const k=2/(p+1);let e=a[0];return a.map((v,i)=>i?(e=v*k+e*(1-k)):e)};
function rsi(c,p=14){let g=0,l=0;const r=Array(c.length).fill(50);for(let i=1;i<c.length;i++){const d=c[i]-c[i-1],u=Math.max(d,0),w=Math.max(-d,0);if(i<=p){g+=u/p;l+=w/p}else{g=(g*(p-1)+u)/p;l=(l*(p-1)+w)/p}if(i>=p)r[i]=l?100-100/(1+g/l):100}return r}
export function indicators(k){
  const c=k.map(x=>x.c),h=k.map(x=>x.h),l=k.map(x=>x.l);
  const tr=h.map((x,i)=>i?Math.max(x-l[i],Math.abs(x-c[i-1]),Math.abs(l[i]-c[i-1])):x-l[i]);
  const a12=ema(c,12),a26=ema(c,26),m=a12.map((v,i)=>v-a26[i]),sg=ema(m,9);
  return{c,h,l,e9:ema(c,9),e21:ema(c,21),e50:ema(c,50),e200:ema(c,200),rsi:rsi(c),hist:m.map((v,i)=>v-sg[i]),atr:ema(tr,14)};
}
// Confluence: trend (EMA50/200) + EMA9/21 cross + RSI zone + MACD momentum
export function sigAt(i,I){
  const{c,e9,e21,e50,e200,rsi,hist,atr}=I;if(i<201)return null;
  const up=[0,1,2].some(d=>e9[i-d-1]<=e21[i-d-1]&&e9[i-d]>e21[i-d]);
  const dn=[0,1,2].some(d=>e9[i-d-1]>=e21[i-d-1]&&e9[i-d]<e21[i-d]);
  const a=atr[i];let side=null;
  if(up&&e50[i]>e200[i]&&c[i]>e200[i]&&rsi[i]>45&&rsi[i]<68&&hist[i]>0)side='BUY';
  if(dn&&e50[i]<e200[i]&&c[i]<e200[i]&&rsi[i]<55&&rsi[i]>32&&hist[i]<0)side='SELL';
  if(!side)return null;const s=side==='BUY'?1:-1;
  return{side,entry:c[i],sl:c[i]-s*a*1.5,tp1:c[i]+s*a,tp2:c[i]+s*a*2};
}
export function backtest(I){
  let w=0,t=0;const n=I.c.length;
  for(let i=202;i<n-31;i++){const s=sigAt(i,I);if(!s)continue;t++;const buy=s.side==='BUY';
    for(let j=i+1;j<=i+30;j++){
      if(buy?I.l[j]<=s.sl:I.h[j]>=s.sl)break;
      if(buy?I.h[j]>=s.tp1:I.l[j]<=s.tp1){w++;break}
    }i+=10}
  return{trades:t,wins:w,winRate:t?Math.round(w/t*100):null};
}
export function analyze(k){
  const I=indicators(k),i=k.length-2;
  return{signal:sigAt(i,I),price:k[k.length-1].c,rsi:Math.round(I.rsi[i]),trend:I.e50[i]>I.e200[i]?'UP':'DOWN',backtest:backtest(I)};
}
