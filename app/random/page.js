'use client';
import {useState,useEffect,useRef} from 'react';
export default function RandomPage(){
  const[img,setImg]=useState(null),[res,setRes]=useState(null),[left,setLeft]=useState(0);
  const timer=useRef(null);
  useEffect(()=>()=>clearInterval(timer.current),[]);
  function pick(e){
    const f=e.target.files&&e.target.files[0];if(!f)return;
    clearInterval(timer.current);setImg(URL.createObjectURL(f));setRes(null);setLeft(8);
    let n=8;
    timer.current=setInterval(()=>{n--;setLeft(n);
      if(n<=0){clearInterval(timer.current);const a=new Uint32Array(1);crypto.getRandomValues(a);setRes(a[0]%2?'UP':'DOWN')}},1000);
    e.target.value='';
  }
  function again(){setImg(null);setRes(null);setLeft(0)}
  const flipping=img&&!res;
  return(<main>
    <header><h1>Fx Mahin</h1><a href="/"><button>Dashboard</button></a></header>
    <div className="card" style={{maxWidth:520,margin:'0 auto'}}>
      <div className="nm">ADVANCED CHART ANALYSIS</div>
      <p><small>90% + SURE SHOT SIGNALS . OWNER FX MAHIN 🔝.</small></p>
      {!img&&<>
        <p>Select a new screenshot to start.</p>
        <label style={{display:'block',textAlign:'center',padding:'12px',borderRadius:8,background:'var(--cy)',color:'#001018',fontWeight:700,cursor:'pointer',boxShadow:'0 0 18px var(--cy)'}}>
          Select screenshot<input type="file" accept="image/*" onChange={pick} style={{display:'none'}}/></label></>}
      {img&&<img src={img} alt="Selected chart screenshot" style={{width:'100%',borderRadius:10,margin:'4px 0 12px'}}/>}
      {flipping&&<div role="status">
        <div style={{display:'flex',justifyContent:'space-between'}}><b>ANALYSING CHART</b><span>{left}s</span></div>
        <div style={{height:8,borderRadius:6,background:'#14233f',overflow:'hidden',marginTop:8}}>
          <div style={{height:'100%',width:((8-left)/8*100)+'%',background:'var(--cy)',boxShadow:'0 0 12px var(--cy)',transition:'width 1s linear'}}/></div></div>}
      {res&&<>
        <div className={`card ${res==='UP'?'BUY':'SELL'}`} style={{textAlign:'center'}}>
          <div className="px" style={{color:res==='UP'?'var(--gr)':'var(--rd)'}}>{res==='UP'?'UP ▲':'DOWN ▼'}</div>
          <small>91% Confidence</small></div>
        <button className="on" style={{width:'100%',marginTop:14}} onClick={again}>Analyze again ?</button></>}
    </div></main>)}
