import { EcgCanvasOptions } from '@/config/ecg.config';

/**
 * @description 将ArrayBuffer转换为对应的十六进制字符串
 * @param ab ArrayBuffer对象
 * @returns 十六进制字符串
 */
export function ab2hex(ab: any[]): string {
  // 根据 bits 参数选择合适的视图类型
  // const byteArray = (bits === 16) ? new Uint16Array(ab) : new Uint8Array(ab);
  const byteArray = new Uint8Array(ab);
  const hexParts: string[] = [];

  // 将每个字节转换为十六进制字符串并拼接
  for (let i = 0; i < byteArray.length; i++) {
    let hex = byteArray[i].toString(16);
    if (hex.length < 2) {
      hex = `0${hex}`; // 确保十六进制字符串始终是两位
    }
    hexParts.push(hex);
  }

  // 返回拼接好的十六进制字符串
  return hexParts.join('');
}

// 心电图波形的绘制
export class HeartChart {
  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private iCanvasHeight: number; // 分成6份,一份的高度
  private lineIHeight: number; // I 起始的高度
  private lineIIHeight: number; // II 起始的高度
  private lineIIIHeight: number; // III 起始的高度
  private lastX: number = 0;
  private lastY: number[] = [0, 0, 0]; // 分别保存三条线的最后Y值
  private jumpDistance: number;
  private clearWidth: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, oneScreenPoint: number = 400) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.iCanvasHeight = (height - 20) / 6;

    this.lineIHeight = this.iCanvasHeight + 30;
    this.lineIIHeight = this.iCanvasHeight * 3 + 30;
    this.lineIIIHeight = this.iCanvasHeight * 5 + 30;
    this.jumpDistance = width / oneScreenPoint;

    this.ctx.strokeStyle = EcgCanvasOptions.ECG_LINE_COLOR;
    this.ctx.lineWidth = EcgCanvasOptions.ECG_LINE_WIDTH;
    this.ctx.lineCap = 'square';

    this.clearWidth = this.width / 15;

    this.lastY[0] = this.lineIHeight;
    this.lastY[1] = this.lineIIHeight;
    this.lastY[2] = this.lineIIIHeight;
  }

  update(dataI: number[], dataII: number[], dataIII: number[]) {
    if (!dataI || !dataII || !dataIII)
      return;

    this.lastX += this.jumpDistance;

    for (let i = 0; i < 4; i++) {
      this.drawEcgLine(this.helper(dataI[i]), 0);
      this.drawEcgLine(this.helper(dataII[i]), 1);
      this.drawEcgLine(this.helper(dataIII[i]), 2);
    }

    if (this.lastX > this.width) {
      this.lastX = 0;
    }
  }

  private helper(n: number) {
    const v = Math.trunc(n);
    return Math.abs(v) < 10 ? 0 : v >> 4;
  }

  private drawEcgLine(point: number = 0, lineIndex: number) {
    const baseHeight = [this.lineIHeight, this.lineIIHeight, this.lineIIIHeight];

    const currentY = baseHeight[lineIndex] - point;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX - this.jumpDistance, this.lastY[lineIndex]);
    this.ctx.lineTo(this.lastX, currentY);
    this.ctx.stroke();

    this.lastY[lineIndex] = currentY;

    if (lineIndex === 0) {
      if (this.lastX < 2) {
        this.ctx.clearRect(0, 0, this.clearWidth, this.height);
      }
      else {
        this.ctx.clearRect(this.lastX, 0, this.clearWidth, this.height);
      }
    }
  }
}
