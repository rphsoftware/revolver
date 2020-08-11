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
    pl.innerHTML = `<!-- idle --><div id="webplayer_idle"><p class="wp_l_head">Idle</p><p class="wp_l_state" data-wp="2">Select a song to play</p></div><!-- Loading overlay --><div id="webplayer_loading" style="display: none;"><p class="wp_l_head">Loading song</p><p class="wp_l_state" data-wp="1">Downloading song</p><p class="wp_l_state" data-wp="1">Decoding BRSTM</p><p class="wp_l_state" data-wp="1">Emitting audio data</p><p class="wp_l_state" data-wp="1">Ready</p><div class="wp_anim"><div class="wp_anim_center"></div></div></div><!-- player controls --><div id="webplayer_controls"><div id="webplayer_loop">Loop:<input type="checkbox" id="wp_loop_checkbox"></div><div id="webplayer_pause"><img src="/dist/play.png" id="webplayer_pause_s1"><img src="/dist/pause.png" id="webplayer_pause_s2"></div><div id="webplayer_credits">v1, by Rph</div><div id="webplayer_status">0:00 / 5:00</div><div id="webplayer_volume"><input type="range" min="0" max="1000" value="1000" id="wp_volume_slider"></div><input type="range" min="0" max="100" value="50" id="wp_slider"><div style="grid-area:feedback;display:flex;align-items:flex-end;justify-content:flex-end"><a onclick="localStorage.setItem('revolver.mode', 'modern'); window.location.reload();" style="font-size:12px; color:white;">Use new player</a></div></div>`;

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
    if (!initialized && mode === "modern") {
        let z = document.createElement("a");
        z.href = "#";
        z.style = "z-index: 999999999; position: fixed; font-family: sans-serif; bottom: 100px; right: 0px; background: black; color: white; text-decoration: none; padding: 8px;";
        z.innerText = `Use ${mode === "modern" ? "old" : "new"} player`;

        z.addEventListener("click", function() {
            localStorage.setItem("revolver.mode", mode === "modern" ? "legacy" : "modern");
            window.location.reload();
        })

        document.body.appendChild(z);
    }

    if (mode === "legacy") {
        if (!initialized)
            jsplayer.useGUI();

        initialized = true;
        jsplayer.start("https://smashcustommusic.net/brstm/" + id + "&noIncrement=1");
    }
    if (mode === "modern") {
        player.play("https://smashcustommusic.net/brstm/" + id + "&noIncrement=1");
    }
}