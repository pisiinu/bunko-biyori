import { useState, useRef, useEffect } from "react";

const MAX_SHELF = 9;
const MAX_BM    = 3;
// 茶系3色
const BM_COLORS = ["#7a4a20","#a07040","#5a3818"];

/* ─── 色生成 ─── */
function titleToBeige(title) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = title.charCodeAt(i) + ((h << 5) - h);
  const hue = 32 + (Math.abs(h) % 16);
  const sat  = 12 + (Math.abs(h >> 3) % 15);
  const lig  = 84 + (Math.abs(h >> 6) % 10);
  const age  = Math.abs(h >> 10) % 4;
  return {
    bg:     `hsl(${hue},${sat+age}%,${lig-age*2}%)`,
    ink:    `hsl(${hue},${sat+28}%,${lig-57}%)`,
    accent: `hsl(${hue},${sat+32}%,${lig-44}%)`,
    aged: age,
  };
}

/* ─── 社章 ─── */
function Shacho({ size=16, color="#8a7050", opacity=0.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{opacity,display:"block",flexShrink:0}}>
      <polygon points="12,1 23,12 12,23 1,12" fill="none" stroke={color} strokeWidth="1.3"/>
      <polygon points="12,5 19,12 12,19 5,12"  fill="none" stroke={color} strokeWidth="0.7" opacity="0.55"/>
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="0.4" opacity="0.35"/>
      <line x1="3"  y1="12" x2="21" y2="12" stroke={color} strokeWidth="0.4" opacity="0.35"/>
      <circle cx="12" cy="12" r="2" fill={color}/>
    </svg>
  );
}

/* ─── 飾り罫 ─── */
function OrnamentFrame({ accent, w, h }) {
  const m=7, m2=12;
  return (
    <svg style={{position:"absolute",inset:0,pointerEvents:"none"}} width={w} height={h}>
      <rect x={m}  y={m}  width={w-m*2}  height={h-m*2}  fill="none" stroke={accent} strokeWidth="0.75" opacity="0.65"/>
      <rect x={m2} y={m2} width={w-m2*2} height={h-m2*2} fill="none" stroke={accent} strokeWidth="0.38" opacity="0.35"/>
      {[[m,m],[w-m,m],[m,h-m],[w-m,h-m]].map(([cx,cy],i)=>(
        <g key={i} transform={`translate(${cx},${cy})`}>
          <line x1="-7" y1="0" x2="7" y2="0" stroke={accent} strokeWidth="0.6" opacity="0.52"/>
          <line x1="0" y1="-7" x2="0" y2="7" stroke={accent} strokeWidth="0.6" opacity="0.52"/>
          <circle cx="0" cy="0" r="2" fill={accent} opacity="0.45"/>
        </g>
      ))}
      {[[w/2,m],[w/2,h-m]].map(([cx,cy],i)=>(
        <g key={`d${i}`} transform={`translate(${cx},${cy})`}>
          <polygon points="0,-3.5 3.5,0 0,3.5 -3.5,0" fill={accent} opacity="0.4"/>
          <line x1="-10" y1="0" x2="-5" y2="0" stroke={accent} strokeWidth="0.5" opacity="0.28"/>
          <line x1="5"   y1="0" x2="10" y2="0" stroke={accent} strokeWidth="0.5" opacity="0.28"/>
        </g>
      ))}
    </svg>
  );
}

/* ─── 文庫表紙 ─── */
function BunkoCover({ book, size="normal", onClick, badge }) {
  const [hov,setHov] = useState(false);
  const c  = titleToBeige(book.title);
  const w  = size==="small"?70:size==="large"?128:94;
  const h  = Math.round(w*1.52);
  const fs = size==="small"?9.5:size==="large"?16:12.5;
  const fa = size==="small"?6.5:size==="large"?9:8;
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        width:w,height:h,background:c.bg,borderRadius:2,
        position:"relative",cursor:"pointer",flexShrink:0,overflow:"hidden",
        boxShadow:hov?"4px 10px 22px rgba(0,0,0,0.3)":"2px 4px 11px rgba(0,0,0,0.18),inset -1px 0 2px rgba(0,0,0,0.06)",
        transform:hov?"translateY(-5px) rotate(-0.5deg)":"none",
        transition:"all 0.18s ease",
        fontFamily:"'Noto Serif JP','Yu Mincho',serif",
      }}>
      <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.012) 3px,rgba(0,0,0,0.013) 4px)"}}/>
      {c.aged>1&&<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at ${c.aged*25}% ${c.aged*18}%,rgba(140,100,50,0.07) 0%,transparent 68%)`}}/>}
      <OrnamentFrame accent={c.accent} w={w} h={h}/>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:c.accent,opacity:0.22}}/>
      <div style={{
        position:"absolute",inset:0,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:size==="small"?"18px 8px 36px":"20px 12px 40px",
        gap:size==="small"?3:5,textAlign:"center",
      }}>
        <div style={{fontSize:fs,fontWeight:700,color:c.ink,letterSpacing:"0.08em",lineHeight:1.4,wordBreak:"break-all"}}>{book.title}</div>
        <div style={{width:size==="small"?22:32,height:"0.5px",background:c.accent,opacity:0.38}}/>
        <div style={{fontSize:fa,color:c.ink,opacity:0.68,letterSpacing:"0.06em"}}>{book.author}</div>
      </div>
      {/* 社章＋青空文庫：飾り罫より十分上に */}
      <div style={{position:"absolute",bottom:size==="small"?17:20,left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <Shacho size={size==="small"?8:10} color={c.accent} opacity={0.48}/>
        <div style={{fontSize:size==="small"?4.5:6,color:c.ink,opacity:0.28,letterSpacing:"0.2em"}}>青空文庫</div>
      </div>
      {badge&&<div style={{position:"absolute",top:9,right:9,fontSize:5.5,color:c.bg,background:c.ink,opacity:0.7,padding:"1px 4px",letterSpacing:"0.1em"}}>{badge}</div>}
    </div>
  );
}

/* ─── ドラッグ可能シークバー（右端=1ページ目） ─── */
function Seekbar({ page, totalPages, bookmarks, onSeek }) {
  const trackRef  = useRef(null);
  const dragging  = useRef(false);

  // 右端=page0、左端=page(totalPages-1)
  // page p の left位置：((totalPages-1-p)/(totalPages-1))*100%
  const pctLeft = p => totalPages<=1 ? 100 : ((totalPages-1-p)/(totalPages-1))*100;

  function pageFromClientX(clientX) {
    if(!trackRef.current) return page;
    const rect = trackRef.current.getBoundingClientRect();
    // 右端=0ページ、左端=最終ページ（x座標は左端が小さい）
    const r = 1 - Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));
    return Math.round(r*(totalPages-1));
  }

  // マウスイベント
  function onMouseDown(e) { e.preventDefault(); dragging.current=true; onSeek(pageFromClientX(e.clientX)); }
  function onMouseMove(e) { if(dragging.current) onSeek(pageFromClientX(e.clientX)); }
  function onMouseUp()    { dragging.current=false; }
  useEffect(()=>{
    window.addEventListener("mousemove",onMouseMove);
    window.addEventListener("mouseup",onMouseUp);
    return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);};
  });

  // タッチイベント
  function onTouchStart(e) { e.stopPropagation(); dragging.current=true; onSeek(pageFromClientX(e.touches[0].clientX)); }
  function onTouchMove(e)  { e.stopPropagation(); if(dragging.current) onSeek(pageFromClientX(e.touches[0].clientX)); }
  function onTouchEnd()    { dragging.current=false; }

  return (
    <div
      ref={trackRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{height:20,display:"flex",alignItems:"center",cursor:"pointer",userSelect:"none"}}
    >
      <div style={{position:"relative",width:"100%",height:5,background:"rgba(160,130,90,0.18)",borderRadius:2}}>
        {/* 既読バー：右端から現在位置まで */}
        <div style={{
          position:"absolute",right:0,top:0,bottom:0,
          width:`${pctLeft(page)}%`,
          background:"rgba(90,60,20,0.22)",borderRadius:2,
        }}/>
        {/* 栞マーカー */}
        {bookmarks.map((bm,i)=>(
          <div key={i}
            style={{
              position:"absolute",left:`${pctLeft(bm.page)}%`,top:"50%",
              transform:"translate(-50%,-50%)",
              width:11,height:11,borderRadius:"50%",
              background:BM_COLORS[i],border:"1.5px solid rgba(255,255,255,0.75)",
              zIndex:2,pointerEvents:"none",
            }}/>
        ))}
        {/* 現在位置サム */}
        <div style={{
          position:"absolute",left:`${pctLeft(page)}%`,top:"50%",
          transform:"translate(-50%,-50%)",
          width:15,height:15,borderRadius:"50%",
          background:"#3a2010",boxShadow:"0 1px 4px rgba(0,0,0,0.32)",
          zIndex:3,pointerEvents:"none",
        }}/>
      </div>
    </div>
  );
}

/* ─── 上部栞タブ（右上にまとめ、右=最初のページの栞） ─── */
function TopBookmarkTabs({ bookmarks, onJump }) {
  if(bookmarks.length===0) return null;
  // page小さい順＝右から並べる（reverseして左から描画）
  const sorted = [...bookmarks].sort((a,b)=>a.page-b.page); // 小→大
  return (
    <div style={{
      position:"absolute",top:0,right:16,zIndex:8,
      display:"flex",flexDirection:"row",gap:4,
      pointerEvents:"none",
    }}>
      {/* 右が最初のページ → sorted[0]が右端 → flex-direction:row-reverseで右から小ページ順 */}
      {[...sorted].reverse().map((bm,i)=>{
        const origIdx = bookmarks.indexOf(bm);
        const color = BM_COLORS[origIdx] ?? BM_COLORS[0];
        return (
          <div key={i}
            onClick={e=>{e.stopPropagation();onJump(bm.page);}}
            title={`栞${origIdx+1}：${bm.page+1}ページ`}
            style={{
              width:16,height:20,
              background:color,
              borderRadius:"0 0 3px 3px",
              cursor:"pointer",pointerEvents:"all",
              boxShadow:"0 1px 4px rgba(0,0,0,0.22)",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
            <div style={{width:4,height:4,background:"rgba(255,255,255,0.55)",borderRadius:"50%"}}/>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Amazonダイアログ ─── */
function AmazonModal({ book, onClose }) {
  const url = `https://www.amazon.co.jp/s?k=${encodeURIComponent(book.author+" "+book.title)}`;
  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:300,background:"rgba(20,10,0,0.48)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"#f7f2e8",border:"1px solid #c0a880",padding:"22px 22px 18px",maxWidth:320,width:"88%",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",fontFamily:"'Noto Serif JP','Yu Mincho',serif"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a0800",marginBottom:4}}>{book.title}</div>
        <div style={{fontSize:11,color:"#7a6040",marginBottom:16}}>{book.author}</div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{display:"block",background:"#2a1800",color:"#f7f2e8",textDecoration:"none",padding:"10px 16px",textAlign:"center",fontSize:13,letterSpacing:"0.08em",marginBottom:14}}>
          Amazonで紙の本を探す
        </a>
        <div style={{fontSize:9,color:"#9a8060",lineHeight:1.75,letterSpacing:"0.04em",borderTop:"1px solid #d8c8a8",paddingTop:10}}>
          Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
        </div>
        <button onClick={onClose}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#9a8060",marginTop:10,width:"100%",textAlign:"center",letterSpacing:"0.1em"}}>
          閉じる
        </button>
      </div>
    </div>
  );
}

