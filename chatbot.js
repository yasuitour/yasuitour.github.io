
// ✅ Yasui Tour Chatbot Popup — Full single-file chatbot.js
// Features:
// - Pre-chat form (name + email) required
// - Saves to localStorage
// - Quick replies + FAQ responses
// - Web3Forms notification includes name/email
// - Sounds, , clear history, logout
// - Single file: paste into site inside a <script> tag or as external JS

document.addEventListener("DOMContentLoaded", () => {
  // Prevent double-insert
  if (document.getElementById("chatPopup")) return;

  // ==========  ==========
  const style = document.createElement("style");
  style.textContent = `
:root{--primary:#00bfa6;--bot-bg:rgba(0,191,166,0.15);--user-bg:rgba(191,240,226,0.3);--chat-bg:rgba(0,0,0,0.75);--text-color:#fff}
.chat-toggle{position:fixed;bottom:20px;right:20px;background:var(--primary);color:white;border:none;width:60px;height:60px;border-radius:50%;font-size:28px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.4);z-index:1001;opacity:0;transform:scale(0.5);animation:fadeBounceIn 1s ease forwards,bubble 2.5s infinite ease-in-out 2s}
@keyframes fadeBounceIn{0%{opacity:0;transform:scale(0.5) translateY(40px)}60%{opacity:1;transform:scale(1.1) translateY(-10px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes bubble{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-6px) scale(1.08)}}
.chat-toggle:hover{transform:scale(1.15);transition:0.2s}
.chat-popup{position:fixed;bottom:90px;right:20px;width:340px;max-height:520px;display:none;flex-direction:column;background:var(--chat-bg);color:var(--text-color);border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,0.6);overflow:hidden;z-index:1000;opacity:0;transform:translateY(30px);transition:all 0.4s ease;backdrop-filter:blur(12px)}
.chat-popup.show{display:flex;opacity:1;transform:translateY(0)}
.chat-header{background:var(--primary);color:white;text-align:center;padding:10px;font-weight:bold;position:relative;font-size:15px}
.chat-header button{position:absolute;right:10px;top:6px;background:transparent;border:none;color:white;font-size:18px;cursor:pointer}
.chat-box{flex:1;padding:12px;overflow-y:auto}
.msg{padding:8px 12px;border-radius:14px;margin:6px 0;display:inline-block;max-width:80%;line-height:1.5;position:relative;word-wrap:break-word;opacity:0;transform:translateY(15px);animation:fadeSlideIn 0.4s ease forwards;color:#fff}
.bot{background:var(--bot-bg);color:#fff;align-self:flex-start;border-bottom-left-radius:4px}
.user{background:var(--user-bg);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
@keyframes fadeSlideIn{0%{opacity:0;transform:translateY(15px)}100%{opacity:1;transform:translateY(0)}}
.date-label{text-align:center;font-size:11px;color:#ddd;margin:10px 0;background:rgba(255,255,255,0.1);padding:4px 0;border-radius:8px;opacity:0;transform:translateY(10px);animation:fadeSlideIn 0.5s ease forwards}
.timestamp{display:block;font-size:10px;color:#bbb;margin-top:3px;text-align:right}
.quick-replies{display:flex;flex-wrap:wrap;gap:6px;padding:6px 10px;background:rgba(255,255,255,0.08);border-top:1px solid rgba(255,255,255,0.15)}
.quick-btn{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);color:#000;border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer;transition:0.3s}
.quick-btn:hover{background:var(--primary);color:white}
.chat-input{display:flex;padding:8px;border-top:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.3)}
.chat-input input{flex:1;padding:8px;border:1px solid rgba(255,255,255,0.3);border-radius:18px;font-size:13px;background:rgba(255,255,255,0.1);color:white}
.chat-input input::placeholder{color:#aaa}
.chat-input button{background:var(--primary);color:white;border:none;margin-left:6px;border-radius:18px;padding:8px 12px;cursor:pointer;transition:transform 0.2s ease}
.chat-input button:active{transform:scale(0.9)}
.line-btn{background:#06c755;color:white;text-align:center;padding:10px;font-weight:bold;cursor:pointer;border-top:1px solid rgba(255,255,255,0.1)}
.line-btn:hover{background:#05b14d}
.clear-btn{background:#ff6b6b;color:white;text-align:center;padding:8px;font-weight:bold;cursor:pointer;border-top:1px solid rgba(255,255,255,0.1)}
.clear-btn:hover{background:#ff4040}
.chat-box::-webkit-scrollbar{width:6px}
.chat-box::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.3);border-radius:3px}
.bot.shake-glow{animation:botShake 0.5s ease;box-shadow:0 0 10px rgba(0,255,180,0.5);border:1px solid rgba(0,255,180,0.3)}
@keyframes botShake{0%,100%{transform:translate(0,0);box-shadow:0 0 6px rgba(0,255,180,0.3)}20%{transform:translate(1px,-1px);box-shadow:0 0 10px rgba(0,255,180,0.4)}40%{transform:translate(-1px,1px);box-shadow:0 0 12px rgba(0,255,180,0.6)}60%{transform:translate(1px,1px);box-shadow:0 0 10px rgba(0,255,180,0.4)}80%{transform:translate(-1px,-1px);box-shadow:0 0 8px rgba(0,255,180,0.3)}}
@keyframes userFadePop{0%{opacity:0;transform:scale(0.8) translateY(10px)}70%{opacity:1;transform:scale(1.05) translateY(0)}100%{opacity:1;transform:scale(1) translateY(0)}}
.user.fade-pop{animation:userFadePop 0.35s ease forwards}
.user-form{display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.12)}
.user-form input{padding:8px;border:1px solid rgba(255,255,255,0.25);border-radius:10px;background:rgba(255,255,255,0.08);color:white}
#startChatBtn{background:var(--primary);color:white;border:none;padding:8px;border-radius:10px;cursor:pointer}
.user-meta{font-size:12px;color:#ddd;padding:8px;border-top:1px solid rgba(255,255,255,0.06);text-align:center}
.logout-btn{background:transparent;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:6px;border-radius:8px;cursor:pointer;margin-left:8px}
`;
  document.head.appendChild(style);

  // ========== HTML ==========
  const chatHTML = `
    <button class="chat-toggle" id="chatToggle" aria-label="Open chat">💬</button>
    <div class="chat-popup" id="chatPopup" role="dialog" aria-modal="true" aria-label="Yasui Tour Chat">
      <div class="chat-header">ヤスイツアー チャット<button id="closeChat" aria-label="Close chat">✕</button></div>

      <!-- Pre-chat form -->
      <div class="user-form" id="userForm">
        <input type="text" id="userName" placeholder="お名前 (Nama)" autocomplete="name" />
        <input type="email" id="userEmail" placeholder="メール (Email)" autocomplete="email" />
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button id="startChatBtn">OK</button>
        </div>
      </div>

      <div class="chat-box" id="chatBox" aria-live="polite"></div>
      <div class="quick-replies" id="quickReplies"></div>

      <div class="chat-input">
        <input type="text" id="userInput" placeholder="メッセージを入力..." aria-label="Tulis pesan" />
        <button id="sendBtn">送信</button>
      </div>

      <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
        <div class="clear-btn" id="clearHistory">🗑️ 履歴を削除する</div>
        <div style="display:flex;align-items:center;padding-right:10px;">
          <div class="user-meta" id="userMeta" style="padding-right:0"></div>
          <button class="logout-btn" id="logoutBtn" title="Logout user">Logout</button>
        </div>
      </div>

      <div class="line-btn" id="lineBtn">📲 LINEでチャット（ID: @wae1030i）</div>
    </div>

    <audio id="botPopSound" src="https://actions.google.com/sounds/v1/cartoon/pop.ogg" preload="auto"></audio>
    <audio id="userSendSound" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg" preload="auto"></audio>
    <audio id="chatAppearSound" src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" preload="auto"></audio>
    <audio id="sendClickSound" src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" preload="auto"></audio>
  `;

  document.body.insertAdjacentHTML("beforeend", chatHTML);

  // ========== Elements ==========
  const chatToggle = document.getElementById("chatToggle");
  const chatPopup = document.getElementById("chatPopup");
  const closeChat = document.getElementById("closeChat");
  const chatBox = document.getElementById("chatBox");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const quickReplies = document.getElementById("quickReplies");
  const botPop = document.getElementById("botPopSound");
  const userSound = document.getElementById("userSendSound");
  const clearBtn = document.getElementById("clearHistory");
  const chatAppear = document.getElementById("chatAppearSound");
  const sendClick = document.getElementById("sendClickSound");
  const lineBtn = document.getElementById("lineBtn");

  const userForm = document.getElementById("userForm");
  const startChatBtn = document.getElementById("startChatBtn");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const userMeta = document.getElementById("userMeta");
  const logoutBtn = document.getElementById("logoutBtn");

  // Sounds volume
  if (botPop) botPop.volume = 0.3;
  if (userSound) userSound.volume = 0.35;
  if (chatAppear) chatAppear.volume = 0.4;
  if (sendClick) sendClick.volume = 0.45;

  // little intro animation
  setTimeout(() => {
    if (chatAppear) { try { chatAppear.play().catch(()=>{}); } catch(e){} }
    if (navigator.vibrate) navigator.vibrate([80,50,80]);
  }, 800);

  // ===== Quick options & responses =====
  const QUICK_OPTIONS = [
    "カーチャーターについて",
    "観光ツアーについて",
    "アクティビティについて",
    "スパ・エステについて",
    "空港送迎について",
    "予約をしたい",
    "予約を変更したい",
    "予約をキャンセルしたい",
    "支払いについて"
  ];

  const RESPONSES = {
    "カーチャーター": "ヤスイツアーのカーチャーターは時間制です（5時間・8時間など）。8時間：6千円、次は 5百円/1時間。日本語対応ドライバーがご案内いたします🚘 ご希望のスケジュールをお知らせください。",
    "観光ツアー": "人気の観光ツアーはウブド・キンタマーニ・タナロット・ウルワツなどがあります🌴 ご希望のコースを選んでください。",
    "アクティビティ": "バリ島の人気アクティビティには ATV ライディング、ラフティング、マリンスポーツが手配させて頂きます🏝️。私たちを通してアクティビティを予約すると、50％以上の割引が受けられます。※日本国籍のお客様限定です。",
    "スパ": "私たちを通してスパを予約すると、全てのスパメニューが40％割引になります。ご希望の日時をお知らせください💆‍♀️",
    "空港送迎": "空港送迎は片道・往復どちらも対応しております✈️ ご到着便とお名前をお知らせください。",
    "予約をしたい": "ありがとうございます😊 ご希望の日付・人数・お名前・サービス内容をお知らせください。または、このウェブサイトの「予約フォーム」ボタンをクリックして、詳しい情報をご覧ください。",
    "変更": "予約の変更ですね。予約名と新しい日程をお知らせください📅",
    "キャンセル": "キャンセルの手続きですね。予約名と日付を教えてください。",
    "支払い": "支払いは日本円、またはインドネシアルピアが出来ます。",
    "default": "すみません、もう少し詳しく教えていただけますか？"
  };

  const DAYS_JP = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"];
  function formatJapaneseDate(date){
    const month = date.getMonth()+1;
    const day = date.getDate();
    const time = date.toLocaleTimeString("ja-JP",{hour:'2-digit',minute:'2-digit'});
    return `${month}月${day}日 ${time}`;
  }

  let lastDate = "";

  function addMessage(text, sender, save=true){
    const now = new Date();
    const currentDate = now.toLocaleDateString("ja-JP");

    if (currentDate !== lastDate){
      const dateLabel = document.createElement("div");
      dateLabel.classList.add("date-label");
      const dayOfWeek = DAYS_JP[now.getDay()];
      dateLabel.textContent = `${now.getMonth()+1}月${now.getDate()}日（${dayOfWeek}）`;
      chatBox.appendChild(dateLabel);
      lastDate = currentDate;
    }

    const msg = document.createElement("div");
    msg.classList.add("msg", sender);

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = formatJapaneseDate(now);

    msg.textContent = text;
    msg.appendChild(timestamp);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (save) saveChat();
    return msg;
  }

  function botResponse(userText){
    let foundKey = "default";
    for (const key in RESPONSES){
      if (userText.includes(key)) { foundKey = key; break; }
    }

    setTimeout(()=>{
      const botMsg = addMessage(RESPONSES[foundKey], "bot");
      if (botPop){ botPop.currentTime = 0; try{ botPop.play().catch(()=>{}); }catch(e){} }
      if (navigator.vibrate) navigator.vibrate([40,30,40]);
      if (botMsg){ botMsg.classList.add("shake-glow"); setTimeout(()=>botMsg.classList.remove("shake-glow"),600); }
    }, 500);
  }


// Fungsi untuk menambahkan kesalahan ketik secara acak
function introduceTypo(text) {
  const typoVariants = {
    "カーチャーター": ["カーチャーター", "カーちゅたー", "カーチャータ"],
    "観光ツアー": ["観光ツアー", "かんこうツアー", "観光ツアー"],
    "アクティビティ": ["アクティビティ", "あくてぃびてぃ", "アクティビティ"],
    "スパ": ["スパ", "すぱ", "スパ"],
    "空港送迎": ["空港送迎", "くうこうそうえい", "空港送迎"],
    "予約": ["予約", "よやく", "予約"],
    "支払い": ["支払い", "しはらい", "支払い"]
  };

  // Ganti kata-kata tertentu dengan versi yang mungkin salah ketik
  let newText = text;
  Object.keys(typoVariants).forEach(word => {
    const variants = typoVariants[word];
    if (newText.includes(word)) {
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      newText = newText.replace(new RegExp(word, 'g'), randomVariant);
    }
  });

  return newText;
}

// Fungsi untuk menampilkan efek mengetik
function typeWriterEffect(element, text, speed = 5) {
  let i = 0;
  element.textContent = '';
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      element.scrollTop = element.scrollHeight;
    } else {
      clearInterval(typing);
    }
  }, speed);
}

