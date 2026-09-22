import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = (folder, name) => path.join(root, "design-input/marketing-originals", folder, name);
const generated = (folder, name) =>
  path.join(root, "design-input/marketing-generated", folder, name);
const output = (folder, name) => path.join(root, "public/images", folder, name);

const jobs = [
  // Keep the residential storage unit on the right in the portrait crops.
  [
    source("stromspeicher", "stromspeicher-sigenergy-source.jpg"),
    "battery-storage",
    "residential-storage-hero-desktop.webp",
    { left: 0, top: 0, width: 2560, height: 1536 },
    2000,
    1200,
  ],
  [
    source("stromspeicher", "stromspeicher-sigenergy-source.jpg"),
    "battery-storage",
    "residential-storage-hero-mobile.webp",
    { left: 1080, top: 500, width: 800, height: 1000 },
    800,
    1000,
  ],
  [
    source("stromspeicher", "stromspeicher-sigenergy-source.jpg"),
    "battery-storage",
    "residential-storage-feature-desktop.webp",
    { left: 370, top: 0, width: 2048, height: 1536 },
    1600,
    1200,
  ],
  [
    source("stromspeicher", "stromspeicher-sigenergy-source.jpg"),
    "battery-storage",
    "residential-storage-feature-mobile.webp",
    { left: 560, top: 0, width: 1229, height: 1536 },
    1200,
    1500,
  ],
  [
    source("stromspeicher", "stromspeicher-sigenergy-source.jpg"),
    "navigation",
    "residential-storage-mega.webp",
    { left: 390, top: 0, width: 1843, height: 1536 },
    1200,
    1000,
  ],
  [
    source("stromspeicher", "stromspeicher-funktionsweise-source.png"),
    "battery-storage",
    "residential-storage-function-desktop.webp",
    { left: 0, top: 0, width: 1719, height: 1289 },
    1600,
    1200,
  ],
  [
    source("stromspeicher", "stromspeicher-funktionsweise-source.png"),
    "battery-storage",
    "residential-storage-function-mobile.webp",
    { left: 210, top: 0, width: 1031, height: 1289 },
    1024,
    1280,
  ],
  [
    source("stromspeicher", "stromspeicher-ersatzstrom-source.jpg"),
    "battery-storage",
    "residential-storage-backup-desktop.webp",
    { left: 0, top: 0, width: 2048, height: 1536 },
    1600,
    1200,
  ],
  [
    source("stromspeicher", "stromspeicher-ersatzstrom-source.jpg"),
    "battery-storage",
    "residential-storage-backup-mobile.webp",
    { left: 370, top: 0, width: 1229, height: 1536 },
    1200,
    1500,
  ],

  [
    source("photovoltaik-unternehmen", "pv-unternehmen-desktop-source.jpg"),
    "commercial-photovoltaic",
    "commercial-photovoltaic-hero-desktop.webp",
    { left: 0, top: 91, width: 2000, height: 1250 },
    1600,
    1000,
    { flop: true },
  ],
  [
    source("photovoltaik-unternehmen", "pv-unternehmen-mobile-source.jpg"),
    "commercial-photovoltaic",
    "commercial-photovoltaic-hero-mobile.webp",
    { left: 0, top: 100, width: 812, height: 1015 },
    812,
    1015,
    { flop: true },
  ],
  [
    source("photovoltaik-unternehmen", "pv-unternehmen-desktop-source.jpg"),
    "navigation",
    "commercial-photovoltaic-mega.webp",
    { left: 280, top: 0, width: 1720, height: 1433 },
    1200,
    1000,
  ],

  [
    output("team", "company-service-hero-desktop.webp"),
    "jobs",
    "jobs-hero-desktop.webp",
    { left: 0, top: 0, width: 1800, height: 1039 },
    1800,
    1039,
    { flop: true },
  ],
  [
    output("team", "company-service-hero-mobile.webp"),
    "jobs",
    "jobs-hero-mobile.webp",
    { left: 0, top: 0, width: 1080, height: 1350 },
    1080,
    1350,
    { flop: true },
  ],
  [
    generated("jobs", "electrician-master.png"),
    "jobs",
    "job-electrician-desktop.webp",
    { left: 0, top: 32, width: 1536, height: 960 },
    1440,
    900,
  ],
  [
    generated("jobs", "electrician-master.png"),
    "jobs",
    "job-electrician-mobile.webp",
    { left: 130, top: 0, width: 819, height: 1024 },
    768,
    960,
  ],
  [
    generated("jobs", "rooftop-installer-master.png"),
    "jobs",
    "job-rooftop-installer-desktop.webp",
    { left: 0, top: 32, width: 1536, height: 960 },
    1440,
    900,
  ],
  [
    generated("jobs", "rooftop-installer-master.png"),
    "jobs",
    "job-rooftop-installer-mobile.webp",
    { left: 250, top: 0, width: 819, height: 1024 },
    768,
    960,
  ],
  [
    generated("jobs", "trainee-master.png"),
    "jobs",
    "job-trainee-desktop.webp",
    { left: 0, top: 32, width: 1536, height: 960 },
    1440,
    900,
  ],
  [
    generated("jobs", "trainee-master.png"),
    "jobs",
    "job-trainee-mobile.webp",
    { left: 150, top: 0, width: 819, height: 1024 },
    768,
    960,
  ],

  [
    source("wallbox", "wallbox-pv-laden-source.jpg"),
    "wallbox",
    "wallbox-pv-charging-desktop.webp",
    { left: 132, top: 0, width: 2296, height: 1435 },
    1600,
    1000,
  ],
  [
    source("wallbox", "wallbox-pv-laden-source.jpg"),
    "wallbox",
    "wallbox-pv-charging-mobile.webp",
    { left: 300, top: 0, width: 1148, height: 1435 },
    800,
    1000,
  ],
  [
    source("wallbox", "wallbox-lastmanagement-source.jpg"),
    "wallbox",
    "wallbox-load-management-desktop.webp",
    { left: 0, top: 25, width: 1200, height: 750 },
    1200,
    750,
  ],
  [
    source("wallbox", "wallbox-lastmanagement-source.jpg"),
    "wallbox",
    "wallbox-load-management-mobile.webp",
    { left: 260, top: 0, width: 640, height: 800 },
    640,
    800,
  ],

  [
    generated("waermepumpen", "heat-pump-pv-system-master.png"),
    "heat-pump",
    "heat-pump-pv-system-desktop.webp",
    { left: 0, top: 32, width: 1536, height: 960 },
    1440,
    900,
  ],
  [
    generated("waermepumpen", "heat-pump-pv-system-mobile-master.png"),
    "heat-pump",
    "heat-pump-pv-system-mobile.webp",
    { left: 1, top: 1, width: 1120, height: 1400 },
    768,
    960,
  ],
  [
    generated("waermepumpen", "heat-pump-energy-management-master.png"),
    "heat-pump",
    "heat-pump-energy-management-desktop.webp",
    { left: 0, top: 24, width: 1548, height: 968 },
    1440,
    900,
  ],
  [
    generated("waermepumpen", "heat-pump-energy-management-master.png"),
    "heat-pump",
    "heat-pump-energy-management-mobile.webp",
    { left: 0, top: 0, width: 813, height: 1016 },
    768,
    960,
  ],

  [
    generated("klimaanlagen", "climate-house-pv-master.png"),
    "climate",
    "climate-house-pv-desktop.webp",
    { left: 0, top: 30, width: 1539, height: 962 },
    1440,
    900,
  ],
  [
    generated("klimaanlagen", "climate-house-pv-master.png"),
    "climate",
    "climate-house-pv-mobile.webp",
    { left: 520, top: 0, width: 818, height: 1022 },
    768,
    960,
  ],
  [
    generated("klimaanlagen", "climate-outdoor-unit-master.png"),
    "climate",
    "climate-outdoor-unit-desktop.webp",
    { left: 0, top: 32, width: 1536, height: 960 },
    1440,
    900,
  ],
  [
    generated("klimaanlagen", "climate-outdoor-unit-master.png"),
    "climate",
    "climate-outdoor-unit-mobile.webp",
    { left: 520, top: 0, width: 819, height: 1024 },
    768,
    960,
  ],

  [
    generated("photovoltaik-unternehmen", "business-pv-system-master.png"),
    "commercial-photovoltaic",
    "commercial-photovoltaic-system-desktop.webp",
    { left: 0, top: 32, width: 1536, height: 960 },
    1440,
    900,
  ],
  [
    generated("photovoltaik-unternehmen", "business-pv-system-master.png"),
    "commercial-photovoltaic",
    "commercial-photovoltaic-system-mobile.webp",
    { left: 360, top: 0, width: 819, height: 1024 },
    768,
    960,
  ],

  // The supplied tariff panorama is short; crops retain native vertical detail.
  [
    source("stromtarife", "stromtarife-desktop-source.jpg"),
    "electricity-tariffs",
    "electricity-tariffs-hero-desktop.webp",
    { left: 610, top: 0, width: 1280, height: 800 },
    1280,
    800,
  ],
  [
    source("stromtarife", "stromtarife-desktop-source.jpg"),
    "electricity-tariffs",
    "electricity-tariffs-hero-mobile.webp",
    { left: 1070, top: 0, width: 640, height: 800 },
    640,
    800,
  ],
  [
    source("stromtarife", "stromtarife-desktop-source.jpg"),
    "navigation",
    "electricity-tariffs-mega.webp",
    { left: 810, top: 0, width: 960, height: 800 },
    960,
    800,
  ],

  [
    path.join(root, "design-input/marketing-generated/maintenance-inspection-master.png"),
    "service",
    "maintenance-cleaning-hero-desktop.webp",
    { left: 0, top: 0, width: 1505, height: 941 },
    1505,
    941,
  ],
  [
    path.join(root, "design-input/marketing-generated/maintenance-inspection-master.png"),
    "service",
    "maintenance-cleaning-hero-mobile.webp",
    { left: 910, top: 0, width: 752, height: 940 },
    752,
    940,
  ],
  [
    path.join(root, "design-input/marketing-generated/maintenance-inspection-master.png"),
    "navigation",
    "maintenance-cleaning-mega.webp",
    { left: 500, top: 0, width: 1129, height: 941 },
    1129,
    941,
  ],
];

for (const [input, folder, filename, crop, width, height, options] of jobs) {
  if (
    process.argv.includes("--storage-sections") &&
    !/^residential-storage-(function|backup)-/.test(filename)
  )
    continue;
  if (
    process.argv.includes("--post-sprint-9") &&
    !/^(commercial-photovoltaic-hero-|commercial-photovoltaic-system-|jobs-hero-|job-|wallbox-(pv-charging|load-management)-|heat-pump-(pv-system|energy-management)-|climate-(house-pv|outdoor-unit)-)/.test(
      filename,
    )
  )
    continue;
  const destination = output(folder, filename);
  await mkdir(path.dirname(destination), { recursive: true });
  let image = sharp(input).rotate().extract(crop);
  if (options?.flop) image = image.flop();
  await image.resize(width, height).webp({ quality: 84 }).toFile(destination);
  const metadata = await sharp(destination).metadata();
  const bytes = (await stat(destination)).size;
  console.log(
    `${path.relative(root, destination)} ${metadata.width}x${metadata.height} ${bytes} bytes`,
  );
}