/* ─── HTMLページ分割 ─── */
// HTML内のベース文字数で分割—<ruby>内の<rt>・<rp>はカウントしない、<ruby>元素の途中で分割しない
function splitHtmlAtChar(html, n) {
  let count = 0, i = 0;
  let inTag = false, skipContent = false, tagBuf = '', rubyDepth = 0;
  while (i < html.length) {
    const ch = html[i];
    if (!inTag && ch === '<') { inTag = true; tagBuf = '<'; i++; continue; }
    if (inTag) {
      tagBuf += ch;
      if (ch === '>') {
        inTag = false;
        if (/^<ruby[\s>]/i.test(tagBuf)) rubyDepth++;
        if (/^<\/ruby>/i.test(tagBuf)) rubyDepth--;
        if (/^<r[tp][\s>]/i.test(tagBuf)) skipContent = true;
        if (/^<\/r[tp]>/i.test(tagBuf)) skipContent = false;
        tagBuf = '';
      }
      i++; continue;
    }
    if (!skipContent) {
      count++;
      if (count >= n && rubyDepth === 0) return i + 1;
    }
    i++;
  }
  return i;
}

/* ─── ページ分割 ─── */
function paginateText(html, w, h, fontSize) {
  const usableH = h - 80;   // padding 40px × 上下
  const usableW = w - 48;   // padding 24px × 左右
  const lineH   = fontSize * 2.25;  // 縦方向：1文字が占める高さ
  const colW    = fontSize;          // 横方向：1文字が占める幅（CJKは正方形）
  const charsPerCol = Math.max(1, Math.floor(usableH / lineH));
  const colsPerPage = Math.max(1, Math.floor(usableW / colW));
  const cpp         = Math.max(1, charsPerCol * colsPerPage);
  const pages = [];
  let pos = 0;
  while (pos < html.length) {
    const len = splitHtmlAtChar(html.slice(pos), cpp);
    if (len === 0) break;
    pages.push(html.slice(pos, pos + len));
    pos += len;
  }
  return pages.length > 0 ? pages : [""];
}