// Modifikasi fungsi botResponse
function botResponse(userText){
  let foundKey = "default";
  for (const key in RESPONSES){
    if (userText.includes(key)) { foundKey = key; break; }
  }

  setTimeout(()=>{
    // Tambahkan efek mengetik
    const botMsg = addMessage("", "bot");
    
    // Tunggu sebentar sebelum menampilkan teks
    setTimeout(() => {
      const originalResponse = RESPONSES[foundKey];
      const typoResponse = introduceTypo(originalResponse);
      
      // Gunakan typeWriterEffect untuk menampilkan respons
      typeWriterEffect(botMsg, typoResponse, 25);
      
      if (botPop){ botPop.currentTime = 0; try{ botPop.play().catch(()=>{}); }catch(e){} }
      if (navigator.vibrate) navigator.vibrate([40,30,40]);
      if (botMsg){ botMsg.classList.add("shake-glow"); setTimeout(()=>botMsg.classList.remove("shake-glow"),600); }
    }, 500);
  }, 500);
}




  // ===== Web3Forms Notification (includes name + email) =====
  async function sendEmailNotification(message){
    const access_key = "f353e5ae-1b86-4ea6-a55f-582ad8612812"; // <-- ganti kalau perlu
    const name = localStorage.getItem("yasui_name") || "Unknown";
    const email = localStorage.getItem("yasui_email") || "Unknown";

    const payload = {
      access_key,
      subject: "📩 Pesan Baru dari Chatbot ヤスイツアー",
      from_name: name,
      from_email: email,
      message: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}\n\nWaktu: ${formatJapaneseDate(new Date())}`
    };

    try{
      const response = await fetch("https://api.web3forms.com/submit",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log("Web3Forms:", result);
    }catch(err){ console.error("Gagal kirim email (Web3Forms):", err); }
  }

  function isValidEmail(email){
    // simple regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function sendMessage(){
    // prevent if user not registered
    if (!localStorage.getItem("yasui_name") || !localStorage.getItem("yasui_email")){
      alert("Silakan isi nama & email terlebih dahulu.");
      return;
    }

    const text = userInput.value.trim();
    if (!text) return;

    if (sendClick){ try{ sendClick.currentTime = 0; sendClick.play().catch(()=>{}); }catch(e){} }
    sendBtn.style.transform = "scale(0.9)";
    setTimeout(()=> sendBtn.style.transform = "scale(1)", 150);
    if (navigator.vibrate) navigator.vibrate(70);

    const userMsg = addMessage(text, "user");
    if (userMsg){ userMsg.classList.add("fade-pop"); setTimeout(()=>userMsg.classList.remove("fade-pop"), 500); }
    if (userSound){ try{ userSound.currentTime = 0; userSound.play().catch(()=>{}); }catch(e){} }

    userInput.value = "";
    botResponse(text);

    // Send notification
    sendEmailNotification(text);
  }

  // ===== Quick replies builder =====
  function loadQuickReplies(){
    quickReplies.innerHTML = "";
    QUICK_OPTIONS.forEach(q=>{
      const btn = document.createElement("button");
      btn.classList.add("quick-btn");
      btn.textContent = q;
      btn.onclick = ()=>{
        const qMsg = addMessage(q, "user");
        if (qMsg){ qMsg.classList.add("fade-pop"); setTimeout(()=>qMsg.classList.remove("fade-pop"),500); }
        if (userSound){ try{ userSound.currentTime = 0; userSound.play().catch(()=>{}); }catch(e){} }
        botResponse(q);
        sendEmailNotification(q);
      };
      quickReplies.appendChild(btn);
    });
  }
  
// ===== Tambahan agar quick replies tidak langsung muncul =====
quickReplies.style.display = "none"; // disembunyikan di awal

// Tampilkan quick replies hanya saat user fokus di input
userInput.addEventListener("focus", () => {
  quickReplies.style.display = "flex";
});

// Sembunyikan lagi ketika input kehilangan fokus (opsional)
userInput.addEventListener("blur", () => {
  setTimeout(() => {  // jeda sedikit agar tidak hilang saat klik tombol
    quickReplies.style.display = "none";
  }, 200);
});
  
  
  
// ===== Quick Replies Toggle Buttons =====
let quickVisible = true;

function showQuickReplies() {
  quickReplies.style.display = "flex";
  quickVisible = true;
}

function hideQuickReplies() {
  quickReplies.style.display = "none";
  quickVisible = false;
}

function toggleQuickReplies() {
  if (quickVisible) hideQuickReplies();
  else showQuickReplies();
}


// ===== Event agar quick replies muncul saat input focus =====
userInput.addEventListener("focus", () => {
  showQuickReplies();
});




// ===== Tambahkan tombol toggle di dekat chat input =====
const inputContainer = document.querySelector(".chat-input");
const toggleQuickBtn = document.createElement("button");
toggleQuickBtn.textContent = "💡";
toggleQuickBtn.title = "Tampilkan/Sembunyikan pertanyaan cepat";
toggleQuickBtn.style.marginLeft = "6px";
toggleQuickBtn.style.padding = "6px 10px";
toggleQuickBtn.style.borderRadius = "12px";
toggleQuickBtn.style.border = "none";
toggleQuickBtn.style.background = "#888";
toggleQuickBtn.style.color = "#fff";
toggleQuickBtn.style.cursor = "pointer";
toggleQuickBtn.onclick = toggleQuickReplies;

// Masukkan tombol setelah input dan sebelum tombol Kirim
inputContainer.appendChild(toggleQuickBtn);
  

  // ===== Local Storage chat save/load/clear =====
  function saveChat(){ localStorage.setItem("yasui_chat", chatBox.innerHTML); }
  function loadChat(){
    const saved = localStorage.getItem("yasui_chat");
    if (saved) chatBox.innerHTML = saved;
    else addMessage("こんにちは！ヤスイツアーです🌴 ご質問は日本語でどうぞ ！。"
                    "このチャットを始める前に、お手数ですがお名前とメールアドレスをフォームにご入力ください。"
"今後のサービス対応をスムーズに行うために必要となります。"
"なお、フォームの入力は任意ですので、空欄のままでもご利用いただけます。", "bot", false);
  }
  function clearChat(){
    if (confirm("チャット履歴を削除しますか？")){
      localStorage.removeItem("yasui_chat");
      chatBox.innerHTML = "";
      lastDate = "";
      addMessage("こんにちは！ヤスイツアーです🌴 ご質問は日本語でどうぞ！。", "bot", false);
    }
  }

  // ===== User form handling =====
  function showUserMeta(){
    const name = localStorage.getItem("yasui_name");
    const email = localStorage.getItem("yasui_email");
    if (name && email){
      userMeta.textContent = `${name} • ${email}`;
    } else userMeta.textContent = "";
  }

  startChatBtn.onclick = ()=>{
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!name || !email){ alert("Nama & Email wajib diisi."); return; }
    if (!isValidEmail(email)){ alert("Format email tidak valid."); return; }

    localStorage.setItem("yasui_name", name);
    localStorage.setItem("yasui_email", email);

    userForm.style.display = "none";
    showUserMeta();

    addMessage(`こんにちは ${name} さん！😊\nご質問は日本語でどうぞ。`, "bot");
  };

  logoutBtn.onclick = ()=>{
    if (!confirm("Logout dan hapus data nama/email?")) return;
    localStorage.removeItem("yasui_name");
    localStorage.removeItem("yasui_email");
    userForm.style.display = "flex";
    userNameInput.value = "";
    userEmailInput.value = "";
    showUserMeta();
  };

  // ===== Event bindings =====
  sendBtn.onclick = sendMessage;
  userInput.addEventListener("keypress", e=>{ if (e.key === "Enter") sendMessage(); });

  chatToggle.onclick = ()=> chatPopup.classList.toggle("show");
  closeChat.onclick = ()=> chatPopup.classList.remove("show");
  lineBtn && lineBtn.addEventListener("click", ()=> window.open('https://line.me/ti/p/~@wae1030i','_blank'));
  clearBtn.onclick = clearChat;

  // Open chat from other scripts
  window.openYasuiChat = function(){
    chatPopup.classList.add("show");
    if (chatAppear) { try { chatAppear.play().catch(()=>{}); } catch(e){} }
    if (navigator.vibrate) navigator.vibrate(50);
  };

  // ===== Init load =====
  function loadUser(){
    const name = localStorage.getItem("yasui_name");
    const email = localStorage.getItem("yasui_email");
    if (name && email) userForm.style.display = "none";
    else userForm.style.display = "flex";
    showUserMeta();
  }

  loadChat();
  loadQuickReplies();
  loadUser();

});
