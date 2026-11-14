import {NextResponse} from 'next/server';import {token} from '../../../lib/auth';
export async function POST(req){
  const{user,pass}=await req.json();
  if(!process.env.ADMIN_USER||user!==process.env.ADMIN_USER||pass!==process.env.ADMIN_PASS)return NextResponse.json({error:'Wrong login'},{status:401});
  const res=NextResponse.json({ok:true});
  res.cookies.set('sd',token(),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:604800});return res;
}
export async function DELETE(){const r=NextResponse.json({ok:true});r.cookies.delete('sd');return r}
