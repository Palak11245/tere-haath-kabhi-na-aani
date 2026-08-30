/* tere haath kabhi na aani
   The button is STILL. You go to click it. It steps aside and says YOU THOUGHT.

   Two rules that shape this whole file:
   1. PERF — nothing touches the DOM unless something actually moved. No filters, ever.
   2. The button does not "flee". It waits, then dodges once, deliberately, with a line. */

const SHEILA_SRC = 'audio/sheila-ki-jawaani.mp3';   // 0:08–0:13 clip. one-line swap.
const SFX_DIR = 'sfx/', MEME_DIR = 'memes/';

/* ============ dom ============ */
const $ = s => document.querySelector(s);
const btn = $('#btn'), intro = $('#intro'), title = $('#title'), kicker = $('#kicker'),
      sub = $('#sub'), arrow = $('#arrow'), hud = $('#hud'), commentEl = $('#comment'),
      bub = $('#bubble'), memeEl = $('#meme'), memeVid = $('#memeVid'), giveup = $('#giveup'),
      winEl = $('#win'), certImg = $('#cert'), dlLink = $('#dl'), sheila = $('#sheila'),
      grassEl = $('#grass'), gCert = $('#gcert'), gDl = $('#gdl');
sheila.src = SHEILA_SRC;

const vw = () => innerWidth, vh = () => innerHeight;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
// Where the cursor is heading, not where it is. The button flees this point,
// so a fast approach gets cut off instead of chased.
const predX = () => S.mx + clamp(S.vmx * .16, -280, 280);
const predY = () => S.my + clamp(S.vmy * .16, -280, 280);

/* ============ real meme sound effects ============ */
const SOUNDS = ['vine-boom', 'bruh', 'airhorn', 'erro', 'sad-trombone', 'metal-pipe-falling',
  'emotional-damage-meme', 'fart-with-reverb', 'taco-bell-bong-sfx', 'ba-dum-tss', 'nope-nope-nope',
  'yeet', 'windows-xp-error', 'rizz-sound-effect', 'goofy-ahh-car-horn', 'among-us-role-reveal-sound',
  'crickets-chirping', 'wow-anime', 'discord-notification', 'oh-my-god-bro-oh-hell-nah-man',
  'boowomp', 'aughhh', 'explosion-meme',
  'water-drop', 'bubble', 'liquid', 'goo', 'squish', 'plop'];
const VOL = { 'vine-boom': .85, 'airhorn': .5, 'bruh': .7, 'aughhh': .6, 'boowomp': .8,
  'crickets-chirping': .45, 'oh-my-god-bro-oh-hell-nah-man': .7, 'among-us-role-reveal-sound': .6 };
const pool = {};
SOUNDS.forEach(n => {
  const arr = [0, 1].map(() => { const a = new Audio(SFX_DIR + n + '.mp3'); a.preload = 'auto'; return a; });
  arr.i = 0; pool[n] = arr;
});
function sfx(name, vol) {
  const p = pool[name]; if (!p) return;
  p.i = (p.i + 1) % p.length;
  const a = p[p.i];
  try { a.currentTime = 0; a.volume = vol != null ? vol : (VOL[name] || .6); a.play().catch(() => {}); } catch (e) {}
}

/* ============ short taunts — what the button actually says ============ */
const TAUNT = {
  thought: ['you thought', 'you thought.', 'nope', 'haath nahi aaya', 'not today', 'no.',
            'skill issue', 'lol', 'aur bata', 'missed', 'imagine', 'weak', 'sit down',
            'tere haath? na.', 'try again bestie', 'that was embarrassing', 'again? really?'],
  tease:   ['just kidding', 'psych', 'gotcha', 'sike', 'i was never there'],
  zip:     ['bye', 'catch me', 'later', 'zoom', 'gone'],
  hop:     ['boing', 'wheee', 'up here', 'hop'],
  moonwalk:['walking away from you', 'slowly. on purpose.', 'this is a choice', 'strolling'],
  swing:   ['behind you', 'other side', 'turn around', 'over here'],
  mercy:   ['here. take it.', "i'll come to you", 'this is charity', 'go on then'],
  duck:    ['gone', 'poof', 'nothing here'],
  camo:    ['where', 'find me', 'still here. somewhere.'],
  split:   ['which one', 'good luck', 'pick wrong'],
  morph:   ['new shape. same L.', 'different now', 'guess the hitbox'],
  glitch:  ['01001110 01001111', 'e̵r̷r̸o̷r̶', 'no such button'],
  close:   ['SO close', 'a pixel. one pixel.', 'ooooh', 'nearly'],
  trip:    ['ow', 'wait—', 'lag', 'oof', 'give me a second', 'ok that hurt'],
  melt:    ['not solid, apparently', 'i can do that', 'poured myself out',
            'reassembled. rethink.', 'liquid'],
  slingshot: ['and away', 'launched', 'wound up, gone'],
  feint:   ['other way', 'made you look', 'wrong side', 'ha'],
  wallbounce: ['boing boing', 'off the wall', 'ricochet'],
  corner:  ['corner office', 'safe up here', 'nice view'],
  mirror:  ['opposite day', 'other end', 'flipped'],
  drop:    ['see you at the top', 'gravity', 'falling with style'],
  intro:   ['ab try kar', 'now try.', 'go on then', 'your turn'],
  win:     ['...fine.', 'you got me.', 'ok. wow.']
};

