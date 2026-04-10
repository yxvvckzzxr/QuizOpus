const { jsPDF } = require("jspdf"); // I need to install jspdf
const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
const cx = 35, cy = 200, bubbleW = 6, bubbleH = 5;
doc.ellipse(cx + bubbleW/2, cy + bubbleH/2, bubbleW/2, bubbleH/2);
doc.save("test.pdf");
