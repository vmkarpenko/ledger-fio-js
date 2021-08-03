import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

import { Fio, HARDENED } from "../src/fio";

const getVersion0 = async (appFio: Fio) => {
  console.log("getVersion");
  console.log(await appFio.getVersion());
  console.log("-".repeat(40));
}

const getSerial0 = async (appFio: Fio) => {
  console.log("getSerial");
  console.log(await appFio.getSerial());
  console.log("-".repeat(40));
}

const getExtendedPublicKey0 = async (appFio: Fio) => {
  console.log("getExtendedPublicKey");
  console.log(
    await appFio.getExtendedPublicKey({
      path: [
        HARDENED + 44,
        HARDENED + 235,
        HARDENED + 0,
      ]
    })
  );
  /*
    {
      publicKeyHex: '09353fce36f0b6eb8b8042d94289387af815dc2e31f6455cc0272adcb784358f',
      chainCodeHex: '7fec2640ed66eb3f6170ddef57a934298ad87cbeb233df243da1ecd9bd506762'
    }
  */
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

  console.log("Step2b");
  await getSerial0(appFio);
  console.log("Step3b");

  console.log("Step2c");
  await getExtendedPublicKey0(appFio);
  console.log("Step3c");
}

example();
console.log("Step4");