/* ============ the long, personal ones (subtitle bar) ============ */
const BANK = {
  fast: ["slow down. you are not going to catch a button by panicking. that is also just advice for your life.",
    "all that speed and still nothing. feels familiar, doesn't it.",
    "whipping the mouse around like that has never solved a single one of your problems.",
    "you move like someone who reads the first two lines of everything."],
  slow: ["oh, we're being strategic now? a little late for that, isn't it.",
    "careful and deliberate. where was this in every other decision you have made.",
    "take your time. you clearly have an alarming amount of it."],
  reverse: ["pick a direction. in this and in everything else.",
    "left, right, left. i have watched you second-guess a mouse movement.",
    "this is the most indecisive anyone has ever been at a rectangle."],
  idle: ["the button is right there. you are just high. or worse, bored of trying.",
    "sitting perfectly still, hoping it comes to you. your whole strategy, honestly.",
    "you stopped. not quit, not won. stopped. very on brand.",
    "are you thinking, or has the screen just become a place you stare at."],
  repeat: ["trying the same thing again? bold of you to think that will work this time.",
    "same angle, fourth time. some people would call this practice. i call it a pattern.",
    "you have one move and i have watched you run it into the ground."],
  back: ["oh, you're back. missed me, or just avoiding something more important.",
    "welcome back from whatever tab that was. we both know it wasn't work.",
    "you left, did nothing meaningful, and returned. a complete summary of you."],
  rage: ["clicking harder does not make you faster. ask anyone who has met you.",
    "yes, hit it more. that has historically gone great for you.",
    "you are hammering a mouse button at a javascript object. sit with that."],
  mercyMiss: ["...how. genuinely, how.", "i moved TOWARD you. you still found a way.",
    "that was charity and you fumbled the charity."],
  miss: ["get a job.", "what are you doing with your life.",
    "it's a button. it has one job. so do you, presumably. neither of us is doing great.",
    "i have seen toddlers with better hand-eye coordination and better life choices.",
    "have you considered that this says something about you?",
    "your mouse sounds tired. honestly, so do you.",
    "i respect the commitment to a bad decision. it is very you.",
    "this is the most effort you have put into anything today and it is still not enough.",
    "somewhere there is a person who loves you and would like you to stop.",
    "i am a rectangle with a border and i am outperforming you.",
    "every miss is a small biography.",
    "you should be doing literally anything else and we both know exactly what it is."],
  min1: ["one minute. get a job."],
  min3: ["three minutes on a button. what are you doing with your life."],
  min5: ["five minutes. this is now a cry for help and i am not qualified to help you."],
  min10: ["ten minutes. i have seen people give up on healthier things than this faster."]
};
const usedPool = {};
function line(cat) {
  const b = BANK[cat] || BANK.miss;
  if (!usedPool[cat] || !usedPool[cat].length) usedPool[cat] = b.slice();
  return usedPool[cat].splice((Math.random() * usedPool[cat].length) | 0, 1)[0];
}
let lastSay = 0;
function say(cat, force) {
  const t = performance.now();
  if (!force && t - lastSay < 6000) return;
  lastSay = t;
  commentEl.textContent = line(cat);
  commentEl.classList.add('on');
  clearTimeout(say._t);
  say._t = setTimeout(() => commentEl.classList.remove('on'), force ? 5000 : 4200);
}

let usedTaunt = {};
function taunt(cat, x, y) {
  const b = TAUNT[cat] || TAUNT.thought;
  if (!usedTaunt[cat] || !usedTaunt[cat].length) usedTaunt[cat] = b.slice();
  bub.textContent = usedTaunt[cat].splice((Math.random() * usedTaunt[cat].length) | 0, 1)[0];
  bub.classList.remove('pop'); void bub.offsetWidth;
  const w = bub.offsetWidth, h = bub.offsetHeight;
  bub.style.left = clamp(x - 24, 8, vw() - w - 8) + 'px';
  bub.style.top = clamp(y - halfH() - h - 26, 8, vh() - h - 8) + 'px';
  bub.classList.add('pop');
}

/* ============ meme cards (real gifs, transcoded to mp4) ============ */
const MEME_CLIPS = ['thought', 'smh', 'stare', 'hmm', 'imagination', 'laugh', 'clap'];
const MEME_CAPS = ['that just happened', 'skill issue confirmed', 'exhibit a',
  'the button is fine. you are not.', 'everyone saw that', 'documented for later',
  'nothing personal. entirely personal.', 'still 0 for everything', 'certified fumble',
  'your hand-eye coordination, visualised', 'no notes. terrible.', 'peak performance',
  'the button remains undefeated', 'try using the other hand', 'a masterclass in missing',
  'this is your legacy', 'we are all watching', 'peak human achievement',
  'brother. ew.', 'peak indecision'];
let lastClip = '';
function memeRandom(cap) {
  let c = pick(MEME_CLIPS), guard = 0;
  while (c === lastClip && guard++ < 5) c = pick(MEME_CLIPS);
  lastClip = c;
  meme(c, cap || pick(MEME_CAPS));
}
function meme(name, cap) {
  memeVid.src = MEME_DIR + name + '.mp4';
  memeEl.querySelector('.cap').textContent = cap;
  memeVid.play().catch(() => {});
  memeEl.classList.add('on');
  clearTimeout(meme._t);
  meme._t = setTimeout(() => memeEl.classList.remove('on'), 2800);
}

/* ============ tiers ============
   `near` = proximity dodge radius. ZERO at tier 1 — it does not flee, it waits.
   `stun` = how long after a dodge it cannot dodge again. This is your window to win. */
const TIERS = [
  { near: 132, grab: 190, stun: 150, dist: [200, 310], scale: 1,
    moves: ['sidestep', 'sidestep', 'sidestep', 'tease', 'feint', 'slingshot', 'melt'] },
  { near: 168, grab: 220, stun: 125, dist: [210, 360], scale: .86,
    moves: ['sidestep', 'sidestep', 'tease', 'feint', 'slingshot', 'hop', 'zip',
            'moonwalk', 'wallbounce', 'corner', 'melt'] },
  { near: 222, grab: 252, stun: 105, dist: [240, 430], scale: .66,
    moves: ['sidestep', 'sidestep', 'feint', 'slingshot', 'hop', 'zip', 'swing', 'morph',
            'split', 'camo', 'mercy', 'moonwalk', 'wallbounce', 'corner', 'mirror',
            'drop', 'melt', 'melt'] },
  { near: 290, grab: 300, stun: 88,  dist: [300, 560], scale: .46,
    moves: ['sidestep', 'feint', 'slingshot', 'hop', 'zip', 'swing', 'morph', 'split',
            'camo', 'glitch', 'mercy', 'duck', 'wallbounce', 'corner', 'mirror',
            'drop', 'melt', 'melt'] }
];

