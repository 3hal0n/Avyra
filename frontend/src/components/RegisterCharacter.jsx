import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function RegisterCharacter(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/free_character_-_ancient_6.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Play the first available animation on mount
    if (actions && animations.length > 0) {
      const firstAnimationName = animations[0].name
      actions[firstAnimationName]?.play()
    }
  }, [actions, animations])

  return (
    <group ref={group} {...props} dispose={null} position={[0, -1.5, 0]}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="16b9372c8df846fe9e58bd6ee826dbeafbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Armature" rotation={[-Math.PI / 2, 0, 0]}>
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                      name="Object_150"
                      geometry={nodes.Object_150.geometry}
                      material={materials['Chest2.001']}
                      skeleton={nodes.Object_150.skeleton}
                      morphTargetDictionary={nodes.Object_150.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_150.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_152"
                      geometry={nodes.Object_152.geometry}
                      material={materials['Arm1.001']}
                      skeleton={nodes.Object_152.skeleton}
                      morphTargetDictionary={nodes.Object_152.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_152.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_154"
                      geometry={nodes.Object_154.geometry}
                      material={materials['shoes.001']}
                      skeleton={nodes.Object_154.skeleton}
                      morphTargetDictionary={nodes.Object_154.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_154.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_156"
                      geometry={nodes.Object_156.geometry}
                      material={materials['Leg1.001']}
                      skeleton={nodes.Object_156.skeleton}
                      morphTargetDictionary={nodes.Object_156.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_156.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_158"
                      geometry={nodes.Object_158.geometry}
                      material={materials['Mask.001']}
                      skeleton={nodes.Object_158.skeleton}
                      morphTargetDictionary={nodes.Object_158.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_158.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_160"
                      geometry={nodes.Object_160.geometry}
                      material={materials['Cloak.001']}
                      skeleton={nodes.Object_160.skeleton}
                      morphTargetDictionary={nodes.Object_160.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_160.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_162"
                      geometry={nodes.Object_162.geometry}
                      material={materials['ChestPart2.001']}
                      skeleton={nodes.Object_162.skeleton}
                      morphTargetDictionary={nodes.Object_162.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_162.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_164"
                      geometry={nodes.Object_164.geometry}
                      material={materials['HeadPart.001']}
                      skeleton={nodes.Object_164.skeleton}
                      morphTargetDictionary={nodes.Object_164.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_164.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_166"
                      geometry={nodes.Object_166.geometry}
                      material={materials['Arm2.001']}
                      skeleton={nodes.Object_166.skeleton}
                      morphTargetDictionary={nodes.Object_166.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_166.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_168"
                      geometry={nodes.Object_168.geometry}
                      material={materials['Chest2_copy1.001']}
                      skeleton={nodes.Object_168.skeleton}
                      morphTargetDictionary={nodes.Object_168.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_168.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_170"
                      geometry={nodes.Object_170.geometry}
                      material={materials['Part3.001']}
                      skeleton={nodes.Object_170.skeleton}
                      morphTargetDictionary={nodes.Object_170.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_170.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_172"
                      geometry={nodes.Object_172.geometry}
                      material={materials['Cloak2.001']}
                      skeleton={nodes.Object_172.skeleton}
                      morphTargetDictionary={nodes.Object_172.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_172.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_174"
                      geometry={nodes.Object_174.geometry}
                      material={materials['Leg2.001']}
                      skeleton={nodes.Object_174.skeleton}
                      morphTargetDictionary={nodes.Object_174.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_174.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_176"
                      geometry={nodes.Object_176.geometry}
                      material={materials['ChestParts.001']}
                      skeleton={nodes.Object_176.skeleton}
                      morphTargetDictionary={nodes.Object_176.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_176.morphTargetInfluences}
                    />
                    <skinnedMesh
                      name="Object_178"
                      geometry={nodes.Object_178.geometry}
                      material={materials['Helmet.001']}
                      skeleton={nodes.Object_178.skeleton}
                      morphTargetDictionary={nodes.Object_178.morphTargetDictionary}
                      morphTargetInfluences={nodes.Object_178.morphTargetInfluences}
                    />
                    {/* ...other group nodes as in your original code... */}
                  </group>
                </group>
                {/* ...additional group nodes... */}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/free_character_-_ancient_6.glb')
