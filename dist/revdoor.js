/*
@source: https://github.com/rphsoftware/revolving-door
@licstart  The following is the entire license notice for the 
JavaScript code in this page.

Copyright (C) 2020 Rph

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 

@licend  The above is the entire license notice
for the JavaScript code in this page.
*/
!function(t){var e={};function a(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=t,a.c=e,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="",a(a.s=1)}([function(t,e,a){"use strict";function n(t,e,a,n){if(this.fromSampleRate=+t,this.toSampleRate=+e,this.channels=0|a,"object"!=typeof n)throw new Error("inputBuffer is not an object.");if(!(n instanceof Array||n instanceof Float32Array||n instanceof Float64Array))throw new Error("inputBuffer is not an array or a float32 or a float64 array.");this.inputBuffer=n,this.initialize()}n.prototype.initialize=function(){if(!(this.fromSampleRate>0&&this.toSampleRate>0&&this.channels>0))throw new Error("Invalid settings specified for the resampler.");this.fromSampleRate==this.toSampleRate?(this.resampler=this.bypassResampler,this.ratioWeight=1,this.outputBuffer=this.inputBuffer):(this.ratioWeight=this.fromSampleRate/this.toSampleRate,this.fromSampleRate<this.toSampleRate?(this.compileLinearInterpolationFunction(),this.lastWeight=1):(this.compileMultiTapFunction(),this.tailExists=!1,this.lastWeight=0),this.initializeBuffers())},n.prototype.compileLinearInterpolationFunction=function(){for(var t="var outputOffset = 0;    if (bufferLength > 0) {        var buffer = this.inputBuffer;        var weight = this.lastWeight;        var firstWeight = 0;        var secondWeight = 0;        var sourceOffset = 0;        var outputOffset = 0;        var outputBuffer = this.outputBuffer;        for (; weight < 1; weight += "+this.ratioWeight+") {            secondWeight = weight % 1;            firstWeight = 1 - secondWeight;",e=0;e<this.channels;++e)t+="outputBuffer[outputOffset++] = (this.lastOutput["+e+"] * firstWeight) + (buffer["+e+"] * secondWeight);";t+="}        weight -= 1;        for (bufferLength -= "+this.channels+", sourceOffset = Math.floor(weight) * "+this.channels+"; sourceOffset < bufferLength;) {            secondWeight = weight % 1;            firstWeight = 1 - secondWeight;";for(e=0;e<this.channels;++e)t+="outputBuffer[outputOffset++] = (buffer[sourceOffset"+(e>0?" + "+e:"")+"] * firstWeight) + (buffer[sourceOffset + "+(this.channels+e)+"] * secondWeight);";t+="weight += "+this.ratioWeight+";            sourceOffset = Math.floor(weight) * "+this.channels+";        }";for(e=0;e<this.channels;++e)t+="this.lastOutput["+e+"] = buffer[sourceOffset++];";t+="this.lastWeight = weight % 1;    }    return outputOffset;",this.resampler=Function("bufferLength",t)},n.prototype.compileMultiTapFunction=function(){for(var t="var outputOffset = 0;    if (bufferLength > 0) {        var buffer = this.inputBuffer;        var weight = 0;",e=0;e<this.channels;++e)t+="var output"+e+" = 0;";for(t+="var actualPosition = 0;        var amountToNext = 0;        var alreadyProcessedTail = !this.tailExists;        this.tailExists = false;        var outputBuffer = this.outputBuffer;        var currentPosition = 0;        do {            if (alreadyProcessedTail) {                weight = "+this.ratioWeight+";",e=0;e<this.channels;++e)t+="output"+e+" = 0;";for(t+="}            else {                weight = this.lastWeight;",e=0;e<this.channels;++e)t+="output"+e+" = this.lastOutput["+e+"];";for(t+="alreadyProcessedTail = true;            }            while (weight > 0 && actualPosition < bufferLength) {                amountToNext = 1 + actualPosition - currentPosition;                if (weight >= amountToNext) {",e=0;e<this.channels;++e)t+="output"+e+" += buffer[actualPosition++] * amountToNext;";for(t+="currentPosition = actualPosition;                    weight -= amountToNext;                }                else {",e=0;e<this.channels;++e)t+="output"+e+" += buffer[actualPosition"+(e>0?" + "+e:"")+"] * weight;";for(t+="currentPosition += weight;                    weight = 0;                    break;                }            }            if (weight <= 0) {",e=0;e<this.channels;++e)t+="outputBuffer[outputOffset++] = output"+e+" / "+this.ratioWeight+";";for(t+="}            else {                this.lastWeight = weight;",e=0;e<this.channels;++e)t+="this.lastOutput["+e+"] = output"+e+";";t+="this.tailExists = true;                break;            }        } while (actualPosition < bufferLength);    }    return outputOffset;",this.resampler=Function("bufferLength",t)},n.prototype.bypassResampler=function(t){return t},n.prototype.initializeBuffers=function(){var t=Math.ceil(this.inputBuffer.length*this.toSampleRate/this.fromSampleRate/this.channels*1.0000004768371582)*this.channels+this.channels;try{this.outputBuffer=new Float32Array(t),this.lastOutput=new Float32Array(this.channels)}catch(t){this.outputBuffer=[],this.lastOutput=[]}},t.exports=n},function(t,e,a){"use strict";a.r(e);var n=a(0),i=a.n(n);const o=a(2),r=a(3),s=a(4),{STREAMING_MIN_RESPONSE:l}=a(5),u=a(6),f=a(7);function h(t,e,a){let n=[],i=0;for(let e=0;e<t.metadata.numberChannels;e++)n.push(new Int16Array(a));for(;i<a;){let o=t.getSamples(e+i,Math.min(t.metadata.samplesPerBlock,a-i));for(let t=0;t<o.length;t++)n[t].set(o[t],i);i+=Math.min(t.metadata.samplesPerBlock,a-i)}return n}let c=!1,d=null,p=null,m=null,g=null,v=!0,y=0,w=0,S=null,b=null,k=!1,T=!1,_=!1,C=!1,B=0,x=localStorage.getItem("volumeoverride")||1;function R(){f.updateState({position:w,paused:k,volume:x,loaded:B,looping:T})}async function D(t){let e=await fetch(t),a=await e.arrayBuffer();S=new s.Brstm(a),v=!0,y=Number.MAX_SAFE_INTEGER,B=Number.MAX_SAFE_INTEGER}function M(t){return new Promise(async(e,a)=>{let n,i;try{n=await fetch(t),i=(await n.body).getReader()}catch(t){return a(t)}b=new ArrayBuffer(parseInt(n.headers.get("content-length")));let o=new Uint8Array(b),r=0,u=!1,h=0;for(B=0,v=!1,_=!1;;){let t;try{t=await i.read()}catch(t){return void(u?(f.updateState({streamingDied:!0,buffering:!1,ready:!0}),await p.close(),p=null):a(t))}if(_)return await i.cancel(),void window.postMessage("continueload");if(t.done){if(!u)try{S=new s.Brstm(b),e(),u=!0}catch(t){return void a(t)}v=!0,B=Number.MAX_SAFE_INTEGER,console.log("File finished streaming");break}if(o.set(t.value,r),r+=t.value.length,y=r,0==h&&r>128){let t=0;65279==256*o[4]+o[5]&&(t=1),h=1==t?16777216*o[112]+65536*o[113]+256*o[114]+o[115]:o[112]+256*o[113]+65536*o[114]+16777216*o[115],h<144&&(h=l)}if(!u&&0!=h&&r>h)try{S=new s.Brstm(b),e(),u=!0}catch(t){return void a(t)}u&&(B=Math.floor((y-h)/S.metadata.numberChannels/S.metadata.blockSize)*S.metadata.samplesPerBlock)}})}const E={setVolume:function(t){x=t,R(),g&&g.gain.setValueAtTime(x,p.currentTime)},seek:function(t){w=Math.floor(t),R()},pause:function(){k=!k,p[k?"suspend":"resume"](),R()},setLoop:function(t){T=t,R()}};window.player={play:async function(t){if(c||(d=await o(),c=!0,f.runGUI(E),setInterval((function(){f.updateState({loaded:B}),f.guiUpdate()}),100)),C)return;var e,a;C=!0,v||(console.log("Cancelling last stream..."),_=!0,await(e="continueload",new Promise((function(t){window.addEventListener("message",(function a(n){n.data===e&&n.isTrusted&&(window.removeEventListener("message",a),t())}))}))),console.log("Done.")),p&&(await p.close(),p=null),w=0,k=!1,f.updateState({ready:!1,position:0,samples:1e6,loaded:0,volume:x,paused:!1,buffering:!1,sampleRate:44100,streamingDied:!1});try{await(d.streaming?M:D)(t)}catch(t){return f.updateState({streamingDied:!0,ready:!0,buffering:!1}),console.error(t),void(C=!1)}p=new(window.AudioContext||window.webkitAudioContext)(d.sampleRate?{sampleRate:S.metadata.sampleRate}:{}),T=1===S.metadata.loopFlag,await r(p),d.streaming&&await(a=1e3,new Promise(t=>setTimeout(t,a))),m=p.createScriptProcessor(0,0,2);let n=m.bufferSize;var s,l,y;n=d.sampleRate?n:(s=p.sampleRate,l=S.metadata.sampleRate,y=n,Math.ceil(y/s*l));let b=n;d.sampleRate||(b+=20),f.updateState({ready:!0,samples:S.metadata.totalSamples}),f.updateState({sampleRate:S.metadata.sampleRate}),C=!1,m.onaudioprocess=function(t){R();let e,a=t.outputBuffer;if(a.copyToChannel||(a.copyToChannel=u),w+n+1024>B)return f.updateState({buffering:!0}),console.log("Buffering...."),a.copyToChannel(new Float32Array(m.bufferSize).fill(0),0),void a.copyToChannel(new Float32Array(m.bufferSize).fill(0),1);if(f.updateState({buffering:!1}),k)return a.copyToChannel(new Float32Array(m.bufferSize).fill(0),0),void a.copyToChannel(new Float32Array(m.bufferSize).fill(0),1);if(w+b<S.metadata.totalSamples)e=h(S,w,b),w+=n;else if(T){e=h(S,w,S.metadata.totalSamples-w);let t=h(S,S.metadata.loopStartSample,b-e[0].length);for(let a=0;a<e.length;a++){let n=new Int16Array(b).fill(0);n.set(e[a]),n.set(t[a],e[a].length),e[a]=n}w=S.metadata.loopStartSample+t[0].length}else{e=h(S,w,S.metadata.totalSamples-w-1);for(let t=0;t<e.length;t++){let a=new Int16Array(b).fill(0);a.set(e[t]),e[t]=a}w=0,k=!0,setTimeout((function(){p.suspend()}),200)}e.length>2&&(e=[e[0],e[1]]),1===e.length&&(e=[e[0],e[0]]);for(let t=0;t<e.length;t++){let n=new Float32Array(b);for(let a=0;a<b;a++)n[a]=e[t][a]/32768;if(!d.sampleRate){let t=new i.a(S.metadata.sampleRate,p.sampleRate,1,n);t.resampler(b),n=t.outputBuffer,n.length>m.bufferSize&&(n=n.slice(0,m.bufferSize))}a.copyToChannel(n,t)}},g=p.createGain(),m.connect(g),g.connect(p.destination),g.gain.setValueAtTime(x,p.currentTime)}}},function(t,e){t.exports=async function(){let t={sampleRate:!1,streaming:!1};try{let e=new(window.AudioContext||window.webkitAudioContext)({sampleRate:8e3});t.sampleRate=8e3===e.sampleRate,e.close().then(()=>console.log("Closed capability detection audio context."))}catch(t){console.log("WebAudio sample rate capability detection failed. Assuming fallback.")}try{let e=new Uint8Array(65536),a=new Blob([e],{type:"application/octet-stream"}),n=URL.createObjectURL(a),i=await fetch(n);const o=(await i.body).getReader();for(;;){if((await o.read()).done)break}t.streaming=!0}catch(t){console.log("Streaming capability detection failed. Assuming fallback.")}return t}},function(t,e){t.exports=function(t){return new Promise((async function(e){let a=!1,n=document.createElement("div");n.style="background: #888a; z-index: 88888; position: fixed; top: 0; bottom: 0; left: 0; right: 0; display: flex; align-items: center; justify-content: center;";let i=document.createElement("div");i.style="display: flex; align-items: center; justify-content: center; flex-direction: column",i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" version="1.0"  width="200" height="200" viewBox="0 0 75 75">\n<path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"\nstyle="stroke:#fff;stroke-width:5;stroke-linejoin:round;fill:#fff;"\n/>\n<path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style="fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round"/>\n</svg><h1 style="font-family: sans-serif; color: white; margin: 0;">Tap or click anywhere to enable audio.</h1>',n.appendChild(i),setTimeout((function(){a||document.body.appendChild(n)}),200),t.onstatechange=function(){"running"==t.state&&(e(),n.remove(),a=!0)};try{t.resume()}catch(t){console.error(t)}n.addEventListener("touchend",(async function(){await t.resume(),"running"===t.state&&(e(),n.remove(),a=!0)})),n.addEventListener("click",(async function(){await t.resume(),"running"===t.state&&(e(),n.remove(),a=!0)})),"running"===t.state&&(e(),n.remove(),a=!0)}))}},function(t,e){function a(t,e,a){for(var n=[],i=e;i<e+a;i++)n.push(t[i]);return n}function n(t,e,n){return a(t,e,n).reduce((function(t,e){return 256*t+e}),0)}function i(t,e,a){return t<=e?e:t>=a?a:t}function o(t){return t>=32768?t-65536:t}e.Brstm=function(){function t(t){if(this.rawData=new Uint8Array(t),"RSTM"!==(e=a(this.rawData,0,4),String.fromCharCode.apply(String,e)))throw new Error("Not a valid BRSTM file");var e;this._offsetToHead=n(this.rawData,16,4),this._offsetToHeadChunk1=this._offsetToHead+n(this.rawData,this._offsetToHead+12,4)+8,this._offsetToHeadChunk2=this._offsetToHead+n(this.rawData,this._offsetToHead+20,4)+8,this._offsetToHeadChunk3=this._offsetToHead+n(this.rawData,this._offsetToHead+28,4)+8,this._offsetToAdpc=n(this.rawData,24,4),this._offsetToData=n(this.rawData,32,4),this.metadata=this._getMetadata(),this._cachedSamples=null,this._partitionedAdpcChunkData=null,this._cachedChannelInfo=null,this._cachedBlockResults=[]}var e=t.prototype;return e._getChannelInfo=function(){if(this._cachedChannelInfo)return this._cachedChannelInfo;for(var t=this.metadata.numberChannels,e=[],a=0;a<t;a++){for(var i=this._offsetToHead+n(this.rawData,this._offsetToHeadChunk3+8+8*a,4)+8+8,r=[],s=0;s<16;s++){var l=n(this.rawData,i+2*s,2);r.push(o(l))}e.push({adpcmCoefficients:r,gain:n(this.rawData,i+40,2),initialPredictorScale:n(this.rawData,i+42,2),historySample1:n(this.rawData,i+44,2),historySample2:n(this.rawData,i+46,2),loopPredictorScale:n(this.rawData,i+48,2),loopHistorySample1:n(this.rawData,i+50,2),loopHistorySample2:n(this.rawData,i+52,2)})}return this._cachedChannelInfo=e,e},e._getMetadata=function(){var t=n(this.rawData,this._offsetToHeadChunk1+2,1);return{fileSize:n(this.rawData,8,4),codec:n(this.rawData,this._offsetToHeadChunk1,1),loopFlag:n(this.rawData,this._offsetToHeadChunk1+1,1),numberChannels:t,sampleRate:n(this.rawData,this._offsetToHeadChunk1+4,2),loopStartSample:n(this.rawData,this._offsetToHeadChunk1+8,4),totalSamples:n(this.rawData,this._offsetToHeadChunk1+12,4),totalBlocks:n(this.rawData,this._offsetToHeadChunk1+20,4),blockSize:n(this.rawData,this._offsetToHeadChunk1+24,4),samplesPerBlock:n(this.rawData,this._offsetToHeadChunk1+28,4),finalBlockSize:n(this.rawData,this._offsetToHeadChunk1+32,4),finalBlockSizeWithPadding:n(this.rawData,this._offsetToHeadChunk1+40,4),totalSamplesInFinalBlock:n(this.rawData,this._offsetToHeadChunk1+36,4),adpcTableSamplesPerEntry:n(this.rawData,this._offsetToHeadChunk1+44,4),adpcTableBytesPerEntry:n(this.rawData,this._offsetToHeadChunk1+48,4),numberTracks:n(this.rawData,this._offsetToHeadChunk2,1),trackDescriptionType:n(this.rawData,this._offsetToHeadChunk2+1,1)}},e._getPartitionedBlockData=function(t){for(var e=this.metadata,a=e.blockSize,n=e.totalBlocks,i=e.numberChannels,o=e.finalBlockSize,r=e.finalBlockSizeWithPadding,s=[],l=0;l<i;l++)s.push(new Uint8Array(t===n-1?o:a));for(var u=t,f=0;f<i;f++){var h=0!==f&&u+1===n?u*i*a+f*r:(u*i+f)*a,c=this.rawData.slice(this._offsetToData+32+h,this._offsetToData+32+(u+1===n?h+o:h+a));s[f].set(c)}return s},e._getPartitionedAdpcChunkData=function(){if(this._partitionedAdpcChunkData)return this._partitionedAdpcChunkData;for(var t=this.metadata,e=t.totalBlocks,a=t.numberChannels,i=n(this.rawData,this._offsetToAdpc+4,4),r=this.rawData.slice(this._offsetToAdpc+8,this._offsetToAdpc+8+i),s=0,l=0,u=0,f=0;f<a;f++)l=o(n(r,s,2)),u=o(n(r,s+=2,2)),s+=2;for(var h=[],c=0;c<e;c++){h.push([]);for(var d=0;d<a;d++)c>0&&(l=o(n(r,s,2)),u=o(n(r,s+=2,2)),s+=2),h[c].push({yn1:l,yn2:u})}for(var p=[],m=function(t){p.push(h.map((function(e){return e[t]})))},g=0;g<a;g++)m(g);return this._partitionedAdpcChunkData=p,p},e.getAllSamples=function(){if(this._cachedSamples)return this._cachedSamples;for(var t=this.metadata,e=t.numberChannels,a=t.totalSamples,n=t.totalBlocks,i=t.samplesPerBlock,o=[],r=0;r<e;r++)o.push(new Int16Array(a));for(var s=0;s<n;s++)for(var l=this._getSamplesAtBlock(s),u=0;u<e;u++)o[u].set(l[u],s*i);return this._cachedSamples=o,o},e._getSamplesAtBlock=function(t){if(this._cachedBlockResults[t])return this._cachedBlockResults[t];for(var e=this.metadata,a=e.numberChannels,r=e.totalBlocks,s=e.totalSamplesInFinalBlock,l=e.samplesPerBlock,u=e.codec,f=this._getChannelInfo(),h=this._getPartitionedBlockData(t),c=this._getPartitionedAdpcChunkData(),d=[],p=t===r-1?s:l,m=0;m<a;m++)d.push(new Int16Array(p));for(var g=0;g<a;g++){var v=f[g].adpcmCoefficients,y=h[g],w=[];if(2===u){for(var S=c[g][t],b=y[0],k=S.yn1,T=S.yn2,_=0,C=0;C<p;){var B=0;C%14==0&&(b=y[_++]),(B=0==(1&C++)?y[_]>>4:15&y[_++])>=8&&(B-=16);var x=b>>4<<1;B=1024+((1<<(15&b))*B<<11)+v[i(x,0,15)]*k+v[i(x+1,0,15)]*T>>11,T=k,k=i(B,-32768,32767),w.push(k)}t<r-1&&(c[g][t+1].yn1=w[p-1],c[g][t+1].yn2=w[p-2])}else if(1===u)for(var R=0;R<p;R++){var D=o(n(y,2*R,2));w.push(D)}else{if(0!==u)throw new Error("Invalid codec");for(var M=0;M<p;M++)w.push(o(y[M]))}d[g].set(w)}return this._cachedBlockResults[t]=d,d},e.getBuffer=function(t,e){return this.getSamples(t,e)},e.getSamples=function(t,e){for(var a=this.metadata,n=a.numberChannels,i=a.totalBlocks,o=a.totalSamples,r=a.samplesPerBlock,s=Math.max(0,t),l=Math.min(o,t+e),u=Math.max(0,Math.floor(s/r)),f=Math.min(i-1,Math.floor(l/r)),h=[],c=u;c<=f;c++)h.push(this._getSamplesAtBlock(c));for(var d=[],p=0;p<n;p++)d.push(new Int16Array(l-s));for(var m=u;m<=f;m++){var g=m-u;if(m===u&&m===f)for(var v=0;v<n;v++)d[v].set(h[g][v].slice(s-u*r,s-u*r+e),0);else if(m===u)for(var y=0;y<n;y++){var w=h[g][y].slice(s-u*r);d[y].set(w,0)}else if(m===f)for(var S=0;S<n;S++){var b=h[g][S].slice(0,l-h[g][S].length-u*r);d[S].set(b.length+(m*r-s)>d[S].length?b.slice(0,e-(m*r-s)):b,m*r-s)}else for(var k=0;k<n;k++)d[k].set(h[g][k],m*r-s)}return d},t}()},function(t,e){t.exports.STREAMING_MIN_RESPONSE=2**19},function(t,e){t.exports=function(t,e){let a=this.getChannelData(e);for(let e=0;e<t.length;e++)a[e]=t[e]}},function(t,e,a){const n=a(8);let i={position:0,samples:1e6,loaded:5e5,volume:1,paused:!1,ready:!1,buffering:!1,sampleRate:48e3,looping:!1,streamingDied:!1},o={volume:null,position:null},r={},s=null,l=null,u=null,f=-30;function h(e){try{e.preventDefault()}catch(t){}if(e.targetTouches.length>0){let a=e.targetTouches[0].target.getBoundingClientRect(),n=e.targetTouches[0].clientY+e.targetTouches[0].radiusY-a.top;n<5&&(n=0),n>80&&(n=84);let s=1-n/84;o.volume=s,"touchend"===e.type&&(i.volume=o.volume,r.setVolume(o.volume),o.volume=null,localStorage.setItem("volumeoverride",s)),t.exports.guiUpdate()}else"touchend"===e.type&&(i.volume=o.volume,r.setVolume(o.volume),o.volume=null)}function c(e){try{e.preventDefault()}catch(t){}if(e.targetTouches.length>0){let a=e.targetTouches[0].target.getBoundingClientRect(),n=e.targetTouches[0].clientX+e.targetTouches[0].radiusX-a.left;if(n<5&&(n=0),n>254&&(n=254),n=Math.round(n),n===f)return;f=n;let s=i.samples*(n/254);s<i.loaded&&(o.position=s),"touchend"===e.type&&(r.seek(o.position),o.position=null),t.exports.guiUpdate()}else"touchend"===e.type&&(r.seek(o.position),o.position=null)}function d(e,a){let n=Math.round(e),r=i.samples*(n/254);r<i.loaded&&(o.position=r),t.exports.guiUpdate()}function p(e,a){let n=Math.round(e),s=i.samples*(n/254);s<i.loaded&&(o.position=s),r.seek(s),o.position=null,t.exports.guiUpdate()}function m(e,a){a=Math.round(a),o.volume=1-a/84,t.exports.guiUpdate()}function g(e,a){let n=1-(a=Math.round(a))/84;o.volume=null,localStorage.setItem("volumeoverride",n),r.setVolume(n),t.exports.guiUpdate()}t.exports.updateState=function(t){Object.assign(i,t)},t.exports.runGUI=function(e){r=e,u=document.createElement("div"),u.classList.add("guiholder"),u.innerHTML='\n<div class="error" style="display: none">\n    <h3>Playback failed!</h3>\n    <h3>Check your internet and play again.</h3>\n    <h3>If this issue continues, contact us.</h3>\n</div>\n<div id="gui-loading-bar">\n    <div id="gui-inner-loading-bar"></div>\n</div>\n<div class="guistate" data-guistate="preload">\n    <h3>Loading song...</h3>\n</div>\n<div class="guistate" data-guistate="ready">\n    <div id="pl-pause-play">\n        <svg width="48" height="48" viewBox="0 0 48 48" id="pl-play">\n            <path d="M 10, 10 l 0, 28 l 28, -14" fill="white"></path>\n        </svg>\n        <svg width="48" height="48" viewBox="0 0 48 48" id="pl-pause" style="display: none;">\n            <path d="M 10, 10 l 0, 28 l 10, 0 l 0, -28 M 28, 10 l 0, 28 l 10, 0 l 0, -28" fill="white"></path>\n        </svg>\n    </div>\n    <canvas id="pl-volume" width="16" height="84" data-gesture-hitzone="volume"></canvas>\n    <div id="pl-timing">\n        <span id="pl-time-start">0:00</span>\n        <span id="pl-time-end"  >0:00</span>\n    </div>\n    <canvas id="pl-seek" width="254" height="16" data-gesture-hitzone="seek"></canvas>\n    <div id="pl-loop">\n        <input type="checkbox" id="pl-loop-box" style="width: 16px; height: 16px; margin: 0;">\n        <span class="pl-loop-text">Enable loop</span>\n        <a class="pl-loop-text" target="_blank" href="https://smashcustommusic.net/feedback/">Send feedback</a>\n        <a class="pl-loop-text" target="_blank" href="https://github.com/rphsoftware/revolving-door">v2 by Rph</a>\n    </div>\n</div>',document.body.appendChild(u),s=document.querySelector("#pl-volume").getContext("2d"),l=document.querySelector("#pl-seek").getContext("2d"),document.querySelector("#pl-volume").addEventListener("touchstart",h),document.querySelector("#pl-volume").addEventListener("touchmove",h),document.querySelector("#pl-volume").addEventListener("touchend",h),document.querySelector("#pl-seek").addEventListener("touchstart",c),document.querySelector("#pl-seek").addEventListener("touchmove",c),document.querySelector("#pl-seek").addEventListener("touchend",c),document.querySelector("#pl-pause-play").addEventListener("click",(function(){r.pause(),t.exports.guiUpdate()})),document.querySelector("#pl-loop-box").addEventListener("input",(function(){i.looping=document.querySelector("#pl-loop-box").checked,r.setLoop(i.looping)})),u.addEventListener("drag",(function(t){t.preventDefault()})),n.runGestureEngine(),n.registerOpEvent("seek",d),n.registerFinEvent("seek",p),n.registerOpEvent("volume",m),n.registerFinEvent("volume",g)};let v=null,y=null,w=-1,S=-1,b=null,k=-1,T=-1,_=null,C=-1,B=null;t.exports.guiUpdate=function(){if(u){B!==i.streamingDied&&(u.querySelector(".error").style.display=i.streamingDied?"flex":"none",B=i.streamingDied);let t=i.buffering||!i.ready;if(v!==t&&(u.querySelector("#gui-loading-bar").dataset.exists=t,v=t),y!==i.ready&&(u.querySelector('.guistate[data-guistate="preload"]').style.display=i.ready?"none":"block",u.querySelector('.guistate[data-guistate="ready"]').style.display=i.ready?"grid":"none",y=i.ready),!i.ready)return;let e=Math.round(84-84*i.volume);null!==o.volume&&(e=Math.round(84-84*o.volume)),e!==w&&(s.fillStyle="#444",s.fillRect(0,0,16,84),s.fillStyle="hsl(200, 85%, 55%)",s.fillRect(0,e,16,84),w=e);let a=Math.ceil(i.position/i.samples*254);null!==o.position&&(a=Math.ceil(o.position/i.samples*254));let n=Math.ceil(i.loaded/i.samples*254);a===S&&n===C||(l.fillStyle="#222",l.fillRect(0,0,254,16),l.fillStyle="#666",l.fillRect(0,0,Math.min(254,n),16),l.fillStyle="hsl(200, 85%, 55%)",l.fillRect(0,0,Math.min(254,a),16),S=a,C=n),b!==i.paused&&(u.querySelector("#pl-pause").style.display=i.paused?"none":"block",u.querySelector("#pl-play").style.display=i.paused?"block":"none",b=i.paused);let r=Math.floor(i.samples/i.sampleRate),f=Math.floor(i.position/i.sampleRate);null!==o.position&&(f=Math.floor(o.position/i.sampleRate)),r!==k&&(u.querySelector("#pl-time-end").innerText=`${Math.floor(r/60)}:${(r%60).toString().padStart(2,"0")}`,k=r),f!==T&&(u.querySelector("#pl-time-start").innerText=`${Math.floor(f/60)}:${(f%60).toString().padStart(2,"0")}`,T=f),_!==i.looping&&(u.querySelector("#pl-loop-box").checked=i.looping,_=i.looping)}}},function(t,e){let a=!1,n="",i=null,o=new Map,r=new Map;function s(t,e){let a=i.getBoundingClientRect(),n=t-a.x,o=e-a.y;return n<0&&(n=0),o<0&&(o=0),n>a.width&&(n=a.width),o>a.height&&(o=a.height),[n,o]}function l(t,e,a){if(o.has(t))for(let n=0;n<o.get(t).length;n++)o.get(t)[n](e,a)}t.exports.registerOpEvent=function(t,e){if(o.has(t)){let a=o.get(t);a.push(e),o.set(t,a)}else o.set(t,[e])},t.exports.registerFinEvent=function(t,e){if(r.has(t)){let a=r.get(t);a.push(e),r.set(t,a)}else r.set(t,[e])},t.exports.runGestureEngine=function(){document.addEventListener("mousedown",(function(t){if(t.target.dataset.gestureHitzone){a=!0,n=t.target.dataset.gestureHitzone,i=t.target;let[e,o]=s(t.clientX,t.clientY);l(n,e,o)}})),document.addEventListener("mousemove",(function(t){if(a){let[e,a]=s(t.clientX,t.clientY);l(n,e,a)}})),document.addEventListener("mouseup",(function(t){if(a){let[e,o]=s(t.clientX,t.clientY);!function(t,e,a){if(r.has(t))for(let n=0;n<r.get(t).length;n++)r.get(t)[n](e,a)}(n,e,o),a=!1,i=null,n=""}}))}}]);