const S = {
  phase: 'intro',
  x: 0, y: 0, rot: 0, sx: 1, sy: 1, scale: 1,
  tw: null, stunUntil: 0, mercyArmed: false, melting: false, lockUntil: 0,
  vulnerable: false, locked: false, lastAttempt: 0, presses: 0, grassShown: false,
  extraStun: 0, tauntDelay: 0, revealed: false,
  attempts: 0, dodges: 0, tier: 0, forced: -1, started: 0,
  mx: -9999, my: -9999, vmx: 0, vmy: 0, lastMove: 0, idleFired: false, speed: 0, dirSign: 0, revs: 0,
  angles: [], clicks: [], marks: {}, decoys: [], dirty: true
};
let BW = 0, BH = 0;
const cfg = () => TIERS[S.forced >= 0 ? S.forced : S.tier];
function measure() { BW = btn.offsetWidth; BH = btn.offsetHeight; }
function halfW() { return BW * S.sx * S.scale / 2; }
function halfH() { return BH * S.sy * S.scale / 2; }
function draw() {
  btn.style.transform = 'translate(' + (S.x - BW / 2) + 'px,' + (S.y - BH / 2) + 'px) rotate(' +
    S.rot + 'deg) scale(' + (S.sx * S.scale) + ',' + (S.sy * S.scale) + ')';
}

/* ============ easings + the tween ============ */
const easeOutBack = p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const easeOutCubic = p => 1 - Math.pow(1 - p, 3);
const easeInOutQuad = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const easeLinear = p => p;

function move(x1, y1, dur, ease, o) {
  o = o || {};
  const hw = halfW(), hh = halfH();
  S.tw = {
    x0: S.x, y0: S.y,
    x1: o.free ? x1 : clamp(x1, hw + 10, vw() - hw - 10),
    y1: o.free ? y1 : clamp(y1, hh + 52, vh() - hh - 74),
    t0: performance.now(), dur: dur, ease: ease || easeOutBack,
    r0: S.rot, r1: o.rot != null ? o.rot : 0,
    s0: S.scale, s1: o.scale != null ? o.scale : S.scale,
    arc: o.arc || 0, then: o.then || null
  };
  return S.tw;
}
function away(dmin, dmax, spreadRad) {
  const base = Math.atan2(S.y - predY(), S.x - predX());
  const a = base + rnd(-spreadRad, spreadRad), d = rnd(dmin, dmax);
  return [S.x + Math.cos(a) * d, S.y + Math.sin(a) * d];
}

/* ============ the moves ============ */
function doMove(name) {
  const c = cfg(), d = c.dist;
  switch (name) {
    case 'sidestep': {                       // the signature move: short, sharp, sideways
      const perp = Math.atan2(S.y - predY(), S.x - predX()) + (Math.random() < .5 ? 1 : -1) * rnd(.7, 1.5);
      const dist = rnd(d[0], d[1]);
      move(S.x + Math.cos(perp) * dist, S.y + Math.sin(perp) * dist, 92, easeOutBack, { rot: rnd(-7, 7) });
      sfx('vine-boom'); return 'thought';
    }
    case 'tease': {                          // twitches away, then strolls right back
      const [tx, ty] = away(70, 110, .5), ox = S.x, oy = S.y;
      move(tx, ty, 85, easeOutCubic, { rot: rnd(-10, 10), then: () => move(ox, oy, 300, easeInOutQuad, { rot: 0 }) });
      sfx('boowomp'); return 'tease';
    }
    case 'hop': {
      const [tx, ty] = away(d[0], d[1], 1.1);
      move(tx, ty, 290, easeOutCubic, { arc: rnd(120, 210), rot: rnd(-20, 20) });
      sfx('yeet'); return 'hop';
    }
    case 'zip': {                            // long dash with a full spin
      const [tx, ty] = away(d[1], d[1] * 1.7, .8);
      move(tx, ty, 195, easeOutCubic, { rot: 360 * (Math.random() < .5 ? 1 : -1) });
      sfx('goofy-ahh-car-horn', .45); return 'zip';
    }
    case 'moonwalk': {                       // slow, deliberate, insulting
      const [tx, ty] = away(d[0], d[1], .35);
      move(tx, ty, 900, easeLinear, { rot: rnd(-4, 4) });
      sfx('rizz-sound-effect', .5); return 'moonwalk';
    }
    case 'swing': {                          // arcs around you to the far side
      const a = Math.atan2(S.y - S.my, S.x - S.mx) + Math.PI * (Math.random() < .5 ? .85 : -.85);
      const r = Math.max(150, Math.hypot(S.x - S.mx, S.y - S.my));
      move(S.mx + Math.cos(a) * r, S.my + Math.sin(a) * r, 330, easeInOutQuad, { arc: 70, rot: rnd(-24, 24) });
      sfx('wow-anime', .45); return 'swing';
    }
    case 'mercy': {                          // genuinely comes to you. genuinely your fault.
      const a = Math.atan2(S.my - S.y, S.mx - S.x);
      move(S.mx - Math.cos(a) * 70, S.my - Math.sin(a) * 70, 620, easeInOutQuad, { rot: 0 });
      S.mercyArmed = true;
      clearTimeout(doMove._mercy);
      doMove._mercy = setTimeout(() => { S.mercyArmed = false; }, 2600);
      sfx('taco-bell-bong-sfx', .5); return 'mercy';
    }
    case 'duck': {                           // shrinks to nothing, reappears far away
      const base = S.scale, [tx, ty] = away(d[0], d[1], Math.PI);
      S.lockUntil = performance.now() + 440;   // must not be interrupted: `then` restores scale
      move(S.x, S.y, 150, easeOutCubic, { scale: .01, then: () => {
        S.x = clamp(tx, halfW() + 10, vw() - halfW() - 10);
        S.y = clamp(ty, halfH() + 52, vh() - halfH() - 74);
        move(S.x, S.y, 220, easeOutBack, { scale: base });
      } });
      sfx('discord-notification'); return 'duck';
    }
    case 'melt': {                           // pours itself to a new spot
      const [tx, ty] = away(d[0] * 1.15, d[1] * 1.45, Math.PI * .85);
      meltTo(tx, ty);
      S.extraStun = 700; S.tauntDelay = 720;
      sfx(pick(['goo', 'liquid', 'squish'])); return 'melt';
    }

    case 'slingshot': {                      // winds back toward you, then leaves
      const a0 = Math.atan2(predY() - S.y, predX() - S.x);
      const [tx, ty] = away(d[1], d[1] * 1.8, .5);
      move(S.x + Math.cos(a0) * 46, S.y + Math.sin(a0) * 46, 135, easeInOutQuad,
        { rot: rnd(-5, 5), then: () => move(tx, ty, 185, easeOutCubic, { rot: rnd(-16, 16) }) });
      S.extraStun = 140; sfx('yeet'); return 'slingshot';
    }
    case 'feint': {                          // commits one way, snaps the other
      const base = Math.atan2(S.y - predY(), S.x - predX());
      const a1 = base + 1.25, a2 = base - 1.35, d2 = rnd(d[0], d[1] * 1.25);
      move(S.x + Math.cos(a1) * 120, S.y + Math.sin(a1) * 120, 105, easeOutCubic,
        { then: () => move(S.x + Math.cos(a2) * d2, S.y + Math.sin(a2) * d2, 155, easeOutBack,
                           { rot: rnd(-12, 12) }) });
      S.extraStun = 120; sfx('boowomp'); return 'feint';
    }
    case 'wallbounce': {                     // ricochets off the edge
      const ex = Math.random() < .5 ? halfW() + 14 : vw() - halfW() - 14;
      const ey = clamp(S.y + rnd(-210, 210), halfH() + 60, vh() - halfH() - 90);
      const [tx, ty] = away(d[0], d[1], 1.3);
      move(ex, ey, 165, easeOutCubic,
        { rot: rnd(-20, 20), then: () => move(tx, ty, 205, easeOutCubic, { rot: rnd(-20, 20) }) });
      S.extraStun = 150; sfx('metal-pipe-falling', .45); return 'wallbounce';
    }
    case 'corner': {
      const cx = Math.random() < .5 ? halfW() + 26 : vw() - halfW() - 26;
      const cy = Math.random() < .5 ? halfH() + 72 : vh() - halfH() - 94;
      move(cx, cy, 235, easeOutCubic, { rot: rnd(-18, 18) });
      sfx('goofy-ahh-car-horn', .4); return 'corner';
    }
    case 'mirror': {                         // reflects through the centre of the screen
      move(vw() - S.x, vh() - S.y, 175, easeOutBack, { rot: 180 });
      sfx('discord-notification'); return 'mirror';
    }
    case 'drop': {                           // off the bottom, back in from the top
      const nx = clamp(S.x + rnd(-360, 360), halfW() + 20, vw() - halfW() - 20);
      S.lockUntil = performance.now() + 530;   // it is off-screen mid-move; let it land
      move(S.x, vh() + halfH() + 60, 195, p => p * p, { free: true, then: () => {
        S.x = nx; S.y = -halfH() - 60; draw();
        move(nx, rnd(vh() * .28, vh() * .68), 265, easeOutBack);
      } });
      S.extraStun = 230; sfx('plop'); return 'drop';
    }
    case 'camo': {
      btn.classList.add('camo');
      const [tx, ty] = away(d[0], d[1], 1.4);
      move(tx, ty, 130, easeOutCubic);
      clearTimeout(doMove._camo);
      doMove._camo = setTimeout(() => btn.classList.remove('camo'), rnd(750, 1400));
      sfx('taco-bell-bong-sfx'); return 'camo';
    }
    case 'morph': {
      btn.style.clipPath = '';
      const shape = pick(['sliver', 'tall', 'dot', 'poly']);
      if (shape === 'sliver') { S.sx = 1.2; S.sy = .2; }
      else if (shape === 'tall') { S.sx = .3; S.sy = 1.45; }
      else if (shape === 'dot') { S.sx = .4; S.sy = .4; }
      else {
        S.sx = 1; S.sy = 1;
        const p = [];
        for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = rnd(30, 50);
          p.push((50 + Math.cos(a) * r).toFixed(0) + '% ' + (50 + Math.sin(a) * r * 1.4).toFixed(0) + '%'); }
        btn.style.clipPath = 'polygon(' + p.join(',') + ')';
      }
      const [tx, ty] = away(d[0], d[1], 1);
      move(tx, ty, 120, easeOutBack);
      sfx('metal-pipe-falling', .5); return 'morph';
    }
    case 'split': { spawnDecoys(S.tier >= 3 ? 3 : 2);
      const [tx, ty] = away(d[0], d[1], 1.2);
      move(tx, ty, 130, easeOutCubic);
      sfx('among-us-role-reveal-sound', .5); return 'split'; }
    case 'glitch': {
      S.lockUntil = performance.now() + 470;
      let n = 0;
      const iv = setInterval(() => {
        btn.classList.toggle('blink');
        S.x = rnd(120, vw() - 120); S.y = rnd(140, vh() - 160); draw();
        if (++n > 7) { clearInterval(iv); btn.classList.remove('blink'); S.tw = null; S.dirty = true; }
      }, 45);
      sfx('windows-xp-error'); return 'glitch';
    }
  }
  return 'thought';
}

