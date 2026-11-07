const BANK_VERSION = "2026.11.07-r1";

const TOPICS = {
  position: {
    order: 1,
    chapter: "圓的基本關係",
    title: "點、直線與圓的位置",
    short: "先比距離",
    intuition: "把半徑想成圓的固定尺：點到圓心、直線到圓心的距離，只要和半徑比較，就能判斷內、上、外或相離、相切、相交。",
    steps: ["找出圓心與半徑", "量出（或算出）最短距離", "與半徑比較並保留等號邊界"],
    tip: "看到「內外、幾個交點、半徑範圍」，先寫 d 與 r 的大小關係。"
  },
  chord: {
    order: 2,
    chapter: "弦與圓心",
    title: "弦心距、垂徑與弦長",
    short: "垂徑先對半",
    intuition: "圓心向弦作垂線，會把弦平分。半弦、弦心距、半徑立刻組成直角三角形；同圓中，弦越靠近圓心就越長。",
    steps: ["由圓心向弦作垂線", "把整條弦換成半弦", "用畢氏定理或大小關係收尾"],
    tip: "弦長題不要直接套整條弦：先除以 2，再做畢氏，最後乘回 2。"
  },
  tangent: {
    order: 3,
    chapter: "切線與圓",
    title: "切線、等切線與切點半徑",
    short: "切點必垂直",
    intuition: "切線只碰圓一點，切點半徑一定和切線垂直；同一圓外點引出的兩段切線等長，常能把複雜周長拆成成對相等的線段。",
    steps: ["圈出切點並連圓心", "補上 90° 或等切線", "用畢氏、全等或周長拆線"],
    tip: "題目一出現「切」，先在切點畫直角記號；同一外點的兩切線再畫同一種刻痕。"
  },
  arc: {
    order: 4,
    chapter: "圓心角與圓周角",
    title: "弧、圓心角與圓周角",
    short: "先找所對弧",
    intuition: "同一條弧像共同的「底」。圓心角讀完整弧，圓周角讀一半；反過來，已知圓周角就把它乘 2 還原成弧。",
    steps: ["在角的兩邊找到弧端點", "判斷是圓心角或圓周角", "用 1 倍或 1/2 倍關係轉換"],
    tip: "不要只看角畫在哪裡；把角的兩邊延伸到圓周，先圈出真正所對的弧。"
  },
  cyclic: {
    order: 5,
    chapter: "圓內角的整合",
    title: "圓內接四邊形與交角",
    short: "先補角再配弧",
    intuition: "內接四邊形的對角互補；兩弦在圓內相交時，交角是兩段對弧和的一半；在圓外相交則取兩弧差的一半。",
    steps: ["判斷交點在圓內、圓上或圓外", "標出相關兩弧", "依位置使用互補、半和或半差"],
    tip: "交點位置決定公式：圓上看一條弧、圓內看半和、圓外看半差。"
  },
  power: {
    order: 6,
    chapter: "線段乘積",
    title: "圓冪、相交弦與割切線",
    short: "成對線段相乘",
    intuition: "從同一個交點出發，穿過圓的兩組線段會形成固定乘積。先確認是「內部兩弦」還是「外部割線／切線」，再決定要乘哪兩段。",
    steps: ["固定共同交點", "找每一條線上的近段與全段", "列出乘積相等並檢查正長度"],
    tip: "外部割線要用「外段 × 全段」，不是外段 × 內段。"
  },
  measure: {
    order: 7,
    chapter: "圓的度量",
    title: "弧長、扇形、弓形與圓環",
    short: "先求占整圓比例",
    intuition: "圓心角占 360° 的幾分之幾，弧長與扇形面積就占整個圓周、圓面積的同樣比例；弓形是扇形減三角形。",
    steps: ["算圓心角占 360° 的比例", "乘圓周或圓面積", "複合圖形用加減拆開"],
    tip: "弧長和扇形面積共用同一比例；只有最後乘的是 2πr 還是 πr² 不同。"
  },
  coordinate: {
    order: 8,
    chapter: "圓與坐標",
    title: "坐標平面中的圓",
    short: "把圖形翻成距離",
    intuition: "坐標只是換了一把尺。點到圓心的距離用畢氏定理；切線題再加入「半徑垂直切線」，圓心常落在垂線或中垂線上。",
    steps: ["標出圓心、已知點與坐標差", "用畢氏求距離", "加入相切或中垂線條件定位"],
    tip: "先畫簡單座標草圖，再算水平差與鉛直差，可避免正負號錯誤。"
  },
  construction: {
    order: 9,
    chapter: "尺規作圖",
    title: "找圓心與作切線",
    short: "把性質變作圖",
    intuition: "圓心一定在每條弦的中垂線上；圓上一點的切線垂直該點半徑；圓外點作切線可利用以 OP 為直徑的輔助圓製造直角。",
    steps: ["先找出可用的弦或 OP", "作中垂線／輔助圓", "連接交點並保留作圖痕跡"],
    tip: "尺規題的得分點在痕跡：等半徑弧、交點與最後直線都要清楚保留。"
  },
  composite: {
    order: 10,
    chapter: "跨觀念綜合",
    title: "圓的綜合幾何",
    short: "拆成兩個熟悉模型",
    intuition: "綜合題通常不是新定理，而是把切線、圓周角、相似或面積疊在一起。先找最強條件（直徑、切線、垂徑），再把圖拆成兩個熟悉的小圖。",
    steps: ["標出直徑、切點、平行與直角", "選一個局部模型先完成", "把中間結果帶入下一個模型"],
    tip: "不要一次看完整張圖；先遮住一半，只問第一步能確定哪個角或哪條線。"
  }
};

