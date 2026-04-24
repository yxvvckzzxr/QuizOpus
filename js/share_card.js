// share_card.js — SNS共有用の成績カード画像をCanvasで生成する

const ShareCard = (() => {
    const W = 1200, H = 630;

    // カラーパレット
    const C = {
        bg: '#f0f2f5',
        bgLine: '#d8dce3',
        accent: '#2563eb',
        accentLight: 'rgba(37,99,235,0.12)',
        dark: '#1a1f2e',
        darkSub: '#2a3040',
        white: '#ffffff',
        textMain: '#1e293b',
        textSub: '#64748b',
    };

    function drawBackground(ctx) {
        // ベース背景
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);

        // 斜線パターン（左上）
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 2;
        for (let i = -200; i < 300; i += 18) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + 200, 200);
            ctx.stroke();
        }
        // 斜線パターン（右下）
        for (let i = 900; i < 1400; i += 18) {
            ctx.beginPath();
            ctx.moveTo(i, 430);
            ctx.lineTo(i + 200, 630);
            ctx.stroke();
        }
        ctx.restore();

        // ドットパターン
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = C.dark;
        for (let x = 400; x < 900; x += 20) {
            for (let y = 200; y < 400; y += 20) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // サーキットライン（装飾的な水平・垂直線）
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 1;
        // 水平線
        ctx.beginPath(); ctx.moveTo(200, 320); ctx.lineTo(600, 320); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(700, 450); ctx.lineTo(1100, 450); ctx.stroke();
        // 垂直線
        ctx.beginPath(); ctx.moveTo(500, 200); ctx.lineTo(500, 500); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(850, 250); ctx.lineTo(850, 550); ctx.stroke();
        ctx.restore();

        // 太い青ライン（右上・左下）
        ctx.save();
        ctx.fillStyle = C.accent;
        // 右上
        ctx.beginPath();
        ctx.moveTo(W - 200, 0); ctx.lineTo(W, 0);
        ctx.lineTo(W, 60); ctx.lineTo(W - 140, 0);
        ctx.fill();
        // 左下
        ctx.beginPath();
        ctx.moveTo(0, H - 60); ctx.lineTo(60, H);
        ctx.lineTo(0, H);
        ctx.fill();
        ctx.restore();
    }

    function drawTitleBanner(ctx, projectName) {
        const bannerY = 30;
        const bannerH = 80;

        // 斜めバナー背景
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(80, bannerY);
        ctx.lineTo(W - 80, bannerY);
        ctx.lineTo(W - 120, bannerY + bannerH);
        ctx.lineTo(40, bannerY + bannerH);
        ctx.closePath();

        // グラデーション
        const grad = ctx.createLinearGradient(0, bannerY, W, bannerY);
        grad.addColorStop(0, C.dark);
        grad.addColorStop(1, C.darkSub);
        ctx.fillStyle = grad;
        ctx.fill();

        // 青いアクセントライン（上辺）
        ctx.strokeStyle = C.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, bannerY);
        ctx.lineTo(W - 80, bannerY);
        ctx.stroke();
        ctx.restore();

        // バナー左の青い三本線マーク
        ctx.save();
        ctx.fillStyle = C.accent;
        const lineX = 95;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(lineX + i * 8, bannerY + 25, 4, bannerH - 50);
        }
        ctx.restore();

        // テキスト（三本線の右に余白を確保）
        const centerX = W / 2 + 10;
        const textY = bannerY + bannerH / 2 + 2;

        const prefix = projectName;
        const suffix = ' に参加しました!!';

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 36px "Inter", "Noto Sans JP", sans-serif';

        const prefixW = ctx.measureText(prefix).width;
        const suffixW = ctx.measureText(suffix).width;
        const totalW = prefixW + suffixW;
        const startX = centerX - totalW / 2;

        // "CIQ the" 部分は白、数字部分は青で描画
        const match = prefix.match(/^(.+?the\s*)(\d+\w*)(.*)/i);
        if (match) {
            let x = startX;
            ctx.fillStyle = C.white;
            ctx.textAlign = 'left';
            ctx.fillText(match[1], x, textY);
            x += ctx.measureText(match[1]).width;

            ctx.fillStyle = C.accent;
            ctx.font = 'bold 42px "Inter", "Noto Sans JP", sans-serif';
            ctx.fillText(match[2], x, textY);
            x += ctx.measureText(match[2]).width;

            ctx.fillStyle = C.white;
            ctx.font = 'bold 36px "Inter", "Noto Sans JP", sans-serif';
            ctx.fillText(match[3] + suffix, x, textY);
        } else {
            ctx.fillStyle = C.white;
            ctx.textAlign = 'center';
            ctx.fillText(prefix + suffix, centerX, textY);
        }
        ctx.restore();
    }

    function drawCard(ctx, x, y, w, h, label, value, options = {}) {
        const headerH = 36;
        const cornerSize = 16;

        // カード本体（白）
        ctx.save();
        ctx.fillStyle = C.white;
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fillRect(x, y, w, h);
        ctx.restore();

        // ヘッダーバー
        ctx.save();
        const hGrad = ctx.createLinearGradient(x, y, x + w, y);
        hGrad.addColorStop(0, C.dark);
        hGrad.addColorStop(1, C.darkSub);
        ctx.fillStyle = hGrad;
        ctx.fillRect(x, y, w, headerH);

        // ヘッダーの青いアクセント四角
        ctx.fillStyle = C.accent;
        ctx.fillRect(x + 10, y + 8, 4, headerH - 16);

        // ヘッダーテキスト
        ctx.fillStyle = C.white;
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + 22, y + headerH / 2);
        ctx.restore();

        // コーナー装飾（右下）
        ctx.save();
        ctx.fillStyle = C.accent;
        ctx.beginPath();
        ctx.moveTo(x + w, y + h);
        ctx.lineTo(x + w - cornerSize, y + h);
        ctx.lineTo(x + w, y + h - cornerSize);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // コーナーライン（左下、右上）
        ctx.save();
        ctx.strokeStyle = C.bgLine;
        ctx.lineWidth = 1;
        // 左下
        ctx.beginPath();
        ctx.moveTo(x, y + h - 12);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + 12, y + h);
        ctx.stroke();
        // 右上
        ctx.beginPath();
        ctx.moveTo(x + w - 12, y);
        ctx.lineTo(x + w, y);
        ctx.stroke();
        ctx.restore();

        // 値テキスト
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const bodyCenter = y + headerH + (h - headerH) / 2;

        if (options.large) {
            ctx.font = `bold ${options.fontSize || 72}px "Inter", sans-serif`;
            ctx.fillStyle = C.textMain;
            ctx.fillText(value, x + w / 2, bodyCenter - (options.subValue ? 12 : 0));

            if (options.subValue) {
                ctx.font = '600 18px "Inter", "Noto Sans JP", sans-serif';
                ctx.fillStyle = C.textSub;
                ctx.fillText(options.subValue, x + w / 2, bodyCenter + 36);
            }
        } else {
            ctx.font = `bold ${options.fontSize || 48}px "Inter", sans-serif`;
            ctx.fillStyle = C.textMain;
            ctx.fillText(value, x + w / 2, bodyCenter);
        }
        ctx.restore();
    }

    async function generate({ projectName, rank, score, streaks = [] }) {
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // フォントロード確認
        try {
            await document.fonts.ready;
        } catch(e) {}

        // 背景
        drawBackground(ctx);

        // タイトルバナー
        drawTitleBanner(ctx, projectName || 'CIQ');

        // カードレイアウト
        const cardTop = 150;
        const cardGap = 24;
        const mainCardW = 340;
        const mainCardH = 340;
        const streakCardW = 260;
        const streakCardH = (mainCardH - cardGap) / 2;

        const totalW = mainCardW * 2 + streakCardW + cardGap * 2;
        const startX = (W - totalW) / 2;

        // RANK カード
        drawCard(ctx, startX, cardTop, mainCardW, mainCardH, 'RANK', rank || '-', {
            large: true,
            fontSize: rank && rank.length > 4 ? 56 : 72,
        });

        // SCORE カード
        const scoreStr = String(score ?? '-');
        drawCard(ctx, startX + mainCardW + cardGap, cardTop, mainCardW, mainCardH, 'SCORE', scoreStr, {
            large: true,
            fontSize: scoreStr.length > 4 ? 56 : 72,
            subValue: 'pts',
        });

        // STREAK 1 カード
        const s1 = streaks[0] ?? '-';
        drawCard(ctx, startX + (mainCardW + cardGap) * 2, cardTop, streakCardW, streakCardH, 'STREAK 1', String(s1), {
            fontSize: 42,
        });

        // STREAK 2 カード
        const s2 = streaks[1] ?? '-';
        drawCard(ctx, startX + (mainCardW + cardGap) * 2, cardTop + streakCardH + cardGap, streakCardW, streakCardH, 'STREAK 2', String(s2), {
            fontSize: 42,
        });

        // CIQ ウォーターマーク
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.font = 'bold 120px "Inter", sans-serif';
        ctx.fillStyle = C.dark;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('CIQ', W - 40, H - 20);
        ctx.restore();

        // PNGブロブを返す
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/png');
        });
    }

    return { generate };
})();