// Melts into droplets that stream along a bowed path and pool back together
// at the destination. Staggered starts are what make it read as liquid rather
// than as an explosion.
function meltTo(tx, ty) {
  const hw = halfW(), hh = halfH();
  tx = clamp(tx, hw + 10, vw() - hw - 10);
  ty = clamp(ty, hh + 52, vh() - hh - 74);
  const dx = tx - S.x, dy = ty - S.y;
  const w = BW * S.sx * S.scale, h = BH * S.sy * S.scale;
  const N = 15, SPAN = 13, TRAVEL = 540;

  S.melting = true;
  btn.classList.add('hidden');
  const ang = Math.atan2(dy, dx), perp = ang + Math.PI / 2;

  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    const sz = rnd(.34, .70) * Math.min(w, h) * 1.25;
    const ox = rnd(-w / 2 + 6, w / 2 - 6), oy = rnd(-h / 2, h / 2);
    d.style.width = sz + 'px'; d.style.height = sz + 'px';
    d.style.left = (S.x + ox - sz / 2) + 'px';
    d.style.top = (S.y + oy - sz / 2) + 'px';
    document.body.appendChild(d);

    const bow = rnd(-95, 95);                       // each droplet takes its own arc
    const mx = dx * .5 + Math.cos(perp) * bow;
    const my = dy * .5 + Math.sin(perp) * bow - 20;
    d.animate([
      { transform: 'translate(0,0) scale(1)', offset: 0 },
      { transform: 'translate(' + mx + 'px,' + my + 'px) scale(' + rnd(.72, 1.18) + ')', offset: .55 },
      { transform: 'translate(' + (dx - ox) + 'px,' + (dy - oy) + 'px) scale(.5)', offset: 1 }
    ], { duration: TRAVEL, delay: i * SPAN, fill: 'both',
         easing: 'cubic-bezier(.45,.02,.28,1)' }).onfinish = () => d.remove();
  }
  setTimeout(() => {
    S.x = tx; S.y = ty; S.dirty = true;
    btn.classList.remove('hidden');
    S.melting = false;
  }, TRAVEL + N * SPAN - 60);
}