/* ─── リーダー ─── */
function PageReader({ book, text, onClose, fontSize, setFontSize }) {
  const initPages = ()=> paginateText(text, window.innerWidth, window.innerHeight, fontSize);
  const [pages,setPages]           = useState(initPages);
  const [page,setPage]             = useState(0);
  const [bookmarks,setBookmarks]   = useState([]);
  const [lastRead,setLastRead]     = useState(null);
  const [overlay,setOverlay]       = useState(false);
  const [miniSeek,setMiniSeek]     = useState(false);
  const [amazonModal,setAmazonModal] = useState(false);

  const containerRef = useRef(null);
  const touchStart   = useRef(null);
  const didSwipe     = useRef(false);

  // フォントサイズ・テキスト変更時にページを再計算
  useEffect(()=>{
    const el = containerRef.current;
    const w  = el ? el.clientWidth  : window.innerWidth;
    const h  = el ? el.clientHeight : window.innerHeight;
    const np = paginateText(text, w, h, fontSize);
    setPages(np);
    setPage(p => Math.min(p, Math.max(0, np.length - 1)));
  }, [text, fontSize]);

  const totalPages = pages.length;
  const nextP = ()=>setPage(p=>Math.min(p+1,totalPages-1));
  const prevP = ()=>setPage(p=>Math.max(p-1,0));
  const FS = [13,16,19,22];

  // タッチ判定
  function onTS(e){ touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; didSwipe.current=false; }
  function onTM(e){ if(touchStart.current&&Math.abs(e.touches[0].clientX-touchStart.current.x)>10) didSwipe.current=true; }
  function onTE(e){
    if(!touchStart.current) return;
    const dx=e.changedTouches[0].clientX-touchStart.current.x;
    const dy=e.changedTouches[0].clientY-touchStart.current.y;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){
      // 右スワイプ=次ページ、左スワイプ=前ページ
      dx>0 ? nextP() : prevP();
    } else if(!didSwipe.current&&Math.abs(dx)<12&&Math.abs(dy)<12){
      setOverlay(v=>!v); setMiniSeek(false);
    }
    touchStart.current=null;
  }

  const hasBmHere = !!bookmarks.find(b=>b.page===page);
  function addBm(){ if(bookmarks.length>=MAX_BM||hasBmHere) return; setBookmarks(prev=>[...prev,{page}].sort((a,b)=>a.page-b.page)); }
  function removeBm(p){ setBookmarks(prev=>prev.filter(b=>b.page!==p)); }
  function jumpBm(p){ setLastRead(page); setPage(p); setOverlay(false); }
  function returnLast(){ if(lastRead!==null){setPage(lastRead);setLastRead(null);} }

  const PB="rgba(248,243,234,0.97)";
  const BC="rgba(192,168,136,0.35)";

  return (
    <div style={{position:"fixed",inset:0,background:"linear-gradient(150deg,#f7f2e8 0%,#ece6d4 100%)",fontFamily:"'Noto Serif JP','Yu Mincho',serif",userSelect:"none"}}>

      {/* 上部栞タブ */}
      <TopBookmarkTabs bookmarks={bookmarks} onJump={jumpBm}/>

      {/* 書名（左上・薄め） */}
      {!overlay&&!miniSeek&&(
        <div style={{position:"absolute",top:26,left:14,zIndex:5,fontSize:10,color:"rgba(90,60,20,0.28)",letterSpacing:"0.1em",pointerEvents:"none"}}>
          {book.title}
        </div>
      )}

      {/* 本文 — pages[page] を直接レンダリング（translateX不要） */}
      <div
        ref={containerRef}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        onClick={()=>{setOverlay(v=>!v);setMiniSeek(false);}}
        style={{position:"absolute",inset:0,overflow:"hidden",cursor:"pointer",
          opacity:overlay?0.16:1,transition:"opacity 0.22s"}}
      >
        <div style={{
          writingMode:"vertical-rl",textOrientation:"mixed",
          height:"100%",width:"100%",overflow:"hidden",
          fontSize,lineHeight:2.25,letterSpacing:"0.08em",color:"#140800",
          whiteSpace:"pre-wrap",
          padding:"40px 24px",
        }} dangerouslySetInnerHTML={{__html: pages[page]}}></div>
      </div>

      {/* ノンブル（タップでミニシークバー） */}
      {!overlay&&(
        <div
          onClick={e=>{e.stopPropagation();setMiniSeek(v=>!v);}}
          style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center",
            fontSize:10,color:"rgba(90,60,20,0.35)",letterSpacing:"0.15em",cursor:"pointer",zIndex:5}}
        >
          {page+1} / {totalPages}
        </div>
      )}

      {/* ミニシークバー */}
      {miniSeek&&!overlay&&(
        <div onClick={e=>e.stopPropagation()}
          style={{position:"absolute",bottom:30,left:16,right:16,zIndex:12,
            background:PB,border:`1px solid ${BC}`,padding:"12px 14px 10px",
            boxShadow:"0 2px 16px rgba(0,0,0,0.1)"}}>
          <Seekbar page={page} totalPages={totalPages} bookmarks={bookmarks} onSeek={p=>setPage(p)}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:8.5,color:"rgba(80,50,20,0.38)"}}>
            <span>{totalPages}p（末）</span>
            {[...bookmarks].sort((a,b)=>b.page-a.page).map((bm,i)=>{
              const oi=bookmarks.indexOf(bm);
              return <span key={i} style={{color:BM_COLORS[oi]}}>栞{oi+1}:{bm.page+1}p</span>;
            })}
            {lastRead!==null&&<span style={{color:"#aaa"}}>読:{lastRead+1}p</span>}
            <span>1p（頭）</span>
          </div>
        </div>
      )}

      {/* オーバーレイ（設定パネル） */}
      {overlay&&(
        <div style={{position:"absolute",inset:0,zIndex:20,display:"flex",flexDirection:"column"}}
          onClick={()=>setOverlay(false)}>
          {/* 上部バー */}
          <div onClick={e=>e.stopPropagation()}
            style={{background:PB,borderBottom:`1px solid ${BC}`,padding:"10px 14px",
              display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <button onClick={onClose}
              style={{background:"none",border:`1px solid #c0a880`,cursor:"pointer",padding:"5px 12px",
                color:"#5a3a18",fontSize:11,letterSpacing:"0.08em",whiteSpace:"nowrap"}}>本を閉じる</button>
            <span style={{fontSize:13,fontWeight:700,color:"#1a0800",letterSpacing:"0.06em",flex:1}}>{book.title}</span>
            <button onClick={()=>setAmazonModal(true)}
              style={{background:"none",border:`1px solid #c0a880`,cursor:"pointer",padding:"5px 12px",
                color:"#7a6040",fontSize:10,letterSpacing:"0.05em",whiteSpace:"nowrap"}}>紙の本を探す</button>
          </div>
          {/* 中央透過（タップで閉じる） */}
          <div style={{flex:1}}/>
          {/* 下部設定 */}
          <div onClick={e=>e.stopPropagation()}
            style={{background:PB,borderTop:`1px solid ${BC}`,padding:"16px 16px 32px"}}>
            {/* 文字サイズ */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontSize:10,color:"#9a8060",letterSpacing:"0.1em",minWidth:58}}>文字サイズ</span>
              <div style={{display:"flex",gap:4}}>
                {FS.map(s=>(
                  <button key={s} onClick={()=>setFontSize(s)}
                    style={{width:38,height:34,
                      background:fontSize===s?"#2a1800":"transparent",
                      color:fontSize===s?"#f7f2e8":"#5a4030",
                      border:`1px solid #c0a880`,cursor:"pointer",
                      fontSize:s*0.68,fontFamily:"'Noto Serif JP','Yu Mincho',serif",
                      transition:"all 0.12s"}}>あ</button>
                ))}
              </div>
            </div>
            {/* 栞操作 */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              <span style={{fontSize:10,color:"#9a8060",letterSpacing:"0.1em",minWidth:58}}>栞</span>
              {bookmarks.map((bm,i)=>(
                <button key={i} onClick={()=>jumpBm(bm.page)}
                  style={{background:BM_COLORS[i],color:"#f7f2e8",border:"none",
                    padding:"5px 11px",cursor:"pointer",fontSize:10,letterSpacing:"0.06em",borderRadius:2}}>
                  {i+1}: {bm.page+1}p
                </button>
              ))}
              {bookmarks.length<MAX_BM&&!hasBmHere&&(
                <button onClick={addBm}
                  style={{background:"none",border:`1px solid #c0a880`,color:"#5a4030",
                    padding:"5px 11px",cursor:"pointer",fontSize:10,letterSpacing:"0.06em"}}>
                  ＋ 挟む
                </button>
              )}
              {hasBmHere&&(
                <button onClick={()=>removeBm(page)}
                  style={{background:"none",border:`1px solid #c0a880`,color:"#8a5040",
                    padding:"5px 11px",cursor:"pointer",fontSize:10,letterSpacing:"0.06em"}}>
                  ✕ 外す
                </button>
              )}
              {lastRead!==null&&(
                <button onClick={returnLast}
                  style={{background:"none",border:"1px dashed #b0906a",color:"#7a6050",
                    padding:"5px 11px",cursor:"pointer",fontSize:10,letterSpacing:"0.06em"}}>
                  ← 読んでいたページへ
                </button>
              )}
            </div>
            {/* シークバー */}
            <div>
              <div style={{fontSize:10,color:"#9a8060",marginBottom:4,letterSpacing:"0.1em"}}>{page+1} / {totalPages} ページ</div>
              <Seekbar page={page} totalPages={totalPages} bookmarks={bookmarks} onSeek={p=>setPage(p)}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:8,color:"rgba(80,50,20,0.35)"}}>
                <span>{totalPages}p（末）</span>
                {[...bookmarks].sort((a,b)=>b.page-a.page).map((bm,i)=>{
                  const oi=bookmarks.indexOf(bm);
                  return <span key={i} style={{color:BM_COLORS[oi]}}>栞{oi+1}:{bm.page+1}p</span>;
                })}
                {lastRead!==null&&<span style={{color:"#bbb"}}>読:{lastRead+1}p</span>}
                <span>1p（頭）</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {amazonModal&&<AmazonModal book={book} onClose={()=>setAmazonModal(false)}/>}
    </div>
  );
}

