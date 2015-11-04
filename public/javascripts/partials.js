(function(factory){if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{window.noUiSlider=factory()}})(function(){"use strict";function unique(array){return array.filter(function(a){return!this[a]?this[a]=true:false},{})}function closest(value,to){return Math.round(value/to)*to}function offset(elem){var rect=elem.getBoundingClientRect(),doc=elem.ownerDocument,docElem=doc.documentElement,pageOffset=getPageOffset();if(/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)){pageOffset.x=0}return{top:rect.top+pageOffset.y-docElem.clientTop,left:rect.left+pageOffset.x-docElem.clientLeft}}function isNumeric(a){return typeof a==="number"&&!isNaN(a)&&isFinite(a)}function accurateNumber(number){var p=Math.pow(10,7);return Number((Math.round(number*p)/p).toFixed(7))}function addClassFor(element,className,duration){addClass(element,className);setTimeout(function(){removeClass(element,className)},duration)}function limit(a){return Math.max(Math.min(a,100),0)}function asArray(a){return Array.isArray(a)?a:[a]}function countDecimals(numStr){var pieces=numStr.split(".");return pieces.length>1?pieces[1].length:0}function addClass(el,className){if(el.classList){el.classList.add(className)}else{el.className+=" "+className}}function removeClass(el,className){if(el.classList){el.classList.remove(className)}else{el.className=el.className.replace(new RegExp("(^|\\b)"+className.split(" ").join("|")+"(\\b|$)","gi")," ")}}function hasClass(el,className){if(el.classList){el.classList.contains(className)}else{new RegExp("(^| )"+className+"( |$)","gi").test(el.className)}}function getPageOffset(){var supportPageOffset=window.pageXOffset!==undefined,isCSS1Compat=(document.compatMode||"")==="CSS1Compat",x=supportPageOffset?window.pageXOffset:isCSS1Compat?document.documentElement.scrollLeft:document.body.scrollLeft,y=supportPageOffset?window.pageYOffset:isCSS1Compat?document.documentElement.scrollTop:document.body.scrollTop;return{x:x,y:y}}function addCssPrefix(cssPrefix){return function(className){return cssPrefix+className}}var actions=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},defaultCssPrefix="noUi-";function subRangeRatio(pa,pb){return 100/(pb-pa)}function fromPercentage(range,value){return value*100/(range[1]-range[0])}function toPercentage(range,value){return fromPercentage(range,range[0]<0?value+Math.abs(range[0]):value-range[0])}function isPercentage(range,value){return value*(range[1]-range[0])/100+range[0]}function getJ(value,arr){var j=1;while(value>=arr[j]){j+=1}return j}function toStepping(xVal,xPct,value){if(value>=xVal.slice(-1)[0]){return 100}var j=getJ(value,xVal),va,vb,pa,pb;va=xVal[j-1];vb=xVal[j];pa=xPct[j-1];pb=xPct[j];return pa+toPercentage([va,vb],value)/subRangeRatio(pa,pb)}function fromStepping(xVal,xPct,value){if(value>=100){return xVal.slice(-1)[0]}var j=getJ(value,xPct),va,vb,pa,pb;va=xVal[j-1];vb=xVal[j];pa=xPct[j-1];pb=xPct[j];return isPercentage([va,vb],(value-pa)*subRangeRatio(pa,pb))}function getStep(xPct,xSteps,snap,value){if(value===100){return value}var j=getJ(value,xPct),a,b;if(snap){a=xPct[j-1];b=xPct[j];if(value-a>(b-a)/2){return b}return a}if(!xSteps[j-1]){return value}return xPct[j-1]+closest(value-xPct[j-1],xSteps[j-1])}function handleEntryPoint(index,value,that){var percentage;if(typeof value==="number"){value=[value]}if(Object.prototype.toString.call(value)!=="[object Array]"){throw new Error("noUiSlider: 'range' contains invalid value.")}if(index==="min"){percentage=0}else if(index==="max"){percentage=100}else{percentage=parseFloat(index)}if(!isNumeric(percentage)||!isNumeric(value[0])){throw new Error("noUiSlider: 'range' value isn't numeric.")}that.xPct.push(percentage);that.xVal.push(value[0]);if(!percentage){if(!isNaN(value[1])){that.xSteps[0]=value[1]}}else{that.xSteps.push(isNaN(value[1])?false:value[1])}}function handleStepPoint(i,n,that){if(!n){return true}that.xSteps[i]=fromPercentage([that.xVal[i],that.xVal[i+1]],n)/subRangeRatio(that.xPct[i],that.xPct[i+1])}function Spectrum(entry,snap,direction,singleStep){this.xPct=[];this.xVal=[];this.xSteps=[singleStep||false];this.xNumSteps=[false];this.snap=snap;this.direction=direction;var index,ordered=[];for(index in entry){if(entry.hasOwnProperty(index)){ordered.push([entry[index],index])}}if(ordered.length&&typeof ordered[0][0]==="object"){ordered.sort(function(a,b){return a[0][0]-b[0][0]})}else{ordered.sort(function(a,b){return a[0]-b[0]})}for(index=0;index<ordered.length;index++){handleEntryPoint(ordered[index][1],ordered[index][0],this)}this.xNumSteps=this.xSteps.slice(0);for(index=0;index<this.xNumSteps.length;index++){handleStepPoint(index,this.xNumSteps[index],this)}}Spectrum.prototype.getMargin=function(value){return this.xPct.length===2?fromPercentage(this.xVal,value):false};Spectrum.prototype.toStepping=function(value){value=toStepping(this.xVal,this.xPct,value);if(this.direction){value=100-value}return value};Spectrum.prototype.fromStepping=function(value){if(this.direction){value=100-value}return accurateNumber(fromStepping(this.xVal,this.xPct,value))};Spectrum.prototype.getStep=function(value){if(this.direction){value=100-value}value=getStep(this.xPct,this.xSteps,this.snap,value);if(this.direction){value=100-value}return value};Spectrum.prototype.getApplicableStep=function(value){var j=getJ(value,this.xPct),offset=value===100?2:1;return[this.xNumSteps[j-2],this.xVal[j-offset],this.xNumSteps[j-offset]]};Spectrum.prototype.convert=function(value){return this.getStep(this.toStepping(value))};var defaultFormatter={to:function(value){return value!==undefined&&value.toFixed(2)},from:Number};function testStep(parsed,entry){if(!isNumeric(entry)){throw new Error("noUiSlider: 'step' is not numeric.")}parsed.singleStep=entry}function testRange(parsed,entry){if(typeof entry!=="object"||Array.isArray(entry)){throw new Error("noUiSlider: 'range' is not an object.")}if(entry.min===undefined||entry.max===undefined){throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.")}parsed.spectrum=new Spectrum(entry,parsed.snap,parsed.dir,parsed.singleStep)}function testStart(parsed,entry){entry=asArray(entry);if(!Array.isArray(entry)||!entry.length||entry.length>2){throw new Error("noUiSlider: 'start' option is incorrect.")}parsed.handles=entry.length;parsed.start=entry}function testSnap(parsed,entry){parsed.snap=entry;if(typeof entry!=="boolean"){throw new Error("noUiSlider: 'snap' option must be a boolean.")}}function testAnimate(parsed,entry){parsed.animate=entry;if(typeof entry!=="boolean"){throw new Error("noUiSlider: 'animate' option must be a boolean.")}}function testConnect(parsed,entry){if(entry==="lower"&&parsed.handles===1){parsed.connect=1}else if(entry==="upper"&&parsed.handles===1){parsed.connect=2}else if(entry===true&&parsed.handles===2){parsed.connect=3}else if(entry===false){parsed.connect=0}else{throw new Error("noUiSlider: 'connect' option doesn't match handle count.")}}function testOrientation(parsed,entry){switch(entry){case"horizontal":parsed.ort=0;break;case"vertical":parsed.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.")}}function testMargin(parsed,entry){if(!isNumeric(entry)){throw new Error("noUiSlider: 'margin' option must be numeric.")}parsed.margin=parsed.spectrum.getMargin(entry);if(!parsed.margin){throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.")}}function testLimit(parsed,entry){if(!isNumeric(entry)){throw new Error("noUiSlider: 'limit' option must be numeric.")}parsed.limit=parsed.spectrum.getMargin(entry);if(!parsed.limit){throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.")}}function testDirection(parsed,entry){switch(entry){case"ltr":parsed.dir=0;break;case"rtl":parsed.dir=1;parsed.connect=[0,2,1,3][parsed.connect];break;default:throw new Error("noUiSlider: 'direction' option was not recognized.")}}function testBehaviour(parsed,entry){if(typeof entry!=="string"){throw new Error("noUiSlider: 'behaviour' must be a string containing options.")}var tap=entry.indexOf("tap")>=0,drag=entry.indexOf("drag")>=0,fixed=entry.indexOf("fixed")>=0,snap=entry.indexOf("snap")>=0;if(drag&&!parsed.connect){throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.")}parsed.events={tap:tap||snap,drag:drag,fixed:fixed,snap:snap}}function testTooltips(parsed,entry){if(entry===true){parsed.tooltips=true}if(entry&&entry.format){if(typeof entry.format!=="function"){throw new Error("noUiSlider: 'tooltips.format' must be an object.")}parsed.tooltips={format:entry.format}}}function testFormat(parsed,entry){parsed.format=entry;if(typeof entry.to==="function"&&typeof entry.from==="function"){return true}throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")}function testCssPrefix(parsed,entry){if(entry!==undefined&&typeof entry!=="string"){throw new Error("noUiSlider: 'cssPrefix' must be a string.")}parsed.cssPrefix=entry}function testOptions(options){var parsed={margin:0,limit:0,animate:true,format:defaultFormatter},tests;tests={step:{r:false,t:testStep},start:{r:true,t:testStart},connect:{r:true,t:testConnect},direction:{r:true,t:testDirection},snap:{r:false,t:testSnap},animate:{r:false,t:testAnimate},range:{r:true,t:testRange},orientation:{r:false,t:testOrientation},margin:{r:false,t:testMargin},limit:{r:false,t:testLimit},behaviour:{r:true,t:testBehaviour},format:{r:false,t:testFormat},tooltips:{r:false,t:testTooltips},cssPrefix:{r:false,t:testCssPrefix}};var defaults={connect:false,direction:"ltr",behaviour:"tap",orientation:"horizontal"};Object.keys(defaults).forEach(function(name){if(options[name]===undefined){options[name]=defaults[name]}});Object.keys(tests).forEach(function(name){var test=tests[name];if(options[name]===undefined){if(test.r){throw new Error("noUiSlider: '"+name+"' is required.")}return true}test.t(parsed,options[name])});parsed.pips=options.pips;parsed.style=parsed.ort?"top":"left";return parsed}function closure(target,options){var scope_Target=target,scope_Locations=[-1,-1],scope_Base,scope_Handles,scope_Spectrum=options.spectrum,scope_Values=[],scope_Events={};var cssClasses=["target","base","origin","handle","horizontal","vertical","background","connect","ltr","rtl","draggable","","state-drag","","state-tap","active","","stacking","tooltip"].map(addCssPrefix(options.cssPrefix||defaultCssPrefix));function getPositions(a,b,delimit){var c=a+b[0],d=a+b[1];if(delimit){if(c<0){d+=Math.abs(c)}if(d>100){c-=d-100}return[limit(c),limit(d)]}return[c,d]}function fixEvent(e,pageOffset){e.preventDefault();var touch=e.type.indexOf("touch")===0,mouse=e.type.indexOf("mouse")===0,pointer=e.type.indexOf("pointer")===0,x,y,event=e;if(e.type.indexOf("MSPointer")===0){pointer=true}if(touch){x=e.changedTouches[0].pageX;y=e.changedTouches[0].pageY}pageOffset=pageOffset||getPageOffset();if(mouse||pointer){x=e.clientX+pageOffset.x;y=e.clientY+pageOffset.y}event.pageOffset=pageOffset;event.points=[x,y];event.cursor=mouse||pointer;return event}function addHandle(direction,index){var origin=document.createElement("div"),handle=document.createElement("div"),additions=["-lower","-upper"];if(direction){additions.reverse()}addClass(handle,cssClasses[3]);addClass(handle,cssClasses[3]+additions[index]);addClass(origin,cssClasses[2]);origin.appendChild(handle);return origin}function addConnection(connect,target,handles){switch(connect){case 1:addClass(target,cssClasses[7]);addClass(handles[0],cssClasses[6]);break;case 3:addClass(handles[1],cssClasses[6]);case 2:addClass(handles[0],cssClasses[7]);case 0:addClass(target,cssClasses[6]);break}}function addHandles(nrHandles,direction,base){var index,handles=[];for(index=0;index<nrHandles;index+=1){handles.push(base.appendChild(addHandle(direction,index)))}return handles}function addSlider(direction,orientation,target){addClass(target,cssClasses[0]);addClass(target,cssClasses[8+direction]);addClass(target,cssClasses[4+orientation]);var div=document.createElement("div");addClass(div,cssClasses[1]);target.appendChild(div);return div}function defaultFormatTooltipValue(formattedValue){return formattedValue}function addTooltip(handle){var element=document.createElement("div");element.className=cssClasses[18];return handle.firstChild.appendChild(element)}function tooltips(tooltipsOptions){var formatTooltipValue=tooltipsOptions.format?tooltipsOptions.format:defaultFormatTooltipValue,tips=scope_Handles.map(addTooltip);bindEvent("update",function(formattedValues,handleId,rawValues){tips[handleId].innerHTML=formatTooltipValue(formattedValues[handleId],rawValues[handleId])})}function getGroup(mode,values,stepped){if(mode==="range"||mode==="steps"){return scope_Spectrum.xVal}if(mode==="count"){var spread=100/(values-1),v,i=0;values=[];while((v=i++*spread)<=100){values.push(v)}mode="positions"}if(mode==="positions"){return values.map(function(value){return scope_Spectrum.fromStepping(stepped?scope_Spectrum.getStep(value):value)})}if(mode==="values"){if(stepped){return values.map(function(value){return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)))})}return values}}function generateSpread(density,mode,group){function safeIncrement(value,increment){return(value+increment).toFixed(7)/1}var originalSpectrumDirection=scope_Spectrum.direction,indexes={},firstInRange=scope_Spectrum.xVal[0],lastInRange=scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],ignoreFirst=false,ignoreLast=false,prevPct=0;scope_Spectrum.direction=0;group=unique(group.slice().sort(function(a,b){return a-b}));if(group[0]!==firstInRange){group.unshift(firstInRange);ignoreFirst=true}if(group[group.length-1]!==lastInRange){group.push(lastInRange);ignoreLast=true}group.forEach(function(current,index){var step,i,q,low=current,high=group[index+1],newPct,pctDifference,pctPos,type,steps,realSteps,stepsize;if(mode==="steps"){step=scope_Spectrum.xNumSteps[index]}if(!step){step=high-low}if(low===false||high===undefined){return}for(i=low;i<=high;i=safeIncrement(i,step)){newPct=scope_Spectrum.toStepping(i);pctDifference=newPct-prevPct;steps=pctDifference/density;realSteps=Math.round(steps);stepsize=pctDifference/realSteps;for(q=1;q<=realSteps;q+=1){pctPos=prevPct+q*stepsize;indexes[pctPos.toFixed(5)]=["x",0]}type=group.indexOf(i)>-1?1:mode==="steps"?2:0;if(!index&&ignoreFirst){type=0}if(!(i===high&&ignoreLast)){indexes[newPct.toFixed(5)]=[i,type]}prevPct=newPct}});scope_Spectrum.direction=originalSpectrumDirection;return indexes}function addMarking(spread,filterFunc,formatter){var style=["horizontal","vertical"][options.ort],element=document.createElement("div");addClass(element,"noUi-pips");addClass(element,"noUi-pips-"+style);function getSize(type){return["-normal","-large","-sub"][type]}function getTags(offset,source,values){return'class="'+source+" "+source+"-"+style+" "+source+getSize(values[1])+'" style="'+options.style+": "+offset+'%"'}function addSpread(offset,values){if(scope_Spectrum.direction){offset=100-offset}values[1]=values[1]&&filterFunc?filterFunc(values[0],values[1]):values[1];element.innerHTML+="<div "+getTags(offset,"noUi-marker",values)+"></div>";if(values[1]){element.innerHTML+="<div "+getTags(offset,"noUi-value",values)+">"+formatter.to(values[0])+"</div>"}}Object.keys(spread).forEach(function(a){addSpread(a,spread[a])});return element}function pips(grid){var mode=grid.mode,density=grid.density||1,filter=grid.filter||false,values=grid.values||false,stepped=grid.stepped||false,group=getGroup(mode,values,stepped),spread=generateSpread(density,mode,group),format=grid.format||{to:Math.round};return scope_Target.appendChild(addMarking(spread,filter,format))}function baseSize(){return scope_Base["offset"+["Width","Height"][options.ort]]}function fireEvent(event,handleNumber){if(handleNumber!==undefined&&options.handles!==1){handleNumber=Math.abs(handleNumber-options.dir)}Object.keys(scope_Events).forEach(function(targetEvent){var eventType=targetEvent.split(".")[0];if(event===eventType){scope_Events[targetEvent].forEach(function(callback){callback(asArray(valueGet()),handleNumber,inSliderOrder(Array.prototype.slice.call(scope_Values)))})}})}function inSliderOrder(values){if(values.length===1){return values[0]}if(options.dir){return values.reverse()}return values}function attach(events,element,callback,data){var method=function(e){if(scope_Target.hasAttribute("disabled")){return false}if(hasClass(scope_Target,cssClasses[14])){return false}e=fixEvent(e,data.pageOffset);if(events===actions.start&&e.buttons!==undefined&&e.buttons>1){return false}e.calcPoint=e.points[options.ort];callback(e,data)},methods=[];events.split(" ").forEach(function(eventName){element.addEventListener(eventName,method,false);methods.push([eventName,method])});return methods}function move(event,data){if(event.buttons===0&&event.which===0&&data.buttonsProperty!==0){return end(event,data)}var handles=data.handles||scope_Handles,positions,state=false,proposal=(event.calcPoint-data.start)*100/data.baseSize,handleNumber=handles[0]===scope_Handles[0]?0:1,i;positions=getPositions(proposal,data.positions,handles.length>1);state=setHandle(handles[0],positions[handleNumber],handles.length===1);if(handles.length>1){state=setHandle(handles[1],positions[handleNumber?0:1],false)||state;if(state){for(i=0;i<data.handles.length;i++){fireEvent("slide",i)}}}else if(state){fireEvent("slide",handleNumber)}}function end(event,data){var active=scope_Base.querySelector("."+cssClasses[15]),handleNumber=data.handles[0]===scope_Handles[0]?0:1;if(active!==null){removeClass(active,cssClasses[15])}if(event.cursor){document.body.style.cursor="";document.body.removeEventListener("selectstart",document.body.noUiListener)}var d=document.documentElement;d.noUiListeners.forEach(function(c){d.removeEventListener(c[0],c[1])});removeClass(scope_Target,cssClasses[12]);fireEvent("set",handleNumber);fireEvent("change",handleNumber)}function start(event,data){var d=document.documentElement;if(data.handles.length===1){addClass(data.handles[0].children[0],cssClasses[15]);if(data.handles[0].hasAttribute("disabled")){return false}}event.stopPropagation();var moveEvent=attach(actions.move,d,move,{start:event.calcPoint,baseSize:baseSize(),pageOffset:event.pageOffset,handles:data.handles,buttonsProperty:event.buttons,positions:[scope_Locations[0],scope_Locations[scope_Handles.length-1]]}),endEvent=attach(actions.end,d,end,{handles:data.handles});d.noUiListeners=moveEvent.concat(endEvent);if(event.cursor){document.body.style.cursor=getComputedStyle(event.target).cursor;if(scope_Handles.length>1){addClass(scope_Target,cssClasses[12])}var f=function(){return false};document.body.noUiListener=f;document.body.addEventListener("selectstart",f,false)}}function tap(event){var location=event.calcPoint,total=0,handleNumber,to;event.stopPropagation();scope_Handles.forEach(function(a){total+=offset(a)[options.style]});handleNumber=location<total/2||scope_Handles.length===1?0:1;location-=offset(scope_Base)[options.style];to=location*100/baseSize();if(!options.events.snap){addClassFor(scope_Target,cssClasses[14],300)}if(scope_Handles[handleNumber].hasAttribute("disabled")){return false}setHandle(scope_Handles[handleNumber],to);fireEvent("slide",handleNumber);fireEvent("set",handleNumber);fireEvent("change",handleNumber);if(options.events.snap){start(event,{handles:[scope_Handles[handleNumber]]})}}function events(behaviour){var i,drag;if(!behaviour.fixed){for(i=0;i<scope_Handles.length;i+=1){attach(actions.start,scope_Handles[i].children[0],start,{handles:[scope_Handles[i]]})}}if(behaviour.tap){attach(actions.start,scope_Base,tap,{handles:scope_Handles})}if(behaviour.drag){drag=[scope_Base.querySelector("."+cssClasses[7])];addClass(drag[0],cssClasses[10]);if(behaviour.fixed){drag.push(scope_Handles[drag[0]===scope_Handles[0]?1:0].children[0])}drag.forEach(function(element){attach(actions.start,element,start,{handles:scope_Handles})})}}function setHandle(handle,to,noLimitOption){var trigger=handle!==scope_Handles[0]?1:0,lowerMargin=scope_Locations[0]+options.margin,upperMargin=scope_Locations[1]-options.margin,lowerLimit=scope_Locations[0]+options.limit,upperLimit=scope_Locations[1]-options.limit,newScopeValue=scope_Spectrum.fromStepping(to);if(scope_Handles.length>1){to=trigger?Math.max(to,lowerMargin):Math.min(to,upperMargin)}if(noLimitOption!==false&&options.limit&&scope_Handles.length>1){to=trigger?Math.min(to,lowerLimit):Math.max(to,upperLimit)}to=scope_Spectrum.getStep(to);to=limit(parseFloat(to.toFixed(7)));if(to===scope_Locations[trigger]&&newScopeValue===scope_Values[trigger]){return false}if(window.requestAnimationFrame){window.requestAnimationFrame(function(){handle.style[options.style]=to+"%"})}else{handle.style[options.style]=to+"%"}if(!handle.previousSibling){removeClass(handle,cssClasses[17]);if(to>50){addClass(handle,cssClasses[17])}}scope_Locations[trigger]=to;scope_Values[trigger]=scope_Spectrum.fromStepping(to);fireEvent("update",trigger);return true}function setValues(count,values){var i,trigger,to;if(options.limit){count+=1}for(i=0;i<count;i+=1){trigger=i%2;to=values[trigger];if(to!==null&&to!==false){if(typeof to==="number"){to=String(to)}to=options.format.from(to);if(to===false||isNaN(to)||setHandle(scope_Handles[trigger],scope_Spectrum.toStepping(to),i===3-options.dir)===false){fireEvent("update",trigger)}}}}function valueSet(input){var count,values=asArray(input),i;if(options.dir&&options.handles>1){values.reverse()}if(options.animate&&scope_Locations[0]!==-1){addClassFor(scope_Target,cssClasses[14],300)}count=scope_Handles.length>1?3:1;if(values.length===1){count=1}setValues(count,values);for(i=0;i<scope_Handles.length;i++){fireEvent("set",i)}}function valueGet(){var i,retour=[];for(i=0;i<options.handles;i+=1){retour[i]=options.format.to(scope_Values[i])}return inSliderOrder(retour)}function destroy(){cssClasses.forEach(function(cls){if(!cls){return}removeClass(scope_Target,cls)});scope_Target.innerHTML="";delete scope_Target.noUiSlider}function getCurrentStep(){var retour=scope_Locations.map(function(location,index){var step=scope_Spectrum.getApplicableStep(location),stepDecimals=countDecimals(String(step[2])),value=scope_Values[index],increment=location===100?null:step[2],prev=Number((value-step[2]).toFixed(stepDecimals)),decrement=location===0?null:prev>=step[1]?step[2]:step[0]||false;return[decrement,increment]});return inSliderOrder(retour)}function bindEvent(namespacedEvent,callback){scope_Events[namespacedEvent]=scope_Events[namespacedEvent]||[];scope_Events[namespacedEvent].push(callback);if(namespacedEvent.split(".")[0]==="update"){scope_Handles.forEach(function(a,index){fireEvent("update",index)})}}function removeEvent(namespacedEvent){var event=namespacedEvent.split(".")[0],namespace=namespacedEvent.substring(event.length);Object.keys(scope_Events).forEach(function(bind){var tEvent=bind.split(".")[0],tNamespace=bind.substring(tEvent.length);if((!event||event===tEvent)&&(!namespace||namespace===tNamespace)){delete scope_Events[bind]}})}if(scope_Target.noUiSlider){throw new Error("Slider was already initialized.")}scope_Base=addSlider(options.dir,options.ort,scope_Target);scope_Handles=addHandles(options.handles,options.dir,scope_Base);addConnection(options.connect,scope_Target,scope_Handles);events(options.events);if(options.pips){pips(options.pips)}if(options.tooltips){tooltips(options.tooltips)}function updateOptions(optionsToUpdate){var newOptions=testOptions({start:[0,0],margin:optionsToUpdate.margin,limit:optionsToUpdate.limit,step:optionsToUpdate.step,range:optionsToUpdate.range,animate:optionsToUpdate.animate});options.margin=newOptions.margin;options.limit=newOptions.limit;options.step=newOptions.step;options.range=newOptions.range;options.animate=newOptions.animate;scope_Spectrum=newOptions.spectrum}return{destroy:destroy,steps:getCurrentStep,on:bindEvent,off:removeEvent,get:valueGet,set:valueSet,updateOptions:updateOptions}}function initialize(target,originalOptions){if(!target.nodeName){throw new Error("noUiSlider.create requires a single element.")}var options=testOptions(originalOptions,target),slider=closure(target,options);slider.set(options.start);target.noUiSlider=slider;return slider}return{create:initialize}});"use strict";var priceSlider=document.querySelector("[data-noui-slider-price]");var timeSlider=document.querySelector("[data-noui-slider-time]");var personsSlider=document.querySelector("[data-noui-slider-persons]");if(priceSlider){noUiSlider.create(priceSlider,{start:[.5,3],step:.1,connect:true,tooltips:true,range:{min:.1,max:8},format:{from:function(value){return value.replace("€","")},to:function(value){return"€"+value}}})}if(timeSlider){noUiSlider.create(timeSlider,{start:[5,60],step:1,margin:5,connect:true,tooltips:true,range:{min:5,max:60},format:{from:function(value){return value.replace(" minuten","")},to:function(value){return value+" minuten"}}})}if(personsSlider){noUiSlider.create(personsSlider,{start:4,step:1,tooltips:true,range:{min:1,max:15},format:{from:function(value){return value.replace(" personen","")},to:function(value){return value+" personen"}}})}"use strict";if(localStorage.getItem("supermarkets")===null){localStorage.setItem("supermarkets",'{"albert-heijn": true}')}var supermarketOptions=document.querySelectorAll("[data-supermarket-option]");var recipes=document.querySelectorAll("[data-recipe-preview]");var supermarkets=JSON.parse(localStorage.getItem("supermarkets"));for(var i=0;i<supermarketOptions.length;i+=1){var element=supermarketOptions[i];element.firstChild.checked=supermarkets[element.firstChild.id];element.addEventListener("click",function(){var name=this.firstChild.id;var state=this.firstChild.checked;supermarkets[name]=state;localStorage.setItem("supermarkets",JSON.stringify(supermarkets));updateRecipeListing()})}var updateRecipeListing=function(){for(var i=0;i<recipes.length;i+=1){var element=recipes[i];if(!supermarkets[element.dataset.recipePreview]){element.classList.add("recipe-preview-disabled")}else{element.classList.remove("recipe-preview-disabled")}}};updateRecipeListing();