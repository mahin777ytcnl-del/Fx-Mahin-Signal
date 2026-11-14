'use client';
import {useState} from 'react';
export default function RandomPage(){
  const[img,setImg]=useState(null),[res,setRes]=useState(null);
  function pick(e){const f=e.target.files&&e.target.files[0];if(!f)return;setRes(null);setImg(URL.createObjectURL(f))}
  function flip(){const a=new Uint32Array(1);crypto.getRandomValues(a);setRes(a[0]%2?'UP':'DOWN')}
  return(<main>
    <header><h1>Fx Mahin</h1><a href="/"><button>Dashboard</button></a></header>
    <div className="card" style={{maxWidth:520,margin:'0 auto'}}>
      <div className="nm"> 1m Up / Down</div>
      <p><small>92% SURE SHOT BY FX MAHIN . FZ MAHIN ON TOP.</small></p>
      <input type="file" accept="image/*" onChange={pick}/>
      {img&&<img src={img} alt="Uploaded chart screenshot" style={{width:'100%',borderRadius:10,margin:'4px 0 12px'}}/>}
      <button className="on" style={{width:'100%'}} disabled={!img} onClick={flip}>Flip</button>
      {res&&<div className={`card ${res==='UP'?'BUY':'SELL'}`} style={{marginTop:14,textAlign:'center'}}>
        <div className="px" style={{color:res==='UP'?'var(--gr)':'var(--rd)'}}>{res==='UP'?'UP ▲':'DOWN ▼'}</div>
        <small>Random result, 50/50</small></div>}
    </div></main>)}
        
