# 🚀 Ragly - CI/CD Deployment Guide

Panduan lengkap untuk setup CI/CD pipeline dengan GitHub Actions untuk deployment otomatis ke VPS menggunakan Docker.

## 📋 Daftar Isi

- [Arsitektur CI/CD](#arsitektur-cicd)
- [Prerequisites](#prerequisites)
- [Setup GitHub Repository](#setup-github-repository)
- [Setup Docker Hub](#setup-docker-hub)
- [Setup VPS](#setup-vps)
- [Konfigurasi GitHub Actions](#konfigurasi-github-actions)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Monitoring](#monitoring)

## 🏗️ Arsitektur CI/CD

```
Developer
   ↓ git push
GitHub Repository
   ↓ (trigger GitHub Actions)
GitHub Actions (CI/CD)
   ↓ (build)
Docker Build Image
   ↓ (push)
Docker Hub
   ↓ (deploy via SSH)
VPS Pull Image Terbaru
   ↓ (restart)
Container Running
   ↓
https://ragly.ibpub.org
```

## ✅ Prerequisites

Sebelum memulai, pastikan Anda memiliki:

### 1. Akun dan Tools

- [x] Akun GitHub dengan repository: `https://github.com/zidaneelfasya/ragly.git`
- [x] Akun Docker Hub
- [x] VPS dengan spesifikasi minimal:
  - RAM: 2GB
  - Storage: 20GB
  - OS: Ubuntu 20.04/22.04 atau Debian
- [x] Domain: `ragly.ibpub.org` yang sudah mengarah ke IP VPS

### 2. Software di Local Machine

```bash
- Git
- SSH Client
- Text Editor (VS Code, Vim, dll)
```

### 3. Software di VPS

```bash
- Docker
- Docker Compose
- Nginx (untuk reverse proxy)
- Certbot (untuk SSL)
```

---

## 🔧 Setup GitHub Repository

### 1. Clone Repository

```bash
git clone https://github.com/zidaneelfasya/ragly.git
cd ragly
```

### 2. Verifikasi File CI/CD

Pastikan file-file berikut ada di repository:

```
ragly/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── scripts/
│   └── deploy.sh               # Deployment script untuk VPS
├── docker-compose.vps.yml       # Docker compose untuk VPS
├── Dockerfile                   # Docker image definition
└── DEPLOYMENT.md               # File ini
```

---

## 🐳 Setup Docker Hub

### 1. Login ke Docker Hub

Kunjungi: https://hub.docker.com/

### 2. Buat Repository

- Klik "Create Repository"
- Repository Name: `ragly-app`
- Visibility: Public atau Private
- Klik "Create"

### 3. Generate Access Token

1. Klik profile → "Account Settings"
2. Pilih "Security" → "New Access Token"
3. Description: `GitHub Actions CI/CD`
4. Access permissions: `Read, Write, Delete`
5. **SIMPAN TOKEN INI** - hanya muncul sekali!

---

## 🖥️ Setup VPS

### 1. Koneksi ke VPS

```bash
ssh root@your-vps-ip
# atau
ssh your-username@your-vps-ip
```

### 2. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Docker

```bash
# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, untuk non-root user)
sudo usermod -aG docker $USER
```

### 4. Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 5. Setup Application Directory

```bash
# Buat direktori untuk aplikasi
sudo mkdir -p /opt/ragly
cd /opt/ragly

# Set permissions
sudo chown -R $USER:$USER /opt/ragly
```

### 6. Upload File Konfigurasi

Upload file-file berikut ke VPS:

#### a. docker-compose.vps.yml

```bash
# Dari local machine, upload via scp
scp docker-compose.vps.yml user@vps-ip:/opt/ragly/
```

Atau buat manual di VPS:

```bash
nano /opt/ragly/docker-compose.vps.yml
```

Paste isi file `docker-compose.vps.yml`

#### b. .env File

```bash
nano /opt/ragly/.env
```

Isi dengan environment variables (contoh):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# RAG & LLM Services
RAG_BASE_URL=http://your-rag-service:8000
NEXT_PUBLIC_RAG_BASE_URL=http://your-rag-service:8000
LLM_SERVICE_URL=http://your-llm-service:8000
NEXT_PUBLIC_LLM_SERVICE_URL=http://your-llm-service:8000

# WhatsApp
WHATSAPP_API_URL=http://your-whatsapp-api:3001

# Gemini
GEMINI_API_KEY=your-gemini-api-key

# Site URL
NEXT_PUBLIC_SITE_URL=https://ragly.ibpub.org
```

### 7. Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Buat konfigurasi untuk domain
sudo nano /etc/nginx/sites-available/ragly.ibpub.org
```

Paste konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name ragly.ibpub.org;

    # Redirect HTTP to HTTPS (akan aktif setelah SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Aktifkan konfigurasi:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ragly.ibpub.org /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 8. Setup SSL dengan Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d ragly.ibpub.org

# Follow the prompts:
# - Enter email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 9. Setup SSH Key untuk GitHub Actions

```bash
# Generate SSH key (di VPS)
ssh-keygen -t ed25519 -C "github-actions@ragly" -f ~/.ssh/github_actions -N ""

# Tampilkan public key
cat ~/.ssh/github_actions.pub

# Tambahkan public key ke authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Set permissions (CRITICAL!)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub

# Enable PubkeyAuthentication in SSH config
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Or manually edit
# sudo nano /etc/ssh/sshd_config
# Find: #PubkeyAuthentication yes
# Change to: PubkeyAuthentication yes (remove #)

# Verify SSH config
sudo grep "^PubkeyAuthentication" /etc/ssh/sshd_config
# Should output: PubkeyAuthentication yes

# Restart SSH service (service name is 'ssh' not 'sshd' on Ubuntu/Debian)
sudo systemctl restart ssh

# Verify SSH service is running
sudo systemctl status ssh

# Test SSH config syntax
sudo sshd -t

# Tampilkan private key (untuk disimpan di GitHub Secrets)
echo "=== Copy this ENTIRE private key to GitHub Secret VPS_SSH_KEY ==="
cat ~/.ssh/github_actions
```

**⚠️ CRITICAL**: 
1. Copy **ENTIRE** private key including `-----BEGIN` and `-----END` lines
2. Make sure `PubkeyAuthentication yes` is uncommented in `/etc/ssh/sshd_config`
3. Restart SSH service after changes

---

## ⚙️ Konfigurasi GitHub Actions

### 1. Setup GitHub Secrets

Masuk ke repository GitHub: `https://github.com/zidaneelfasya/ragly`

1. Klik "Settings" → "Secrets and variables" → "Actions"
2. Klik "New repository secret"
3. Tambahkan secrets berikut:

#### Secrets yang Diperlukan:

| Secret Name | Value | Deskripsi |
|-------------|-------|-----------|
| `DOCKER_USERNAME` | `zidaneelfasya` | Username Docker Hub |
| `DOCKER_PASSWORD` | `your-docker-token` | Access token dari Docker Hub |
| `VPS_HOST` | `your-vps-ip` | IP address VPS (misal: 192.168.1.100) |
| `VPS_USERNAME` | `your-username` | SSH username VPS (misal: root atau ubuntu) |
| `VPS_SSH_KEY` | `private-key-content` | Private SSH key untuk akses VPS |
| `VPS_PORT` | `22` | SSH port (default: 22) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Supabase anon/public key |
| `NEXT_PUBLIC_RAG_BASE_URL` | `http://your-rag:8000` | URL RAG service |
| `NEXT_PUBLIC_LLM_SERVICE_URL` | `http://your-llm:8000` | URL LLM service |

**⚠️ PENTING**: Environment variables `NEXT_PUBLIC_*` diperlukan saat build Docker image karena Next.js akan embed values tersebut ke dalam static files.

### 2. Verifikasi Workflow File

File `.github/workflows/deploy.yml` sudah tersedia di repository. Pastikan konfigurasi sesuai:

- Branch trigger: `main` atau `master`
- Docker image name: `zidaneelfasya/ragly-app`
- VPS deployment path: `/opt/ragly`

---

## 🚀 Deployment

### Cara 1: Automatic Deployment (via Git Push)

```bash
# Dari local machine
cd /path/to/ragly

# Make changes to code
git add .
git commit -m "Update feature X"
git push origin main

# GitHub Actions akan otomatis:
# 1. Build Docker image
# 2. Push ke Docker Hub
# 3. Deploy ke VPS
# 4. Restart container
```

### Cara 2: Manual Deployment (via GitHub UI)

1. Buka: `https://github.com/zidaneelfasya/ragly/actions`
2. Pilih workflow "CI/CD Pipeline - Build and Deploy to VPS"
3. Klik "Run workflow"
4. Pilih branch
5. Klik "Run workflow"

### Cara 3: Manual Deployment (via SSH di VPS)

```bash
# Login ke VPS
ssh user@vps-ip

# Jalankan deployment script
cd /opt/ragly
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Monitor Deployment

#### Via GitHub Actions

1. Buka: `https://github.com/zidaneelfasya/ragly/actions`
2. Klik pada workflow run yang sedang berjalan
3. Lihat logs real-time

#### Via VPS

```bash
# Login ke VPS
ssh user@vps-ip

# Check container status
docker ps

# View logs
docker-compose -f /opt/ragly/docker-compose.vps.yml logs -f

# Check specific container
docker logs ragly-app -f
```

---

## 🔍 Monitoring

### 1. Check Application Status

```bash
# Via browser
https://ragly.ibpub.org

# Via curl
curl -I https://ragly.ibpub.org

# Health check endpoint
curl https://ragly.ibpub.org/api/health
```

### 2. Docker Commands

```bash
# List running containers
docker ps

# View container logs
docker logs ragly-app

# Follow logs in real-time
docker logs ragly-app -f

# View last 100 lines
docker logs ragly-app --tail 100

# Check container stats
docker stats ragly-app

# Inspect container
docker inspect ragly-app
```

### 3. System Resources

```bash
# Check disk usage
df -h

# Check memory usage
free -m

# Check CPU usage
top

# Check Docker disk usage
docker system df

# Cleanup unused Docker resources
docker system prune -a
```

### 4. Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🐛 Troubleshooting

### Problem 1: GitHub Actions Failed to Connect to VPS

**Symptoms**: SSH connection timeout atau authentication failed

**Error Message**: `ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain`

**Solution**:
```bash
# 1. Check if PubkeyAuthentication is enabled (COMMON ISSUE!)
sudo grep "^PubkeyAuthentication" /etc/ssh/sshd_config

# If output is empty or shows commented line, enable it:
sudo sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# 2. Verify the change
sudo grep "^PubkeyAuthentication" /etc/ssh/sshd_config
# Should output: PubkeyAuthentication yes (without #)

# 3. Restart SSH service (service name is 'ssh' not 'sshd' on Ubuntu/Debian)
sudo systemctl restart ssh

# 4. Verify SSH service is running
sudo systemctl status ssh

# 5. Check authorized_keys permissions
ls -la ~/.ssh/authorized_keys
# Should be: -rw------- (600)

# 6. Check .ssh directory permissions
ls -la ~/.ssh/
# Should be: drwx------ (700)

# 7. Test SSH connection manually from local machine
ssh -i path/to/private-key user@vps-ip -v

# 8. Check VPS firewall
sudo ufw status
sudo ufw allow 22/tcp  # Allow SSH
sudo ufw allow 80/tcp  # Allow HTTP
sudo ufw allow 443/tcp # Allow HTTPS

# 9. View SSH logs for debugging
sudo tail -f /var/log/auth.log  # Ubuntu/Debian
```

**Common Causes**:
- ✅ PubkeyAuthentication is commented out in `/etc/ssh/sshd_config` (MOST COMMON)
- ✅ Wrong file permissions on `.ssh/` or `authorized_keys`
- ✅ Private key not properly copied to GitHub Secrets
- ✅ SSH service not restarted after config changes
- ✅ Wrong username in VPS_USERNAME secret

### Problem 2: Docker Build Failed

**Symptoms**: GitHub Actions fails at build step

**Solution**:
```bash
# Check Dockerfile syntax
docker build -t test .

# Check build logs in GitHub Actions
# Fix dependencies in package.json if needed
```

### Problem 3: Container Won't Start

**Symptoms**: Container exits immediately after start

**Solution**:
```bash
# Check container logs
docker logs ragly-app

# Check environment variables
docker exec ragly-app env

# Verify .env file exists and is correct
cat /opt/ragly/.env

# Try running container interactively
docker run -it --rm zidaneelfasya/ragly-app:latest sh
```

### Problem 4: Port Already in Use

**Symptoms**: Error "port is already allocated"

**Solution**:
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or stop the container using that port
docker stop ragly-app
```

### Problem 5: Out of Disk Space

**Symptoms**: "no space left on device"

**Solution**:
```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -a --volumes

# Remove old images
docker images
docker rmi <image-id>

# Clean up logs
sudo journalctl --vacuum-time=3d
```

### Problem 6: SSL Certificate Issues

**Symptoms**: HTTPS not working

**Solution**:
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

### Problem 7: Application Shows Old Version

**Symptoms**: Changes not reflected after deployment

**Solution**:
```bash
# Verify image was pulled
docker images | grep ragly-app

# Force pull latest image
docker pull zidaneelfasya/ragly-app:latest

# Remove old containers and images
docker-compose -f docker-compose.vps.yml down
docker rmi zidaneelfasya/ragly-app:latest
docker-compose -f docker-compose.vps.yml up -d

# Clear browser cache
# Or open in incognito mode
```

---

## 📊 Best Practices

### 1. Security

- ✅ Gunakan SSH key authentication, bukan password
- ✅ Set firewall rules yang ketat
- ✅ Update sistem secara berkala
- ✅ Gunakan strong passwords
- ✅ Enable fail2ban untuk proteksi brute-force
- ✅ Limit SSH access by IP jika memungkinkan

### 2. Deployment

- ✅ Test di local sebelum push ke production
- ✅ Gunakan semantic versioning untuk tags
- ✅ Backup database sebelum deployment
- ✅ Monitor logs setelah deployment
- ✅ Implement health checks

### 3. Docker

- ✅ Cleanup old images secara berkala
- ✅ Set resource limits untuk containers
- ✅ Use multi-stage builds untuk image yang lebih kecil
- ✅ Tag images dengan version numbers
- ✅ Monitor disk usage

### 4. Monitoring

- ✅ Setup uptime monitoring (contoh: UptimeRobot)
- ✅ Configure log rotation
- ✅ Monitor resource usage
- ✅ Set up alerts untuk issues
- ✅ Regular backup strategy

---

## 📝 Maintenance Commands

### Update Application

```bash
# Method 1: Via Git Push (Recommended)
git push origin main
# GitHub Actions akan otomatis deploy

# Method 2: Manual
ssh user@vps-ip
cd /opt/ragly
./scripts/deploy.sh
```

### Backup

```bash
# Backup .env file
scp user@vps-ip:/opt/ragly/.env ./backup/.env.$(date +%Y%m%d)

# Backup Docker volumes (if any)
ssh user@vps-ip
docker run --rm -v ragly_data:/data -v $(pwd):/backup alpine tar czf /backup/ragly-data-backup-$(date +%Y%m%d).tar.gz /data
```

### Rollback

```bash
# Via VPS
ssh user@vps-ip
cd /opt/ragly

# Pull specific version
docker pull zidaneelfasya/ragly-app:main-abc1234

# Update docker-compose.vps.yml to use specific tag
nano docker-compose.vps.yml
# Change: image: zidaneelfasya/ragly-app:main-abc1234

# Restart
docker-compose -f docker-compose.vps.yml up -d
```

---

## 🆘 Support

Jika mengalami masalah:

1. **Check GitHub Actions logs**: `https://github.com/zidaneelfasya/ragly/actions`
2. **Check VPS logs**: `docker logs ragly-app`
3. **Check Nginx logs**: `sudo tail -f /var/log/nginx/error.log`
4. **Check system resources**: `htop` atau `docker stats`

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Documentation](https://certbot.eff.org/)

---

## ✅ Checklist Setup

Gunakan checklist ini untuk memastikan semua langkah sudah dilakukan:

### GitHub
- [ ] Repository di-clone
- [ ] File CI/CD workflow tersedia
- [ ] GitHub Secrets dikonfigurasi (6 secrets)

### Docker Hub
- [ ] Repository dibuat
- [ ] Access token di-generate
- [ ] Token disimpan di GitHub Secrets

### VPS
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Application directory created (`/opt/ragly`)
- [ ] docker-compose.vps.yml uploaded
- [ ] .env file configured
- [ ] Nginx installed dan configured
- [ ] SSL certificate generated
- [ ] SSH key untuk GitHub Actions setup
- [ ] Firewall configured

### Testing
- [ ] Test deployment via git push
- [ ] Access https://ragly.ibpub.org successfully
- [ ] Health check endpoint working
- [ ] Logs accessible
- [ ] Auto-deploy working

---

**🎉 Selamat! CI/CD Pipeline Anda sudah siap!**

Setiap kali Anda `git push`, aplikasi akan otomatis:
1. Build Docker image baru
2. Push ke Docker Hub  
3. Deploy ke VPS
4. Restart dengan versi terbaru

**URL Aplikasi**: https://ragly.ibpub.org

---

*Last updated: March 5, 2026*
