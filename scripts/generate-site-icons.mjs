import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Preserve the official artwork and colors; only expand its viewport for padding.
const source = await readFile("public/brand/energie-kraft/eksued-signet-website.svg", "utf8");
const svg = source
  .replace('width="52.98" height="51.63"', 'width="64" height="64"')
  .replace('viewBox="0 0 52.98 51.63"', 'viewBox="-5.51 -6.185 64 64"');
await writeFile("src/app/icon.svg", svg);
await sharp(Buffer.from(svg))
  .resize(180, 180)
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("src/app/apple-icon.png");

const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2); // ICO
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...images]));
