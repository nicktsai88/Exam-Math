(() => {
  "use strict";

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const shell = (q, lesson, body) => `
    <svg class="teaching-diagram" viewBox="0 0 440 300" role="img" aria-labelledby="diagram-title-${esc(q.id)} diagram-desc-${esc(q.id)}">
      <title id="diagram-title-${esc(q.id)}">${esc(q.school)}${esc(q.label)}專屬幾何教學圖</title>
      <desc id="diagram-desc-${esc(q.id)}">依本題條件重繪，按步驟依序顯示輔助線、幾何關係與結論。</desc>
      <defs>
        <marker id="arrow-${esc(q.id)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#d64b83"/></marker>
        <filter id="glow-${esc(q.id)}"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="8" y="8" width="424" height="284" rx="18" class="diagram-paper"/>
      <text x="24" y="31" class="diagram-kicker">${esc(lesson.labels?.source || `${q.school}・${q.label}`)}｜教學重繪</text>
      ${body}
      <g data-diagram-step="3" class="diagram-step diagram-conclusion">
        <rect x="250" y="258" width="166" height="25" rx="12"/>
        <text x="333" y="275" text-anchor="middle">結論：${esc(lesson.labels?.answer || q.answer)}</text>
      </g>
    </svg>`;

  function special(q, lesson) {
    const L = lesson.labels || {};
    if (lesson.scene === "coordinateThreePoints") return shell(q, lesson, `
      <line x1="43" y1="155" x2="402" y2="155" class="d-axis"/><line x1="220" y1="265" x2="220" y2="47" class="d-axis"/><circle cx="220" cy="155" r="90" class="d-circle"/><circle cx="220" cy="155" r="4" class="d-point"/><text x="206" y="147">O</text>
      <circle cx="292" cy="83" r="5" class="d-focus"/><text x="301" y="78">A(4,4)</text><circle cx="148" cy="209" r="5" class="d-focus"/><text x="75" y="224">B(－4,－3)</text><circle cx="256" cy="227" r="5" class="d-focus"/><text x="263" y="244">C(2,－4)</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="220" y1="155" x2="292" y2="83" class="d-helper"/><line x1="220" y1="155" x2="148" y2="209" class="d-helper"/><line x1="220" y1="155" x2="256" y2="227" class="d-helper"/></g>
      <g data-diagram-step="2" class="diagram-step"><text x="47" y="56" class="d-step-text">OA²＝32、OB²＝25、OC²＝20</text><text x="69" y="278" class="d-step-text">與 r²＝25 比較：C 內、B 上、A 外</text></g>
    `);
    if (lesson.scene === "outsidePointExtremes") return shell(q, lesson, `
      <circle cx="172" cy="157" r="72" class="d-circle"/><circle cx="172" cy="157" r="4" class="d-point"/><text x="160" y="146">O</text><circle cx="354" cy="157" r="5" class="d-focus"/><text x="364" y="151">A</text><line x1="100" y1="157" x2="354" y2="157" class="d-given"/>
      <text x="235" y="145">OA＝10</text><g data-diagram-step="1" class="diagram-step"><line x1="172" y1="157" x2="244" y2="157" class="d-highlight"/><text x="188" y="184" class="d-step-text">r＝6</text></g>
      <g data-diagram-step="2" class="diagram-step"><path d="M244 118v24M100 118v24" class="d-highlight"/><text x="264" y="107" class="d-step-text">最近 10－6＝4</text><text x="58" y="227" class="d-step-text">最遠 10＋6＝16</text></g>
    `);
    if (lesson.scene === "gridPointCount") return shell(q, lesson, `
      <g class="d-grid">${Array.from({length:9},(_,i)=>`<line x1="${72+i*34}" y1="58" x2="${72+i*34}" y2="256"/><line x1="72" y1="${58+i*24}" x2="344" y2="${58+i*24}"/>`).join('')}</g>
      <circle cx="174" cy="154" r="88" class="d-circle"/><circle cx="174" cy="154" r="5" class="d-point"/><text x="160" y="145">A</text><circle cx="262" cy="154" r="5" class="d-focus"/><text x="270" y="149">B</text>
      <circle cx="106" cy="106" r="4" class="d-point"/><text x="91" y="99">C</text><circle cx="310" cy="82" r="4" class="d-point"/><text x="316" y="78">D</text><circle cx="242" cy="226" r="4" class="d-point"/><text x="249" y="240">E</text><circle cx="344" cy="226" r="4" class="d-point"/><text x="351" y="239">F</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="174" y1="154" x2="262" y2="154" class="d-highlight"/><text x="201" y="176" class="d-step-text">半徑 AB</text></g><g data-diagram-step="2" class="diagram-step"><text x="80" y="280" class="d-step-text">數水平格、鉛直格，比較 AP² 與 AB²</text></g>
    `);
    if (lesson.scene === "diameterTangent20") return shell(q, lesson, `
      <circle cx="174" cy="154" r="88" class="d-circle"/>
      <line x1="86" y1="154" x2="262" y2="154" class="d-given"/>
      <circle cx="174" cy="154" r="4" class="d-point"/><text x="160" y="145">O</text>
      <text x="174" y="177" text-anchor="middle" class="d-label">最長弦 AB＝${esc(L.diameter)}</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="174" y1="154" x2="262" y2="154" class="d-highlight" marker-end="url(#arrow-${esc(q.id)})"/><text x="102" y="82" class="d-step-text">r＝20÷2＝10</text></g>
      <line x1="262" y1="50" x2="262" y2="246" class="d-line"/><text x="272" y="66" class="d-label">直線 L</text>
      <g data-diagram-step="2" class="diagram-step"><line x1="174" y1="154" x2="262" y2="154" class="d-helper"/><path d="M250 154v-12h12" class="d-right"/><text x="102" y="224" class="d-step-text">d(O,L)＝${esc(L.distance)}＝r</text><circle cx="262" cy="154" r="6" class="d-focus"/><text x="270" y="176">T</text></g>
    `);
    if (lesson.scene === "diameterLineSeparate") return shell(q, lesson, `
      <circle cx="150" cy="158" r="62" class="d-circle"/><circle cx="150" cy="158" r="4" class="d-point"/><text x="137" y="149">O</text><line x1="88" y1="158" x2="212" y2="158" class="d-given"/><text x="113" y="182">直徑 6</text><line x1="330" y1="55" x2="330" y2="250" class="d-line"/><text x="339" y="70">L</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="150" y1="158" x2="212" y2="158" class="d-highlight"/><text x="165" y="144" class="d-step-text">r＝3</text></g><g data-diagram-step="2" class="diagram-step"><line x1="150" y1="158" x2="330" y2="158" class="d-helper"/><path d="M318 158v-12h12" class="d-right"/><text x="233" y="181" class="d-step-text">d＝10＞r</text></g>
    `);
    if (["rectangleRange815","rectangleRangeRoot","rectangleRange1517"].includes(lesson.scene)) {
      const root = lesson.scene === "rectangleRangeRoot";
      const long = lesson.scene === "rectangleRange1517";
      const x2 = root ? 307 : 325, y2 = root ? 216 : 226;
      const side1 = root ? "BA＝√7" : "AB＝8", side2 = root ? "BC＝3" : "AD＝15", diag = root ? "BD＝4" : "AC＝17";
      return shell(q, lesson, `<rect x="112" y="76" width="${x2-112}" height="${y2-76}" class="d-polygon"/><text x="100" y="72">A</text><text x="99" y="240">B</text><text x="${x2+7}" y="240">C</text><text x="${x2+7}" y="72">D</text><circle cx="112" cy="76" r="5" class="d-focus"/>
        <text x="55" y="155" class="d-label">${side1}</text><text x="190" y="66" class="d-label">${side2}</text><g data-diagram-step="1" class="diagram-step"><line x1="112" y1="76" x2="${x2}" y2="${y2}" class="d-highlight"/><text x="210" y="178" class="d-step-text">${diag}</text></g>
        <g data-diagram-step="2" class="diagram-step"><path d="M112 76m0 -${root?92:118}a${root?92:118} ${root?92:118} 0 0 1 ${root?92:118} ${root?92:118}" class="d-arc"/><text x="66" y="273" class="d-step-text">${long?'15＜r＜17':root?'3＜r≤4':'可行範圍 8＜r＜15'}</text></g>`);
    }
    if (lesson.scene === "fourLineRelations") return shell(q, lesson, `
      <circle cx="220" cy="154" r="86" class="d-circle"/><line x1="55" y1="58" x2="386" y2="58" class="d-line"/><text x="40" y="62">L1</text><line x1="54" y1="94" x2="385" y2="132" class="d-line"/><text x="39" y="95">L2</text><line x1="54" y1="238" x2="385" y2="238" class="d-line"/><text x="39" y="241">L3</text><line x1="67" y1="257" x2="360" y2="77" class="d-given"/><text x="365" y="79">L4</text>
      <g data-diagram-step="1" class="diagram-step"><circle cx="149" cy="197" r="6" class="d-focus"/><circle cx="291" cy="111" r="6" class="d-focus"/><text x="79" y="282" class="d-step-text">L4 與圓有兩個交點</text></g><g data-diagram-step="2" class="diagram-step"><text x="284" y="217" class="d-step-text">兩交點 ⇒ 割線</text></g>
    `);
    if (lesson.scene === "insideOutsidePoints") return shell(q, lesson, `
      <circle cx="205" cy="157" r="92" class="d-circle"/><circle cx="205" cy="157" r="4" class="d-point"/><text x="191" y="148">O</text><circle cx="260" cy="157" r="5" class="d-focus"/><text x="250" y="145">B</text><circle cx="350" cy="157" r="5" class="d-focus"/><text x="360" y="151">A</text><line x1="205" y1="157" x2="350" y2="157" class="d-given"/>
      <g data-diagram-step="1" class="diagram-step"><text x="230" y="181" class="d-step-text">OB＝6＜r</text></g><g data-diagram-step="2" class="diagram-step"><text x="282" y="126" class="d-step-text">r＜OA＝10</text><text x="124" y="257" class="d-step-text">合併：6＜r＜10</text></g>
    `);
    if (lesson.scene === "twoChordNumbers") return shell(q, lesson, `
      <circle cx="218" cy="154" r="112" class="d-circle"/><circle cx="218" cy="154" r="4" class="d-point"/><text x="204" y="145">O</text>
      <line x1="106" y1="117" x2="330" y2="117" class="d-given"/><text x="112" y="104">${esc(L.chord1)}</text>
      <line x1="218" y1="154" x2="218" y2="117" class="d-helper"/><text x="226" y="140">${esc(L.d1)}</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="218" y1="117" x2="106" y2="117" class="d-highlight"/><line x1="218" y1="154" x2="106" y2="117" class="d-highlight"/><text x="65" y="149" class="d-step-text">20²＋15²＝25²</text></g>
      <line x1="151" y1="64" x2="151" y2="244" class="d-given"/><text x="76" y="230">${esc(L.chord2)}</text>
      <line x1="218" y1="154" x2="151" y2="154" class="d-helper"/><text x="166" y="174">${esc(L.d2)}</text>
      <g data-diagram-step="2" class="diagram-step"><line x1="151" y1="154" x2="151" y2="64" class="d-highlight"/><line x1="218" y1="154" x2="151" y2="64" class="d-highlight"/><text x="265" y="216" class="d-step-text">半弦＝7 → 全弦＝14</text></g>
    `);
    if (lesson.scene === "rectangleRadius") return shell(q, lesson, `
      <circle cx="170" cy="157" r="105" class="d-circle"/><circle cx="170" cy="157" r="4" class="d-point"/><text x="155" y="149">O</text>
      <rect x="170" y="81" width="76" height="76" class="d-polygon"/><text x="249" y="80">A</text><text x="249" y="173">B</text><text x="231" y="150">C</text>
      <line x1="170" y1="157" x2="275" y2="157" class="d-given"/><text x="283" y="162">D</text>
      <text x="252" y="143" class="d-label">${esc(L.extension)}</text><text x="253" y="119" class="d-label">${esc(L.side)}</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="170" y1="157" x2="170" y2="81" class="d-highlight"/><text x="113" y="102" class="d-step-text">OA＝BC＝12</text></g>
      <g data-diagram-step="2" class="diagram-step"><line x1="170" y1="157" x2="275" y2="157" class="d-highlight"/><text x="123" y="224" class="d-step-text">OD＝OA＝r＝12</text></g>
    `);
    if (lesson.scene === "tangentRadiusNumbers") return shell(q, lesson, `
      <circle cx="154" cy="154" r="70" class="d-circle"/><circle cx="154" cy="154" r="4" class="d-point"/><text x="140" y="145">O</text>
      <line x1="154" y1="154" x2="316" y2="154" class="d-given"/><text x="218" y="174">AC＝9</text><text x="318" y="160">A</text><text x="218" y="149">C</text>
      <line x1="316" y1="154" x2="154" y2="84" class="d-given"/><text x="236" y="99">AB＝15</text><text x="148" y="76">B</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="154" y1="154" x2="154" y2="84" class="d-highlight"/><path d="M154 96l11 5 5-11" class="d-right"/><text x="74" y="115" class="d-step-text">OB⊥AB</text></g>
      <g data-diagram-step="2" class="diagram-step"><text x="208" y="221" class="d-step-text">(r＋9)²＝r²＋15² → r＝8</text></g>
    `);
    if (lesson.scene === "threeTangents60") return shell(q, lesson, `
      <circle cx="225" cy="161" r="62" class="d-circle"/>
      <path d="M68 61L350 82L295 250Z" class="d-polygon"/><text x="55" y="58">P</text><text x="354" y="78">C</text><text x="300" y="266">D</text>
      <circle cx="189" cy="110" r="4" class="d-focus"/><circle cx="276" cy="119" r="4" class="d-focus"/><circle cx="259" cy="216" r="4" class="d-focus"/><text x="176" y="102">A</text><text x="284" y="113">E</text><text x="268" y="230">B</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="225" y1="161" x2="189" y2="110" class="d-helper"/><line x1="225" y1="161" x2="276" y2="119" class="d-helper"/><line x1="225" y1="161" x2="259" y2="216" class="d-helper"/></g>
      <g data-diagram-step="2" class="diagram-step"><text x="82" y="198" class="d-step-text">CA＝CE、DB＝DE、PA＝PB</text><text x="89" y="224" class="d-step-text">周長 60＝2PA → PA＝30</text></g>
    `);
    if (lesson.scene === "qixianChordBounds") return shell(q, lesson, `
      <circle cx="220" cy="154" r="112" class="d-circle"/><circle cx="220" cy="154" r="4" class="d-point"/><text x="205" y="145">O</text>
      <line x1="108" y1="206" x2="332" y2="206" class="d-given"/><text x="334" y="211">CD＝32</text><line x1="220" y1="154" x2="220" y2="206" class="d-helper"/><text x="227" y="187">ON＝12</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="220" y1="206" x2="332" y2="206" class="d-highlight"/><line x1="220" y1="154" x2="332" y2="206" class="d-highlight"/><text x="272" y="239" class="d-step-text">12²＋16²＝20²</text></g>
      <line x1="142" y1="74" x2="142" y2="235" class="d-given"/><line x1="220" y1="154" x2="142" y2="154" class="d-helper"/><text x="155" y="145">OM＝√55</text>
      <g data-diagram-step="2" class="diagram-step"><text x="242" y="88" class="d-step-text">AB＝10√11；16＜EF＜10√11</text></g>
    `);
    return null;
  }

  function genericPosition(q, lesson) {
    const v = lesson.variant || 0;
    const lineX = [326,302,338,288][v];
    const radius = [86,96,78,104][v];
    return shell(q, lesson, `
      <circle cx="172" cy="158" r="${radius}" class="d-circle"/><circle cx="172" cy="158" r="4" class="d-point"/><text x="157" y="149">O</text>
      <line x1="${lineX}" y1="57" x2="${lineX}" y2="252" class="d-line"/><text x="${lineX+10}" y="72">L</text>
      <g data-diagram-step="1" class="diagram-step"><line x1="172" y1="158" x2="${172+radius}" y2="158" class="d-highlight"/><text x="190" y="145" class="d-step-text">半徑 r</text></g>
      <g data-diagram-step="2" class="diagram-step"><line x1="172" y1="158" x2="${lineX}" y2="158" class="d-helper"/><path d="M${lineX-12} 158v-12h12" class="d-right"/><text x="236" y="181" class="d-step-text">最短距離 d 與 r 比較</text></g>
    `);
  }

  function genericChord(q, lesson) {
    const v = lesson.variant || 0;
    const horizontal = v % 2 === 0;
    const chord = horizontal ? '<line x1="104" y1="202" x2="336" y2="202" class="d-given"/>' : '<line x1="130" y1="68" x2="130" y2="240" class="d-given"/>';
    const helper = horizontal ? '<line x1="220" y1="151" x2="220" y2="202" class="d-helper"/><path d="M220 190h12v12" class="d-right"/>' : '<line x1="220" y1="151" x2="130" y2="151" class="d-helper"/><path d="M142 151v12h-12" class="d-right"/>';
    const tri = horizontal ? '<line x1="220" y1="151" x2="336" y2="202" class="d-highlight"/><line x1="220" y1="202" x2="336" y2="202" class="d-highlight"/>' : '<line x1="220" y1="151" x2="130" y2="68" class="d-highlight"/><line x1="130" y1="151" x2="130" y2="68" class="d-highlight"/>';
    return shell(q, lesson, `<circle cx="220" cy="151" r="112" class="d-circle"/><circle cx="220" cy="151" r="4" class="d-point"/><text x="206" y="142">O</text>${chord}
      <g data-diagram-step="1" class="diagram-step">${helper}<text x="245" y="119" class="d-step-text">圓心垂線平分弦</text></g>
      <g data-diagram-step="2" class="diagram-step">${tri}<text x="245" y="240" class="d-step-text">r²＝d²＋(L÷2)²</text></g>`);
  }

  function genericTangent(q, lesson) {
    const v = lesson.variant || 0;
    const px = [360,350,372,340][v];
    return shell(q, lesson, `
      <circle cx="164" cy="156" r="82" class="d-circle"/><circle cx="164" cy="156" r="4" class="d-point"/><text x="150" y="147">O</text><circle cx="${px}" cy="156" r="4" class="d-point"/><text x="${px+8}" y="151">P</text>
      <line x1="${px}" y1="156" x2="183" y2="76" class="d-given"/><line x1="${px}" y1="156" x2="183" y2="236" class="d-given"/>
      <g data-diagram-step="1" class="diagram-step"><line x1="164" y1="156" x2="183" y2="76" class="d-helper"/><line x1="164" y1="156" x2="183" y2="236" class="d-helper"/><path d="M186 88l11-5" class="d-right"/><text x="64" y="60" class="d-step-text">切點半徑 ⟂ 切線</text></g>
      <g data-diagram-step="2" class="diagram-step"><path d="M254 108l11 6M254 204l11-6" class="d-highlight"/><text x="238" y="245" class="d-step-text">同一外點：兩切線等長</text></g>
    `);
  }

  function genericArc(q, lesson) {
    const v = lesson.variant || 0;
    const point = [[94,178],[126,79],[214,45],[300,92]][v];
    return shell(q, lesson, `
      <circle cx="220" cy="154" r="112" class="d-circle"/>
      <circle cx="${point[0]}" cy="${point[1]}" r="4" class="d-point"/><circle cx="292" cy="75" r="4" class="d-point"/><circle cx="322" cy="207" r="4" class="d-point"/>
      <line x1="${point[0]}" y1="${point[1]}" x2="292" y2="75" class="d-given"/><line x1="${point[0]}" y1="${point[1]}" x2="322" y2="207" class="d-given"/>
      <g data-diagram-step="1" class="diagram-step"><path d="M292 75A112 112 0 0 1 322 207" class="d-arc"/><text x="339" y="139" class="d-step-text">所對弧</text></g>
      <g data-diagram-step="2" class="diagram-step"><line x1="220" y1="154" x2="292" y2="75" class="d-helper"/><line x1="220" y1="154" x2="322" y2="207" class="d-helper"/><text x="123" y="257" class="d-step-text">圓心角＝2×同弧圓周角</text></g>
    `);
  }

  function genericCyclic(q, lesson) {
    const v = lesson.variant || 0;
    const rotate = v * 12;
    return shell(q, lesson, `
      <circle cx="220" cy="154" r="112" class="d-circle"/>
      <g transform="rotate(${rotate} 220 154)"><path d="M140 76L310 94L292 230L112 197Z" class="d-polygon"/><text x="129" y="70">A</text><text x="315" y="91">B</text><text x="298" y="245">C</text><text x="94" y="208">D</text></g>
      <g data-diagram-step="1" class="diagram-step"><path d="M143 91A23 23 0 0 1 164 80M275 224A23 23 0 0 1 294 205" class="d-angle"/><text x="42" y="62" class="d-step-text">先配對角</text></g>
      <g data-diagram-step="2" class="diagram-step"><text x="125" y="274" class="d-step-text">內接四邊形：對角和＝180°</text></g>
    `);
  }

  function genericPower(q, lesson) {
    const v = lesson.variant || 0;
    if (v === 2) return shell(q, lesson, `<circle cx="176" cy="154" r="92" class="d-circle"/><circle cx="355" cy="154" r="4" class="d-point"/><text x="363" y="149">P</text><line x1="355" y1="154" x2="189" y2="63" class="d-given"/><line x1="355" y1="154" x2="86" y2="154" class="d-given"/><g data-diagram-step="1" class="diagram-step"><line x1="176" y1="154" x2="189" y2="63" class="d-helper"/><text x="61" y="51" class="d-step-text">切線 PT</text></g><g data-diagram-step="2" class="diagram-step"><text x="223" y="235" class="d-step-text">PT²＝外段×全段</text></g>`);
    return shell(q, lesson, `<circle cx="220" cy="154" r="112" class="d-circle"/><line x1="112" y1="104" x2="328" y2="207" class="d-given"/><line x1="125" y1="225" x2="315" y2="72" class="d-given"/><circle cx="218" cy="155" r="5" class="d-focus"/><text x="226" y="149">P</text><g data-diagram-step="1" class="diagram-step"><path d="M164 128l14 7M257 178l14 7M171 188l12-10M258 122l12-10" class="d-highlight"/><text x="45" y="59" class="d-step-text">固定共同交點 P</text></g><g data-diagram-step="2" class="diagram-step"><text x="119" y="272" class="d-step-text">PA·PB＝PC·PD</text></g>`);
  }

  function genericMeasure(q, lesson) {
    const v = lesson.variant || 0;
    const end = [[305,92],[316,204],[245,44],[114,87]][v];
    return shell(q, lesson, `<circle cx="220" cy="154" r="112" class="d-circle"/><path d="M220 154L220 42A112 112 0 0 1 ${end[0]} ${end[1]}Z" class="d-sector"/><line x1="220" y1="154" x2="220" y2="42" class="d-given"/><line x1="220" y1="154" x2="${end[0]}" y2="${end[1]}" class="d-given"/><g data-diagram-step="1" class="diagram-step"><path d="M220 42A112 112 0 0 1 ${end[0]} ${end[1]}" class="d-arc"/><text x="61" y="73" class="d-step-text">先標圓心角 θ</text></g><g data-diagram-step="2" class="diagram-step"><text x="82" y="267" class="d-step-text">比例 θ/360° × 圓周（或圓面積）</text></g>`);
  }

  function genericCoordinate(q, lesson) {
    const v = lesson.variant || 0;
    const cx = [205,235,188,248][v], cy = [145,132,168,156][v];
    return shell(q, lesson, `<line x1="44" y1="236" x2="397" y2="236" class="d-axis" marker-end="url(#arrow-${esc(q.id)})"/><line x1="86" y1="265" x2="86" y2="48" class="d-axis" marker-end="url(#arrow-${esc(q.id)})"/><text x="400" y="252">x</text><text x="70" y="49">y</text><circle cx="${cx}" cy="${cy}" r="72" class="d-circle"/><circle cx="${cx}" cy="${cy}" r="4" class="d-point"/><text x="${cx+8}" y="${cy-8}">O(h,k)</text><circle cx="330" cy="236" r="5" class="d-focus"/><text x="338" y="228">P</text><g data-diagram-step="1" class="diagram-step"><line x1="${cx}" y1="${cy}" x2="330" y2="${cy}" class="d-helper"/><line x1="330" y1="${cy}" x2="330" y2="236" class="d-helper"/><text x="246" y="116" class="d-step-text">標 Δx、Δy</text></g><g data-diagram-step="2" class="diagram-step"><text x="123" y="276" class="d-step-text">OP²＝(Δx)²＋(Δy)²</text></g>`);
  }

  function genericConstruction(q, lesson) {
    const v = lesson.variant || 0;
    if (v === 1) return shell(q, lesson, `<circle cx="205" cy="156" r="96" class="d-circle"/><circle cx="301" cy="156" r="5" class="d-focus"/><text x="310" y="151">P</text><line x1="205" y1="156" x2="301" y2="156" class="d-helper"/><g data-diagram-step="1" class="diagram-step"><path d="M282 117A46 46 0 0 1 320 117" class="d-construction"/><path d="M282 195A46 46 0 0 0 320 195" class="d-construction"/></g><g data-diagram-step="2" class="diagram-step"><line x1="301" y1="57" x2="301" y2="255" class="d-highlight"/><path d="M289 156v-12h12" class="d-right"/><text x="318" y="92" class="d-step-text">過 P 作 OP 的垂線</text></g>`);
    return shell(q, lesson, `<circle cx="220" cy="154" r="108" class="d-circle"/><line x1="130" y1="96" x2="319" y2="194" class="d-given"/><line x1="139" y1="218" x2="304" y2="77" class="d-given"/><g data-diagram-step="1" class="diagram-step"><path d="M165 103A62 62 0 0 1 184 178M281 116A62 62 0 0 0 262 190" class="d-construction"/><path d="M157 172A58 58 0 0 1 220 196M246 83A58 58 0 0 0 294 121" class="d-construction"/></g><g data-diagram-step="2" class="diagram-step"><line x1="183" y1="53" x2="260" y2="251" class="d-highlight"/><line x1="116" y1="139" x2="331" y2="157" class="d-highlight"/><circle cx="220" cy="154" r="6" class="d-focus"/><text x="231" y="146" class="d-step-text">兩中垂線交於圓心</text></g>`);
  }

  function genericComposite(q, lesson) {
    const v = lesson.variant || 0;
    const smallR = [52,62,46,58][v];
    return shell(q, lesson, `<circle cx="173" cy="158" r="90" class="d-circle"/><circle cx="286" cy="158" r="${smallR}" class="d-secondary"/><path d="M68 238L220 58L367 238Z" class="d-polygon"/><g data-diagram-step="1" class="diagram-step"><line x1="173" y1="158" x2="220" y2="58" class="d-helper"/><line x1="286" y1="158" x2="367" y2="238" class="d-helper"/><text x="57" y="64" class="d-step-text">先標最強條件</text></g><g data-diagram-step="2" class="diagram-step"><rect x="84" y="247" width="270" height="24" rx="12" class="d-note-box"/><text x="219" y="264" text-anchor="middle" class="d-step-text">拆成局部 ① → 中間量 → 局部 ②</text></g>`);
  }

  function render(q, lesson) {
    const exact = special(q, lesson);
    if (exact) return exact;
    const renderers = {position:genericPosition,chord:genericChord,tangent:genericTangent,arc:genericArc,cyclic:genericCyclic,power:genericPower,measure:genericMeasure,coordinate:genericCoordinate,construction:genericConstruction,composite:genericComposite};
    return renderers[q.topic](q, lesson);
  }

  window.CIRCLE_DIAGRAMS = { render };
})();

