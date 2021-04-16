/*
@source: https://github.com/rphsoftware/revolver
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

// Initialize switcher
let mode = localStorage.getItem("revolver.mode");
if (!mode || (mode !== "legacy" && mode !== "modern")) {
    localStorage.setItem("revolver.mode", "modern");
    mode = localStorage.getItem("revolver.mode");
}

if (mode === "legacy") {
    let st = document.createElement("script");
    st.src = "/dist/legacy.js";

    let lt = document.createElement("link");
    lt.rel = "stylesheet";
    lt.href = "/dist/legacy.css";

    let pl = document.createElement("div");
    pl.id = "webplayer_widget";
    pl.style.display = "none";
    pl.innerHTML = `<!-- idle --><div id="webplayer_idle"><p class="wp_l_head">Idle</p><p class="wp_l_state" data-wp="2">Select a song to play</p></div><!-- Loading overlay --><div id="webplayer_loading" style="display: none;"><p class="wp_l_head">Loading song</p><p class="wp_l_state" data-wp="1">Downloading song</p><p class="wp_l_state" data-wp="1">Decoding BRSTM</p><p class="wp_l_state" data-wp="1">Emitting audio data</p><p class="wp_l_state" data-wp="1">Ready</p><div class="wp_anim"><div class="wp_anim_center"></div></div></div><!-- player controls --><div id="webplayer_controls"><div id="webplayer_loop">Loop:<input type="checkbox" id="wp_loop_checkbox"></div><div id="webplayer_pause"><img src="/dist/play.png" id="webplayer_pause_s1"><img src="/dist/pause.png" id="webplayer_pause_s2"></div><div id="webplayer_credits">v1, by Rph</div><div id="webplayer_status">0:00 / 5:00</div><div id="webplayer_volume"><input type="range" min="0" max="1000" value="1000" id="wp_volume_slider"></div><input type="range" min="0" max="100" value="50" id="wp_slider"><div style="grid-area:feedback;display:flex;align-items:flex-end;justify-content:flex-end"><a onclick="localStorage.setItem('revolver.mode', 'modern'); window.location.reload();" style="font-size:12px; color:white; cursor: pointer;"></a></div></div>`;

    document.body.appendChild(st);
    document.body.appendChild(lt);
    document.body.appendChild(pl);
}

if (mode === "modern") {
    let st = document.createElement("script");
    st.src = "/dist/revdoor.js";

    let lt = document.createElement("link");
    lt.rel = "stylesheet";
    lt.href = "/dist/revdoor.css";

    document.body.appendChild(st);
    document.body.appendChild(lt);
}

let initialized = false;
function playSong(id) {
    if (mode === "legacy") {
        if (!initialized)
            jsplayer.useGUI();

        initialized = true;
        jsplayer.start("/brstm/" + id + "&noIncrement=1&legacy=1");
    }
    if (mode === "modern") {
        player.play("/brstm/" + id + "&noIncrement=1");
    }
}

function playSongURL(id) {
    if (mode === "legacy") {
        if (!initialized)
            jsplayer.useGUI();

        initialized = true;
        jsplayer.start(id);
    }
    if (mode === "modern") {
        player.play(id);
    }
}
