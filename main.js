// ==========================================
// 1. LOADING PAGE LOGIC (3 seconds)
// ==========================================
let startTime = performance.now();
let remaining = 3.0;
let animationFrame;

const progressFill = document.getElementById('progressFill');
const countdownSpan = document.getElementById('countdownDisplay');

function updateLoader(now) {
  const elapsed = (now - startTime) / 1000;
  remaining = Math.max(0, 3.0 - elapsed);
  const percent = (elapsed / 3.0) * 100;

  if (progressFill) progressFill.style.width = Math.min(100, percent) + '%';
  if (countdownSpan) countdownSpan.innerText = remaining.toFixed(1) + ' s';

  if (remaining > 0) {
    animationFrame = requestAnimationFrame(updateLoader);
  } else {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    finishLoading();
  }
}

function finishLoading() {
  const overlay = document.getElementById('loadingOverlay');
  const mainApp = document.getElementById('mainApp');
  
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
  }
  
  if (mainApp) {
    mainApp.classList.add('app-visible');
  }
  
  // Fully initialize main app
  render();
}

// Start Loader Animation
startTime = performance.now();
animationFrame = requestAnimationFrame(updateLoader);


// ==========================================
// 2. STATE & GLOBAL CONFIGURATIONS
// ==========================================
let appDark = true;

const S = {
  platform: 'tiktok',
  darkBubble: false,
  avatar: 'https://i.pravatar.cc/200?img=12',
  username: 'user.official',
  displayName: 'User Official',
  comment: 'Write any comment and see what happens 😊',
  replyLabel: 'User Official',
  time: '2h',
  verified: true,
  showLikes: true,
  showReply: false,
  replyTxt: 'Great video! 🔥',
  likes: '12.4K',
  replies: '847',
  liked: false,
};

const AVS = [12, 15, 25, 33, 36, 44, 47, 52, 60, 65, 70, 75, 83, 91];


// ==========================================
// 3. AVATAR ACTIONS
// ==========================================
function randAv() {
  const i = AVS[Math.floor(Math.random() * AVS.length)];
  S.avatar = `https://i.pravatar.cc/200?img=${i}`;
  document.getElementById('avThumb').src = S.avatar;
  render();
}

function loadAv(e) {
  const f = e.target.files[0];
  if (!f) return;

  const r = new FileReader();
  r.onload = ev => {
    S.avatar = ev.target.result;
    document.getElementById('avThumb').src = ev.target.result;
    render();
  };
  r.readAsDataURL(f);
}


// ==========================================
// 4. UI CONTROLS & UTILITIES
// ==========================================
function togOpt(el, k) {
  el.classList.toggle('on');
  const v = el.classList.contains('on');

  if (k === 'verified') S.verified = v;
  if (k === 'likes') S.showLikes = v;
  if (k === 'reply') {
    S.showReply = v;
    const f = document.getElementById('repField');
    if (f) f.style.display = v ? 'flex' : 'none';
  }
  render();
}

function toggleTheme() {
  appDark = !appDark;
  document.body.classList.toggle('light-mode', !appDark);
  document.getElementById('themeIcon').className = appDark ? 'fa fa-moon' : 'fa fa-sun';
  S.darkBubble = appDark;
  render();
}

function tgl() {
  S.liked = !S.liked;
  render();
}

function switchP(el) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  S.platform = el.dataset.p;
  render();
  closeSb();
}

