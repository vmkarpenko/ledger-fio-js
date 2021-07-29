import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

import { Fio } from "../src/fio";

const getVersion0 = async (appFio: Fio) => {
  console.log("getVersion");
  console.log(await appFio.getVersion());
  console.log("-".repeat(40));
}



async function example() {
  console.log("Running FIO examples");
  const transport = await TransportNodeHid.create(5000);
  // transport.setDebugMode(true);
  console.log("Step1");
  const appFio = new Fio(transport);

  console.log("Step2");
  await getVersion0(appFio);
  console.log("Step3");
}

example();
console.log("Step4");
