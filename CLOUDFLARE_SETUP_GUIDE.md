# 🌐 Cloudflare Setup Guide for showcase.damieus.app

**Domain:** showcase.damieus.app  
**Vercel IP:** 76.76.21.21  
**Status:** Pending DNS Configuration  

---

## Option 1: Manual Setup (Recommended if you prefer GUI)

### Step 1: Log into Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com
2. Select domain: **damieus.app**

### Step 2: Add DNS Record
1. Go to **DNS** → **Records**
2. Click **Add record**
3. Configure:
   - **Type:** A
   - **Name:** showcase
   - **IPv4 address:** 76.76.21.21
   - **Proxy status:** ✅ Proxied (orange cloud)
   - **TTL:** Auto
4. Click **Save**

### Step 3: Verify in Vercel
1. Wait 1-2 minutes for DNS propagation
2. Go to: https://vercel.com/dame-luthas/damieus_awwwards_poc_1/settings/domains
3. Check if showcase.damieus.app shows as "Valid Configuration"
4. Vercel will auto-provision SSL certificate

---

## Option 2: Automated Setup (Requires API Token)

### Get Your Credentials

**1. Get Cloudflare API Token:**
- Go to: https://dash.cloudflare.com/profile/api-tokens
- Click "Create Token"
- Use template: "Edit zone DNS"
- Zone Resources: Include → damieus.app
- Copy the token

**2. Get Zone ID:**
- Go to: https://dash.cloudflare.com
- Select domain: damieus.app
- Copy **Zone ID** from right sidebar (Overview section)

### Run the Automated Script

```bash
cd /Users/dame/management-git

# Set your credentials
export CLOUDFLARE_API_TOKEN="your_api_token_here"
export ZONE_ID="your_zone_id_here"

# Run the script
bash add-showcase-dns.sh
```

**Expected Output:**
```
🌐 Adding DNS record for showcase.damieus.app → 76.76.21.21
✅ DNS record added successfully!
"id":"abc123def456..."
```

---

## Verification Steps

### 1. Check DNS Propagation
```bash
# Check if DNS is propagating
dig showcase.damieus.app +short

# Should return: 76.76.21.21 (or Cloudflare IPs if proxied)
```

### 2. Check Vercel Configuration
```bash
cd /Users/dame/management-git/damieus_awwwards_poc_1

# Check domain status
VERCEL_ORG_ID=team_gDyS6wIPTEdeuMu1PVvorxXx \
VERCEL_PROJECT_ID=prj_2BOuOQK0eHLk9znOELLGrfg3UrBx \
vercel --token=Z9zJ07SG7OCqjh53ImvwRTyT domains ls
```

### 3. Test the Site
```bash
# Check HTTP response
curl -I https://showcase.damieus.app

# Should return: HTTP/2 200
```

---

## Troubleshooting

### DNS Not Propagating
- **Wait:** DNS can take 1-48 hours (usually < 5 minutes with Cloudflare)
- **Check:** https://dnschecker.org/#A/showcase.damieus.app
- **Flush cache:** `sudo dscacheutil -flushcache` (macOS)

### SSL Certificate Pending
- **Wait:** Vercel auto-provisions SSL (takes 2-10 minutes)
- **Check status:** Vercel Dashboard → Settings → Domains
- **Retry:** Sometimes needs a second deployment

### "Invalid Configuration" in Vercel
1. Double-check IP: Must be **76.76.21.21**
2. Check DNS: `dig showcase.damieus.app`
3. Wait 5 minutes and refresh Vercel dashboard
4. Try "Refresh" button in Vercel domain settings

### Cloudflare "Too Many Redirects"
- **Fix:** Change SSL/TLS mode to "Full" (not "Flexible")
- **Location:** SSL/TLS → Overview → Encryption mode
- **Select:** Full (recommended for Vercel)

---

## Post-Setup: Update Documentation

Once DNS is configured and site is accessible:

```bash
cd /Users/dame/management-git/damieus_awwwards_poc_1

# Update DEPLOYMENT_SUCCESS.md with new domain
# Update canonical URLs in SEO metadata to use showcase.damieus.app
# Commit changes

git add .
git commit -m "docs: Add showcase.damieus.app custom domain configuration"
git push
```

---

## Quick Reference

**Domain:** showcase.damieus.app  
**Vercel IP:** 76.76.21.21  
**DNS Type:** A Record  
**Proxy Status:** Proxied (Cloudflare)  
**SSL/TLS Mode:** Full  
**TTL:** Auto  

**Vercel Project:** https://vercel.com/dame-luthas/damieus_awwwards_poc_1  
**Cloudflare Dashboard:** https://dash.cloudflare.com  

---

## Next Steps After Setup

1. **Update SEO Metadata**
   - Change canonical URLs from damieus.com to showcase.damieus.app
   - Update sitemap.xml base URL (when generated)

2. **Configure Analytics**
   - Add Google Analytics (optional)
   - Enable Vercel Analytics
   - Enable Cloudflare Web Analytics

3. **Performance Monitoring**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Monitor via Vercel dashboard

4. **Security Headers**
   - Cloudflare automatically adds:
     - HSTS
     - X-Content-Type-Options
     - X-Frame-Options
   - Verify with: https://securityheaders.com

---

**Setup Time:** ~5 minutes  
**SSL Provisioning:** 2-10 minutes  
**DNS Propagation:** 1-5 minutes (with Cloudflare)  
**Total Time to Live:** ~15 minutes max
