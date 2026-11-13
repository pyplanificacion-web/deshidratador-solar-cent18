import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------- THREE.JS SOLAR LAB ----------
const container=document.getElementById('threeContainer');
const loading=document.getElementById('loading3d');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0xa8cce2);
scene.fog=new THREE.Fog(0xa8cce2,12,24);
const camera=new THREE.PerspectiveCamera(42,container.clientWidth/container.clientHeight,.02,100);
camera.position.set(2.2,1.65,2.8);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(container.clientWidth,container.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);
loading.remove();
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,.27,0);controls.minDistance=1.1;controls.maxDistance=8;controls.maxPolarAngle=Math.PI/2-.02;
scene.add(new THREE.HemisphereLight(0xffffff,0x536447,1.4));

// Ground + Cartesian grid (x=E/W, z=N/S)
const groundMat=new THREE.MeshStandardMaterial({color:0x6f8a53,roughness:1});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(16,16),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(10,20,0x465d3e,0x78936b);grid.position.y=.002;scene.add(grid);
const axisX=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,.01,0),new THREE.Vector3(4,.01,0)]),new THREE.LineBasicMaterial({color:0xb23a2a}));
const axisZ=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.012,-4),new THREE.Vector3(0,.012,4)]),new THREE.LineBasicMaterial({color:0x295d93}));scene.add(axisX,axisZ);
function labelSprite(text,color='#fff'){
  const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');x.font='700 58px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(20,25,20,.65)';x.roundRect(30,28,196,74,18);x.fill();x.fillStyle=color;x.fillText(text,128,66);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));s.scale.set(.42,.21,1);return s;
}
[['N',0,0,3.25],['S',0,0,-3.25],['E',3.25,0,0],['O',-3.25,0,0]].forEach(([t,x,y,z])=>{const s=labelSprite(t);s.position.set(x,.08,z);scene.add(s)});
const xLab=labelSprite('X · E/O','#ffd7c8');xLab.position.set(2.7,.08,.28);scene.add(xLab);const zLab=labelSprite('Z · N/S','#cfe4ff');zLab.position.set(.3,.08,2.7);scene.add(zLab);

// Dryer model
const dryer=new THREE.Group();scene.add(dryer);
const wood=new THREE.MeshStandardMaterial({color:0x9a542b,roughness:.8,metalness:0});
const woodDark=new THREE.MeshStandardMaterial({color:0x60351f,roughness:.9});
const black=new THREE.MeshStandardMaterial({color:0x252721,roughness:.9});
const meshMat=new THREE.MeshStandardMaterial({color:0x9caaa4,roughness:.7,metalness:.35,transparent:true,opacity:.72,side:THREE.DoubleSide});
const glassMat=new THREE.MeshPhysicalMaterial({color:0xbfe4ee,transparent:true,opacity:.27,roughness:.08,metalness:0,transmission:.3,side:THREE.DoubleSide});
function addBox(size,pos,mat,parent=dryer){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const W=.55,D=.505,yF=.105,yB=.505,bottom=.045,zF=D/2,zB=-D/2;
addBox([W,.055,D],[0,bottom/2,0],woodDark);
addBox([W,.105,.038],[0,.075,zF],wood);
addBox([W,.50,.038],[0,.255,zB],wood);
// Side wedge panels
function sidePanel(x){const g=new THREE.BufferGeometry();const verts=new Float32Array([x,bottom,zF, x,yF,zF, x,yB,zB, x,bottom,zB]);g.setAttribute('position',new THREE.BufferAttribute(verts,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x8d4e2a,roughness:.85,side:THREE.DoubleSide}));m.castShadow=true;m.receiveShadow=true;dryer.add(m)}sidePanel(-W/2);sidePanel(W/2);
// Glass plane custom quad, inset from frame
const inset=.025;const gyF=yF+.004,gyB=yB-.025;const gzF=zF-.02,gzB=zB+.02;const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-W/2+inset,gyF,gzF, W/2-inset,gyF,gzF, W/2-inset,gyB,gzB, -W/2+inset,gyB,gzB]),3));gg.setIndex([0,1,2,0,2,3]);gg.computeVertexNormals();const glass=new THREE.Mesh(gg,glassMat);glass.receiveShadow=true;dryer.add(glass);
function beamBetween(a,b,t=.022,mat=wood){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),mid=va.clone().add(vb).multiplyScalar(.5),v=vb.clone().sub(va);const m=new THREE.Mesh(new THREE.BoxGeometry(t,v.length(),t),mat);m.position.copy(mid);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());m.castShadow=true;dryer.add(m);return m}
beamBetween([-W/2,yF,zF],[W/2,yF,zF],.025);beamBetween([-W/2,yB,zB],[W/2,yB,zB],.025);beamBetween([-W/2,yF,zF],[-W/2,yB,zB],.025);beamBetween([W/2,yF,zF],[W/2,yB,zB],.025);
// top outlet and lower inlet accents
addBox([W-.06,.014,.055],[0,yB-.015,zB+.025],meshMat);addBox([W-.07,.026,.015],[0,.085,zF+.021],meshMat);
// trays
[[.155,.40],[.245,.34],[.335,.27]].forEach(([y,depth])=>{const tray=new THREE.Group();addBox([.48,.018,depth],[0,y,-.02],wood,tray);const mm=new THREE.Mesh(new THREE.PlaneGeometry(.45,depth-.035),meshMat);mm.rotation.x=-Math.PI/2;mm.position.set(0,y+.011,-.02);mm.receiveShadow=true;tray.add(mm);dryer.add(tray)});
// stand and feet
addBox([.07,.64,.07],[0,-.29,0],black);addBox([.75,.035,.055],[0,-.595,0],black);const foot2=addBox([.75,.035,.055],[0,-.594,0],black);foot2.rotation.y=Math.PI/2;
dryer.position.y=.62;
// airflow arrows
const airflow=new THREE.Group();dryer.add(airflow);[[0,.12,.18],[0,.24,.05],[0,.36,-.08]].forEach(([x,y,z])=>{const ar=new THREE.ArrowHelper(new THREE.Vector3(0,.88,-.45).normalize(),new THREE.Vector3(x,y,z),.16,0x4da7ff,.045,.025);airflow.add(ar)});

