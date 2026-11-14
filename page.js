'use client';
import {useState,useEffect,useCallback} from 'react';
const SYMS=[['BTCUSDT','BTC/USD'],['ETHUSDT','ETH/USD'],['EUR/USD','EUR/USD'],['GBP/USD','GBP/USD'],['USD/JPY','USD/JPY'],['XAU/USD','GOLD'],['WTI/USD','OIL (WTI)']];
const f=n=>n>=100?n.toFixed(2):n.toFixed(5);
function Card({id,name,tf,onAuth}){
  const[d,setD]=useState(null);
  const load=useCallback(async()=>{const r=await fetch(`/api/signals?s=${encodeURIComponent(id)}&tf=${tf}`);if(r.status===401)return onAuth();setD(await r.json())},[id,tf,onAuth]);
  useEffect(()=>{setD(null);load();const t=setInterval(load,60000);return()=>clearInterval(t)},[load]);
  const s=d?.signal,k=s?s.side:'WAIT',b=d?.backtest;
  return(<div className={`card ${k}`}><div className="top"><span className="nm">{name}</span><span className="badge">{d?.error?'ERR':k}</span></div>
  {!d?<p>Loading…</p>:d.error?<p className="err">{d.error}</p>:<>
  <div className="px">{f(d.price)}</div>
  {s?<><div className="row">Entry<b>{f(s.entry)}</b></div><div className="row sl">Stop loss<b>{f(s.sl)}</b></div><div className="row tp">Take profit 1<b>{f(s.tp1)}</b></div><div className="row tp">Take profit 2<b>{f(s.tp2)}</b></div></>
  :<div className="row">No setup. Waiting for trend, cross and momentum to agree.</div>}
  <div className="row">Trend / RSI<b>{d.trend} / {d.rsi}</b></div>
  <div className="row">Backtest win rate<b>{b.winRate==null?'n/a':b.winRate+'%'} ({b.trades} trades)</b></div></>}</div>)}
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
  <p><small>Signals refresh every minute. Win rate comes from a backtest on the last ~1000 candles and does not predict future results. Not financial advice. Trading can lose money.</small></p></main>)}