/* ─── データ ─── */
const POPULAR = [
  {id:1,title:"こころ",author:"夏目漱石"},
  {id:2,title:"坊っちゃん",author:"夏目漱石"},
  {id:3,title:"羅生門",author:"芥川龍之介"},
  {id:4,title:"走れメロス",author:"太宰治"},
  {id:5,title:"銀河鉄道の夜",author:"宮沢賢治"},
  {id:6,title:"山月記",author:"中島敦"},
  {id:7,title:"人間失格",author:"太宰治"},
  {id:8,title:"伊豆の踊子",author:"川端康成"},
  {id:9,title:"雪国",author:"川端康成"},
  {id:10,title:"舞姫",author:"森鴎外"},
  {id:11,title:"たけくらべ",author:"樋口一葉"},
  {id:12,title:"檸檬",author:"梶井基次郎"},
];
const SEARCH_POOL = [
  ...POPULAR,
  {id:13,title:"藪の中",author:"芥川龍之介"},
  {id:14,title:"高瀬舟",author:"森鴎外"},
  {id:15,title:"風立ちぬ",author:"堀辰雄"},
  {id:16,title:"蜘蛛の糸",author:"芥川龍之介"},
  {id:17,title:"城の崎にて",author:"志賀直哉"},
];
const SANGETSUKI_TEXT = `<ruby>隴西<rt>ろうさい</rt></ruby>の<ruby>李徴<rt>りちょう</rt></ruby>は博学<ruby>才穎<rt>さいえい</rt></ruby>、天宝の末年、若くして名を<ruby>虎榜<rt>こぼう</rt></ruby>に連ね、ついで<ruby>江南尉<rt>こうなんい</rt></ruby>に補せられたが、性、<ruby>狷介<rt>けんかい</rt></ruby>、<ruby>自<rt>みずか</rt></ruby>ら<ruby>恃<rt>たの</rt></ruby>むところ<ruby>頗<rt>すこぶ</rt></ruby>る厚く、<ruby>賤吏<rt>せんり</rt></ruby>に甘んずるを<ruby>潔<rt>いさぎよ</rt></ruby>しとしなかった。いくばくもなく官を退いた後は、<ruby>故山<rt>こざん</rt></ruby>、<ruby><img src="../../../gaiji/1-91/1-91-48.png" alt="※(「埒のつくり＋虎」、第3水準1-91-48)" class="gaiji" />略<rt>かくりゃく</rt></ruby>に<ruby>帰臥<rt>きが</rt></ruby>し、人と<ruby>交<rt>まじわり</rt></ruby>を絶って、ひたすら詩作に<ruby>耽<rt>ふけ</rt></ruby>った。下吏となって長く<ruby>膝<rt>ひざ</rt></ruby>を俗悪な大官の前に屈するよりは、詩家としての名を死後百年に<ruby>遺<rt>のこ</rt></ruby>そうとしたのである。しかし、文名は容易に揚らず、生活は日を<ruby>逐<rt>お</rt></ruby>うて苦しくなる。李徴は<ruby>漸<rt>ようや</rt></ruby>く<ruby>焦躁<rt>しょうそう</rt></ruby>に駆られて来た。この<ruby>頃<rt>ころ</rt></ruby>からその<ruby>容貌<rt>ようぼう</rt></ruby>も<ruby>峭刻<rt>しょうこく</rt></ruby>となり、肉落ち骨<ruby>秀<rt>ひい</rt></ruby>で、眼光のみ<ruby>徒<rt>いたず</rt></ruby>らに<ruby>炯々<rt>けいけい</rt></ruby>として、<ruby>曾<rt>かつ</rt></ruby>て進士に<ruby>登第<rt>とうだい</rt></ruby>した頃の<ruby>豊頬<rt>ほうきょう</rt></ruby>の美少年の<ruby>俤<rt>おもかげ</rt></ruby>は、<ruby>何処<rt>どこ</rt></ruby>に求めようもない。数年の後、貧窮に<ruby>堪<rt>た</rt></ruby>えず、妻子の衣食のために<ruby>遂<rt>つい</rt></ruby>に節を屈して、再び東へ赴き、一地方官吏の職を奉ずることになった。一方、これは、<ruby>己<rt>おのれ</rt></ruby>の詩業に半ば絶望したためでもある。曾ての同輩は既に<ruby>遥<rt>はる</rt></ruby>か高位に進み、彼が昔、鈍物として<ruby>歯牙<rt>しが</rt></ruby>にもかけなかったその連中の下命を拝さねばならぬことが、往年の<ruby>儁才<rt>しゅんさい</rt></ruby>李徴の自尊心を<ruby>如何<rt>いか</rt></ruby>に<ruby>傷<rt>きずつ</rt></ruby>けたかは、想像に<ruby>難<rt>かた</rt></ruby>くない。彼は<ruby>怏々<rt>おうおう</rt></ruby>として楽しまず、<ruby>狂悖<rt>きょうはい</rt></ruby>の性は<ruby>愈々<rt>いよいよ</rt></ruby>抑え<ruby>難<rt>がた</rt></ruby>くなった。一年の後、公用で旅に出、<ruby>汝水<rt>じょすい</rt></ruby>のほとりに宿った時、遂に発狂した。<ruby>或<rt>ある</rt></ruby>夜半、急に顔色を変えて寝床から起上ると、何か訳の分らぬことを叫びつつそのまま下にとび下りて、<ruby>闇<rt>やみ</rt></ruby>の中へ<ruby>駈出<rt>かけだ</rt></ruby>した。彼は二度と<ruby>戻<rt>もど</rt></ruby>って来なかった。附近の山野を捜索しても、何の手掛りもない。その後李徴がどうなったかを知る者は、<ruby>誰<rt>だれ</rt></ruby>もなかった。
翌年、<ruby>監察御史<rt>かんさつぎょし</rt></ruby>、<ruby>陳郡<rt>ちんぐん</rt></ruby>の<ruby>袁<img src="../../../gaiji/2-01/2-01-79.png" alt="※(「にんべん＋參」、第4水準2-1-79)" class="gaiji" /><rt>えんさん</rt></ruby>という者、勅命を奉じて<ruby>嶺南<rt>れいなん</rt></ruby>に<ruby>使<rt>つかい</rt></ruby>し、<ruby>途<rt>みち</rt></ruby>に<ruby>商於<rt>しょうお</rt></ruby>の地に宿った。次の朝<ruby>未<rt>ま</rt></ruby>だ暗い<ruby>中<rt>うち</rt></ruby>に出発しようとしたところ、駅吏が言うことに、これから先の道に<ruby>人喰虎<rt>ひとくいどら</rt></ruby>が出る<ruby>故<rt>ゆえ</rt></ruby>、旅人は白昼でなければ、通れない。今はまだ朝が早いから、今少し待たれたが<ruby>宜<rt>よろ</rt></ruby>しいでしょうと。袁傪は、しかし、<ruby>供廻<rt>ともまわ</rt></ruby>りの多勢なのを恃み、駅吏の言葉を<ruby>斥<rt>しりぞ</rt></ruby>けて、出発した。残月の光をたよりに林中の草地を通って行った時、果して一匹の<ruby>猛虎<rt>もうこ</rt></ruby>が<ruby>叢<rt>くさむら</rt></ruby>の中から躍り出た。虎は、あわや袁傪に躍りかかるかと見えたが、<ruby>忽<rt>たちま</rt></ruby>ち身を<ruby>飜<rt>ひるがえ</rt></ruby>して、元の叢に隠れた。叢の中から人間の声で「あぶないところだった」と繰返し<ruby>呟<rt>つぶや</rt></ruby>くのが聞えた。その声に袁傪は聞き<ruby>憶<rt>おぼ</rt></ruby>えがあった。<ruby>驚懼<rt>きょうく</rt></ruby>の中にも、彼は<ruby>咄嗟<rt>とっさ</rt></ruby>に思いあたって、叫んだ。「その声は、我が友、李徴子ではないか？」袁傪は李徴と同年に進士の第に登り、友人の少かった李徴にとっては、最も親しい友であった。温和な袁傪の性格が、<ruby>峻峭<rt>しゅんしょう</rt></ruby>な李徴の性情と衝突しなかったためであろう。
叢の中からは、<ruby>暫<rt>しばら</rt></ruby>く返辞が無かった。しのび泣きかと思われる<ruby>微<rt>かす</rt></ruby>かな声が時々<ruby>洩<rt>も</rt></ruby>れるばかりである。ややあって、低い声が答えた。「如何にも自分は隴西の李徴である」と。
袁傪は恐怖を忘れ、馬から下りて叢に近づき、<ruby>懐<rt>なつ</rt></ruby>かしげに<ruby>久闊<rt>きゅうかつ</rt></ruby>を叙した。そして、<ruby>何故<rt>なぜ</rt></ruby>叢から出て来ないのかと問うた。李徴の声が答えて言う。自分は今や異類の身となっている。どうして、おめおめと<ruby>故人<rt>とも</rt></ruby>の前にあさましい姿をさらせようか。かつ又、自分が姿を現せば、必ず君に<ruby>畏怖嫌厭<rt>いふけんえん</rt></ruby>の情を起させるに決っているからだ。しかし、今、図らずも故人に<ruby>遇<rt>あ</rt></ruby>うことを得て、<ruby>愧赧<rt>きたん</rt></ruby>の念をも忘れる程に懐かしい。どうか、ほんの暫くでいいから、我が醜悪な今の外形を<ruby>厭<rt>いと</rt></ruby>わず、曾て君の友李徴であったこの自分と話を交してくれないだろうか。
後で考えれば不思議だったが、その時、袁傪は、この超自然の怪異を、実に素直に<ruby>受容<rt>うけい</rt></ruby>れて、少しも怪もうとしなかった。彼は部下に命じて行列の進行を<ruby>停<rt>と</rt></ruby>め、自分は叢の<ruby>傍<rt>かたわら</rt></ruby>に立って、見えざる声と対談した。都の<ruby>噂<rt>うわさ</rt></ruby>、旧友の消息、袁傪が現在の地位、それに対する李徴の祝辞。青年時代に親しかった者同志の、あの隔てのない語調で、それ<ruby>等<rt>ら</rt></ruby>が語られた後、袁傪は、李徴がどうして今の身となるに至ったかを<ruby>訊<rt>たず</rt></ruby>ねた。草中の声は次のように語った。
今から一年程前、自分が旅に出て汝水のほとりに泊った夜のこと、一睡してから、ふと<ruby>眼<rt>め</rt></ruby>を覚ますと、戸外で誰かが我が名を呼んでいる。声に応じて外へ出て見ると、声は闇の中から<ruby>頻<rt>しき</rt></ruby>りに自分を招く。覚えず、自分は声を追うて走り出した。無我夢中で駈けて行く中に、<ruby>何時<rt>いつ</rt></ruby>しか途は山林に入り、しかも、知らぬ間に自分は左右の手で地を<ruby>攫<rt>つか</rt></ruby>んで走っていた。何か<ruby>身体<rt>からだ</rt></ruby>中に力が<ruby>充<rt>み</rt></ruby>ち満ちたような感じで、軽々と岩石を跳び越えて行った。気が付くと、手先や<ruby>肱<rt>ひじ</rt></ruby>のあたりに毛を生じているらしい。少し明るくなってから、谷川に臨んで姿を映して見ると、既に虎となっていた。自分は初め眼を信じなかった。次に、これは夢に違いないと考えた。夢の中で、これは夢だぞと知っているような夢を、自分はそれまでに見たことがあったから。どうしても夢でないと悟らねばならなかった時、自分は<ruby>茫然<rt>ぼうぜん</rt></ruby>とした。そうして<ruby>懼<rt>おそ</rt></ruby>れた。全く、どんな事でも起り得るのだと思うて、深く懼れた。しかし、何故こんな事になったのだろう。分らぬ。全く何事も我々には<ruby>判<rt>わか</rt></ruby>らぬ。理由も分らずに押付けられたものを大人しく受取って、理由も分らずに生きて行くのが、我々生きもののさだめだ。自分は<ruby>直<rt>す</rt></ruby>ぐに死を<ruby>想<rt>おも</rt></ruby>うた。しかし、その時、眼の前を一匹の<ruby>兎<rt>うさぎ</rt></ruby>が駈け過ぎるのを見た途端に、自分の中の人間は忽ち姿を消した。再び自分の中の人間が目を覚ました時、自分の口は兎の血に<ruby>塗<rt>まみ</rt></ruby>れ、あたりには兎の毛が散らばっていた。これが虎としての最初の経験であった。それ以来今までにどんな所行をし続けて来たか、それは到底語るに忍びない。ただ、一日の中に必ず数時間は、人間の心が<ruby>還<rt>かえ</rt></ruby>って来る。そういう時には、曾ての日と同じく、人語も<ruby>操<rt>あやつ</rt></ruby>れれば、複雑な思考にも堪え得るし、<ruby>経書<rt>けいしょ</rt></ruby>の章句を<ruby>誦<rt>そら</rt></ruby>んずることも出来る。その人間の心で、虎としての<ruby>己<rt>おのれ</rt></ruby>の<ruby>残虐<rt>ざんぎゃく</rt></ruby>な<ruby>行<rt>おこない</rt></ruby>のあとを見、己の運命をふりかえる時が、最も情なく、恐しく、<ruby>憤<rt>いきどお</rt></ruby>ろしい。しかし、その、人間にかえる数時間も、日を経るに従って次第に短くなって行く。今までは、どうして虎などになったかと怪しんでいたのに、この間ひょいと気が付いて見たら、<ruby>己<rt>おれ</rt></ruby>はどうして以前、人間だったのかと考えていた。これは恐しいことだ。今少し<ruby>経<rt>た</rt></ruby>てば、<ruby>己<rt>おれ</rt></ruby>の中の人間の心は、獣としての習慣の中にすっかり<ruby>埋<rt>うも</rt></ruby>れて消えて<ruby>了<rt>しま</rt></ruby>うだろう。ちょうど、古い宮殿の<ruby>礎<rt>いしずえ</rt></ruby>が次第に土砂に埋没するように。そうすれば、しまいに己は自分の過去を忘れ果て、一匹の虎として狂い廻り、今日のように途で君と出会っても<ruby>故人<rt>とも</rt></ruby>と認めることなく、君を裂き<ruby>喰<rt>くろ</rt></ruby>うて何の悔も感じないだろう。一体、獣でも人間でも、もとは何か<ruby>他<rt>ほか</rt></ruby>のものだったんだろう。初めはそれを憶えているが、次第に忘れて了い、初めから今の形のものだったと思い込んでいるのではないか？　いや、そんな事はどうでもいい。己の中の人間の心がすっかり消えて了えば、恐らく、その方が、己はしあわせになれるだろう。だのに、己の中の人間は、その事を、この上なく恐しく感じているのだ。ああ、全く、どんなに、恐しく、<ruby>哀<rt>かな</rt></ruby>しく、切なく思っているだろう！　己が人間だった記憶のなくなることを。この気持は誰にも分らない。誰にも分らない。己と同じ身の上に成った者でなければ。ところで、そうだ。己がすっかり人間でなくなって了う前に、一つ頼んで置きたいことがある。
袁傪はじめ一行は、息をのんで、<ruby>叢中<rt>そうちゅう</rt></ruby>の声の語る不思議に聞入っていた。声は続けて言う。
他でもない。自分は元来詩人として名を成す積りでいた。しかも、業<ruby>未<rt>いま</rt></ruby>だ成らざるに、この運命に立至った。曾て作るところの詩数百<ruby>篇<rt>ぺん</rt></ruby>、<ruby>固<rt>もと</rt></ruby>より、まだ世に行われておらぬ。遺稿の所在も<ruby>最早<rt>もはや</rt></ruby>判らなくなっていよう。ところで、その中、今も<ruby>尚<rt>なお</rt></ruby><ruby>記誦<rt>きしょう</rt></ruby>せるものが数十ある。これを我が<ruby>為<rt>ため</rt></ruby>に伝録して<ruby>戴<rt>いただ</rt></ruby>きたいのだ。何も、これに<ruby>仍<rt>よ</rt></ruby>って一人前の詩人<ruby>面<rt>づら</rt></ruby>をしたいのではない。作の巧拙は知らず、とにかく、産を破り心を狂わせてまで自分が<ruby>生涯<rt>しょうがい</rt></ruby>それに執着したところのものを、一部なりとも後代に伝えないでは、死んでも死に切れないのだ。
袁傪は部下に命じ、筆を執って叢中の声に<ruby>随<rt>したが</rt></ruby>って書きとらせた。李徴の声は叢の中から朗々と響いた。長短<ruby>凡<rt>およ</rt></ruby>そ三十篇、格調高雅、意趣卓逸、一読して作者の才の非凡を思わせるものばかりである。しかし、袁傪は感嘆しながらも<ruby>漠然<rt>ばくぜん</rt></ruby>と次のように感じていた。<ruby>成程<rt>なるほど</rt></ruby>、作者の素質が第一流に属するものであることは疑いない。しかし、このままでは、第一流の作品となるのには、<ruby>何処<rt>どこ</rt></ruby>か（非常に微妙な点に<ruby>於<rt>おい</rt></ruby>て）欠けるところがあるのではないか、と。
旧詩を吐き終った李徴の声は、突然調子を変え、自らを<ruby>嘲<rt>あざけ</rt></ruby>るか<ruby>如<rt>ごと</rt></ruby>くに言った。
<ruby>羞<rt>はずか</rt></ruby>しいことだが、今でも、こんなあさましい身と成り果てた今でも、<ruby>己<rt>おれ</rt></ruby>は、己の詩集が<ruby>長安<rt>ちょうあん</rt></ruby>風流人士の机の上に置かれている様を、夢に見ることがあるのだ。<ruby>岩窟<rt>がんくつ</rt></ruby>の中に横たわって見る夢にだよ。<ruby>嗤<rt>わら</rt></ruby>ってくれ。詩人に成りそこなって虎になった哀れな男を。（袁傪は昔の青年李徴の<ruby>自嘲癖<rt>じちょうへき</rt></ruby>を思出しながら、哀しく聞いていた。）そうだ。お笑い草ついでに、今の<ruby>懐<rt>おもい</rt></ruby>を即席の詩に述べて見ようか。この虎の中に、まだ、曾ての李徴が生きているしるしに。
袁傪は又下吏に命じてこれを書きとらせた。その詩に言う。
偶因狂疾成殊類　災患相仍不可逃
今日爪牙誰敢敵　当時声跡共相高
我為異物蓬茅下　君已乗気勢豪
此夕渓山対明月　不成長嘯但成
時に、残月、光<ruby>冷<rt>ひや</rt></ruby>やかに、白露は地に<ruby>滋<rt>しげ</rt></ruby>く、樹間を渡る冷風は既に暁の近きを告げていた。人々は最早、事の奇異を忘れ、粛然として、この詩人の<ruby>薄倖<rt>はっこう</rt></ruby>を嘆じた。李徴の声は再び続ける。
<ruby>何故<rt>なぜ</rt></ruby>こんな運命になったか判らぬと、先刻は言ったが、しかし、考えように<ruby>依<rt>よ</rt></ruby>れば、思い当ることが全然ないでもない。人間であった時、<ruby>己<rt>おれ</rt></ruby>は努めて人との<ruby>交<rt>まじわり</rt></ruby>を避けた。人々は己を<ruby>倨傲<rt>きょごう</rt></ruby>だ、尊大だといった。実は、それが<ruby>殆<rt>ほとん</rt></ruby>ど<ruby>羞恥心<rt>しゅうちしん</rt></ruby>に近いものであることを、人々は知らなかった。<ruby>勿論<rt>もちろん</rt></ruby>、曾ての<ruby>郷党<rt>きょうとう</rt></ruby>の鬼才といわれた自分に、自尊心が無かったとは<ruby>云<rt>い</rt></ruby>わない。しかし、それは<ruby>臆病<rt>おくびょう</rt></ruby>な自尊心とでもいうべきものであった。己は詩によって名を成そうと思いながら、進んで師に就いたり、求めて詩友と交って<ruby>切磋琢磨<rt>せっさたくま</rt></ruby>に努めたりすることをしなかった。かといって、又、己は俗物の間に<ruby>伍<rt>ご</rt></ruby>することも<ruby>潔<rt>いさぎよ</rt></ruby>しとしなかった。共に、我が臆病な自尊心と、尊大な羞恥心との<ruby>所為<rt>せい</rt></ruby>である。<ruby>己<rt>おのれ</rt></ruby>の<ruby>珠<rt>たま</rt></ruby>に<ruby>非<rt>あら</rt></ruby>ざることを<ruby>惧<rt>おそ</rt></ruby>れるが<ruby>故<rt>ゆえ</rt></ruby>に、<ruby>敢<rt>あえ</rt></ruby>て刻苦して<ruby>磨<rt>みが</rt></ruby>こうともせず、又、己の珠なるべきを半ば信ずるが故に、<ruby>碌々<rt>ろくろく</rt></ruby>として<ruby>瓦<rt>かわら</rt></ruby>に伍することも出来なかった。<ruby>己<rt>おれ</rt></ruby>は次第に世と離れ、人と遠ざかり、<ruby>憤悶<rt>ふんもん</rt></ruby>と<ruby>慙恚<rt>ざんい</rt></ruby>とによって<ruby>益々<rt>ますます</rt></ruby><ruby>己<rt>おのれ</rt></ruby>の内なる臆病な自尊心を飼いふとらせる結果になった。人間は誰でも猛獣使であり、その猛獣に当るのが、各人の性情だという。<ruby>己<rt>おれ</rt></ruby>の場合、この尊大な羞恥心が猛獣だった。虎だったのだ。これが己を損い、妻子を苦しめ、友人を傷つけ、果ては、己の外形をかくの如く、内心にふさわしいものに変えて了ったのだ。今思えば、全く、己は、己の<ruby>有<rt>も</rt></ruby>っていた<ruby>僅<rt>わず</rt></ruby>かばかりの才能を空費して了った訳だ。人生は何事をも<ruby>為<rt>な</rt></ruby>さぬには余りに長いが、何事かを為すには余りに短いなどと口先ばかりの警句を<ruby>弄<rt>ろう</rt></ruby>しながら、事実は、才能の不足を<ruby>暴露<rt>ばくろ</rt></ruby>するかも知れないとの<ruby>卑怯<rt>ひきょう</rt></ruby>な<ruby>危惧<rt>きぐ</rt></ruby>と、刻苦を<ruby>厭<rt>いと</rt></ruby>う怠惰とが己の<ruby>凡<rt>すべ</rt></ruby>てだったのだ。己よりも遥かに乏しい才能でありながら、それを専一に磨いたがために、堂々たる詩家となった者が幾らでもいるのだ。虎と成り果てた今、己は<ruby>漸<rt>ようや</rt></ruby>くそれに気が付いた。それを思うと、己は今も胸を<ruby>灼<rt>や</rt></ruby>かれるような悔を感じる。己には最早人間としての生活は出来ない。たとえ、今、己が頭の中で、どんな優れた詩を作ったにしたところで、どういう手段で発表できよう。まして、己の頭は<ruby>日毎<rt>ひごと</rt></ruby>に虎に近づいて行く。どうすればいいのだ。己の空費された過去は？　己は<ruby>堪<rt>たま</rt></ruby>らなくなる。そういう時、己は、向うの山の頂の<ruby>巖<rt>いわ</rt></ruby>に上り、<ruby>空谷<rt>くうこく</rt></ruby>に向って<ruby>吼<rt>ほ</rt></ruby>える。この胸を灼く悲しみを誰かに訴えたいのだ。己は昨夕も、<ruby>彼処<rt>あそこ</rt></ruby>で月に向って<ruby>咆<rt>ほ</rt></ruby>えた。誰かにこの苦しみが分って<ruby>貰<rt>もら</rt></ruby>えないかと。しかし、獣どもは己の声を聞いて、<ruby>唯<rt>ただ</rt></ruby>、<ruby>懼<rt>おそ</rt></ruby>れ、ひれ伏すばかり。山も<ruby>樹<rt>き</rt></ruby>も月も露も、一匹の虎が怒り狂って、<ruby>哮<rt>たけ</rt></ruby>っているとしか考えない。天に躍り地に伏して嘆いても、誰一人己の気持を分ってくれる者はない。ちょうど、人間だった頃、己の傷つき<ruby>易<rt>やす</rt></ruby>い内心を誰も理解してくれなかったように。己の毛皮の<ruby>濡<rt>ぬ</rt></ruby>れたのは、夜露のためばかりではない。
漸く<ruby>四辺<rt>あたり</rt></ruby>の暗さが薄らいで来た。木の間を伝って、<ruby>何処<rt>どこ</rt></ruby>からか、<ruby>暁角<rt>ぎょうかく</rt></ruby>が哀しげに響き始めた。
最早、別れを告げねばならぬ。酔わねばならぬ時が、（虎に還らねばならぬ時が）近づいたから、と、李徴の声が言った。だが、お別れする前にもう一つ頼みがある。それは我が妻子のことだ。<ruby>彼等<rt>かれら</rt></ruby>は<ruby>未<rt>ま</rt></ruby>だ<ruby><img src="../../../gaiji/1-91/1-91-48.png" alt="※(「埒のつくり＋虎」、第3水準1-91-48)" class="gaiji" />略<rt>かくりゃく</rt></ruby>にいる。固より、己の運命に就いては知る<ruby>筈<rt>はず</rt></ruby>がない。君が南から帰ったら、己は既に死んだと彼等に告げて貰えないだろうか。決して今日のことだけは明かさないで欲しい。厚かましいお願だが、彼等の孤弱を<ruby>憐<rt>あわ</rt></ruby>れんで、今後とも<ruby>道塗<rt>どうと</rt></ruby>に<ruby>飢凍<rt>きとう</rt></ruby>することのないように計らって戴けるならば、自分にとって、<ruby>恩倖<rt>おんこう</rt></ruby>、これに過ぎたるは<ruby>莫<rt>な</rt></ruby>い。
言終って、叢中から<ruby>慟哭<rt>どうこく</rt></ruby>の声が聞えた。袁もまた涙を<ruby>泛<rt>うか</rt></ruby>べ、<ruby>欣<rt>よろこ</rt></ruby>んで李徴の意に<ruby>副<rt>そ</rt></ruby>いたい<ruby>旨<rt>むね</rt></ruby>を答えた。李徴の声はしかし<ruby>忽<rt>たちま</rt></ruby>ち又先刻の自嘲的な調子に<ruby>戻<rt>もど</rt></ruby>って、言った。
本当は、<ruby>先<rt>ま</rt></ruby>ず、この事の方を先にお願いすべきだったのだ、己が人間だったなら。飢え凍えようとする妻子のことよりも、<ruby>己<rt>おのれ</rt></ruby>の乏しい詩業の方を気にかけているような男だから、こんな獣に身を<ruby>堕<rt>おと</rt></ruby>すのだ。
そうして、<ruby>附加<rt>つけくわ</rt></ruby>えて言うことに、袁傪が嶺南からの帰途には決してこの<ruby>途<rt>みち</rt></ruby>を通らないで欲しい、その時には自分が酔っていて<ruby>故人<rt>とも</rt></ruby>を認めずに襲いかかるかも知れないから。又、今別れてから、前方百歩の所にある、あの丘に上ったら、<ruby>此方<rt>こちら</rt></ruby>を振りかえって見て貰いたい。自分は今の姿をもう一度お目に掛けよう。勇に誇ろうとしてではない。我が醜悪な姿を示して、<ruby>以<rt>もっ</rt></ruby>て、再び<ruby>此処<rt>ここ</rt></ruby>を過ぎて自分に会おうとの気持を君に起させない為であると。
袁傪は叢に向って、<ruby>懇<rt>ねんご</rt></ruby>ろに別れの言葉を述べ、馬に上った。叢の中からは、又、<ruby>堪<rt>た</rt></ruby>え得ざるが如き<ruby>悲泣<rt>ひきゅう</rt></ruby>の声が<ruby>洩<rt>も</rt></ruby>れた。袁傪も幾度か叢を振返りながら、涙の中に出発した。
一行が丘の上についた時、彼等は、言われた通りに振返って、先程の林間の草地を<ruby>眺<rt>なが</rt></ruby>めた。忽ち、一匹の虎が草の茂みから道の上に躍り出たのを彼等は見た。虎は、既に白く光を失った月を仰いで、二声三声<ruby>咆哮<rt>ほうこう</rt></ruby>したかと思うと、又、元の叢に躍り入って、再びその姿を見なかった。`;
const BOOK_TEXTS = { 6: SANGETSUKI_TEXT };

