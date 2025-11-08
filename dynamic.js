// js/dynamic.js
document.addEventListener("DOMContentLoaded", () => {
  // animasi tombol
  document.querySelectorAll(".fancy-btn").forEach((btn, index) => {
    setTimeout(() => btn.classList.add("show"), index * 100);
  });

  const buttons = document.querySelectorAll(".fancy-btn");
  const contentArea = document.getElementById("content-area");

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const soundId = button.getAttribute("data-sound");
      const audio = document.getElementById(soundId);
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }

      const page = button.getAttribute("data-page");
      await loadContent(page);
    });
  });

  async function loadContent(page) {
    const fileMap = {
      car: "car.html",
      spa: "spa.html",
      package: "package.html",
      activity: "activity.html",
      reserve: "reserve.html",
    };

    const file = fileMap[page];
    if (!file) return;

    try {
      const res = await fetch(file);
      const html = await res.text();
      contentArea.innerHTML = `<div class="fade-in">${html}</div>`;
    } catch (err) {
      contentArea.innerHTML = `<p class="text-red-400 mt-4">⚠️ ページの読み込みに失敗しました。</p>`;
    }
  }
});
