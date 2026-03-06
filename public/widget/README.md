# 🤖 Ragly Chatbot Widget

Embed your AI chatbot on any website with a simple script tag. No complex setup required!

## ✨ Features

- 🎨 **Fully Customizable** - Colors, position, size
- 💬 **Real-time Chat** - Instant AI-powered responses
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Lightweight** - Minimal performance impact
- 🔒 **Secure** - HTTPS support
- 🌍 **Universal** - Works with any website (HTML, React, WordPress, etc.)

## 🚀 Quick Start

### Method 1: HTML (Recommended)

Add this code before the closing `</body>` tag:

```html
<!-- Ragly Chatbot Widget -->
<script>
  window.RAGLY_CHATBOT_ID = 'your-chatbot-id-here';
  window.RAGLY_POSITION = 'bottom-right';
  window.RAGLY_PRIMARY_COLOR = '#4F46E5';
  window.RAGLY_BUTTON_SIZE = '60px';
</script>
<script src="https://yourdomain.com/widget/chatbot-widget.js"></script>
```

### Method 2: React

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.RAGLY_CHATBOT_ID = 'your-chatbot-id-here';
    window.RAGLY_POSITION = 'bottom-right';
    window.RAGLY_PRIMARY_COLOR = '#4F46E5';
    window.RAGLY_BUTTON_SIZE = '60px';

    const script = document.createElement('script');
    script.src = 'https://yourdomain.com/widget/chatbot-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const widget = document.getElementById('ragly-widget');
      if (widget) widget.remove();
      document.body.removeChild(script);
    };
  }, []);

  return <div>{/* Your app */}</div>;
}
```

### Method 3: WordPress

1. Go to **Appearance** → **Theme Editor** → **footer.php**
2. Or use a plugin like "Insert Headers and Footers"
3. Add the script before `</body>`:

```html
<script>
  window.RAGLY_CHATBOT_ID = 'your-chatbot-id-here';
  window.RAGLY_POSITION = 'bottom-right';
  window.RAGLY_PRIMARY_COLOR = '#4F46E5';
  window.RAGLY_BUTTON_SIZE = '60px';
</script>
<script src="https://yourdomain.com/widget/chatbot-widget.js"></script>
```

## 🎨 Customization Options

### Configuration Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `RAGLY_CHATBOT_ID` | string | **Required** | Your chatbot ID from dashboard |
| `RAGLY_POSITION` | string | `'bottom-right'` | Widget position (`'bottom-right'` or `'bottom-left'`) |
| `RAGLY_PRIMARY_COLOR` | string | `'#4F46E5'` | Primary color (hex format) |
| `RAGLY_BUTTON_SIZE` | string | `'60px'` | Chat button size |
| `RAGLY_API_URL` | string | `window.location.origin` | API base URL (auto-detected) |
| `RAGLY_Z_INDEX` | string | `'9999'` | Z-index for widget |

### Example Configurations

**Blue Theme - Bottom Left**
```javascript
window.RAGLY_CHATBOT_ID = 'abc123';
window.RAGLY_POSITION = 'bottom-left';
window.RAGLY_PRIMARY_COLOR = '#3B82F6';
window.RAGLY_BUTTON_SIZE = '70px';
```

**Purple Theme - Bottom Right**
```javascript
window.RAGLY_CHATBOT_ID = 'abc123';
window.RAGLY_POSITION = 'bottom-right';
window.RAGLY_PRIMARY_COLOR = '#9333EA';
window.RAGLY_BUTTON_SIZE = '60px';
```

**Green Theme - Large Button**
```javascript
window.RAGLY_CHATBOT_ID = 'abc123';
window.RAGLY_POSITION = 'bottom-right';
window.RAGLY_PRIMARY_COLOR = '#10B981';
window.RAGLY_BUTTON_SIZE = '80px';
```

## 📱 Responsive Behavior

The widget automatically adapts to different screen sizes:

- **Desktop**: Fixed position floating button with chat modal
- **Tablet**: Optimized modal size
- **Mobile**: Full-screen chat experience

## 🔧 Advanced Usage

### Programmatic Control

```javascript
// Wait for widget to load
window.addEventListener('load', () => {
  // Access widget elements (if needed for custom integrations)
  const chatButton = document.getElementById('ragly-chat-button');
  const chatWindow = document.getElementById('ragly-chat-window');
  
  // Example: Auto-open chat after 5 seconds
  setTimeout(() => {
    chatButton.click();
  }, 5000);
});
```

### Custom Styling

You can override widget styles with CSS:

```css
/* Custom button shadow */
#ragly-chat-button {
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4) !important;
}

/* Custom chat window border */
#ragly-chat-window {
  border: 2px solid #4F46E5 !important;
}
```

## 🛠️ Troubleshooting

### Widget not showing?

1. **Check chatbot ID**: Make sure you're using the correct ID from your dashboard
2. **Check console**: Open browser DevTools and look for errors
3. **Check URL**: Ensure the script URL is correct
4. **Check CORS**: If hosting on a different domain, ensure CORS is enabled

### Widget appears but doesn't respond?

1. **Check API connection**: Ensure your chatbot backend is running
2. **Check network tab**: Look for failed API requests
3. **Check chatbot status**: Ensure your chatbot is active in the dashboard

### Styling issues?

1. **Check z-index**: Increase `RAGLY_Z_INDEX` if widget is hidden behind other elements
2. **Check mobile view**: Test on actual mobile devices, not just browser resize
3. **Clear cache**: Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## 📊 Analytics & Monitoring

Track widget performance in your Ragly dashboard:

- **Total conversations**
- **User engagement**
- **Response times**
- **Popular questions**

## 🔒 Security & Privacy

- All communications are encrypted (HTTPS)
- No personal data is stored without consent
- GDPR compliant
- Customizable privacy policy link

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 📞 Support

Need help? Contact us:

- 📧 Email: support@ragly.com
- 💬 Chat: Use the widget on our website
- 📚 Docs: https://docs.ragly.com

## 📄 License

Copyright © 2026 Ragly. All rights reserved.

---

Made with ❤️ by Ragly Team
