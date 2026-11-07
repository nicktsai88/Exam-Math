(() => {
  "use strict";

  const { BANK_VERSION, TOPICS, QUESTION_BANK, SCHOOL_FILES } = window.CIRCLE_BANK;
  const LESSONS = window.CIRCLE_LESSONS;
  const DIAGRAMS = window.CIRCLE_DIAGRAMS;
  const STORAGE_PREFIX = `circle-method-lab:${BANK_VERSION}:`;
  const state = {
    mode: localStorage.getItem(`${STORAGE_PREFIX}mode`) || "analysis",
    font: Number(localStorage.getItem(`${STORAGE_PREFIX}font`) || 100),
    selectedSchools: new Set(Object.keys(SCHOOL_FILES)),
    selectedTopics: new Set(Object.keys(TOPICS)),
    search: "",
    wrongOnly: false,
    reviewOnly: false,
    visible: 18,
    progress: JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}progress`) || "{}"),
    learner: JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}learner`) || "null"),
    modalScale: 1
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const els = {
    analysisMode: $("#analysisMode"), quizMode: $("#quizMode"), fontDown: $("#fontDown"),
    fontUp: $("#fontUp"), fontReset: $("#fontReset"), fontPercent: $("#fontPercent"),
    methodCards: $("#methodCards"), schoolFilters: $("#schoolFilters"), topicFilters: $("#topicFilters"),
    searchInput: $("#searchInput"), wrongOnly: $("#wrongOnly"), reviewOnly: $("#reviewOnly"),
    filteredCount: $("#filteredCount"), answeredCount: $("#answeredCount"), correctCount: $("#correctCount"),
    reviewCount: $("#reviewCount"), progressBar: $("#progressBar"), progressText: $("#progressText"),
    answerIndex: $("#answerIndex"), answerChips: $("#answerChips"), questionList: $("#questionList"),
    loadMore: $("#loadMore"), resultTitle: $("#resultTitle"), resultDescription: $("#resultDescription"),
    resetFilters: $("#resetFilters"), startLearning: $("#startLearning"), printSelected: $("#printSelected"),
    printRoot: $("#printRoot"), liveRegion: $("#liveRegion"), saveState: $("#saveState"),
    learnerEmoji: $("#learnerEmoji"), learnerName: $("#learnerName"), saveLearner: $("#saveLearner"),
    learnerStatus: $("#learnerStatus"), modal: $("#imageModal"), modalImage: $("#modalImage"),
    modalTitle: $("#modalTitle"), modalClose: $("#modalClose"), zoomIn: $("#zoomIn"),
    zoomOut: $("#zoomOut"), zoomReset: $("#zoomReset"), versionLabel: $("#versionLabel")
  };

  const topicEntries = Object.entries(TOPICS).sort((a,b) => a[1].order-b[1].order);

  function announce(message) {
    els.liveRegion.textContent = "";
    requestAnimationFrame(() => { els.liveRegion.textContent = message; });
  }

  function saveProgress() {
    localStorage.setItem(`${STORAGE_PREFIX}progress`, JSON.stringify(state.progress));
    els.saveState.textContent = "● 本機已儲存";
  }

  function updateFont() {
    state.font = Math.max(80, Math.min(160, state.font));
    document.documentElement.style.setProperty("--font-scale", state.font / 100);
    els.fontPercent.textContent = `${state.font}%`;
    els.fontDown.disabled = state.font <= 80;
    els.fontUp.disabled = state.font >= 160;
    localStorage.setItem(`${STORAGE_PREFIX}font`, String(state.font));
    announce(`字級已調整為 ${state.font}%`);
  }

  function setMode(mode) {
    state.mode = mode;
    localStorage.setItem(`${STORAGE_PREFIX}mode`, mode);
    els.analysisMode.classList.toggle("active", mode === "analysis");
    els.quizMode.classList.toggle("active", mode === "quiz");
    els.analysisMode.setAttribute("aria-pressed", String(mode === "analysis"));
    els.quizMode.setAttribute("aria-pressed", String(mode === "quiz"));
    els.answerIndex.hidden = mode === "quiz";
    state.visible = 18;
    renderQuestions();
    announce(mode === "analysis" ? "已切換到解析介面" : "已切換到測驗介面；未作答題不顯示答案");
  }

  function buildFilters() {
    Object.keys(SCHOOL_FILES).forEach(school => {
      const label = document.createElement("label");
      label.className = "check-row";
      const input = document.createElement("input");
      input.type = "checkbox"; input.checked = true; input.value = school; input.dataset.filterSchool = "";
      const span = document.createElement("span"); span.textContent = school;
      label.append(input, span); els.schoolFilters.append(label);
    });
    topicEntries.forEach(([key, topic]) => {
      const label = document.createElement("label"); label.className = "check-row topic-check";
      const input = document.createElement("input"); input.type = "checkbox"; input.checked = true; input.value = key; input.dataset.filterTopic = "";
      const span = document.createElement("span"); span.textContent = topic.title;
      const count = document.createElement("small"); count.textContent = QUESTION_BANK.filter(q=>q.topic===key).length;
      label.append(input, span, count); els.topicFilters.append(label);
    });
  }

  function buildMethods() {
    topicEntries.forEach(([key, topic], index) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = `method-card method-${index+1}`; button.dataset.topicJump = key;
      const num = document.createElement("span"); num.className = "method-number"; num.textContent = String(index+1).padStart(2,"0");
      const body = document.createElement("span"); body.className = "method-body";
      const title = document.createElement("strong"); title.textContent = topic.title;
      const short = document.createElement("em"); short.textContent = topic.short;
      const count = document.createElement("small"); count.textContent = `${QUESTION_BANK.filter(q=>q.topic===key).length} 題`;
      body.append(title, short, count); button.append(num, body); els.methodCards.append(button);
    });
  }

  function filteredQuestions() {
    const query = state.search.trim().toLocaleLowerCase("zh-Hant");
    return QUESTION_BANK.filter(q => {
      const p = state.progress[q.id] || {};
      if (!state.selectedSchools.has(q.school) || !state.selectedTopics.has(q.topic)) return false;
      if (state.wrongOnly && !p.wrong) return false;
      if (state.reviewOnly && !p.review) return false;
      if (!query) return true;
      const haystack = `${q.newQuestionNumber} ${q.school} ${q.section} ${q.originalQuestionNumber} ${q.topicTitle} ${q.chapter} ${TOPICS[q.topic].short}`.toLocaleLowerCase("zh-Hant");
      return haystack.includes(query);
    });
  }

  function updateStats(list) {
    const answered = list.filter(q => state.progress[q.id]?.answered).length;
    const correct = list.filter(q => state.progress[q.id]?.correct).length;
    const review = list.filter(q => state.progress[q.id]?.review).length;
    const percent = list.length ? Math.round(answered/list.length*100) : 0;
    els.filteredCount.textContent = list.length;
    els.answeredCount.textContent = answered;
    els.correctCount.textContent = correct;
    els.reviewCount.textContent = review;
    els.progressBar.style.width = `${percent}%`;
    els.progressText.textContent = `${percent}%`;
  }

  function buildAnswerIndex(list) {
    els.answerChips.replaceChildren();
    list.forEach(q => {
      const a = document.createElement("a"); a.href = `#${q.id}`; a.className = "answer-chip";
      a.textContent = `${q.newQuestionNumber}・${q.answer}`; a.title = `${q.school}${q.section}${q.originalQuestionNumber}`;
      els.answerChips.append(a);
    });
  }

  function solutionFor(q) {
    const lesson=LESSONS[q.id];
    if(!lesson) throw new Error(`Missing dedicated lesson: ${q.id}`);
    return {...lesson,visualSteps:lesson.steps};
  }

  function createMeta(q) {
    const meta = document.createElement("div"); meta.className = "question-meta";
    const number = document.createElement("span"); number.className = "new-number"; number.textContent = `新題號 ${q.newQuestionNumber}`;
    const source = document.createElement("span"); source.textContent = `${q.school}・原始${q.section}${q.originalQuestionNumber}`;
    const topic = document.createElement("span"); topic.className = "topic-pill"; topic.textContent = q.topicTitle;
    meta.append(number, source, topic); return meta;
  }

  function createSourcePane(q) {
    const pane = document.createElement("section"); pane.className = "source-pane";
    const head = document.createElement("div"); head.className = "pane-head";
    const title = document.createElement("h3"); title.textContent = "原卷題目圖";
    const tools = document.createElement("div");
    const page = document.createElement("span"); page.textContent = `第 ${q.sourcePage} 頁・定位 ${q.label}`;
    const zoom = document.createElement("button"); zoom.type = "button"; zoom.className = "zoom-question"; zoom.textContent = "🔎 放大題目"; zoom.dataset.zoom = q.id;
    tools.append(page, zoom); head.append(title, tools);
    const imageWrap = document.createElement("button"); imageWrap.type = "button"; imageWrap.className = "page-image-button"; imageWrap.dataset.zoom = q.id;
    const img = document.createElement("img"); img.src = q.screenImage; img.alt = `${q.school}原始${q.section}${q.originalQuestionNumber}題目圖，保留原卷題幹、選項與可辨識附圖`; img.loading = "lazy"; img.decoding = "async"; img.width = 1240; img.height = 700;
    imageWrap.append(img); pane.append(head, imageWrap);
    if(q.auxImages?.length){
      const auxWrap=document.createElement("div");auxWrap.className="aux-source-grid";
      q.auxImages.forEach((aux,index)=>{const figure=document.createElement("figure");const button=document.createElement("button");button.type="button";button.className="aux-image-button";button.dataset.zoomAux=`${q.id}:${index}`;const auxImg=document.createElement("img");auxImg.src=aux.screen;auxImg.alt=`${q.school}${q.label}原卷分離附圖 ${index+1}`;auxImg.loading="lazy";button.append(auxImg);const caption=document.createElement("figcaption");caption.textContent=`原卷分離附圖 ${index+1}`;figure.append(button,caption);auxWrap.append(figure);});
      pane.append(auxWrap);
    }
    const note = document.createElement("p"); note.className = "source-note"; note.textContent = `來源：${q.sourceFile}｜答案：${q.answerSourceFile}`; pane.append(note);
    return pane;
  }

  function createIntuition(q) {
    const solution=solutionFor(q);
    const section = document.createElement("section"); section.className = "intuition-pane";
    const head = document.createElement("div"); head.className = "pane-head";
    const h3 = document.createElement("h3"); h3.textContent = "幾何直觀・視覺化解題";
    const badge = document.createElement("span"); badge.className = "model-badge"; badge.textContent = "本題重繪・專屬步驟";
    head.append(h3,badge);
    const body = document.createElement("div"); body.className = "intuition-body";
    const visual = document.createElement("div"); visual.className = "geometry-visual teaching-visual"; visual.dataset.step = "0";
    const stepBadge=document.createElement("span");stepBadge.className="visual-step-badge";stepBadge.textContent="讀題重繪";
    visual.innerHTML=DIAGRAMS.render(q,solution);visual.append(stepBadge);
    const copy = document.createElement("div");
    const lead = document.createElement("p"); lead.className = "intuition-lead"; lead.textContent = solution.tip;
    const list = document.createElement("ol"); list.className = "visual-steps";
    solution.visualSteps.forEach((step,index)=>{ const li=document.createElement("li"); li.textContent=step; li.dataset.visualStep=String(index+1); list.append(li); });
    const play = document.createElement("button"); play.type="button"; play.className="play-intuition"; play.textContent="▶ 逐步播放直觀"; play.dataset.play=q.id;
    copy.append(lead,list,play); body.append(visual,copy); section.append(head,body); return section;
  }

  function createExplanation(q) {
    const solution=solutionFor(q);
    const wrap = document.createElement("section"); wrap.className = "explanation";
    const tip=document.createElement("div");tip.className="key-tip";const tipTitle=document.createElement("strong");tipTitle.textContent="💡 解題要訣";const tipText=document.createElement("p");tipText.textContent=solution.tip;tip.append(tipTitle,tipText);
    const work=document.createElement("div");work.className="derivation";const workTitle=document.createElement("strong");workTitle.className="solve-mark";workTitle.textContent="解";const lines=document.createElement("div");lines.className="derivation-lines";solution.derivation.forEach((line,index)=>{const p=document.createElement("p");p.textContent=index===solution.derivation.length-1?`∴ ${line}`:line;if(index===1)p.className="formula-line";lines.append(p);});work.append(workTitle,lines);
    const title = document.createElement("div"); title.className="answer-banner";const label = document.createElement("span"); label.textContent="答";const answer = document.createElement("strong"); answer.textContent=q.answer;title.append(label,answer);
    wrap.append(tip,work,title);
    return wrap;
  }

  function createQuizControls(q, progress) {
    const wrap=document.createElement("section");wrap.className="quiz-controls";
    if(!progress.answered){
      const prompt=document.createElement("p");prompt.textContent=q.kind==="choice"?"選擇你的答案；第一次作答會鎖定。":"先在紙上完成，再選擇是否答對；第一次紀錄會鎖定。";wrap.append(prompt);
      const choices=document.createElement("div");choices.className="choice-buttons";
      const values=q.kind==="choice"?["A","B","C","D"]:["我答對了","還不會／答錯"];
      values.forEach(value=>{const b=document.createElement("button");b.type="button";b.textContent=value;b.dataset.answerQuestion=q.id;b.dataset.answerValue=value;choices.append(b);});
      wrap.append(choices);
    }else{
      const result=document.createElement("div");result.className=progress.correct?"result correct":"result wrong";result.textContent=progress.correct?`✓ 第一次作答正確｜答案 ${q.answer}`:`✕ 第一次作答需訂正｜正式答案 ${q.answer}`;wrap.append(result);
    }
    return wrap;
  }

  function createQuestionCard(q) {
    const p=state.progress[q.id]||{};
    const article=document.createElement("article");article.id=q.id;article.className="question-card";article.dataset.topic=q.topic;
    article.append(createMeta(q));
    const layout=document.createElement("div");layout.className="question-layout";layout.append(createSourcePane(q),createIntuition(q));article.append(layout);
    if(state.mode==="quiz") article.append(createQuizControls(q,p));
    if(state.mode==="analysis"||p.answered) article.append(createExplanation(q));
    const actions=document.createElement("div");actions.className="card-actions";
    const review=document.createElement("button");review.type="button";review.dataset.review=q.id;review.className=p.review?"review active":"review";review.textContent=p.review?"★ 已標記複習":"☆ 標記複習";
    const trace=document.createElement("details");trace.className="source-trace";const summary=document.createElement("summary");summary.textContent="來源追蹤";const text=document.createElement("p");text.textContent=`新題號 ${q.newQuestionNumber}｜${q.school} ${q.label}｜原卷第 ${q.sourcePage} 頁｜版本 ${q.version}`;trace.append(summary,text);actions.append(review,trace);article.append(actions);
    return article;
  }

  function renderQuestions() {
    const list=filteredQuestions(); updateStats(list); buildAnswerIndex(list);
    els.questionList.replaceChildren(); list.slice(0,state.visible).forEach(q=>els.questionList.append(createQuestionCard(q)));
    els.loadMore.hidden=state.visible>=list.length; els.loadMore.textContent=`載入更多（尚有 ${Math.max(0,list.length-state.visible)} 題）`;
    const onlyTopic=state.selectedTopics.size===1?[...state.selectedTopics][0]:null;
    els.resultTitle.textContent=onlyTopic?TOPICS[onlyTopic].title:"依解法排序";
    els.resultDescription.textContent=onlyTopic?TOPICS[onlyTopic].intuition:"題目依「解法 → 學校 → 原始題號」排列，避免只靠題目外觀背答案。";
  }

  function answerQuestion(id,value) {
    if(state.progress[id]?.answered) return;
    const q=QUESTION_BANK.find(item=>item.id===id); if(!q) return;
    const correct=q.kind==="choice"?value===q.answer:value==="我答對了";
    state.progress[id]={...(state.progress[id]||{}),answered:true,choice:value,correct,wrong:!correct,firstAnsweredAt:new Date().toISOString()};
    saveProgress(); renderQuestions(); announce(correct?"作答正確，已顯示解析":"已鎖定第一次作答，請查看解析訂正");
    requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:"center"}));
  }

  function toggleReview(id) {
    state.progress[id]={...(state.progress[id]||{}),review:!state.progress[id]?.review};saveProgress();renderQuestions();
  }

  function playIntuition(button) {
    const card=button.closest(".question-card");const visual=card.querySelector(".geometry-visual");const list=[...card.querySelectorAll(".visual-steps li")];
    let step=Number(visual.dataset.step||0)+1;if(step>3)step=0;visual.dataset.step=String(step);visual.classList.toggle("active",step>0);visual.querySelector(".visual-step-badge").textContent=step===0?"讀題重繪":`步驟 ${step}`;visual.querySelectorAll("[data-diagram-step]").forEach(layer=>layer.classList.toggle("shown",Number(layer.dataset.diagramStep)<=step));list.forEach((li,i)=>li.classList.toggle("active",i<step));button.textContent=step===0?"▶ 逐步播放直觀":step===3?"↻ 重新播放":"下一步 →";
  }

  function openModal(id,auxIndex=null) {
    const q=QUESTION_BANK.find(item=>item.id===id);if(!q)return;state.modalScale=1;const aux=auxIndex===null?null:q.auxImages?.[auxIndex];els.modalTitle.textContent=aux?`${q.school}・${q.label}｜分離附圖 ${auxIndex+1}`:`${q.school}・${q.label}｜原卷第${q.sourcePage}頁`;els.modalImage.src=aux?.print||q.printImage;els.modalImage.alt=aux?`${q.school}${q.label}原卷高畫質分離附圖`:`${q.school}${q.label}原卷高畫質題目圖`;applyModalScale();els.modal.hidden=false;document.body.classList.add("modal-open");els.modalClose.focus();
  }
  function closeModal(){els.modal.hidden=true;document.body.classList.remove("modal-open");els.modalImage.removeAttribute("src");}
  function applyModalScale(){els.modalImage.style.width=`${Math.round(state.modalScale*100)}%`;els.zoomReset.textContent=`${Math.round(state.modalScale*100)}%`;}

  async function printFiltered() {
    const list=filteredQuestions();if(!list.length){announce("目前沒有可列印的題目");return;}
    els.printRoot.replaceChildren();
    const cover=document.createElement("section");cover.className="print-cover";const h=document.createElement("h1");h.textContent="國三圓單元・分類練習卷";const p=document.createElement("p");p.textContent=`共 ${list.length} 題｜版本 ${BANK_VERSION}`;cover.append(h,p);els.printRoot.append(cover);
    list.forEach(q=>{const section=document.createElement("section");section.className="print-question";const meta=document.createElement("h2");meta.textContent=`新題號 ${q.newQuestionNumber}｜${q.school}・原始${q.label}｜${q.topicTitle}`;const img=document.createElement("img");img.src=q.printImage;img.alt=`${q.school}${q.label}原卷第${q.sourcePage}頁`;section.append(meta,img);q.auxImages?.forEach((aux,index)=>{const label=document.createElement("p");label.className="print-aux-label";label.textContent=`原卷分離附圖 ${index+1}`;const auxImg=document.createElement("img");auxImg.src=aux.print;auxImg.alt=`${q.school}${q.label}分離附圖`;section.append(label,auxImg);});els.printRoot.append(section);});
    const key=document.createElement("section");key.className="print-answer-key";const kh=document.createElement("h2");kh.textContent="答案";const grid=document.createElement("div");list.forEach(q=>{const item=document.createElement("p");item.textContent=`${q.newQuestionNumber}. ${q.answer}`;grid.append(item);});key.append(kh,grid);els.printRoot.append(key);
    const images=[...els.printRoot.querySelectorAll("img")];await Promise.all(images.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve()));window.print();
  }

  function updateLearner() {
    if(state.learner){els.learnerEmoji.value=state.learner.emoji;els.learnerName.value=state.learner.name;els.learnerStatus.textContent=`${state.learner.emoji} ${state.learner.name}・本機模式`;}
  }

  function syncFilterState(){state.selectedSchools=new Set($$("[data-filter-school]:checked").map(i=>i.value));state.selectedTopics=new Set($$("[data-filter-topic]:checked").map(i=>i.value));state.search=els.searchInput.value;state.wrongOnly=els.wrongOnly.checked;state.reviewOnly=els.reviewOnly.checked;state.visible=18;renderQuestions();}

  document.addEventListener("change",event=>{if(event.target.matches("[data-filter-school],[data-filter-topic],#wrongOnly,#reviewOnly"))syncFilterState();});
  els.searchInput.addEventListener("input",syncFilterState);
  document.addEventListener("click",event=>{
    const topic=event.target.closest("[data-topic-jump]")?.dataset.topicJump;if(topic){$$("[data-filter-topic]").forEach(i=>i.checked=i.value===topic);syncFilterState();$("#questionList").scrollIntoView({behavior:"smooth"});}
    const select=event.target.dataset.select;if(select){$$(`[data-filter-${select==="schools"?"school":"topic"}]`).forEach(i=>i.checked=true);syncFilterState();}
    const clear=event.target.dataset.clear;if(clear){$$(`[data-filter-${clear==="schools"?"school":"topic"}]`).forEach(i=>i.checked=false);syncFilterState();}
    const id=event.target.dataset.answerQuestion;if(id)answerQuestion(id,event.target.dataset.answerValue);
    if(event.target.dataset.review)toggleReview(event.target.dataset.review);
    if(event.target.dataset.play)playIntuition(event.target);
    const auxZoom=event.target.closest("[data-zoom-aux]")?.dataset.zoomAux;if(auxZoom){const [auxId,index]=auxZoom.split(":");openModal(auxId,Number(index));return;}
    const zoom=event.target.closest("[data-zoom]")?.dataset.zoom;if(zoom)openModal(zoom);
  });
  els.analysisMode.addEventListener("click",()=>setMode("analysis"));els.quizMode.addEventListener("click",()=>setMode("quiz"));
  els.fontDown.addEventListener("click",()=>{state.font-=10;updateFont();});els.fontUp.addEventListener("click",()=>{state.font+=10;updateFont();});els.fontReset.addEventListener("click",()=>{state.font=100;updateFont();});
  els.resetFilters.addEventListener("click",()=>{$$("[data-filter-school],[data-filter-topic]").forEach(i=>i.checked=true);els.searchInput.value="";els.wrongOnly.checked=false;els.reviewOnly.checked=false;syncFilterState();});
  els.startLearning.addEventListener("click",()=>$("#methodTitle").scrollIntoView({behavior:"smooth"}));
  els.loadMore.addEventListener("click",()=>{state.visible+=18;renderQuestions();});els.printSelected.addEventListener("click",printFiltered);
  els.modalClose.addEventListener("click",closeModal);els.modal.addEventListener("click",e=>{if(e.target===els.modal)closeModal();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!els.modal.hidden)closeModal();});
  els.zoomIn.addEventListener("click",()=>{state.modalScale=Math.min(2.5,state.modalScale+.25);applyModalScale();});els.zoomOut.addEventListener("click",()=>{state.modalScale=Math.max(.5,state.modalScale-.25);applyModalScale();});els.zoomReset.addEventListener("click",()=>{state.modalScale=1;applyModalScale();});
  els.saveLearner.addEventListener("click",()=>{const name=els.learnerName.value.trim();if(!name){announce("請先輸入暱稱");return;}state.learner={id:state.learner?.id||crypto.randomUUID(),name,emoji:els.learnerEmoji.value};localStorage.setItem(`${STORAGE_PREFIX}learner`,JSON.stringify(state.learner));updateLearner();announce("學習者已儲存在這台裝置");});

  buildFilters();buildMethods();updateFont();updateLearner();els.versionLabel.textContent=BANK_VERSION;setMode(state.mode);
})();
