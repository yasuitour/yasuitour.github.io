// chatbot.js — Yasui Tour Chatbot Popup
document.addEventListener("DOMContentLoaded", () => {

  // ====== Tambahkan CSS ======
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --primary: #00bfa6;
      --bot-bg: rgba(0, 191, 166, 0.15);
      --user-bg: rgba(191, 240, 226, 0.3);
      --chat-bg: rgba(0, 0, 0, 0.75);
      --text-color: #fff;
    }

    /* Tombol Chat */
    .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      border: none;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      z-index: 1001;
      opacity: 0;
      transform: scale(0.5);
      animation: fadeBounceIn 1s ease forwards, bubble 2.5s infinite ease-in-out 2s;
    }

    /* Animasi Muncul + Getar */
    @keyframes fadeBounceIn {
      0% { opacity: 0; transform: scale(0.5) translateY(40px); }
      60% { opacity: 1; transform: scale(1.1) translateY(-10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Animasi Gelembung Chat */
    @keyframes bubble {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-6px) scale(1.08); }
    }

    .chat-toggle:hover { transform: scale(1.15); transition: 0.2s; }

    /* Popup */
    .chat-popup {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 340px;
      max-height: 520px;
      display: none;
      flex-direction: column;
      background: var(--chat-bg);
      color: var(--text-color);
      border-radius: 16px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.6);
      overflow: hidden;
      z-index: 1000;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.4s ease;
      backdrop-filter: blur(12px);
    }

    .chat-popup.show {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    .chat-header {
      background: var(--primary);
      color: white;
      text-align: center;
      padding: 10px;
      font-weight: bold;
      position: relative;
      font-size: 15px;
    }
    .chat-header button {
      position: absolute;
      right: 10px;
      top: 6px;
      background: transparent;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    .chat-box {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
    }

    .msg {
      padding: 8px 12px;
      border-radius: 14px;
      margin: 6px 0;
      display: inline-block;
      max-width: 80%;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
      opacity: 0;
      transform: translateY(15px);
      animation: fadeSlideIn 0.4s ease forwards;
    }

    .bot { background: var(--bot-bg); color: var(--text-color); align-self: flex-start; border-bottom-left-radius: 4px; }
    .user { background: var(--user-bg); color: var(--text-color); align-self: flex-end; border-bottom-right-radius: 4px; }

    @keyframes fadeSlideIn {
      0% {opacity: 0; transform: translateY(15px);}
      100% {opacity: 1; transform: translateY(0);}
    }

    .date-label {
      text-align: center;
      font-size: 11px;
      color: #ddd;
      margin: 10px 0;
      background: rgba(255,255,255,0.1);
      padding: 4px 0;
      border-radius: 8px;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeSlideIn 0.5s ease forwards;
    }

    .timestamp {
      display: block;
      font-size: 10px;
      color: #bbb;
      margin-top: 3px;
      text-align: right;
    }

    .quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.08);
      border-top: 1px solid rgba(255,255,255,0.15);
    }

    .quick-btn {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      color: var(--text-color);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: 0.3s;
    }
    .quick-btn:hover {
      background: var(--primary);
      color: white;
    }

    .chat-input {
      display: flex;
      padding: 8px;
      border-top: 1px solid rgba(255,255,255,0.15);
      background: rgba(0,0,0,0.3);
    }

    .chat-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 18px;
      font-size: 13px;
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .chat-input input::placeholder { color: #aaa; }

    .chat-input button {
      background: var(--primary);
      color: white;
      border: none;
      margin-left: 6px;
      border-radius: 18px;
      padding: 8px 12px;
      cursor: pointer;
    }

    .line-btn {
      background: #06c755;
      color: white;
      text-align: center;
      padding: 10px;
      font-weight: bold;
      cursor: pointer;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .line-btn:hover { background: #05b14d; }

    .clear-btn {
      background: #ff6b6b;
      color: white;
      text-align: center;
      padding: 8px;
      font-weight: bold;
      cursor: pointer;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .clear-btn:hover { background: #ff4040; }

    .chat-box::-webkit-scrollbar { width: 6px; }
    .chat-box::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);

  // ====== Tambahkan HTML ======
  const chatHTML = `
    <button class="chat-toggle" id="chatToggle">💬</button>
    <div class="chat-popup" id="chatPopup">
      <div class="chat-header">ヤスイツアー チャット<button id="closeChat">✕</button></div>
      <div class="chat-box" id="chatBox"></div>
      <div class="quick-replies" id="quickReplies"></div>
      <div class="chat-input">
        <input type="text" id="userInput" placeholder="メッセージを入力..." />
        <button id="sendBtn">送信</button>
      </div>
      <div class="clear-btn" id="clearHistory">🗑️ 履歴を削除する</div>
      <div class="line-btn" onclick="window.open('https://line.me/ti/p/~@wae1030i', '_blank')">
        📲 LINEでチャット（ID: @wae1030i）
      </div>
    </div>
    <audio id="botPopSound" src="https://actions.google.com/sounds/v1/cartoon/pop.ogg" preload="auto"></audio>
    <audio id="userSendSound" src="https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_hit.ogg" preload="auto"></audio>
    <audio id="chatAppearSound" src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" preload="auto"></audio>
  `;
  document.body.insertAdjacentHTML("beforeend", chatHTML);

  // ====== Logika Chat ======
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

  botPop.volume = 0.3;
  userSound.volume = 0.4;
  chatAppear.volume = 0.4;

  // 🔊 Mainkan suara + getar saat tombol chat muncul
  setTimeout(() => {
    chatAppear.play();
    if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
  }, 800);

  const QUICK_OPTIONS = [
    "カーチャーターについて","ツアーパッケージについて","アクティビティについて",
    "スパエステについて","予約をしたい","予約を変更したい","予約をキャンセルしたい"
  ];

  const RESPONSES = {
    "カーチャーター": "カーチャーターは時間制で利用できます。ドライバーは日本語対応可能です。",
    "ツアー": "ツアーパッケージは半日・終日・カスタムがあります。おすすめ観光地をご案内します！",
    "アクティビティ": "人気アクティビティ：シュノーケル・ダイビング・トレッキング・文化体験など！",
    "スパ": "スパ＆エステは1時間コースから予約可能です。ご希望の時間をお知らせください。",
    "予約をしたい": "ご予約ありがとうございます。希望日・人数・お名前を教えてください。",
    "変更": "予約の変更ですね。予約名と新しい日程をお知らせください。",
    "キャンセル": "キャンセルの手続きですね。予約名と日付を教えてください。",
    "default": "すみません、もう少し詳しく教えていただけますか？"
  };

  const DAYS_JP = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"];
  function formatJapaneseDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const time = date.toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' });
    return `${month}月${day}日 ${time}`;
  }

  let lastDate = "";

  function addMessage(text, sender, save = true) {
    const now = new Date();
    const currentDate = now.toLocaleDateString("ja-JP");

    if (currentDate !== lastDate) {
      const dateLabel = document.createElement("div");
      dateLabel.classList.add("date-label");
      const dayOfWeek = DAYS_JP[now.getDay()];
      dateLabel.textContent = `${now.getMonth() + 1}月${now.getDate()}日（${dayOfWeek}）`;
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
  }

  function botResponse(userText) {
    let foundKey = "default";
    for (const key in RESPONSES) {
      if (userText.includes(key)) { foundKey = key; break; }
    }
    setTimeout(() => {
      addMessage(RESPONSES[foundKey], "bot");
      botPop.currentTime = 0;
      botPop.play();
      if (navigator.vibrate) navigator.vibrate(100);
    }, 500);
  }

  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    userSound.currentTime = 0;
    userSound.play();
    userInput.value = "";
    botResponse(text);
  }

  sendBtn.onclick = sendMessage;
  userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

  chatToggle.onclick = () => chatPopup.classList.toggle("show");
  closeChat.onclick = () => chatPopup.classList.remove("show");

  function loadQuickReplies() {
    quickReplies.innerHTML = "";
    QUICK_OPTIONS.forEach(q => {
      const btn = document.createElement("button");
      btn.classList.add("quick-btn");
      btn.textContent = q;
      btn.onclick = () => {
        addMessage(q, "user");
        userSound.play();
        botResponse(q);
      };
      quickReplies.appendChild(btn);
    });
  }

  function saveChat() { localStorage.setItem("yasui_chat", chatBox.innerHTML); }
  function loadChat() {
    const saved = localStorage.getItem("yasui_chat");
    if (saved) chatBox.innerHTML = saved;
    else addMessage("こんにちは！ヤスイツアーです🌴 ご質問は日本語でどうぞ。", "bot", false);
  }
  function clearChat() {
    if (confirm("チャット履歴を削除しますか？")) {
      localStorage.removeItem("yasui_chat");
      chatBox.innerHTML = "";
      lastDate = "";
      addMessage("こんにちは！ヤスイツアーです🌴 ご質問は日本語でどうぞ。", "bot", false);
    }
  }
  clearBtn.onclick = clearChat;

  loadChat();
  loadQuickReplies();


  // === Fungsi untuk membuka chatbot dari luar ===
  window.openYasuiChat = function() {
    const chatPopup = document.getElementById("chatPopup");
    if (chatPopup) {
      chatPopup.classList.add("show");
      const chatAppear = document.getElementById("chatAppearSound");
      if (chatAppear) chatAppear.play();
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

// === Efek suara & animasi saat gelembung chat diklik ===
  const bubbleClickSound = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
  bubbleClickSound.volume = 0.4;

  chatBox.addEventListener("click", (e) => {
    const msg = e.target.closest(".msg");
    if (msg) {
      // Mainkan suara
      bubbleClickSound.currentTime = 0;
      bubbleClickSound.play();

      // Tambahkan animasi singkat
      msg.style.transition = "transform 0.2s ease";
      msg.style.transform = "scale(1.05)";
      setTimeout(() => {
        msg.style.transform = "scale(1)";
      }, 200);
    }
  });
        
});