/* ============ the dodge ============ */
function dodge(fromClick, onButton) {
  const now = performance.now();
  if (now >= S.stunUntil) {
    const c = cfg();
    const dist = Math.hypot(S.x - S.mx, S.y - S.my);
    S.extraStun = 0; S.tauntDelay = 0;
    let cat = doMove(pick(c.moves));
    S.dodges++;
    // The stumble is the only way to win, so its odds set the whole difficulty.
    // Impossible in tier 1: you must be made to see the early tricks first. It
    // then gets likelier as the button gets more arrogant. During a hard chase
    // there are 3-5 dodges a second, so these numbers stay deliberately small.
    const tripOdds = [0, .018, .03, .05][S.forced >= 0 ? S.forced : S.tier] || 0;
    const tripped = !S.extraStun && S.dodges >= 12 && Math.random() < tripOdds;
    // Recovery time is NOT an invitation. Only these two states are catchable,
    // and both announce themselves loudly.
    S.vulnerable = tripped || cat === 'mercy';
    if (tripped) {
      cat = 'trip';
      // It must stumble AWAY from you. If it trips under a cursor that is already
      // sitting on it, anyone clicking fast converts the window for free — which
      // is exactly how this was being beaten in five seconds. You have to cross
      // the gap now, and the clock only starts once it has landed.
      let flight = 190;
      if (S.tw) {
        const [fx, fy] = away(390, 540, .9);
        S.tw.x1 = clamp(fx, halfW() + 10, vw() - halfW() - 10);
        S.tw.y1 = clamp(fy, halfH() + 52, vh() - halfH() - 74);
        S.tw.r1 = 23 * (Math.random() < .5 ? 1 : -1);
        S.tw.dur = Math.max(S.tw.dur, 190);
        flight = S.tw.dur;
      }
      S.extraStun = flight + 520;      // 520ms of genuine sitting-duck AFTER landing
      sfx('boowomp');
    }
    S.stunUntil = now + c.stun + S.extraStun; S.dirty = true;
    // the bubble speaks from where it lands, not where it was
    const t = S.tw;
    const bx = t ? t.x1 : S.x, by = t ? t.y1 : S.y;
    const grazed = fromClick && !onButton && cat === 'thought' &&
                   dist < Math.max(halfW(), halfH()) + 55;
    if (S.tauntDelay) setTimeout(() => taunt(cat, S.x, S.y), S.tauntDelay);
    else if (grazed) { taunt('close', bx, by); sfx('oh-my-god-bro-oh-hell-nah-man'); }
    else taunt(cat, bx, by);
    if (grazed) memeRandom('that was the closest you will get');
    else if (S.dodges % 3 === 0) memeRandom();
    trackAngle();
    syncHud();
    return true;
  }
  return false;
}
function trackAngle() {
  const a = Math.atan2(S.my - S.y, S.mx - S.x);
  S.angles.push(a); if (S.angles.length > 4) S.angles.shift();
  const diff = (p, q) => Math.abs(Math.atan2(Math.sin(p - q), Math.cos(p - q)));
  if (S.angles.length === 4 && S.angles.every(x => diff(x, S.angles[0]) < .32)) { say('repeat'); S.angles = []; }
}

/* ============ decoys ============ */
function spawnDecoys(n) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('button');
    el.className = 'decoy'; el.textContent = 'Click me.';
    const o = { el, x: rnd(140, vw() - 140), y: rnd(150, vh() - 160), die: performance.now() + 5000, rot: rnd(-8, 8) };
    el.addEventListener('mousedown', e => { e.stopPropagation(); popDecoy(o, true); });
    document.body.appendChild(el);
    el.style.transform = 'translate(' + (o.x - BW / 2) + 'px,' + (o.y - BH / 2) + 'px) rotate(' + o.rot + 'deg) scale(' + S.scale + ')';
    S.decoys.push(o);
  }
}
function popDecoy(o, clicked) {
  if (clicked) {
    sfx('erro'); sparks(o.x, o.y, 'WRONG');
    taunt('split', o.x, o.y);
    updateTier(); syncHud();
  }
  o.el.remove();
  S.decoys = S.decoys.filter(d => d !== o);
}
function sparks(x, y, word) {
  const words = word ? [word] : ['MISS', 'NOPE', 'X', 'NAH'];
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('span');
    s.className = 'spark'; s.textContent = pick(words);
    s.style.left = x + 'px'; s.style.top = y + 'px';
    document.body.appendChild(s);
    const a = rnd(0, Math.PI * 2), d = rnd(50, 150);
    s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%,-50%) translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d + 70) + 'px) scale(.5)', opacity: 0 }],
      { duration: rnd(420, 700), easing: 'ease-out' }).onfinish = () => s.remove();
  }
}

/* ============ intro ============ */
title.querySelectorAll('.ln').forEach(ln => {
  [...ln.dataset.t].forEach(c => {
    const s = document.createElement('span');
    s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c;
    ln.appendChild(s);
  });
});
function introLayout() {
  measure();
  S.x = Math.min(vw() * .8, vw() - BW / 2 - 40);
  S.y = vh() * .55;
  draw();
  arrow.style.left = (S.x - 52) + 'px';
  arrow.style.top = (S.y - BH / 2 - 44) + 'px';
}
introLayout();
addEventListener('resize', () => {
  if (S.phase === 'intro') introLayout();
  else { S.x = clamp(S.x, halfW() + 10, vw() - halfW() - 10); S.y = clamp(S.y, halfH() + 52, vh() - halfH() - 74); S.dirty = true; }
});

