import {NextResponse} from 'next/server';import {cookies} from 'next/headers';
import {token} from '../../../lib/auth';import {SYMBOLS,candles} from '../../../lib/data';import {analyze} from '../../../lib/strategy';
export const dynamic='force-dynamic';
export async function GET(req){
  if(cookies().get('sd')?.value!==token())return NextResponse.json({error:'auth'},{status:401});
  const u=new URL(req.url),sym=SYMBOLS.find(s=>s.id===u.searchParams.get('s')),tf=u.searchParams.get('tf')==='1m'?'1m':'5m';
  if(!sym)return NextResponse.json({error:'bad symbol'},{status:400});
  try{return NextResponse.json(analyze(await candles(sym,tf)))}catch(e){return NextResponse.json({error:e.message},{status:502})}
}