/* ─── 読みたいボタン ─── */
function WantBtn({ id, wantList, toggle }) {
  const on = wantList.includes(id);
  return (
    <button onClick={e=>{e.stopPropagation();toggle(id);}}
      style={{background:"none",border:"none",cursor:"pointer",padding:"2px 4px",
        fontSize:16,lineHeight:1,color:on?"#8a5a20":"rgba(130,100,60,0.25)",transition:"color 0.15s"}}>
      {on?"★":"☆"}
    </button>
  );
}

/* ─── メインアプリ ─── */
export default function App() {
  useEffect(()=>{
    if(document.getElementById("nsjp")) return;
    const l=document.createElement("link");
    l.id="nsjp";l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&display=swap";
    document.head.appendChild(l);
  },[]);

  const [fontSize,setFontSize] = useState(16);
  const [tab,setTab]           = useState("shelf");
  const [shelf,setShelf]       = useState([POPULAR[0],POPULAR[2],POPULAR[3]]);
  const [wantList,setWantList] = useState([]);
  const [reading,setReading]   = useState(null);
  const [query,setQuery]       = useState("");
  const [results,setResults]   = useState(null);
  const [loading,setLoading]   = useState(null);

  function toggleWant(id){ setWantList(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); }
  function save(book){
    if(shelf.length>=MAX_SHELF||shelf.find(b=>b.id===book.id)) return;
    setLoading(book.id);
    setTimeout(()=>{setShelf(p=>[...p,book]);setLoading(null);},650);
  }
  function removeFromShelf(id){ setShelf(prev=>prev.filter(b=>b.id!==id)); }
  function doSearch(e){
    e.preventDefault();
    const q=query.trim();
    setResults(!q?SEARCH_POOL:SEARCH_POOL.filter(b=>b.title.includes(q)||b.author.includes(q)));
  }

  if(reading) return (
    <PageReader book={reading} text={BOOK_TEXTS[reading.id] || SANGETSUKI_TEXT}
      onClose={()=>setReading(null)}
      fontSize={fontSize} setFontSize={setFontSize}/>
  );

  const base={minHeight:"100vh",background:"linear-gradient(150deg,#f7f2e8 0%,#ece6d8 100%)",fontFamily:"'Noto Serif JP','Yu Mincho','Hiragino Mincho Pro',serif"};
  const wantedBooks = SEARCH_POOL.filter(b=>wantList.includes(b.id));

  function SaveBtn({ book }) {
    const saved=!!shelf.find(b=>b.id===book.id);
    const full=shelf.length>=MAX_SHELF;
    const isL=loading===book.id;
    return (
      <button onClick={()=>!saved&&!full&&save(book)} disabled={saved||full||isL}
        style={{background:saved?"transparent":"#2a1800",color:saved?"#9a8060":"#f7f2e8",
          border:"1px solid #c0a880",padding:"5px 12px",fontSize:10,
          cursor:saved||full?"default":"pointer",letterSpacing:"0.08em",
          whiteSpace:"nowrap",opacity:isL?0.5:1}}>
        {isL?"…":saved?"保存済":full?`上限${MAX_SHELF}冊`:"書庫へ"}
      </button>
    );
  }

  return (
    <div style={base}>
      {/* ヘッダー */}
      <div style={{padding:"20px 20px 0",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:9,letterSpacing:"0.4em",color:"#9a8060",marginBottom:3}}>BUNKO BIYORI</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <Shacho size={19} color="#8a6a40" opacity={0.62}/>
            <div style={{fontSize:21,fontWeight:700,color:"#1a0800",letterSpacing:"0.05em"}}>文庫びより</div>
          </div>
        </div>
        <div style={{display:"flex"}}>
          {[["shelf","書庫"],["search","検索"],["wantlist","読みたい"]].map(([s,label])=>(
            <button key={s} onClick={()=>setTab(s)}
              style={{background:tab===s?"#2a1800":"transparent",color:tab===s?"#f7f2e8":"#5a4030",
                border:"1px solid #c0a880",marginLeft:-1,padding:"6px 11px",cursor:"pointer",
                fontSize:10,letterSpacing:"0.1em",transition:"all 0.15s"}}>
              {label}
              {s==="shelf"&&<span style={{fontSize:8,marginLeft:3,opacity:0.5}}>{shelf.length}/{MAX_SHELF}</span>}
              {s==="wantlist"&&wantList.length>0&&<span style={{fontSize:8,marginLeft:3,opacity:0.5}}>{wantList.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"18px 20px 56px"}}>

        {/* ════ 書庫 ════ */}
        {tab==="shelf"&&(
          <>
            <div style={{fontSize:10,letterSpacing:"0.2em",color:"#9a8060",borderBottom:"1px solid #d0b898",paddingBottom:7,marginBottom:18}}>
              オフライン書庫　{shelf.length} 冊 ／ 最大 {MAX_SHELF} 冊
            </div>
            {shelf.length===0?(
              <div style={{textAlign:"center",color:"#9a8060",fontSize:12,letterSpacing:"0.15em",marginTop:48,lineHeight:3}}>
                書庫は空です<br/><span style={{fontSize:10,opacity:0.6}}>検索タブから本を保存できます</span>
              </div>
            ):(
              <>
                <div style={{background:"linear-gradient(180deg,#ddd0b2 0%,#c8b898 100%)",borderRadius:4,padding:"20px 16px 12px",border:"1px solid #b89870",boxShadow:"inset 0 2px 10px rgba(0,0,0,0.1)"}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end",minHeight:80}}>
                    {shelf.map((book,i)=>(
                      <div key={book.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                        <BunkoCover book={book} size="normal" onClick={()=>setReading(book)}
                          badge={i===shelf.length-1&&shelf.length>1?"NEW":null}/>
                        <div style={{display:"flex",alignItems:"center",gap:2}}>
                          <WantBtn id={book.id} wantList={wantList} toggle={toggleWant}/>
                          {/* 本を返すボタン */}
                          <button
                            onClick={e=>{e.stopPropagation();removeFromShelf(book.id);}}
                            title="書庫から返す"
                            style={{background:"none",border:"1px solid rgba(140,110,70,0.35)",
                              color:"rgba(100,70,40,0.5)",cursor:"pointer",
                              fontSize:8,padding:"2px 6px",letterSpacing:"0.05em",
                              transition:"all 0.12s"}}
                            onMouseEnter={e=>{e.currentTarget.style.color="#8a5030";e.currentTarget.style.borderColor="#c0a060";}}
                            onMouseLeave={e=>{e.currentTarget.style.color="rgba(100,70,40,0.5)";e.currentTarget.style.borderColor="rgba(140,110,70,0.35)";}}>
                            返す
                          </button>
                        </div>
                      </div>
                    ))}
                    {Array.from({length:Math.max(0,Math.min(3,MAX_SHELF-shelf.length))}).map((_,i)=>(
                      <div key={`e${i}`} style={{width:94,height:143,border:"1px dashed rgba(140,110,70,0.25)",opacity:0.4}}/>
                    ))}
                  </div>
                  <div style={{height:5,marginTop:10,background:"linear-gradient(180deg,#b09060 0%,#9a7848 100%)",borderRadius:2,boxShadow:"0 2px 4px rgba(0,0,0,0.16)"}}/>
                </div>
                <div style={{marginTop:10,fontSize:10,color:"#9a8060",textAlign:"center",letterSpacing:"0.14em"}}>
                  表紙をタップして読む　★で読みたい一覧へ
                </div>
              </>
            )}
          </>
        )}

        {/* ════ 検索 ════ */}
        {tab==="search"&&(
          <>
            <form onSubmit={doSearch} style={{display:"flex",marginBottom:18}}>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="作品名・著者名で検索"
                style={{flex:1,padding:"10px 14px",border:"1px solid #c0a880",borderRight:"none",
                  background:"rgba(255,255,255,0.6)",fontSize:14,fontFamily:"inherit",outline:"none",color:"#1a0800"}}/>
              <button type="submit" style={{background:"#2a1800",color:"#f7f2e8",border:"none",padding:"10px 16px",cursor:"pointer",fontSize:12,letterSpacing:"0.1em"}}>検索</button>
            </form>

            {results===null&&(
              <>
                <div style={{fontSize:10,letterSpacing:"0.28em",color:"#9a8060",borderBottom:"1px solid #d0b898",paddingBottom:6,marginBottom:16}}>人気ランキング</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
                  {POPULAR.map((book,i)=>{
                    const saved=!!shelf.find(b=>b.id===book.id);
                    const full=shelf.length>=MAX_SHELF;
                    const isL=loading===book.id;
                    return (
                      <div key={book.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                        <div style={{position:"relative"}}>
                          <BunkoCover book={book} size="normal" onClick={()=>setReading(book)}/>
                          <div style={{position:"absolute",top:-5,left:-5,width:19,height:19,
                            background:i<3?"#8a5a30":"#6a5040",color:"#f7f2e8",borderRadius:"50%",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:8,fontWeight:700,boxShadow:"0 1px 4px rgba(0,0,0,0.22)"}}>{i+1}</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:3}}>
                          <WantBtn id={book.id} wantList={wantList} toggle={toggleWant}/>
                          <button onClick={()=>!saved&&!full&&save(book)}
                            style={{background:"none",border:"1px solid #c0a880",
                              color:saved?"#9a8060":"#5a4030",padding:"3px 9px",
                              cursor:saved||full?"default":"pointer",fontSize:9,letterSpacing:"0.05em"}}>
                            {isL?"…":saved?"保存済":full?"満杯":"書庫へ"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {results!==null&&(
              <>
                <div style={{fontSize:10,letterSpacing:"0.2em",color:"#9a8060",borderBottom:"1px solid #d0b898",paddingBottom:6,marginBottom:14}}>
                  {results.length>0?`${results.length} 件`:"見つかりませんでした"}
                  <button onClick={()=>{setResults(null);setQuery("");}}
                    style={{background:"none",border:"none",cursor:"pointer",fontSize:9,color:"#9a8060",marginLeft:10,textDecoration:"underline"}}>
                    ランキングへ戻る
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {results.map(book=>(
                    <div key={book.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"rgba(255,255,255,0.4)",border:"1px solid rgba(192,168,136,0.28)"}}>
                      <BunkoCover book={book} size="small" onClick={()=>setReading(book)}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
                          <div style={{fontSize:14,fontWeight:700,color:"#1a0800"}}>{book.title}</div>
                          <WantBtn id={book.id} wantList={wantList} toggle={toggleWant}/>
                        </div>
                        <div style={{fontSize:11,color:"#7a6040",marginBottom:8}}>{book.author}</div>
                        <button onClick={()=>setReading(book)}
                          style={{background:"none",border:"1px solid #8a6a40",color:"#5a3a18",padding:"4px 12px",cursor:"pointer",fontSize:10,letterSpacing:"0.08em"}}>今すぐ読む</button>
                      </div>
                      <SaveBtn book={book}/>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ════ 読みたい ════ */}
        {tab==="wantlist"&&(
          <>
            <div style={{fontSize:10,letterSpacing:"0.2em",color:"#9a8060",borderBottom:"1px solid #d0b898",paddingBottom:7,marginBottom:18}}>
              読みたい本　{wantedBooks.length} 冊
            </div>
            {wantedBooks.length===0?(
              <div style={{textAlign:"center",color:"#9a8060",fontSize:12,letterSpacing:"0.15em",marginTop:48,lineHeight:3}}>
                まだ登録されていません<br/>
                <span style={{fontSize:10,opacity:0.6}}>ランキングや検索結果の ☆ をタップして追加できます</span>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {wantedBooks.map(book=>(
                  <div key={book.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"rgba(255,255,255,0.4)",border:"1px solid rgba(192,168,136,0.28)"}}>
                    <BunkoCover book={book} size="small" onClick={()=>setReading(book)}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#1a0800"}}>{book.title}</div>
                        <WantBtn id={book.id} wantList={wantList} toggle={toggleWant}/>
                      </div>
                      <div style={{fontSize:11,color:"#7a6040",marginBottom:8}}>{book.author}</div>
                      <button onClick={()=>setReading(book)}
                        style={{background:"none",border:"1px solid #8a6a40",color:"#5a3a18",padding:"4px 12px",cursor:"pointer",fontSize:10,letterSpacing:"0.08em"}}>今すぐ読む</button>
                    </div>
                    <SaveBtn book={book}/>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
