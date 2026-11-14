export const ema=(a,p)=>{const k=2/(p+1);let e=a[0];return a.map((v,i)=>i?(e=v*k+e*(1-k)):e)};
function rsi(c,p=14){let g=0,l=0;const r=Array(c.length).fill(50);for(let i=1;i<c.length;i++){const d=c[i]-c[i-1],u=Math.max(d,0),w=Math.max(-d,0);if(i<=p){g+=u/p;l+=w/p}else{g=(g*(p-1)+u)/p;l=(l*(p-1)+w)/p}if(i>=p)r[i]=l?100-100/(1+g/l):100}return r}
const mx=(a,f,t)=>{let m=-Infinity;for(let j=f;j<=t;j++)m=Math.max(m,a[j]);return m};
const mn=(a,f,t)=>{let m=Infinity;for(let j=f;j<=t;j++)m=Math.min(m,a[j]);return m};
export function indicators(k){
  const c=k.map(x=>x.c),h=k.map(x=>x.h),l=k.map(x=>x.l),t=k.map(x=>x.t),n=c.length;
  const tr=h.map((x,i)=>i?Math.max(x-l[i],Math.abs(x-c[i-1]),Math.abs(l[i]-c[i-1])):x-l[i]);
  const pH=Array(n).fill(false),pL=Array(n).fill(false);
  for(let j=3;j<n-3;j++){ // swing points (confirmed 3 bars later)
    if(h[j]>=mx(h,j-3,j-1)&&h[j]>mx(h,j+1,j+3))pH[j]=true;
    if(l[j]<=mn(l,j-3,j-1)&&l[j]<mn(l,j+1,j+3))pL[j]=true;
  }
  return{c,h,l,t,pH,pL,e50:ema(c,50),e200:ema(c,200),rsi:rsi(c),atr:ema(tr,14)};
}
const lastP=(arr,from,lim)=>{for(let j=from;j>=lim;j--)if(arr[j])return j;return -1};
// SMC/ICT: liquidity sweep of a swing level + market structure shift + FVG,
// bought in discount / sold in premium, trend aligned, inside London/NY hours.
export function sigAt(i,I){
  const{c,h,l,t,pH,pL,e50,e200,atr}=I;if(i<210)return null;
  if(t[i]){const hr=new Date(t[i]).getUTCHours();if(hr<7||hr>16)return null}
  const a=atr[i],mid=(mx(h,i-100,i)+mn(l,i-100,i))/2;
  for(let k=i-1;k>=i-8;k--){
    if(e50[i]>e200[i]&&c[i]<mid){
      const pj=lastP(pL,k-4,i-100);
      if(pj>=0&&l[k]<l[pj]&&c[k]>l[pj]&&c[i]>mx(h,k,i-1)&&(i-1<k||c[i-1]<=mx(h,k,i-2))){
        let fvg=false;for(let m=k+1;m<=i;m++)if(l[m]>h[m-2])fvg=true;
        const sl=mn(l,k,i)-0.2*a,R=c[i]-sl;
        if(fvg&&R>0&&R<=3*a)return{side:'BUY',entry:c[i],sl,tp1:c[i]+R,tp2:c[i]+2*R,why:'Sweep + MSS + FVG + Discount'};
      }
    }
    if(e50[i]<e200[i]&&c[i]>mid){
      const pj=lastP(pH,k-4,i-100);
      if(pj>=0&&h[k]>h[pj]&&c[k]<h[pj]&&c[i]<mn(l,k,i-1)&&(i-1<k||c[i-1]>=mn(l,k,i-2))){
        let fvg=false;for(let m=k+1;m<=i;m++)if(h[m]<l[m-2])fvg=true;
        const sl=mx(h,k,i)+0.2*a,R=sl-c[i];
        if(fvg&&R>0&&R<=3*a)return{side:'SELL',entry:c[i],sl,tp1:c[i]-R,tp2:c[i]-2*R,why:'Sweep + MSS + FVG + Premium'};
      }
    }
  }
  return null;
}
export function backtest(I){
  let w=0,tr=0;const n=I.c.length;
  for(let i=210;i<n-41;i++){const s=sigAt(i,I);if(!s)continue;tr++;const buy=s.side==='BUY';
    for(let j=i+1;j<=i+40;j++){
      if(buy?I.l[j]<=s.sl:I.h[j]>=s.sl)break;
      if(buy?I.h[j]>=s.tp1:I.l[j]<=s.tp1){w++;break}
    }i+=10}
  return{trades:tr,wins:w,winRate:tr?Math.round(w/tr*100):null};
}
export function analyze(k){
  const I=indicators(k),i=k.length-2,n=k.length;
  const pj=lastP(I.pL,n-5,n-150),pk=lastP(I.pH,n-5,n-150);
  return{signal:sigAt(i,I),price:k[n-1].c,rsi:Math.round(I.rsi[i]),trend:I.e50[i]>I.e200[i]?'UP':'DOWN',
    sr:{support:pj>=0?I.l[pj]:null,resistance:pk>=0?I.h[pk]:null},backtest:backtest(I)};
}
