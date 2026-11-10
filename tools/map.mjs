import {geoContains} from 'd3-geo';
import {feature} from 'topojson-client';
import {readFileSync, writeFileSync} from 'fs';
const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-110m.json'));
const land = feature(topo, topo.objects.land);
const W=1000, LAT0=78, LAT1=-56, H=Math.round((LAT0-LAT1)/360*W*1.25);
const px=(lon,lat)=>[ (lon+180)/360*W, (LAT0-lat)/(LAT0-LAT1)*H ];
let out=[]; const step=2.6;
for(let lat=LAT0;lat>=LAT1;lat-=step) for(let lon=-180;lon<180;lon+=step*0.8){
  if(geoContains(land,[lon,lat])){const [x,y]=px(lon,lat); out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.1"/>`);}
}
const pts={kolkata:[88.36,22.57],bangalore:[77.59,12.97],durgapur:[87.32,23.52],usa:[-96,39],uk:[-1.5,52.5],eu:[10,50],gcc:[54.4,24.4]};
const m={}; for(const k in pts) m[k]=px(...pts[k]).map(v=>+v.toFixed(1));
writeFileSync('../src/assets/worlddots.svgfrag', out.join(''));
writeFileSync('map-meta.json', JSON.stringify({W,H,m,count:out.length}));
console.log(W,H,out.length,JSON.stringify(m));