// Sun and directional light
const sunMat=new THREE.MeshBasicMaterial({color:0xffd24a});const sun=new THREE.Mesh(new THREE.SphereGeometry(.16,32,18),sunMat);scene.add(sun);
const sunlight=new THREE.DirectionalLight(0xfff1bf,3.0);sunlight.castShadow=true;sunlight.shadow.mapSize.set(2048,2048);sunlight.shadow.camera.left=-3;sunlight.shadow.camera.right=3;sunlight.shadow.camera.top=3;sunlight.shadow.camera.bottom=-3;sunlight.shadow.camera.near=.1;sunlight.shadow.camera.far=18;sunlight.target.position.set(0,.5,0);scene.add(sunlight,sunlight.target);
const sunLineMat=new THREE.LineDashedMaterial({color:0xffe49a,dashSize:.12,gapSize:.08,transparent:true,opacity:.75});const sunLineGeom=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);const sunLine=new THREE.Line(sunLineGeom,sunLineMat);sunLine.computeLineDistances();scene.add(sunLine);

const az=document.getElementById('azimuth'),alt=document.getElementById('altitude'),rot=document.getElementById('dryerRotation');
const azOut=document.getElementById('azOut'),altOut=document.getElementById('altOut'),rotOut=document.getElementById('rotOut');
function updateSun(){const A=THREE.MathUtils.degToRad(+az.value),H=THREE.MathUtils.degToRad(+alt.value),R=7;const p=new THREE.Vector3(R*Math.sin(A)*Math.cos(H),R*Math.sin(H)+.4,R*Math.cos(A)*Math.cos(H));sun.position.copy(p);sunlight.position.copy(p);sunLine.geometry.setFromPoints([p,new THREE.Vector3(0,.45,0)]);sunLine.computeLineDistances();azOut.value=`${az.value}°`;altOut.value=`${alt.value}°`;}
function updateDryer(){dryer.rotation.y=-THREE.MathUtils.degToRad(+rot.value);rotOut.value=`${rot.value}°`;}
az.addEventListener('input',updateSun);alt.addEventListener('input',updateSun);rot.addEventListener('input',updateDryer);document.getElementById('airflowToggle').addEventListener('change',e=>airflow.visible=e.target.checked);updateSun();updateDryer();

// Approximate solar position for San Juan (NOAA-style equations)
function dayOfYear(d){return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/86400000)}
function solarPositionSanJuan(dateStr,timeStr){
  const [Y,M,Dd]=dateStr.split('-').map(Number),[hh,mm]=timeStr.split(':').map(Number);const local=new Date(Y,M-1,Dd,hh,mm);const n=dayOfYear(local);const hour=hh+mm/60;
  const gamma=2*Math.PI/365*(n-1+(hour-12)/24);
  const eq=229.18*(.000075+.001868*Math.cos(gamma)-.032077*Math.sin(gamma)-.014615*Math.cos(2*gamma)-.040849*Math.sin(2*gamma));
  const dec=.006918-.399912*Math.cos(gamma)+.070257*Math.sin(gamma)-.006758*Math.cos(2*gamma)+.000907*Math.sin(2*gamma)-.002697*Math.cos(3*gamma)+.00148*Math.sin(3*gamma);
  const lat=-31.54*Math.PI/180,lon=-68.536,timezone=-3;const offset=eq+4*lon-60*timezone;let tst=hh*60+mm+offset;tst=((tst%1440)+1440)%1440;let ha=tst/4-180;if(ha<-180)ha+=360;const har=ha*Math.PI/180;
  const cosZen=Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(har);const zen=Math.acos(Math.max(-1,Math.min(1,cosZen)));const altitude=90-zen*180/Math.PI;
  const azr=Math.atan2(Math.sin(har),Math.cos(har)*Math.sin(lat)-Math.tan(dec)*Math.cos(lat));const azimuth=(azr*180/Math.PI+180+360)%360;
  return {altitude,azimuth,eq,ha};
}
document.getElementById('calcSun').addEventListener('click',()=>{const date=document.getElementById('solarDate').value,time=document.getElementById('solarTime').value;if(!date||!time)return;const p=solarPositionSanJuan(date,time);const read=document.getElementById('solarReadout');if(p.altitude<=0){alt.value=3;az.value=Math.round(p.azimuth);read.innerHTML=`El Sol está por debajo del horizonte a esa hora. Azimut matemático ≈ <strong>${p.azimuth.toFixed(1)}°</strong>.`; }else{alt.value=Math.round(Math.min(85,p.altitude));az.value=Math.round(p.azimuth)%360;read.innerHTML=`Posición aproximada: <strong>azimut ${p.azimuth.toFixed(1)}°</strong> · <strong>altura ${p.altitude.toFixed(1)}°</strong>.`; }updateSun();});
document.getElementById('resetView').addEventListener('click',()=>{camera.position.set(2.2,1.65,2.8);controls.target.set(0,.27,0);controls.update();az.value=0;alt.value=45;rot.value=0;updateSun();updateDryer()});

function resize(){const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}window.addEventListener('resize',resize);
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);controls.update(clock.getDelta());renderer.render(scene,camera)}animate();
