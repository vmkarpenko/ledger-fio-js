import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

import { Fio, HARDENED } from "../src/fio";

const getVersion = async (appFio: Fio) => {
  console.log("getVersion");
  console.log(await appFio.getVersion());
  console.log("-".repeat(40));
}

const getSerial = async (appFio: Fio) => {
  console.log("getSerial");
  console.log(await appFio.getSerial());
  console.log("-".repeat(40));
}

const getExtendedPublicKey = async (appFio: Fio) => {
  console.log("getPublicKey");
  console.log(
    await appFio.getPublicKey({path: [
        HARDENED + 44,
        HARDENED + 235,
        HARDENED + 0,
        0,
        0,
    ]})
  );
  console.log("-".repeat(40));
}


async function example() {
  console.log("Running FIO examples");
  const transport = await TransportNodeHid.create(5000)
  // transport.setDebugMode(true)
  const appFio = new Fio(transport);

  await getVersion(appFio);
  await getSerial(appFio);
  await getExtendedPublicKey(appFio);
}

example()