const SCHOOL_FILES = {
  "七賢": ["七賢114上2段數學(題目).pdf", "七賢114上2段數學(答案).pdf", "qixian"],
  "五福": ["五福114上2段數學(題目).pdf", "五福114上2段數學(答案).pdf", "wufu"],
  "正興": ["正興114上2段數學(題目).pdf", "正興114上2段數學(答案).pdf", "zhengxing"],
  "民族": ["民族114上2段數學(題目).pdf", "民族114上2段數學(答案).pdf", "minzu"],
  "明華": ["明華114上2段數學試題暨解答.pdf", "明華114上2段數學試題暨解答.pdf", "minghua"],
  "復華": ["復華114上2段數學(題目).pdf", "復華114上2段數學(答案).pdf", "fuhua"],
  "陽明": ["陽明114上2段數學(題目).pdf", "陽明114上2段數學(答案).pdf", "yangming"],
  "楠梓": ["楠梓114上2段數學(題目).pdf", "楠梓114上2段數學(答案).pdf", "nanzih"],
  "福山": ["福山114上2段數學(題目).pdf", "福山114上2段數學(答案).pdf", "fushan"],
  "龍華": ["龍華114上2段數學(題目).pdf", "龍華114上2段數學(答案).pdf", "longhua"]
};

const pageBy = (...groups) => n => {
  for (let i = 0; i < groups.length; i += 1) if (groups[i].includes(n)) return i + 1;
  throw new Error(`No page for ${n}`);
};

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const QUESTION_BANK = [];

function addSet(school, section, include, answers, topics, pageResolver, kind = "choice") {
  const [sourceFile, answerSourceFile, slug] = SCHOOL_FILES[school];
  include.forEach(no => {
    const page = pageResolver(no);
    const sectionCode = section === "選擇" ? "c" : section === "填充" ? "f" : "n";
    QUESTION_BANK.push({
      id: `${slug}-${sectionCode}${no}`,
      school,
      section,
      originalQuestionNumber: no,
      label: `${section}${no}`,
      sourceFile,
      answerSourceFile,
      sourcePage: page,
      answer: String(answers[no] ?? "待核"),
      topic: topics[no] || "composite",
      kind,
      screenImage: `assets/images/questions/screen/${slug}/${sectionCode}${no}.jpg`,
      printImage: `assets/images/questions/print/${slug}/${sectionCode}${no}.jpg`,
      fullScreenImage: `assets/images/screen/${slug}/page-${String(page).padStart(2, "0")}.jpg`,
      fullPrintImage: `assets/images/print/${slug}/page-${String(page).padStart(2, "0")}.jpg`,
      version: BANK_VERSION
    });
  });
}

const qixianChoice = [null,"B","D","C","D","D","D","B","D","C","C","A","C","A","B","C","A","B","C","A"];
addSet("七賢", "選擇", [1,2,5,7,8,9,10,11,14,15,16,17], qixianChoice,
  {1:"tangent",2:"position",5:"arc",7:"arc",8:"tangent",9:"cyclic",10:"composite",11:"cyclic",14:"cyclic",15:"arc",16:"measure",17:"composite"},
  pageBy(range(1,5),range(6,11),range(12,17),range(18,19)));
addSet("七賢", "非選", [1,2], {1:"(1)20；(2)10√11；(3)33",2:"(1)△CDE，AA；(2)CE=2"}, {1:"chord",2:"power"}, () => 4, "constructed");

