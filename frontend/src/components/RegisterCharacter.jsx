import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function RegisterCharacter(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF(
    '/models/free_character_bot_blast_r-325_by_oscar_creativo.glb'
  )
  const { actions } = useAnimations(animations, group)

  // Start the first animation when loaded
  useEffect(() => {
    if (actions && animations.length > 0) {
      const firstAnimName = animations[0].name
      actions[firstAnimName]?.reset().play()
    }
  }, [actions, animations])

  return (
    <group ref={group} {...props} dispose={null} position={[0, -1.6, 0]}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[1.576, 0, 0]} scale={1.619}>
          <group
            name="5a91cb409ca94bc7901af86e8d3d6bbffbx"
            rotation={[-Math.PI, 0, 0]}
            scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Object_4">
                  <primitive object={nodes._rootJoint} />
                  <skinnedMesh
                    name="Object_7"
                    geometry={nodes.Object_7.geometry}
                    material={materials.BOT_BLAST_1002}
                    skeleton={nodes.Object_7.skeleton}
                    morphTargetDictionary={nodes.Object_7.morphTargetDictionary}
                    morphTargetInfluences={nodes.Object_7.morphTargetInfluences}
                  />
                  <skinnedMesh
                    name="Object_9"
                    geometry={nodes.Object_9.geometry}
                    material={materials.BOT_BLAST_1005}
                    skeleton={nodes.Object_9.skeleton}
                    morphTargetDictionary={nodes.Object_9.morphTargetDictionary}
                    morphTargetInfluences={nodes.Object_9.morphTargetInfluences}
                  />
                  <skinnedMesh
                    name="Object_11"
                    geometry={nodes.Object_11.geometry}
                    material={materials.BOT_BLAST_1006}
                    skeleton={nodes.Object_11.skeleton}
                    morphTargetDictionary={nodes.Object_11.morphTargetDictionary}
                    morphTargetInfluences={nodes.Object_11.morphTargetInfluences}
                  />
                  <skinnedMesh
                    name="Object_13"
                    geometry={nodes.Object_13.geometry}
                    material={materials.BOT_BLAST_1004}
                    skeleton={nodes.Object_13.skeleton}
                    morphTargetDictionary={nodes.Object_13.morphTargetDictionary}
                    morphTargetInfluences={nodes.Object_13.morphTargetInfluences}
                  />
                  <skinnedMesh
                    name="Object_15"
                    geometry={nodes.Object_15.geometry}
                    material={materials.BOT_BLAST_1003}
                    skeleton={nodes.Object_15.skeleton}
                    morphTargetDictionary={nodes.Object_15.morphTargetDictionary}
                    morphTargetInfluences={nodes.Object_15.morphTargetInfluences}
                  />
                  <skinnedMesh
                    name="Object_17"
                    geometry={nodes.Object_17.geometry}
                    material={materials.BOT_BLAST_1001}
                    skeleton={nodes.Object_17.skeleton}
                    morphTargetDictionary={nodes.Object_17.morphTargetDictionary}
                    morphTargetInfluences={nodes.Object_17.morphTargetInfluences}
                  />
                  <group name="Object_6" />
                  <group name="Object_8" />
                  <group name="Object_10" />
                  <group name="Object_12" />
                  <group name="Object_14" />
                  <group name="Object_16" />
                  <group name="BOT_BLAST_R_325_6" />
                  <group name="BOT_BLAST_R_325_7" />
                  <group name="BOT_BLAST_R_325_8" />
                  <group name="BOT_BLAST_R_325_9" />
                  <group name="BOT_BLAST_R_325_10" />
                  <group name="BOT_BLAST_R_325_11" />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/free_character_bot_blast_r-325_by_oscar_creativo.glb')
