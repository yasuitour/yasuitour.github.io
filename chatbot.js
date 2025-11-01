// chatbot.js — Yasui Tour Chatbot Popup
document.addEventListener("DOMContentLoaded", () => {

  // ====== Tambahkan CSS ======
  const style = document.createElement("style");
  style.textContent = `
    /* ... semua CSS kamu tetap sama, tidak diubah ... */
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
    <audio id="sendClickSound" src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" preload="auto"></audio>
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
  const sendClick = document.getElementById("sendClickSound");

  botPop.volume = 0.3;
  userSound.volume = 0.4;
  chatAppear.volume = 0.4;
  sendClick.volume = 0.5;

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
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
      const botMsgs = chatBox.querySelectorAll(".msg.bot");
      const lastBot = botMsgs[botMsgs.length - 1];
      if (lastBot) {
        lastBot.classList.add("shake-glow");
        setTimeout(() => lastBot.classList.remove("shake-glow"), 600);
      }
    }, 500);
  }

  // 🌐 Kirim notifikasi email via Web3Forms
  async function sendEmailNotification(message) {
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "f353e5ae-1b86-4ea6-a55f-582ad8612812",
          subject: "📩 Pesan Baru dari Chatbot ヤスイツアー",
          from_name: "Yasui Tour Chatbot",
          message: `Pesan baru dari pengunjung:\n\n${message}`
        })
      });
      console.log("📧 Email notifikasi dikirim sukses!");
    } catch (err) {
      console.error("Gagal kirim email:", err);
    }
  }

  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    sendClick.currentTime = 0;
    sendClick.play();
    sendBtn.style.transform = "scale(0.9)";
    setTimeout(() => (sendBtn.style.transform = "scale(1)"), 150);
    if (navigator.vibrate) navigator.vibrate(70);
    addMessage(text, "user");

    const userMsgs = chatBox.querySelectorAll(".msg.user");
    const lastUser = userMsgs[userMsgs.length - 1];
    if (lastUser) {
      lastUser.classList.add("fade-pop");
      setTimeout(() => lastUser.classList.remove("fade-pop"), 500);
    }

    userSound.currentTime = 0;
    userSound.play();
    userInput.value = "";
    botResponse(text);

    // 🚀 Kirim notifikasi email ke admin
    sendEmailNotification(text);
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
        sendEmailNotification(q);
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

  window.openYasuiChat = function() {
    chatPopup.classList.add("show");
    chatAppear.play();
    if (navigator.vibrate) navigator.vibrate(50);
  };
});