const wufuChoice=[null,"A","C","A","D","B","B","C","B","C","B","D","B"];
addSet("五福","選擇",[1,3,5,6,7,8,9,10,11],wufuChoice,{1:"chord",3:"position",5:"chord",6:"arc",7:"cyclic",8:"measure",9:"arc",10:"cyclic",11:"tangent"},pageBy(range(1,6),range(7,12)));
const wufuFill={1:"16π",2:"20",3:"47°",4:"25:9",5:"75 公尺",6:"100°",7:"25.5",8:"9.6",9:"144°",10:"5 公尺",11:"2.8 公尺",12:"2.5",13:"1:16"};
addSet("五福","填充",[1,2,3,5,6,9,10,11,12],wufuFill,{1:"measure",2:"position",3:"arc",5:"measure",6:"tangent",9:"arc",10:"chord",11:"chord",12:"composite"},n=>n<=7?3:4,"constructed");

const zhengFill={1:"14π",2:"10π/3",3:"8π+24",4:"200π/3-100√3",5:"5",6:"8",7:"24",8:"65°",9:"90°",10:"110°",11:"88°",12:"(-2, 2√3)",13:"68°",14:"42°",15:"9",16:"2:3",17:"12/25",18:"2.3",19:"(8,12)",20:"500/3",21:"31°",22:"4-2√3",23:"2 或 3",24:"100π"};
addSet("正興","填充",[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,21,23,24],zhengFill,{1:"measure",2:"measure",3:"measure",4:"measure",5:"tangent",6:"tangent",7:"chord",8:"arc",9:"arc",10:"arc",11:"cyclic",12:"coordinate",13:"arc",14:"arc",15:"composite",21:"cyclic",23:"composite",24:"measure"},pageBy(range(1,7),range(8,14),range(15,20),range(21,24)),"constructed");
addSet("正興","非選",[1,2],{1:"108√3-36π",2:"面積45π；周長12+15π"},{1:"measure",2:"measure"},()=>5,"constructed");

const minzuChoice=[null,"D","B","A","C","A","A","D","B","A","B","B","D","C","D","C","B","C","B","C","A","A","D","B","D","C"];
addSet("民族","選擇",[3,5,6,7,8,9,10,12,13,14,15,17,18,19,20,21,22,23,24,25],minzuChoice,{3:"arc",5:"tangent",6:"measure",7:"arc",8:"cyclic",9:"arc",10:"coordinate",12:"measure",13:"cyclic",14:"measure",15:"cyclic",17:"cyclic",18:"tangent",19:"chord",20:"tangent",21:"cyclic",22:"chord",23:"arc",24:"tangent",25:"composite"},pageBy(range(1,8),range(9,15),range(16,23),range(24,25)));
addSet("民族","非選",[1,2],{1:"(1)3；(2)3/5",2:"(1)50°；(2)225公分"},{1:"tangent",2:"tangent"},()=>4,"constructed");

const mingChoice=[null,"C","D","A","B","A","C","B","A","C","D","B","C","D","D","A","B","A","B","C","D"];
addSet("明華","選擇",[1,2,3,4,5,6,8,9,11,12,14,15,16,17,18,20],mingChoice,{1:"chord",2:"chord",3:"tangent",4:"tangent",5:"tangent",6:"chord",8:"cyclic",9:"position",11:"arc",12:"cyclic",14:"measure",15:"tangent",16:"tangent",17:"cyclic",18:"measure",20:"measure"},pageBy(range(1,10),range(11,20)));
const mingFill={1:"38.3",2:"10",3:"30°",4:"(14,2)",5:"∠AFB=∠AGB=∠CED",6:"27",7:"90°",8:"甲、乙、丁"};
addSet("明華","填充",[2,3,4,5,7,8],mingFill,{2:"tangent",3:"arc",4:"coordinate",5:"arc",7:"tangent",8:"construction"},()=>3,"constructed");
addSet("明華","非選",[1],{1:"(1)AC=10；(2)a=8"},{1:"construction"},()=>3,"constructed");

const fuhuaChoice=[null,"A","B","A","C","C","B","D","B","B","A","D","C"];
addSet("復華","選擇",range(1,12),fuhuaChoice,{1:"position",2:"chord",3:"chord",4:"coordinate",5:"coordinate",6:"measure",7:"tangent",8:"tangent",9:"arc",10:"tangent",11:"composite",12:"cyclic"},pageBy(range(1,8),range(9,12)));
const fuhuaFill={1:"2",2:"4",3:"64°",4:"215°",5:"32°",6:"5",7:"25π",8:"(4,-3)",9:"61",10:"4",11:"50√3-75π/4"};
addSet("復華","填充",range(1,11),fuhuaFill,{1:"measure",2:"tangent",3:"tangent",4:"arc",5:"cyclic",6:"chord",7:"tangent",8:"cyclic",9:"coordinate",10:"power",11:"measure"},n=>n<=4?2:3,"constructed");
addSet("復華","非選",[1,2],{1:"108√3-36π",2:"43°"},{1:"measure",2:"tangent"},()=>4,"constructed");

