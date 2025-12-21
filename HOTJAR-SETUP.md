# Hotjar Setup Instructions

## What is Hotjar?
Hotjar is a powerful analytics tool that provides:
- **Heatmaps** - See where users click, move, and scroll
- **Session Recordings** - Watch real user sessions
- **User Feedback** - Collect feedback directly from visitors
- **Surveys & Polls** - Ask questions to your visitors
- **Conversion Funnels** - Track user journeys

## How to Add Hotjar

### Step 1: Get Your Hotjar Site ID

1. **Sign up/Login** to Hotjar: https://www.hotjar.com/
2. **Create a new site** (or use existing)
3. **Copy your Site ID** (it's a number like `1234567`)

### Step 2: Add to Your Website

1. Open `index.html`
2. Find the Hotjar section (around line 287)
3. Uncomment the Hotjar script
4. Replace `YOUR_HOTJAR_ID` with your actual Site ID

**Example:**
```html
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:1234567,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

### Step 3: Verify It's Working

1. Deploy your site
2. Visit your website
3. Go to Hotjar dashboard: https://insights.hotjar.com/
4. Check if sessions are being recorded (may take a few minutes)

## Hotjar Features You Can Use

### 1. Heatmaps
- See where users click most
- Identify scroll depth
- Find dead clicks (clicks that don't work)

### 2. Session Recordings
- Watch real user sessions
- See where users get confused
- Identify UX issues

### 3. Feedback Widgets
- Add feedback buttons to your site
- Collect user opinions
- Get suggestions for improvements

### 4. Surveys
- Ask visitors questions
- Get insights about your services
- Understand customer needs

## Privacy & GDPR

Hotjar is GDPR compliant, but you should:
- Add a privacy policy mentioning Hotjar
- Consider a cookie consent banner
- Inform users about data collection

## Pricing

- **Free Plan**: 35 daily session recordings, 3 heatmaps
- **Plus Plan**: $39/month - More recordings and features
- **Business Plan**: Custom pricing

## Current Status

✅ Hotjar code is ready in `index.html`
⚠️ **You need to:**
1. Get your Hotjar Site ID
2. Uncomment the script
3. Replace `YOUR_HOTJAR_ID` with your ID

---

**Once added, you'll be able to see:**
- Where users click on your buttons
- How far users scroll
- Which sections get the most attention
- User session recordings
- Heatmaps of user behavior