function getBg() {
  return S.platform === 'tiktok' ? (S.darkBubble ? '#0a0a12' : '#0a0a12') : '#ffffff';
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


// ==========================================
// 5. INPUT READER
// ==========================================
function readInputs() {
  S.username = document.getElementById('username').value || 'username';
  S.displayName = document.getElementById('displayName').value || S.username;
  S.comment = document.getElementById('commentText').value || '';
  S.time = document.getElementById('timeAgo').value || '2h';
  S.replyLabel = document.getElementById('replyLabel').value || 'username';
  S.likes = document.getElementById('likeCount').value || '0';
  S.replies = document.getElementById('replyCount').value || '0';
  S.replyTxt = document.getElementById('replyTxt').value || '';
}


// ==========================================
// 6. HTML BUILDERS FOR PLATFORMS
// ==========================================
function buildTikTok() {
  const dc = S.darkBubble ? ' dark-bubble' : '';
  return `
    <div class="tt-wrap${dc}">
      <div class="tt-bubble">
        <img class="tt-av" src="${S.avatar}" crossorigin="anonymous"/>
        <div class="tt-body">
          <div class="tt-reply-label">Reply to ${esc(S.replyLabel)}'s comment</div>
          <div class="tt-text">${esc(S.comment)}</div>
          <div class="tt-user-row">
            <span class="tt-user" style="font-weight:600;">${esc(S.displayName)}</span>
            <span class="tt-user" style="color:#aaa;font-size:12px;margin-left:2px;">@${esc(S.username)}</span>
            <i class="fa fa-circle-check tt-vtick${S.verified ? ' show' : ''}" style="color:#20d5ec;"></i>
          </div>
        </div>
      </div>
    </div>`;
}

function buildFacebook() {
  return `
    <div class="fb-card">
      <div class="fb-row">
        <img class="fb-av" src="${S.avatar}" crossorigin="anonymous"/>
        <div class="fb-right">
          <div class="fb-bubble">
            <div class="fb-name-row">
              <span class="fb-name">${esc(S.displayName)}</span>
              <i class="fa fa-circle-check fb-vtick${S.verified ? ' show' : ''}"></i>
            </div>
            <div class="fb-text">${esc(S.comment)}</div>
          </div>
          ${S.showLikes ? `
            <div style="margin-top:4px;margin-left:4px;">
              <div class="fb-react">👍 ❤️ 😂 <span style="color:#65676b;margin-left:2px;">${esc(S.likes)}</span></div>
            </div>` : ''}
          <div class="fb-meta" style="margin-top:${S.showLikes ? '8px' : '4px'}">
            <span class="${S.liked ? 'active' : ''}">Like</span>
            <span>Reply</span>
            <span class="t">${esc(S.time)}</span>
          </div>
          ${S.showReply ? `
            <div class="fb-rep-wrap">
              <img class="fb-rep-av" src="${S.avatar}" crossorigin="anonymous"/>
              <div class="fb-rep-bub">
                <span style="font-weight:700;color:#050505;">${esc(S.displayName)}</span> ${esc(S.replyTxt)}
              </div>
            </div>` : ''}
        </div>
      </div>
    </div>`;
}

function buildYouTube() {
  return `
    <div class="yt-card">
      <div class="yt-row">
        <img class="yt-av" src="${S.avatar}" crossorigin="anonymous"/>
        <div class="yt-body">
          <div class="yt-meta">
            <span class="yt-name">${esc(S.displayName)}</span>
            ${S.verified ? `<i class="fa fa-circle-check yt-vtick show"></i>` : ''}
            <span class="yt-time">${esc(S.time)}</span>
          </div>
          <div class="yt-text">${esc(S.comment)}</div>
          ${S.showLikes ? `
            <div class="yt-acts">
              <div class="yt-btn${S.liked ? ' liked' : ''}" onclick="tgl()">
                <i class="fa${S.liked ? '-solid' : '-regular'} fa-thumbs-up"></i>
                <span>${esc(S.likes)}</span>
              </div>
              <div class="yt-btn"><i class="fa-regular fa-thumbs-down"></i></div>
              <div class="yt-btn" style="font-weight:500;">Reply</div>
            </div>` : ''}
          ${S.showReply ? `<div class="yt-rep">${esc(S.replyTxt)}</div>` : ''}
        </div>
      </div>
    </div>`;
}

function buildInstagram() {
  return `
    <div class="ig-card">
      <div class="ig-row">
        <img class="ig-av" src="${S.avatar}" crossorigin="anonymous"/>
        <div class="ig-body">
          <div class="ig-line"><span class="ig-un">${esc(S.displayName)}</span><i class="fa fa-circle-check ig-vtick${S.verified ? ' show' : ''}"></i>
${esc(S.comment)}</div><div class="ig-meta">
            <span class="ig-time">${esc(S.time)}</span>
            ${S.showLikes ? `<span class="ig-rep-btn">${esc(S.likes)} likes</span>` : ''}
            <span class="ig-rep-btn">Reply</span>
            <i class="fa${S.liked ? '-solid' : '-regular'} fa-heart ig-heart${S.liked ? ' liked' : ''}" onclick="tgl()"></i>
          </div>
          ${S.showReply ? `<div class="ig-rep"><strong>${esc(S.displayName)}</strong> ${esc(S.replyTxt)}</div>` : ''}
        </div>
      </div>
    </div>`;
}

function buildTwitter() {
  const h = S.username.startsWith('@') ? S.username : '@' + S.username;
  return `
    <div class="tw-card">
      <div class="tw-row">
        <img class="tw-av" src="${S.avatar}" crossorigin="anonymous"/>
        <div class="tw-body">
          <div class="tw-top">
            <span class="tw-name">${esc(S.displayName)}</span>
            ${S.verified ? `<i class="fa fa-circle-check tw-vtick show"></i>` : ''}
            <span class="tw-handle">${esc(h)}</span>
            <span class="tw-dot">·</span>
            <span class="tw-time">${esc(S.time)}</span>
          </div>
          <div class="tw-text">${esc(S.comment)}</div>
          ${S.showLikes ? `
            <div class="tw-acts">
              <span class="tw-act"><i class="fa-regular fa-comment"></i> ${esc(S.replies)}</span>
              <span class="tw-act rt"><i class="fa-solid fa-retweet"></i></span>
              <span class="tw-act${S.liked ? ' liked' : ''}" onclick="tgl()">
                <i class="fa${S.liked ? '-solid' : '-regular'} fa-heart"></i> ${esc(S.likes)}
              </span>
              <span class="tw-act"><i class="fa-solid fa-share-nodes"></i></span>
            </div>` : ''}
          ${S.showReply ? `<div class="tw-rep">${esc(S.replyTxt)}</div>` : ''}
        </div>
      </div>
    </div>`;
}


// ==========================================
// 7. EXPORT IMAGE ACTIONS & SIDEBAR
// ==========================================
function exportPNG() {
  const el = document.getElementById('exportTarget').firstElementChild;
  if (!el) return;

  html2canvas(el, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: getBg() })
    .then(c => {
      const a = document.createElement('a');
      a.download = 'tokcomment.png';
      a.href = c.toDataURL('image/png');
      a.click();
      showToast('PNG downloaded!');
    });
}

function exportJPG() {
  const el = document.getElementById('exportTarget').firstElementChild;
  if (!el) return;

  html2canvas(el, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: getBg() })
    .then(c => {
      const a = document.createElement('a');
      a.download = 'tokcomment.jpg';
      a.href = c.toDataURL('image/jpeg', 0.96);
      a.click();
      showToast('JPG downloaded!');
    });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleSb() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function closeSb() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}


// ==========================================
// 8. APP RENDER & INITIALIZATION
// ==========================================
function render() {
  readInputs();
  const map = {
    tiktok: buildTikTok,
    facebook: buildFacebook,
    youtube: buildYouTube,
    instagram: buildInstagram,
    twitter: buildTwitter
  };
  document.getElementById('exportTarget').innerHTML = (map[S.platform] || buildTikTok)();
}

// Register Window Object Functions (Global Access)
window.render = render;
window.switchP = switchP;
window.togOpt = togOpt;
window.toggleTheme = toggleTheme;
window.randAv = randAv;
window.loadAv = loadAv;
window.exportPNG = exportPNG;
window.exportJPG = exportJPG;
window.tgl = tgl;
window.toggleSb = toggleSb;
window.closeSb = closeSb;

// Initial Render on script start
render();