const yangChoice=[null,"A","B","D","C","B","C","D","C","A","A"];
addSet("陽明","選擇",[1,2,4,6,7,9,10],yangChoice,{1:"position",2:"tangent",4:"arc",6:"arc",7:"chord",9:"cyclic",10:"construction"},pageBy(range(1,6),range(7,10)));
const yangFill={1:"D、E",2:"4π-8",3:"450",4:"√3/3",5:"√3π/2",6:"175",7:"24",8:"230°",9:"112°",10:"√5/2"};
addSet("陽明","填充",[1,2,5,8,9,10],yangFill,{1:"construction",2:"measure",5:"tangent",8:"arc",9:"cyclic",10:"measure"},n=>n===1?2:n<=9?3:4,"constructed");
addSet("陽明","非選",[1,2,3],{1:"作兩弦的中垂線，交點為圓心",2:"(1)OP=13；(2)AB=120/13",3:"(1)半徑12；(2)AC=12√2"},{1:"construction",2:"tangent",3:"arc"},()=>4,"constructed");

const nanzihChoice=[null,"C","A","D","C","D","B","B","C","D","A"];
addSet("楠梓","選擇",range(4,10),nanzihChoice,{4:"measure",5:"tangent",6:"chord",7:"measure",8:"arc",9:"arc",10:"chord"},pageBy(range(1,9),[10]));
const nanzihFill={1:"12",2:"400",3:"3.75",4:"9",5:"3:2",6:"350",7:"42π",8:"3<r≤4",9:"3√5",10:"2.5",11:"64",12:"75°",13:"80°",14:"150°",15:"27",16:"20°"};
addSet("楠梓","填充",range(7,16),nanzihFill,{7:"measure",8:"position",9:"chord",10:"chord",11:"tangent",12:"arc",13:"arc",14:"cyclic",15:"composite",16:"arc"},n=>n<=10?2:3,"constructed");
addSet("楠梓","非選",[1,2,3],{1:"過P作OP的垂線",2:"以OP為直徑作輔助圓，連接交點",3:"(1)72°；(2)√5-1"},{1:"construction",2:"construction",3:"composite"},()=>3,"constructed");

const fushanChoice=[null,"D","B","D","C","A","B","A","C","B","D"];
addSet("福山","選擇",range(1,10),fushanChoice,{1:"position",2:"position",3:"arc",4:"tangent",5:"measure",6:"arc",7:"arc",8:"chord",9:"measure",10:"construction"},pageBy(range(1,7),range(8,10)));
const fushanFill={1:"6π-9√3",2:"54°",3:"80°",4:"9",5:"72/5",6:"5",7:"3",8:"56°",9:"45°",10:"27/5",11:"111°",12:"72",13:"26",14:"9π",15:"78°",16:"37°"};
addSet("福山","填充",range(1,16),fushanFill,{1:"measure",2:"arc",3:"arc",4:"tangent",5:"tangent",6:"chord",7:"tangent",8:"arc",9:"cyclic",10:"power",11:"tangent",12:"tangent",13:"power",14:"measure",15:"cyclic",16:"arc"},n=>n<=2?2:n<=8?3:n<=13?4:5,"constructed");
addSet("福山","非選",[1,2],{1:"(1)120°；(2)20π",2:"(1)360°；(2)1600"},{1:"measure",2:"composite"},n=>n===1?5:6,"constructed");

const longChoice=[null,"C","B","C","C","A","B","B","B","D","A","B","C","A","B","A","D","B","A","C","D"];
addSet("龍華","選擇",[4,5,8,9,10,11,12,13,14,15,16,17,18,19,20],longChoice,{4:"tangent",5:"coordinate",8:"tangent",9:"cyclic",10:"arc",11:"measure",12:"power",13:"arc",14:"tangent",15:"arc",16:"tangent",17:"composite",18:"arc",19:"tangent",20:"chord"},pageBy(range(1,7),range(8,13),range(14,18),range(19,20)));
const longFill={1:"15<r<17",2:"70π/3",3:"100°",4:"√3/3",5:"52°",6:"65/2"};
addSet("龍華","填充",[1,2,3],longFill,{1:"position",2:"measure",3:"arc"},()=>4,"constructed");

QUESTION_BANK.sort((a,b)=>TOPICS[a.topic].order-TOPICS[b.topic].order || a.school.localeCompare(b.school,"zh-Hant") || a.originalQuestionNumber-b.originalQuestionNumber);
QUESTION_BANK.forEach((q,index)=>{ q.newQuestionNumber=index+1; q.chapter=TOPICS[q.topic].chapter; q.topicTitle=TOPICS[q.topic].title; });

window.CIRCLE_BANK = { BANK_VERSION, TOPICS, QUESTION_BANK, SCHOOL_FILES };
