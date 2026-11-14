export const SYMBOLS=[{id:'XAU/USD',src:'t'}];
export async function candles(sym,tf){
  if(sym.src==='k'){
    const r=await fetch(`https://api.kraken.com/0/public/OHLC?pair=${sym.pair}&interval=${tf==='1m'?1:5}`,{next:{revalidate:30}});
    const j=await r.json();
    if(!r.ok||(j.error&&j.error.length))throw new Error('Crypto data error');
    const rows=j.result[Object.keys(j.result).find(k=>k!=='last')];
    return rows.map(x=>({t:x[0]*1000,c:+x[4],h:+x[2],l:+x[3]}));
  }
  const iv=tf==='1m'?'1min':'5min';
  const r=await fetch(`https://api.twelvedata.com/time_series?symbol=${sym.id}&interval=${iv}&outputsize=1000&timezone=UTC&apikey=${process.env.TWELVE_DATA_KEY}`,{next:{revalidate:30}});
  const j=await r.json();if(!j.values)throw new Error(j.message||'Data error');
  return j.values.reverse().map(x=>({t:Date.parse(x.datetime.replace(' ','T')+'Z'),c:+x.close,h:+x.high,l:+x.low}));
}
