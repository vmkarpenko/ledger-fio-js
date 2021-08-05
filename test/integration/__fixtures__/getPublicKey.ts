export type TestCase = {
  path: string,
  expected: { publicKey: string}
}

export const testsFio: TestCase[] = [
    {
        path: "44'/235'/0'/0/0'",
        expected: {
            publicKey:
        "3471530a6b2ce7af0f78a3c063b99401ed8542132a8ad2fedfdea53c4a1eed3c",
        },
    },
]
