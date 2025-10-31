style.textContent = `
  :root {
    --primary: #00bfa6;
    --bot-bg: #e6f9f6;
    --user-bg: #d1f2eb;
    --chat-bg: rgba(255,255,255,0.95);
    --text-color: #000; /* warna teks utama */
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

  @keyframes fadeBounceIn {
    0% { opacity: 0; transform: scale(0.5) translateY(40px); }
    60% { opacity: 1; transform: scale(1.1) translateY(-10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes bubble {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-6px) scale(1.08); }
  }

  .chat-toggle:hover { transform: scale(1.15); transition: 0.2s; }

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
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    overflow: hidden;
    z-index: 1000;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.4s ease;
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
    color: #000; /* teks hitam */
  }

  .bot { background: var(--bot-bg); color: #000; align-self: flex-start; border-bottom-left-radius: 4px; }
  .user { background: var(--user-bg); color: #000; align-self: flex-end; border-bottom-right-radius: 4px; }

  @keyframes fadeSlideIn {
    0% {opacity: 0; transform: translateY(15px);}
    100% {opacity: 1; transform: translateY(0);}
  }

  .date-label {
    text-align: center;
    font-size: 11px;
    color: #333;
    margin: 10px 0;
    background: #f0f0f0;
    padding: 4px 0;
    border-radius: 8px;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeSlideIn 0.5s ease forwards;
  }

  .timestamp {
    display: block;
    font-size: 10px;
    color: #555;
    margin-top: 3px;
    text-align: right;
  }

  .quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 6px 10px;
    background: #fff;
    border-top: 1px solid #ddd;
  }

  .quick-btn {
    background: #f9f9f9;
    border: 1px solid #ddd;
    color: #000;
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
    border-top: 1px solid #ddd;
    background: #fff;
  }

  .chat-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 18px;
    font-size: 13px;
    background: #fff;
    color: #000;
  }

  .chat-input input::placeholder { color: #888; }

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
    border-top: 1px solid #eee;
  }
  .line-btn:hover { background: #05b14d; }

  .clear-btn {
    background: #ff6b6b;
    color: white;
    text-align: center;
    padding: 8px;
    font-weight: bold;
    cursor: pointer;
    border-top: 1px solid #eee;
  }
  .clear-btn:hover { background: #ff4040; }

  .chat-box::-webkit-scrollbar { width: 6px; }
  .chat-box::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;
