const chatbot = {
  open: false,
  answers: {
    'how much is delivery': 'Dhaka delivery starts from ৳60. Outside Dhaka starts from ৳120. Remote areas may vary by location.',
    'how can i order': 'You can add products to cart and proceed to checkout, or place an order directly through WhatsApp.',
    'what payment methods': 'We support Cash on Delivery, bKash, Nagad, and Card / Online Payment options.',
    'return policy': 'We support easy returns for damaged or incorrect items within the policy window. Please contact us for details.',
    'whatsapp number': 'Call or WhatsApp us at 01701585007.',
    'default': 'You can ask about pricing, delivery, payment, order steps, product categories, or return policy.'
  }
};

function addChatMessage(text, type = 'bot') {
  const body = document.querySelector('.chatbot-body');
  if (!body) return;
  const node = document.createElement('div');
  node.className = type === 'user' ? 'user-message' : 'bot-message';
  node.textContent = text;
  body.appendChild(node);
  body.scrollTop = body.scrollHeight;
}

function answerQuestion(question) {
  const key = question.toLowerCase().trim();
  const answer = Object.keys(chatbot.answers).find(item => key.includes(item)) || 'default';
  addChatMessage(chatbot.answers[answer] || chatbot.answers.default, 'bot');
}

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.querySelector('.chatbot-fab');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  if (!fab || !panel) return;

  fab.addEventListener('click', () => {
    chatbot.open = !chatbot.open;
    panel.classList.toggle('open', chatbot.open);
  });

  closeBtn?.addEventListener('click', () => {
    chatbot.open = false;
    panel.classList.remove('open');
  });

  document.querySelectorAll('.quick-question').forEach((button) => {
    button.addEventListener('click', () => {
      const text = button.textContent;
      addChatMessage(text, 'user');
      answerQuestion(text);
    });
  });

  const send = () => {
    const text = input?.value.trim();
    if (!text) return;
    addChatMessage(text, 'user');
    answerQuestion(text);
    if (input) input.value = '';
  };

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') send();
  });
});
