export const SYMBOLS=[
 {id:'BTCUSDT',src:'b'},{id:'ETHUSDT',src:'b'},{id:'EUR/USD',src:'t'},{id:'GBP/USD',src:'t'},
 {id:'USD/JPY',src:'t'},{id:'XAU/USD',src:'t'},{id:'WTI/USD',src:'t'}];
export async function candles(sym,tf){
  if(sym.src==='b'){
    const r=await fetch(`https://data-api.binance.vision/api/v3/klines?symbol=${sym.id}&interval=${tf}&limit=1000`,{next:{revalidate:30}});
    if(!r.ok)throw new Error('Binance data error');
    return(await r.json()).map(x=>({c:+x[4],h:+x[2],l:+x[3]}));
  }
  const iv=tf==='1m'?'1min':'5min';
  const r=await fetch(`https://api.twelvedata.com/time_series?symbol=${sym.id}&interval=${iv}&outputsize=1000&apikey=${process.env.TWELVE_DATA_KEY}`,{next:{revalidate:30}});
  const j=await r.json();if(!j.values)throw new Error(j.message||'Data error');
  return j.values.reverse().map(x=>({c:+x.close,h:+x.high,l:+x.low}));
}
