import { readFileSync, writeFileSync } from "fs";
const buffer = readFileSync(
  "C:/projects/pdf-service/assets/tutmanUltras.png",
).toString("base64");

writeFileSync("C:/projects/pdf-service/assets/tutmanUltrasBase64.txt", buffer);
