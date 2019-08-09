(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"8Lv4":function(e,t,s){var i=s("N5i1");"string"==typeof i&&(i=[[e.i,i,""]]);var n={hmr:!0,transform:void 0,insertInto:void 0};s("aET+")(i,n);i.locals&&(e.exports=i.locals)},N5i1:function(e,t,s){},Vtdi:function(e,t,s){"use strict";s.r(t);const i=8;class n{constructor(e,t,s,i,n){this.planet=s.planet,this.side=t,this.parent=s,this.parents=s.parents.concat([this.parent]),this.name=e,this.depth=s.depth+1,this.direction=s.direction,this.rotX=s.rotX,this.rotY=s.rotY,this.relativePosition=n,this.size=s.size/2,this.material=i,this.chuncks=[],this.create()}create(){this.mesh=BABYLON.MeshBuilder.CreateGround(this.name,{height:this.size,width:this.size,subdivisions:this.planet.resolution,updatable:!0},this.planet.scene),this.mesh.position=this.parent.mesh.position,this.mesh.rotate(new BABYLON.Vector3(1,0,0),this.rotX,BABYLON.Space.WORLD),this.mesh.rotate(new BABYLON.Vector3(0,1,0),this.rotY,BABYLON.Space.WORLD),this.mesh.material=this.material,this.moveVertexData(this.mesh),this.mesh.chunck=this,this.side.round(this.mesh),this.side.calculateNormals(this.mesh)}moveVertexData(e){var t=e.getVerticesData(BABYLON.VertexBuffer.PositionKind);this.parent.isSide()||this.relativePosition.addInPlace(this.parent.relativePosition);for(let e=0;e<t.length/3;e++){const s=new BABYLON.Vector3(t[3*e],t[3*e+1],t[3*e+2]);t[3*e]=s.x+this.relativePosition.x,t[3*e+1]=s.y+this.relativePosition.y,t[3*e+2]=s.z+this.relativePosition.z}e.updateVerticesData(BABYLON.VertexBuffer.PositionKind,t)}checkIfMakeChuncks(e){return e<i*this.size?(this.makeChuncks(),this.mesh.setEnabled(!1),!0):e>i*this.parent.size&&(this.parent.disposeChuncks(),this.parent.checkIfMakeChuncks(e),!0)}checkIfDisposeChuncks(e){return e>i*this.parent.size&&(this.parent.disposeChuncks(),this.parent.checkIfMakeChuncks(e),!0)}makeChuncks(){const e=this.size/4,t={1:new BABYLON.Vector3(-1,0,1).scale(e),2:new BABYLON.Vector3(1,0,1).scale(e),3:new BABYLON.Vector3(-1,0,-1).scale(e),4:new BABYLON.Vector3(1,0,-1).scale(e)};for(let e=1;e<=4;e++){const s=new n(`${this.name}_Chunck${e}`,this.side,this,this.planet.scene.glassMaterials[e-1],t[e]);this.chuncks.push(s)}}disposeChuncks(){this.chuncks.forEach(e=>{e.disposeChuncks(),e.mesh.dispose()}),this.chuncks=[],this.mesh.setEnabled(!0)}isSide(){return!1}}const r=8;class a{constructor(e,t,s){this.planet=t,this.parent=t,this.parents=[],this.name=e.name,this.depth=1,this.direction=e.dir,this.rotX=e.rotX,this.rotY=e.rotY,this.size=1/Math.sqrt(3)*this.planet.size*2,this.mesh=null,this.roundingVector=new BABYLON.Vector3(0,1,0).scale(this.size/2),this.material=this.planet.material,this.resolution=s,this.chuncks=[],this.create(e)}create(e){this.mesh=BABYLON.MeshBuilder.CreateGround(this.name,{height:this.size,width:this.size,subdivisions:this.planet.resolution,updatable:!0},this.planet.scene),this.mesh.position=this.planet.position.add(e.dir.scale(this.size/2)),this.mesh.rotate(new BABYLON.Vector3(1,0,0),e.rotX,BABYLON.Space.WORLD),this.mesh.rotate(new BABYLON.Vector3(0,1,0),e.rotY,BABYLON.Space.WORLD),this.mesh.material=this.material,this.mesh.chunck=this}round(e){const t=(e,t,s)=>{const i=new BABYLON.Vector3(e,t,s).add(this.roundingVector),n=this.planet.size/i.length();return i.scale(n).add(this.roundingVector.negate())};var s=e.getVerticesData(BABYLON.VertexBuffer.PositionKind);for(let e=0;e<s.length/3;e++){const i=t(s[3*e],s[3*e+1],s[3*e+2]);s[3*e]=i.x,s[3*e+1]=i.y,s[3*e+2]=i.z}e.updateVerticesData(BABYLON.VertexBuffer.PositionKind,s),e.refreshBoundingInfo(!0)}calculateNormals(e){const t=(e,t,s)=>{const i=new BABYLON.Vector3(e,t,s).add(this.roundingVector);return i.scale(1/i.length())};for(var s=e.getVerticesData(BABYLON.VertexBuffer.NormalKind),i=e.getVerticesData(BABYLON.VertexBuffer.PositionKind),n=0;n<s.length/3;n++){const e=t(i[3*n],i[3*n+1],i[3*n+2]);s[3*n]=e.x,s[3*n+1]=e.y,s[3*n+2]=e.z}e.updateVerticesData(BABYLON.VertexBuffer.NormalKind,s)}checkIfMakeChuncks(e){return e<r*this.size?(this.makeChuncks(),this.mesh.setEnabled(!1),!0):(this.disposeChuncks(),!1)}checkIfDisposeChuncks(e){return e>=r*this.size&&(this.disposeChuncks(),!0)}makeChuncks(){const e=this.size/4,t={1:new BABYLON.Vector3(-1,0,1).scale(e),2:new BABYLON.Vector3(1,0,1).scale(e),3:new BABYLON.Vector3(-1,0,-1).scale(e),4:new BABYLON.Vector3(1,0,-1).scale(e)};for(let e=1;e<=4;e++){const s=new n(`${this.name}_Chunck${e}`,this,this,this.planet.scene.glassMaterials[e-1],t[e]);this.chuncks.push(s)}}disposeChuncks(){this.chuncks.forEach(e=>{e.disposeChuncks(),e.mesh.dispose()}),this.chuncks=[],this.mesh.setEnabled(!0)}isSide(){return!0}}var o=s("G9zD");function c(e,t){const s=new o.g("metal",e);return s.reflectionTexture=e.environmentTexture,s.microSurface=.96,s.reflectivityColor=t||new o.b(.85,.85,.85),s.albedoColor=new o.b(.01,.01,.01),s}function h(e,t){const s=new o.g("plastic",e);return s.reflectionTexture=e.environmentTexture,s.microSurface=.96,s.albedoColor=t||new o.b(.206,.94,1),s.reflectivityColor=new o.b(.003,.003,.003),s}class l{constructor(e,t,s,i){this.size=s,this.resolution=i,this.position=t,this.scene=e,this.material=function(e,t){const s=new o.g("glass",e);return s.reflectionTexture=e.environmentTexture,s.refractionTexture=e.environmentTexture,s.linkRefractionWithTransparency=!0,s.indexOfRefraction=.52,s.alpha=0,s.microSurface=1,s.reflectivityColor=new o.b(.2,.2,.2),s.albedoColor=t||new o.b(.3,1,.3),s}(e,new BABYLON.Color3(.3,.2,1)),this.sides=[],this.activeChunck=null}createSides(){const e={1:{name:"Up",dir:new BABYLON.Vector3(0,1,0),rotX:0,rotY:0},2:{name:"Front",dir:new BABYLON.Vector3(0,0,-1),rotX:-Math.PI/2,rotY:0},3:{name:"Right",dir:new BABYLON.Vector3(1,0,0),rotX:-Math.PI/2,rotY:1.5*Math.PI},4:{name:"Left",dir:new BABYLON.Vector3(-1,0,0),rotX:-Math.PI/2,rotY:Math.PI/2},5:{name:"Back",dir:new BABYLON.Vector3(0,0,1),rotX:-Math.PI/2,rotY:Math.PI},6:{name:"Down",dir:new BABYLON.Vector3(0,-1,0),rotX:-Math.PI,rotY:0}};for(let t=1;t<=6;t++){const s=new a(e[t],this,this.resolution);this.sides.push(s)}this.pushSides(this.sides),this.calculateNormals(this.sides)}pushSides(e){e.forEach(e=>{e.round(e.mesh)})}calculateNormals(e){e.forEach(e=>{e.calculateNormals(e.mesh)})}update(){this.castRayFromCamera(this.scene)}rayFromCamera(e){const t=e.activeCamera.globalPosition,s=t.negate().add(this.position),i=s.length();return new BABYLON.Ray(t,s,i)}pickResult(e,t){const s=t.pickWithRay(e,function(e){return e.isPickable});return s.hit&&s.pickedMesh&&s.pickedMesh.chunck?s:null}castRayFromCamera(e){const t=this.rayFromCamera(e),s=this.pickResult(t,e);s&&this.figureActiveChunck(s)}setActiveChunck(e){this.activeChunck=e}figureActiveChunck(e){const t=e.distance;if(this.activeChunck||(this.setActiveChunck(e.pickedMesh.chunck),console.log("init",this.activeChunck)),e.pickedMesh.chunck!==this.activeChunck){console.log(e.pickedMesh.chunck);this.activeChunck.depth,e.pickedMesh.chunck.depth;this.setActiveChunck(e.pickedMesh.chunck)}this.activeChunck.checkIfMakeChuncks(t)}commonParent(e,t){let s=t.parents.length-1;for(;s>0;){const i=t.parents[s];if(e.parents.includes(i))return i;s--}return null}}s("8Lv4");const u=(new Date).getTime()/1e3;var d=u/1e3;function p(e){d=(new Date).getTime()/1e3,console.log(e+" in "+String(d-u).substring(0,5)+"s.")}const B=20,m=new o.j(0,0,0);window.addEventListener("DOMContentLoaded",function(){const e=document.getElementById("renderCanvas"),t=new o.c(e,!0);let s=null;const i=function(){const i=new o.h(t);i.gravity=new o.j(0,-9.81,0),i.collisionsEnabled=!0,(s=new o.a("Camera",0,0,0,new o.j(0,0,0),i)).setPosition(new o.j(0,40,-170)),s.attachControl(e,!1);new o.d("light1",new o.j(0,1,0),i);return function(e){var t=BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/environmentSpecular.env",e);e.environmentTexture=t,e.imageProcessingConfiguration.exposure=.6,e.imageProcessingConfiguration.contrast=1.6;var s=BABYLON.Mesh.CreateBox("hdrSkyBox",1e3,e),i=new BABYLON.PBRMaterial("skyBox",e);i.backFaceCulling=!1,i.reflectionTexture=t.clone(),i.reflectionTexture.coordinatesMode=BABYLON.Texture.SKYBOX_MODE,i.microSurface=.3,i.disableLighting=!0,s.material=i,s.infiniteDistance=!0}(i),function(e){let t=o.f.CreateSphere("",{diameter:.2},e);t.position=new o.j(0,0,0);let s=new o.i("",e);s.diffuseColor=new o.b(1,0,0),t.material=s,t.isPickable=!1,t.checkCollisions=!0,t.applyGravity=!0}(i),p("Start"),i.planet=new l(i,m,B,12),i.planet.createSides(),p("Planes rendered"),function(e){let t=!1,s=!1;e.onKeyboardObservable.add(i=>{switch(i.type){case o.e.KEYDOWN:switch(i.event.key){case"w":case"W":t=!t,e.materials.forEach(e=>{e.wireframe=t});break;case"b":case"B":s=!s,e.meshes.forEach(e=>{e.showBoundingBox=s});break;case"I":case"i":e.debugLayer.isVisible()?e.debugLayer.hide():e.debugLayer.show()}}})}(i),i}();i.glassMaterials=[c(i,new o.b(1,.1,.1)),h(i,new o.b(.3,1,.3)),h(i,new o.b(.3,1,1)),c(i,new o.b(.3,.2,1))],t.runRenderLoop(function(){i.render()}),window.addEventListener("resize",function(){t.resize()});let n=0;i.registerBeforeRender(function(){n%1==0&&i.planet.update(),n++,function(e){e.speed=.005*(m.negate().add(e.getFrontPosition(0)).length()-B)}(s)})})}},[["Vtdi",1,2]]]);