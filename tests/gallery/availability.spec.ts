import { it } from "node:test"
import assert from "node:assert/strict"
import { checkRegistryAvailability } from "../../lib/registry/availability"
it("only offers installation for a valid published manifest", async () => {
  const original = globalThis.fetch
  try {
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          name: "published-test",
          files: [{ content: "source" }],
        }),
        { status: 200 }
      )
    assert.equal(await checkRegistryAvailability("published-test"), "ready")
    globalThis.fetch = async () => new Response("{}", { status: 404 })
    assert.equal(
      await checkRegistryAvailability("unpublished-test"),
      "unpublished"
    )
    globalThis.fetch = async () => new Response("{}", { status: 200 })
    assert.equal(await checkRegistryAvailability("invalid-test"), "unavailable")
    globalThis.fetch = async () => {
      throw new Error("Offline")
    }
    assert.equal(await checkRegistryAvailability("offline-test"), "unavailable")
  } finally {
    globalThis.fetch = original
  }
})
