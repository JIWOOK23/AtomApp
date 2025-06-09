import { World, RigidBody, RigidBodyDesc, ColliderDesc, Vector3 } from '@dimforge/rapier3d-compat'

declare const self: DedicatedWorkerGlobalScope
export type WorkerInitMessage = {
  type: 'init'
  particleCount: number
  radius: number
}
export type WorkerStepMessage = { type: 'step' }
export type WorkerMessage = WorkerInitMessage | WorkerStepMessage

export type WorkerUpdateMessage = {
  type: 'update'
  positions: Float32Array
}

let world: World | null = null
let bodies: RigidBody[] = []

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data
  if (msg.type === 'init') {
    world = new World({ x: 0, y: -9.81, z: 0 })
    bodies = []
    for (let i = 0; i < msg.particleCount; i++) {
      const bodyDesc = RigidBodyDesc.dynamic().setTranslation(
        (Math.random() - 0.5) * 5,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 5
      )
      const body = world.createRigidBody(bodyDesc)
      const collider = ColliderDesc.ball(msg.radius)
      world.createCollider(collider, body)
      bodies.push(body)
    }
  } else if (msg.type === 'step') {
    if (!world) return
    world.step()
    const positions = new Float32Array(bodies.length * 3)
    bodies.forEach((body, i) => {
      const t = body.translation()
      positions[i * 3] = t.x
      positions[i * 3 + 1] = t.y
      positions[i * 3 + 2] = t.z
    })
    const transfer = positions.buffer
    self.postMessage({ type: 'update', positions }, [transfer])
  }
}