const gate = $('#gate');
let introBegun = false;
function beginIntro() {
  if (introBegun) return;
  introBegun = true;
  kicker.classList.add('fadein');
  const chars = title.querySelectorAll('.ch');
  chars.forEach((c, i) => setTimeout(() => c.classList.add('in'), 220 + i * 38));
  const end = 220 + chars.length * 38;
  setTimeout(() => sub.classList.add('fadein'), end + 90);
  // Reveal is driven by the clip's own length, not by the 'ended' event —
  // 'ended' does not fire when there is no audio output device. Whichever
  // of these three lands first wins; revealStart is idempotent.
  const clip = (isFinite(sheila.duration) && sheila.duration > 0) ? sheila.duration : 8;
  setTimeout(revealStart, clip * 1000 + 300);
  setTimeout(revealStart, 12000);         // hard safety net: never strand the player
}
// the start button does not exist until Sheila has finished warning you.
function revealStart() {
  if (S.revealed || S.phase !== 'intro') return;
  S.revealed = true;
  introLayout();
  btn.classList.remove('hidden');
  arrow.classList.add('fadein');
  sfx('taco-bell-bong-sfx');
  taunt('intro', S.x, S.y);
}
sheila.volume = .95;
// 'playing' is the reliable signal that sound is actually coming out; the
// play() promise can resolve late while the file is still loading.
sheila.addEventListener('playing', beginIntro);
sheila.addEventListener('ended', revealStart);
sheila.addEventListener('error', () => { beginIntro(); setTimeout(revealStart, 800); });
sheila.play().then(beginIntro).catch(() => {
  // autoplay blocked — one press, then it plays from the top exactly as intended
  gate.classList.add('on');
  addEventListener('pointerdown', () => {
    gate.classList.remove('on');
    sheila.play().catch(() => setTimeout(revealStart, 600));
    beginIntro();
  }, { once: true });
});
// if the clip never starts and no gate is up, do not leave the poster blank
setTimeout(() => { if (!gate.classList.contains('on')) beginIntro(); }, 1500);

function startGame() {
  S.phase = 'play';
  S.started = performance.now(); S.lastMove = S.started;
  S.scale = TIERS[0].scale;
  document.body.dataset.tier = '0';
  intro.style.transition = 'opacity .3s, transform .3s';
  intro.style.opacity = '0'; intro.style.transform = 'translateX(-40px)';
  arrow.style.display = 'none';
  setTimeout(() => intro.style.display = 'none', 320);
  hud.classList.add('fadein'); giveup.classList.add('fadein'); placeGiveup();
  sfx('airhorn');
  S.x = vw() / 2; S.y = vh() / 2; S.dirty = true;
  setTimeout(() => taunt('thought', S.x, S.y), 260);
  commentEl.textContent = 'go on then. it is one button. how hard can it be.';
  commentEl.classList.add('on'); lastSay = performance.now();
  setTimeout(() => commentEl.classList.remove('on'), 4200);
  requestAnimationFrame(loop);
}

/* ============ loop — only draws when something actually moved ============ */
let hudSec = -1, lastFrameT = 0;
function loop(now) {
  if (S.phase !== 'play') return;

  // Cursor velocity is only written on mousemove, so when the mouse stops the
  // last vector would persist forever — projecting a phantom cursor up to 280px
  // away and making the button dodge at nothing. Decay it once movement stops.
  const fdt = Math.min(.05, (now - (lastFrameT || now)) / 1000);
  lastFrameT = now;
  if (now - S.lastMove > 50) {
    const k = Math.pow(.02, fdt);
    S.speed *= k; S.vmx *= k; S.vmy *= k;
  }

  if (S.tw) {
    const t = S.tw, p = clamp((now - t.t0) / t.dur, 0, 1), e = t.ease(p);
    S.x = lerp(t.x0, t.x1, e);
    S.y = lerp(t.y0, t.y1, e) - Math.sin(p * Math.PI) * t.arc;
    S.rot = lerp(t.r0, t.r1, e);
    S.scale = lerp(t.s0, t.s1, e);
    S.dirty = true;
    if (p >= 1) { S.tw = null; S.rot = t.r1 % 360; const th = t.then; if (th) th(); }
  }

  // proximity dodge — tier 1 has near:0, so it simply does not do this
  const c = cfg();
  // React to INTENT, not just distance: a fast lunge widens the trigger radius,
  // a slow careful approach does not. Tier 1 has near:0, so only a lunge trips it
  // there — which keeps the "stand still, then YOU THOUGHT" joke intact.
  const reach = c.near + Math.min(S.speed * .07, 130);
  const dNow = Math.hypot(S.x - S.mx, S.y - S.my);
  const dNext = Math.hypot(S.x - predX(), S.y - predY());
  // No !S.tw guard any more: it can bail out of a move it is already making, so
  // chasing it mid-flight no longer buys free ground. mercy is exempt — that one
  // is meant to be catchable.
  if (!S.melting && !S.mercyArmed && now > S.lockUntil &&
      Math.min(dNow, dNext) < reach) dodge(false);

  // Last line of defence: no interrupted trick may ever leave the button
  // invisible or unreachably tiny. Runs only when nothing is in flight.
  if (!S.tw && !S.melting && now > S.lockUntil) {
    const full = cfg().scale;
    if (S.scale < full * .55) { S.scale = full; S.dirty = true; }
    if (S.sx < .15 || S.sy < .12) { S.sx = 1; S.sy = 1; btn.style.clipPath = ''; S.dirty = true; }
    if (btn.classList.contains('hidden')) { btn.classList.remove('hidden'); S.dirty = true; }
    if (btn.classList.contains('blink')) btn.classList.remove('blink');
    // and it must be somewhere you can actually reach: `drop` travels off-screen,
    // so a cut-off return trip would otherwise strand it outside the viewport.
    const hw = halfW(), hh = halfH();
    const cx = clamp(S.x, hw + 10, vw() - hw - 10);
    const cy = clamp(S.y, hh + 52, vh() - hh - 74);
    if (cx !== S.x || cy !== S.y) { S.x = cx; S.y = cy; S.dirty = true; }
  }

  if (S.vulnerable && now >= S.stunUntil) S.vulnerable = false;
  const wantLock = now < S.stunUntil && !S.vulnerable;
  if (wantLock !== S.locked) { S.locked = wantLock; btn.classList.toggle('locked', wantLock); }

  if (S.dirty) { draw(); S.dirty = false; }

  for (const o of S.decoys.slice()) {
    if (now > o.die) popDecoy(o);
  }

  if (now - S.lastMove > 5000 && !S.idleFired) {
    S.idleFired = true; sfx('crickets-chirping'); say('idle', true);
    meme('stare', 'the button is watching you do nothing');
  }

  const el = (now - S.started) / 1000, sec = el | 0;
  if (sec !== hudSec) {
    hudSec = sec;
    $('#hTime').textContent = (sec / 60 | 0) + ':' + String(sec % 60).padStart(2, '0');
    const marks = [[60, 'min1', 'smh', 'one minute of this'], [180, 'min3', 'smh', 'three minutes. three.'],
      [300, 'min5', 'imagination', 'five minutes. imagine explaining this'], [600, 'min10', 'smh', 'ten minutes. a life.']];
    if (!S.grassShown && sec >= GRASS_AFTER && (S.forced >= 0 ? S.forced : S.tier) === 3) {
      S.grassShown = true;
      showGrass(el);
    }
    for (const [s, cat, m, cap] of marks) {
      if (sec >= s && !S.marks[cat]) {
        S.marks[cat] = 1; say(cat, true);
        sfx(s >= 300 ? 'emotional-damage-meme' : 'sad-trombone');
        meme(m, cap);
      }
    }
  }
  requestAnimationFrame(loop);
}
function syncHud() {
  $('#hClk').textContent = S.presses;
  $('#hAtt').textContent = S.attempts;
  $('#hDod').textContent = S.dodges;
}

