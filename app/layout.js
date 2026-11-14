import './globals.css';
export const metadata={title:'Fx Mahin | Live Trade Signals'};
const X=[60,150,240,330,420,510,600,690,780,870,960,1050,1140];
export default function L({children}){return(<html lang="en"><body>
<svg className="bgchart" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
<polyline className="ln" points="0,420 90,380 160,400 250,300 330,340 420,220 500,260 590,160 680,210 770,120 860,180 950,90 1050,140 1200,60"/>
{X.map((x,i)=>{const h=40+(i*37)%90,y=120+(i*53)%260;return <g key={x} className="cd" style={{animationDelay:i*.3+'s'}}><line x1={x} x2={x} y1={y-20} y2={y+h+20}/><rect x={x-9} y={y} width="18" height={h} className={i%3?'g':'r'}/></g>})}
</svg><div className="grid"/>{children}</body></html>)}
