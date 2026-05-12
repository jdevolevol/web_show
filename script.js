const content = document.getElementById("content");
const navButtons = document.querySelectorAll(".nav-btn");

const pages = {
  home: `
    <div class="card">
    <h2>ผู้ช่วยอัจฉริยะ</h2>

    <div class="chat-container">

      <div class="chat-messages" id="chatMessages">
        <div class="message ai">
          สวัสดีครับ มีอะไรให้ช่วยไหม?
        </div>
      </div>

      <div class="chat-input-area">
        <input 
          type="text" 
          id="chatInput"
          placeholder="พิมพ์ข้อความ..."
        />

        <button id="sendBtn">
          ส่ง
        </button>
      </div>

    </div>
  </div>
  `,

  map: `
    <div class="card">
      <h2>แผนที่</h2>
      <p>หน้านี้จะใช้แสดง Longdo Map ในขั้นต่อไป</p>

      <div style="height: 400px; background: #e5e7eb; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
        พื้นที่แสดงแผนที่
      </div>
    </div>
  `,

  dust: `
    <div class="card">
      <h2>ค่าฝุ่น PM2.5</h2>
      <p>หน้านี้จะใช้ดึงข้อมูลค่าฝุ่นจาก Air4Thai ในขั้นต่อไป</p>

      <div style="padding: 16px; background: #fef3c7; border-radius: 10px;">
        ยังไม่ได้เชื่อม API
      </div>
    </div>
  `
};

function showPage(pageName) {

  content.innerHTML = pages[pageName];

  if (pageName === "home") {
    setupChat();
  }

  navButtons.forEach((button) => {
    button.classList.remove("active");

    if (button.dataset.page === pageName) {
      button.classList.add("active");
    }
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pageName = button.dataset.page;
    showPage(pageName);
  });
});

showPage("home");

//ส่วนchat
function setupChat() {

  const sendBtn = document.getElementById("sendBtn");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (!sendBtn) return;

  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {

    const text = chatInput.value.trim();

    if (text === "") return;

    addMessage(text, "user");

    chatInput.value = "";

    setTimeout(() => {

      try {

  const response = await fetch("/api/chat", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      message: text
    })
  });

  const data = await response.json();

  addMessage(data.reply, "ai");

} catch (error) {

  addMessage("ระบบผิดพลาด", "ai");

}

    }, 500);
  }

  async function addMessage(text, sender) {

    const div = document.createElement("div");

    div.classList.add("message");
    div.classList.add(sender);

    div.textContent = text;

    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateReply(message) {

    return `คุณพิมพ์ว่า: "${message}"`;
  }
}