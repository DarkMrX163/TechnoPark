export interface CertificateData {
  name: string;
  school: string;
  categoryTitle: string;
  ageTitle: string;
  score: number;
  accuracy: number;
  correctCount: number;
  totalCount: number;
  dateStr: string;
  certId: string;
}

// Draw 3D Movie Cheburashka (CGI movie version with realistic fluffy fur & glossy hazel eyes)
function draw3DMovieCheburashka(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number = 1,
  alpha: number = 1,
  showBadge: boolean = true
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-300, -260); // Offset center to (300, 260)

  // 1. Soft Cyber Glowing Backlight
  const bgGlow = ctx.createRadialGradient(300, 260, 20, 300, 260, 260);
  bgGlow.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
  bgGlow.addColorStop(0.5, 'rgba(234, 179, 8, 0.18)');
  bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bgGlow;
  ctx.beginPath();
  ctx.arc(300, 260, 260, 0, Math.PI * 2);
  ctx.fill();

  if (showBadge) {
    // Tech Gold & Cyan Rings Frame
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.arc(300, 260, 245, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(300, 260, 255, 0, Math.PI * 2);
    ctx.stroke();

    // Gold/Cyan Badge Banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(300 - 110, 260 + 220, 220, 42, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 20px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText('ЧЕБУРАШКА', 300, 260 + 248);
  }

  // Fur Radial Gradients
  const headFur = ctx.createRadialGradient(300, 160, 10, 300, 180, 150);
  headFur.addColorStop(0, '#8d522a');
  headFur.addColorStop(0.6, '#5a3116');
  headFur.addColorStop(1, '#341b0b');

  const earFurL = ctx.createRadialGradient(125, 230, 10, 125, 230, 120);
  earFurL.addColorStop(0, '#91562d');
  earFurL.addColorStop(0.65, '#5d3317');
  earFurL.addColorStop(1, '#30190a');

  const earFurR = ctx.createRadialGradient(475, 230, 10, 475, 230, 120);
  earFurR.addColorStop(0, '#91562d');
  earFurR.addColorStop(0.65, '#5d3317');
  earFurR.addColorStop(1, '#30190a');

  const innerEar = ctx.createRadialGradient(300, 230, 10, 300, 230, 110);
  innerEar.addColorStop(0, '#d89762');
  innerEar.addColorStop(0.7, '#a66436');
  innerEar.addColorStop(1, '#5c3418');

  const faceSkin3D = ctx.createRadialGradient(300, 185, 10, 300, 185, 90);
  faceSkin3D.addColorStop(0, '#fce2cd');
  faceSkin3D.addColorStop(0.6, '#f5be93');
  faceSkin3D.addColorStop(1, '#d68f5c');

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(300, 510, 160, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left Fluffy Ear
  ctx.fillStyle = earFurL;
  ctx.beginPath();
  ctx.ellipse(125, 230, 115, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = innerEar;
  ctx.beginPath();
  ctx.ellipse(125, 230, 100, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner Ear Swirl Stroke
  ctx.strokeStyle = '#42220d';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(80, 160);
  ctx.bezierCurveTo(50, 200, 50, 260, 90, 290);
  ctx.bezierCurveTo(130, 310, 150, 260, 120, 220);
  ctx.bezierCurveTo(95, 190, 105, 160, 125, 150);
  ctx.stroke();

  // Right Fluffy Ear
  ctx.fillStyle = earFurR;
  ctx.beginPath();
  ctx.ellipse(475, 230, 115, 110, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = innerEar;
  ctx.beginPath();
  ctx.ellipse(475, 230, 100, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(520, 160);
  ctx.bezierCurveTo(550, 200, 550, 260, 510, 290);
  ctx.bezierCurveTo(470, 310, 450, 260, 480, 220);
  ctx.bezierCurveTo(505, 190, 495, 160, 475, 150);
  ctx.stroke();

  // Feet 3D
  ctx.fillStyle = headFur;
  ctx.beginPath();
  ctx.ellipse(250, 485, 45, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(350, 485, 45, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.beginPath();
  ctx.moveTo(230, 280);
  ctx.bezierCurveTo(200, 360, 210, 470, 250, 480);
  ctx.lineTo(350, 480);
  ctx.bezierCurveTo(390, 470, 400, 360, 370, 280);
  ctx.closePath();
  ctx.fill();

  // Tummy Chest Fur
  ctx.fillStyle = faceSkin3D;
  ctx.beginPath();
  ctx.ellipse(300, 380, 36, 55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Arms / Paws
  ctx.fillStyle = headFur;
  ctx.strokeStyle = '#2b1406';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(235, 290);
  ctx.bezierCurveTo(205, 320, 200, 380, 220, 410);
  ctx.bezierCurveTo(235, 430, 250, 400, 240, 370);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(365, 290);
  ctx.bezierCurveTo(395, 320, 400, 380, 380, 410);
  ctx.bezierCurveTo(365, 430, 350, 400, 360, 370);
  ctx.fill();
  ctx.stroke();

  // Head 3D Fur Hood
  ctx.fillStyle = headFur;
  ctx.beginPath();
  ctx.ellipse(300, 180, 135, 125, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fur Tuft on Head
  ctx.fillStyle = '#91562d';
  ctx.beginPath();
  ctx.moveTo(285, 55);
  ctx.bezierCurveTo(295, 40, 305, 40, 315, 55);
  ctx.bezierCurveTo(325, 45, 335, 50, 330, 65);
  ctx.bezierCurveTo(310, 60, 290, 60, 285, 55);
  ctx.fill();

  // Face 3D Fur Oval
  ctx.fillStyle = faceSkin3D;
  ctx.beginPath();
  ctx.ellipse(300, 185, 96, 84, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#3d1f0b';
  ctx.lineWidth = 7;

  ctx.beginPath();
  ctx.moveTo(220, 122);
  ctx.bezierCurveTo(235, 105, 255, 108, 265, 120);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(335, 120);
  ctx.bezierCurveTo(345, 108, 365, 105, 380, 122);
  ctx.stroke();

  // Left Eye 3D Movie Glossy Hazel
  ctx.save();
  ctx.translate(242, 160);

  ctx.fillStyle = '#140a03';
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeHazelL = ctx.createRadialGradient(-5, -5, 2, 0, 0, 28);
  eyeHazelL.addColorStop(0, '#9e7330');
  eyeHazelL.addColorStop(0.4, '#5e3c14');
  eyeHazelL.addColorStop(0.85, '#241305');
  eyeHazelL.addColorStop(1, '#0d0601');
  ctx.fillStyle = eyeHazelL;
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark pupil
  ctx.fillStyle = '#0a0501';
  ctx.beginPath();
  ctx.ellipse(2, -2, 15, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Movie Eye Glare Highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.ellipse(-7, -10, 7, 5, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.arc(6, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.arc(-8, 6, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end Left Eye

  // Right Eye 3D Movie Glossy Hazel
  ctx.save();
  ctx.translate(358, 160);

  ctx.fillStyle = '#140a03';
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeHazelR = ctx.createRadialGradient(-5, -5, 2, 0, 0, 28);
  eyeHazelR.addColorStop(0, '#9e7330');
  eyeHazelR.addColorStop(0.4, '#5e3c14');
  eyeHazelR.addColorStop(0.85, '#241305');
  eyeHazelR.addColorStop(1, '#0d0601');
  ctx.fillStyle = eyeHazelR;
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark pupil
  ctx.fillStyle = '#0a0501';
  ctx.beginPath();
  ctx.ellipse(-2, -2, 15, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Movie Eye Glare Highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.ellipse(-9, -10, 7, 5, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.arc(4, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.arc(-10, 6, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end Right Eye

  // Nose 3D Button
  const nose3D = ctx.createRadialGradient(296, 185, 1, 300, 190, 12);
  nose3D.addColorStop(0, '#524a46');
  nose3D.addColorStop(0.5, '#1f1a17');
  nose3D.addColorStop(1, '#080605');

  ctx.fillStyle = nose3D;
  ctx.beginPath();
  ctx.moveTo(300, 180);
  ctx.quadraticCurveTo(288, 198, 300, 202);
  ctx.quadraticCurveTo(312, 198, 300, 180);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.ellipse(296, 186, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth Sweet Smile
  ctx.strokeStyle = '#8a2016';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(288, 222);
  ctx.quadraticCurveTo(300, 232, 312, 222);
  ctx.stroke();

  // Rosy Cheeks
  ctx.fillStyle = 'rgba(224, 83, 67, 0.22)';
  ctx.beginPath();
  ctx.ellipse(225, 202, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(375, 202, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawCertificateCanvas(data: CertificateData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Background Gradient (Cyber Dark Theme)
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 1200);
  bgGrad.addColorStop(0, '#0d1527');
  bgGrad.addColorStop(0.5, '#050a14');
  bgGrad.addColorStop(1, '#02040a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Cyber Circuit Grid Lines Background
  ctx.save();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
  ctx.lineWidth = 1.5;
  const gridSize = 60;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  // Decorative Tech Glow Orbs
  ctx.save();
  // Cyan glow top-left
  const orb1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 500);
  orb1.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
  orb1.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, 700, 700);

  // Purple glow bottom-right
  const orb2 = ctx.createRadialGradient(w - 200, h - 200, 0, w - 200, h - 200, 500);
  orb2.addColorStop(0, 'rgba(147, 51, 234, 0.25)');
  orb2.addColorStop(1, 'rgba(147, 51, 234, 0)');
  ctx.fillStyle = orb2;
  ctx.fillRect(w - 700, h - 700, 700, 700);
  ctx.restore();

  // 3. Double Tech Border Frame
  const margin = 50;
  const innerM = 70;

  // Outer gold/cyan frame
  ctx.save();
  const frameGrad = ctx.createLinearGradient(0, 0, w, h);
  frameGrad.addColorStop(0, '#06b6d4');
  frameGrad.addColorStop(0.3, '#3b82f6');
  frameGrad.addColorStop(0.7, '#a855f7');
  frameGrad.addColorStop(1, '#eab308');
  ctx.strokeStyle = frameGrad;
  ctx.lineWidth = 6;
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

  // Inner fine frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(innerM, innerM, w - innerM * 2, h - innerM * 2);
  ctx.restore();

  // Corner tech brackets
  const cornerLen = 50;
  const corners = [
    [innerM, innerM],
    [w - innerM, innerM],
    [innerM, h - innerM],
    [w - innerM, h - innerM]
  ];

  ctx.save();
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 4;
  corners.forEach(([cx, cy]) => {
    const dx = cx === innerM ? 1 : -1;
    const dy = cy === innerM ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * cornerLen);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * cornerLen, cy);
    ctx.stroke();

    // Corner dot
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(cx + dx * 10, cy + dy * 10, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 4. Header Badge / Logo Emblem
  const centerX = w / 2;

  // Quantum Atom Logo Emblem
  ctx.save();
  ctx.translate(centerX, 130);

  // Glowing circle behind emblem
  const emblemGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
  emblemGlow.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
  emblemGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = emblemGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.stroke();

  // Atom ellipses
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, 34, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 3.5. 3D Movie Cheburashka on Certificate Background (Soft Watermark)
  draw3DMovieCheburashka(ctx, w - 260, h / 2 + 20, 0.85, 0.25, false);

  // Core nucleus
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 3D Movie Cheburashka in top-right corner frame
  draw3DMovieCheburashka(ctx, w - 175, 150, 0.38, 1, true);

  // 5. Text Header - Split into lines as requested
  ctx.save();
  ctx.textAlign = 'center';

  // Technopark Title Line 1: ДЕТСКИЙ ТЕХНОПАРК
  ctx.font = '800 20px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('ДЕТСКИЙ ТЕХНОПАРК', centerX, 198);

  // Technopark Title Line 2: «КВАНТУМ ДОБРА»
  ctx.font = '900 32px "Inter", "Segoe UI", sans-serif';
  const quantGrad = ctx.createLinearGradient(centerX - 200, 0, centerX + 200, 0);
  quantGrad.addColorStop(0, '#38bdf8');
  quantGrad.addColorStop(0.5, '#fde047');
  quantGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = quantGrad;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
  ctx.shadowBlur = 12;
  ctx.fillText('«КВАНТУМ ДОБРА»', centerX, 238);
  ctx.shadowBlur = 0;

  // Certificate Type
  const isWinner = data.accuracy >= 80;
  const certTitle = isWinner ? 'ДИПЛОМ ПОБЕДИТЕЛЯ' : 'СЕРТИФИКАТ УЧАСТНИКА';

  ctx.font = '900 52px "Inter", "Segoe UI", sans-serif';
  const titleGrad = ctx.createLinearGradient(centerX - 300, 0, centerX + 300, 0);
  if (isWinner) {
    titleGrad.addColorStop(0, '#fde047');
    titleGrad.addColorStop(0.5, '#eab308');
    titleGrad.addColorStop(1, '#f97316');
  } else {
    titleGrad.addColorStop(0, '#38bdf8');
    titleGrad.addColorStop(0.5, '#818cf8');
    titleGrad.addColorStop(1, '#c084fc');
  }
  ctx.fillStyle = titleGrad;
  ctx.shadowColor = isWinner ? 'rgba(234, 179, 8, 0.4)' : 'rgba(56, 189, 248, 0.4)';
  ctx.shadowBlur = 15;
  ctx.fillText(certTitle, centerX, 308);
  ctx.shadowBlur = 0;

  // Subtitle
  ctx.font = '500 18px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('НАУЧНО-ТЕХНИЧЕСКОЙ ВИКТОРИНЫ ПО ИННОВАЦИЯМ', centerX, 342);

  // "Настоящий сертификат подтверждает, что"
  ctx.font = '400 18px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('Настоящий сертификат подтверждает, что', centerX, 415);

  // 6. Participant Name
  const participantName = data.name.trim() || 'Участник Квантума';
  ctx.font = '900 48px "Inter", "Segoe UI", sans-serif';
  const nameGrad = ctx.createLinearGradient(centerX - 400, 0, centerX + 400, 0);
  nameGrad.addColorStop(0, '#ffffff');
  nameGrad.addColorStop(0.5, '#38bdf8');
  nameGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = nameGrad;
  ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
  ctx.shadowBlur = 20;
  ctx.fillText(participantName, centerX, 480);
  ctx.shadowBlur = 0;

  // Underline bar for name
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(centerX - 250, 502, 500, 3);

  // Participant School / Organization
  if (data.school && data.school.trim()) {
    ctx.font = '600 22px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(data.school.trim(), centerX, 545);
  }

  // 7. Quiz Track & Category Description
  ctx.font = '400 19px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('успешно прошел(ла) испытания интеллектуальной викторины по направлению:', centerX, 610);

  // Category Banner Box
  ctx.save();
  const catBoxW = 680;
  const catBoxH = 54;
  const catBoxX = centerX - catBoxW / 2;
  const catBoxY = 635;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(catBoxX, catBoxY, catBoxW, catBoxH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.font = '800 24px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(data.categoryTitle.toUpperCase(), centerX, catBoxY + 36);
  ctx.restore();

  // 8. Stats Pill Badges Row
  const statsY = 730;
  const badgeW = 260;
  const badgeH = 75;
  const spacing = 40;

  const badges = [
    { label: 'ВОЗРАСТ', val: data.ageTitle, color: '#38bdf8' },
    { label: 'НАБРАНО ОЧКОВ', val: `${data.score} XP`, color: '#fde047' },
    { label: 'ТОЧНОСТЬ ОТВЕТОВ', val: `${data.accuracy}%`, color: '#4ade80' },
    { label: 'РЕЗУЛЬТАТ', val: `${data.correctCount} из ${data.totalCount}`, color: '#c084fc' }
  ];

  const totalBadgesW = badges.length * badgeW + (badges.length - 1) * spacing;
  let startBadgeX = centerX - totalBadgesW / 2;

  badges.forEach((b) => {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = b.color + '66';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(startBadgeX, statsY, badgeW, badgeH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 12px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(b.label, startBadgeX + badgeW / 2, statsY + 26);

    ctx.font = '900 22px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = b.color;
    ctx.fillText(b.val, startBadgeX + badgeW / 2, statsY + 58);

    ctx.restore();
    startBadgeX += badgeW + spacing;
  });

  // 9. Bottom Footer: Official Coat of Arms Stamp, Date & Cert Info
  // Official Stamp Seal (Left side)
  ctx.save();
  const stampX = 220;
  const stampY = h - 165;

  ctx.translate(stampX, stampY);
  ctx.rotate(-0.08); // Subtle tilt for seal authenticity

  // Gold radial fill inside seal
  const sealGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 75);
  sealGrad.addColorStop(0, 'rgba(250, 204, 21, 0.12)');
  sealGrad.addColorStop(0.8, 'rgba(234, 179, 8, 0.05)');
  sealGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.fill();

  // Outer gold stamp ring
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.stroke();

  // Middle thin gold ring
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.stroke();

  // Dashed inner ring
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Stamp text - Official wording
  ctx.textAlign = 'center';

  // Header
  ctx.font = '800 11px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('ПОДТВЕРЖДЕНО', 0, -42);

  // Center heraldic emblem
  ctx.font = '18px sans-serif';
  ctx.fillText('🏛️', 0, -18);

  // Body text lines
  ctx.font = '800 10.5px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText('ТЕХНОПАРКОМ «КВАНТУМ»', 0, 8);

  ctx.font = '700 9.5px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('Нефтегорского района', 0, 25);
  ctx.fillText('Самарской области', 0, 41);

  ctx.restore();

  // Date & Cert ID (Center-Left)
  ctx.save();
  ctx.textAlign = 'left';
  ctx.font = '600 15px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Дата выдачи: ${data.dateStr}`, 320, h - 170);
  ctx.fillText(`ID Сертификата: ${data.certId}`, 320, h - 142);
  ctx.font = '400 13px "Inter", "Segoe UI", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Документ сформирован автоматически в системе «Квантум Добра»', 320, h - 118);
  ctx.restore();

  ctx.restore();

  return canvas;
}

export function downloadCertificateImage(data: CertificateData) {
  const canvas = drawCertificateCanvas(data);
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const cleanName = (data.name || 'Participant').replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '_');
  link.download = `Certificate_Quantum_Dobra_${cleanName}.png`;
  link.href = image;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printCertificateWindow(data: CertificateData) {
  const canvas = drawCertificateCanvas(data);
  const image = canvas.toDataURL('image/png');
  const win = window.open('', '_blank');
  if (!win) {
    alert('Пожалуйста, разрешите всплывающие окна для печати сертификата.');
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Сертификат - ${data.name}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body { margin: 0; background: #000; display: flex; items-center: center; justify-content: center; min-height: 100vh; }
          img { width: 100vw; height: auto; max-height: 100vh; object-fit: contain; }
        </style>
      </head>
      <body onload="window.print();">
        <img src="${image}" />
      </body>
    </html>
  `);
  win.document.close();
}
