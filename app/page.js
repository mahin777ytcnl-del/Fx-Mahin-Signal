'use client';
import {useState,useEffect,useCallback,useRef} from 'react';
const SYMS=[['XAU/USD','GOLD (XAU/USD)']];
const f=n=>n>=100?n.toFixed(2):n.toFixed(5);
function Card({id,name,tf,onAuth}){
  const[d,setD]=useState(null);
  const load=useCallback(async()=>{const r=await fetch(`/api/signals?s=${encodeURIComponent(id)}&tf=${tf}`);if(r.status===401)return onAuth();setD(await r.json())},[id,tf,onAuth]);
  useEffect(()=>{setD(null);load();const t=setInterval(load,60000);return()=>clearInterval(t)},[load]);
  const s=d?.signal,k=s?s.side:'WAIT',b=d?.backtest;
  return(<div className={`card ${k}`}><div className="top"><span className="nm">{name}</span><span className="badge">{d?.error?'ERR':k}</span></div>
  {!d?<p>Loading…</p>:d.error?<p className="err">{d.error}</p>:<>
  <div className="px">{f(d.price)}</div>
  {s?<><div className="row">Entry<b>{f(s.entry)}</b></div><div className="row">Setup<b>{s.why}</b></div><div className="row sl">Stop loss<b>{f(s.sl)}</b></div><div className="row tp">Take profit 1<b>{f(s.tp1)}</b></div><div className="row tp">Take profit 2<b>{f(s.tp2)}</b></div></>
  :<div className="row">No setup. Waiting for liquidity sweep, structure shift and FVG.</div>}
  {d.sr?.support!=null&&<div className="row">Support<b>{f(d.sr.support)}</b></div>}{d.sr?.resistance!=null&&<div className="row">Resistance<b>{f(d.sr.resistance)}</b></div>}
  <div className="row">Trend / RSI<b>{d.trend} / {d.rsi}</b></div>
  <div className="row">Backtest win rate<b>{b.winRate==null?'n/a':b.winRate+'%'} ({b.trades} trades)</b></div></>}</div>)}
function Chart({tf}){
  const ref=useRef(null);
  useEffect(()=>{const el=ref.current;el.innerHTML='';
    const sc=document.createElement('script');sc.src='https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';sc.async=true;
    sc.innerHTML=JSON.stringify({autosize:true,symbol:'OANDA:XAUUSD',interval:tf==='1m'?'1':'5',theme:'dark',style:'1',locale:'en',backgroundColor:'rgba(4,10,24,1)',gridColor:'rgba(34,228,255,0.07)',allow_symbol_change:false,hide_side_toolbar:true,hide_volume:true,withdateranges:false,details:false});
    el.appendChild(sc)},[tf]);
  return <div className="tvc" style={{marginTop:16,borderRadius:14,overflow:'hidden',border:'1px solid #22e4ff55',boxShadow:'0 0 30px #22e4ff22'}}>
  <style>{'.tvc{height:640px}.tvc .tradingview-widget-container,.tvc iframe{height:100%!important;width:100%!important}'}</style>
  <div ref={ref} className="tradingview-widget-container"/></div>}
export default function Home(){
  const[auth,setAuth]=useState(true),[tf,setTf]=useState('5m'),[u,setU]=useState(''),[p,setP]=useState(''),[err,setErr]=useState('');
  const onAuth=useCallback(()=>setAuth(false),[]);
  async function login(e){e.preventDefault();const r=await fetch('/api/login',{method:'POST',body:JSON.stringify({user:u,pass:p})});if(r.ok){setErr('');location.reload()}else setErr('Wrong username or password')}
  async function out(){await fetch('/api/login',{method:'DELETE'});setAuth(false)}
  if(!auth)return(<form className="card login" onSubmit={login}><h1>Fx Mahin</h1><p><small>Sign in to see live signals</small></p>
  <input placeholder="Username" value={u} onChange={e=>setU(e.target.value)} autoComplete="username"/><input type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} autoComplete="current-password"/>
  {err&&<p className="err">{err}</p>}<button className="on" style={{width:'100%'}}>Sign in</button></form>);
  return(<main><header><h1>Fx Mahin</h1><div style={{display:'flex',gap:8}}>
  {['1m','5m'].map(x=><button key={x} className={tf===x?'on':''} onClick={()=>setTf(x)}>{x}</button>)}<button onClick={out}>Sign out</button></div></header>
  <div className="cards">{SYMS.map(([id,n])=><Card key={id+tf} id={id} name={n} tf={tf} onAuth={onAuth}/>)}</div>
  <Chart tf={tf}/>
  <p><small>Signals refresh every minute. Win rate comes from a backtest on the last ~1000 candles and does not predict future results. Not financial advice. Trading can lose money.</small></p></main>)}