function updateTier() {
  if (S.forced >= 0) return;
  const a = S.attempts, t = a <= 5 ? 0 : a <= 15 ? 1 : a <= 30 ? 2 : 3;
  if (t !== S.tier) {
    S.tier = t; S.scale = TIERS[t].scale; S.dirty = true;
    S.sx = 1; S.sy = 1; btn.style.clipPath = '';
    document.body.dataset.tier = String(t);
    $('#hTier').textContent = t + 1;
    sfx('among-us-role-reveal-sound');
    meme('thought', 'tier ' + (t + 1) + '. it is getting worse.');
    document.body.classList.remove('shake'); void document.body.offsetWidth;
    document.body.classList.add('shake');
  }
}

/* ============ input ============ */
addEventListener('mousemove', e => {
  const t = performance.now();
  if (S.lastMove) {
    const dt = Math.max(1, t - S.lastMove);
    S.speed = S.speed * .8 + (Math.hypot(e.clientX - S.mx, e.clientY - S.my) / dt * 1000) * .2;
    const sg = Math.sign(e.clientX - S.mx);
    if (sg && S.dirSign && sg !== S.dirSign) { if (++S.revs > 10 && S.phase === 'play') { S.revs = 0; say('reverse'); } }
    if (sg) S.dirSign = sg;
    if (S.phase === 'play' && t - S.started > 8000) {
      if (S.speed > 2200 && Math.random() < .01) say('fast');
      else if (S.speed < 120 && S.speed > 8 && Math.random() < .006) say('slow');
    }
  }
  const pdt = Math.max(8, t - S.lastMove);
  S.vmx = S.vmx * .6 + ((e.clientX - S.mx) / pdt * 1000) * .4;
  S.vmy = S.vmy * .6 + ((e.clientY - S.my) / pdt * 1000) * .4;
  S.mx = e.clientX; S.my = e.clientY; S.lastMove = t; S.idleFired = false;
});

/* THE JOKE: dodge fires on mousedown, before the click can ever land. */
addEventListener('mousedown', e => {
  if (S.phase !== 'play') return;
  S.presses++; syncHud();                 // raw presses, unlike the rate-limited attempts
  if (e.target === btn) return;
  if (Math.hypot(S.x - e.clientX, S.y - e.clientY) < cfg().grab) dodge(true, false);
}, true);

btn.addEventListener('mousedown', e => {
  if (S.phase !== 'play') return;
  // tripped or offering mercy: it is genuinely caught, let the click land
  if (S.vulnerable) return;
  if (performance.now() < S.stunUntil) return;   // .locked normally prevents this
  e.preventDefault(); e.stopPropagation();
  dodge(true, true);
});
btn.addEventListener('click', e => {
  e.stopPropagation();
  if (S.phase === 'intro') { startGame(); return; }
  if (S.phase === 'play' && !S.tw) winGame();
});

addEventListener('click', e => {
  if (S.phase !== 'play' || e.target === btn) return;
  const t = performance.now();
  S.clicks = S.clicks.filter(c => t - c < 1400); S.clicks.push(t);
  // Rate-limited: machine-gun clicking should not fast-forward the tiers. This is
  // what was firing you into tier 4 within seconds and skipping the whole ladder.
  if (t - S.lastAttempt > 150) { S.lastAttempt = t; S.attempts++; updateTier(); syncHud(); }
  sparks(e.clientX, e.clientY);

  if (S.mercyArmed) { S.mercyArmed = false; say('mercyMiss', true); sfx('boowomp');
    meme('hmm', 'it came to you. you missed.'); return; }
  if (S.clicks.length >= 4) {
    sfx(pick(['metal-pipe-falling', 'emotional-damage-meme', 'aughhh', 'fart-with-reverb']));
    if (S.clicks.length === 5) meme('laugh', 'rage detected');
    if (Math.random() < .5) say('rage');
    return;
  }
  sfx(pick(['bruh', 'erro', 'windows-xp-error', 'ba-dum-tss']));
  if (Math.random() < .4) say('miss');
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && S.phase === 'play' && performance.now() - S.started > 4000)
    setTimeout(() => { say('back', true); sfx('nope-nope-nope', .5); }, 400);
});

giveup.addEventListener('mouseenter', placeGiveup);
giveup.addEventListener('mousedown', e => {
  e.stopPropagation(); placeGiveup(); sfx('nope-nope-nope');
  commentEl.textContent = 'there is no giving up. there is only this, and whatever you were avoiding.';
  commentEl.classList.add('on'); lastSay = performance.now();
  clearTimeout(say._t); say._t = setTimeout(() => commentEl.classList.remove('on'), 4200);
});
function placeGiveup() {
  giveup.style.transform = 'translate(' + rnd(20, vw() - 190) + 'px,' + rnd(vh() * .6, vh() - 90) + 'px) rotate(' + rnd(-3, 3) + 'deg)';
}

addEventListener('keydown', e => {           // demo tier selector for judges
  if (e.key >= '1' && e.key <= '4' && S.phase === 'play') {
    S.forced = +e.key - 1; S.tier = S.forced; S.scale = TIERS[S.tier].scale; S.dirty = true;
    document.body.dataset.tier = String(S.tier);
    $('#hTier').textContent = e.key;
    sfx('among-us-role-reveal-sound');
  }
});

/* ============ the endurance award ============ */
const GRASS_AFTER = 240;            // seconds at tier 4 before it stops being funny

function showGrass(elapsed) {
  const m = Math.floor(elapsed / 60);
  sfx('sad-trombone');
  setTimeout(() => sfx('emotional-damage-meme'), 900);
  $('#grassline').textContent = m + ' minutes. the button has not thought about you once.';
  gCert.src = unemploymentCert(elapsed);
  gDl.href = gCert.src;
  grassEl.classList.add('on');
}
$('#gclose').addEventListener('click', () => grassEl.classList.remove('on'));

function unemploymentCert(elapsed) {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 820;
  const g = c.getContext('2d');
  g.fillStyle = '#F2B01E'; g.fillRect(0, 0, 1200, 820);
  g.fillStyle = 'rgba(0,0,0,.13)';
  for (let y = 0; y < 820; y += 9) for (let x = 0; x < 1200; x += 9) { g.beginPath(); g.arc(x, y, 1.3, 0, 6.284); g.fill(); }
  g.fillStyle = '#16110A'; g.fillRect(30, 30, 1140, 12); g.fillRect(30, 778, 1140, 12);
  g.fillRect(30, 30, 12, 760); g.fillRect(1158, 30, 12, 760);
  g.textAlign = 'center';
  g.font = '20px "Courier New",monospace';
  g.fillText('C E R T I F I C A T E   O F', 600, 128);
  g.font = '78px Impact,"Arial Black",sans-serif';
  g.fillStyle = '#D62828'; g.fillText('UNEMPLOYMENT', 606, 214);
  g.fillStyle = '#16110A'; g.fillText('UNEMPLOYMENT', 600, 208);
  g.font = '22px "Courier New",monospace';
  g.fillText('this is not an achievement. this is a status report.', 600, 268);
  const m = Math.floor(elapsed / 60), sc = Math.floor(elapsed % 60);
  const rows = [['TIME WASTED', m + 'm ' + sc + 's'], ['CLICKS FIRED', String(S.presses)],
    ['ATTEMPTS', String(S.attempts)], ['DODGES SURVIVED', String(S.dodges)],
    ['STILL NOT CAUGHT', 'correct'], ['ISSUED', new Date().toLocaleString()]];
  let y = 340;
  rows.forEach(r => {
    g.textAlign = 'left'; g.font = '17px "Courier New",monospace'; g.fillStyle = '#16110A';
    g.fillText(r[0], 180, y);
    g.textAlign = 'right'; g.font = '30px Impact,"Arial Black",sans-serif';
    g.fillText(r[1], 1020, y);
    g.fillRect(180, y + 12, 840, 3);
    y += 58;
  });
  g.textAlign = 'center';
  g.font = '54px Impact,"Arial Black",sans-serif';
  g.fillStyle = '#D62828'; g.fillText('GO TOUCH GRASS.', 604, 724);
  g.fillStyle = '#16110A'; g.fillText('GO TOUCH GRASS.', 600, 720);
  g.font = '16px "Courier New",monospace';
  g.fillText('tere haath kabhi na aani — aur naukri bhi nahi', 600, 756);
  return c.toDataURL('image/png');
}

/* ============ win ============ */
function winGame() {
  S.phase = 'won';
  const el = (performance.now() - S.started) / 1000;
  sfx('airhorn', .7); setTimeout(() => sfx('wow-anime'), 200); setTimeout(() => sfx('airhorn', .5), 420);
  taunt('win', S.x, S.y);
  for (let i = 0; i < 10; i++) setTimeout(() => sparks(rnd(80, vw() - 80), rnd(80, vh() * .7), 'WOW'), i * 80);
  S.decoys.slice().forEach(o => popDecoy(o));
  S.vulnerable = false; btn.classList.remove('locked');
  grassEl.classList.remove('on');
  btn.style.display = 'none'; giveup.style.display = 'none';
  certImg.src = certificate(el); dlLink.href = certImg.src;
  winEl.classList.add('on');
}
function certificate(elapsed) {
  const c = document.createElement('canvas'); c.width = 1200; c.height = 820;
  const g = c.getContext('2d');
  g.fillStyle = '#F2B01E'; g.fillRect(0, 0, 1200, 820);
  g.fillStyle = 'rgba(0,0,0,.13)';
  for (let y = 0; y < 820; y += 9) for (let x = 0; x < 1200; x += 9) { g.beginPath(); g.arc(x, y, 1.3, 0, 6.284); g.fill(); }
  g.fillStyle = '#16110A'; g.fillRect(30, 30, 1140, 12); g.fillRect(30, 778, 1140, 12);
  g.fillRect(30, 30, 12, 760); g.fillRect(1158, 30, 12, 760);
  g.textAlign = 'center';
  g.fillStyle = '#16110A'; g.font = '20px "Courier New",monospace';
  g.fillText('C E R T I F I C A T E   O F', 600, 128);
  g.font = '76px Impact,"Arial Black",sans-serif';
  g.fillStyle = '#D62828'; g.fillText('UNCATCHABLE BUTTON', 606, 212);
  g.fillStyle = '#16110A'; g.fillText('UNCATCHABLE BUTTON', 600, 206);
  g.fillStyle = '#16110A'; g.fillText('ACHIEVEMENT', 600, 282);
  g.font = '22px "Courier New",monospace';
  g.fillText('awarded, reluctantly, to a person with time on their hands', 600, 336);
  const m = Math.floor(elapsed / 60), s = Math.floor(elapsed % 60);
  const rows = [['TIME SPENT', m + 'm ' + s + 's'], ['CLICKS FIRED', String(S.presses)],
    ['FAILED ATTEMPTS', String(S.attempts)], ['DODGES SURVIVED', String(S.dodges)],
    ['PEAK TIER', String(S.tier + 1)], ['ISSUED', new Date().toLocaleString()]];
  let y = 366;
  rows.forEach(r => {
    g.textAlign = 'left'; g.font = '17px "Courier New",monospace'; g.fillStyle = '#16110A';
    g.fillText(r[0], 180, y);
    g.textAlign = 'right'; g.font = '30px Impact,"Arial Black",sans-serif';
    g.fillText(r[1], 1020, y);
    g.fillRect(180, y + 12, 840, 3);
    y += 56;
  });
  g.textAlign = 'center';
  g.fillStyle = '#D62828'; g.font = '44px Impact,"Arial Black",sans-serif';
  g.fillText('YOU BEAT A BUTTON. GO OUTSIDE.', 603, 731);
  g.fillStyle = '#16110A'; g.fillText('YOU BEAT A BUTTON. GO OUTSIDE.', 600, 728);
  g.font = '16px "Courier New",monospace';
  g.fillText('tere haath kabhi na aani — except, apparently, this once', 600, 752);
  return c.toDataURL('image/png');
}
$('#again').addEventListener('click', () => location.reload());

