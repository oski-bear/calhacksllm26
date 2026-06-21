import { useEffect, useRef } from 'react'
import '../../assets/design_handoff_shader_wallpapers/shaders.js'        // window.PD_SHADERS
import '../../assets/design_handoff_shader_wallpapers/webgl-wallpaper.js' // window.PDWallpaper

/**
 * PaperWallpaper — mounts one of the Paperdoodle WebGL shader wallpapers as a
 * fixed, full-viewport background behind the page. A translucent paper scrim
 * softens it so content stays readable; page content should sit in normal flow
 * above it (these layers are fixed at z-index -1).
 *
 * props.shader: 'topo' | 'hilite' | 'grid' | 'ink' | 'scrib'
 * props.scrim:  0..1 paper overlay opacity (default 0.55)
 */
export default function PaperWallpaper({ shader = 'topo', scrim = 0.55 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const Engine = window.PDWallpaper
    const shaders = window.PD_SHADERS
    if (!canvas || !Engine || !shaders) return

    // Everything WebGL-related is wrapped: if the context or shader fails
    // (e.g. headless/blocked WebGL), we degrade to just the paper scrim
    // instead of crashing the page.
    let engine
    let onMove
    let onDown
    try {
      engine = new Engine(canvas)
      const def = shaders.find((s) => s.id === shader) || shaders[0]
      engine.setShader(def)

      onMove = (e) => engine.pointer(e.clientX, e.clientY)
      onDown = (e) => {
        if (e.target && e.target.closest && e.target.closest('.pd-no-doodle')) return
        engine.click(e.clientX, e.clientY)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerdown', onDown)
    } catch {
      try { engine?.stop?.() } catch { /* ignore */ }
      // No (working) WebGL — hide the canvas so no broken-canvas glyph shows;
      // the paper scrim alone remains as the background.
      canvas.style.display = 'none'
      return
    }

    return () => {
      if (onMove) window.removeEventListener('pointermove', onMove)
      if (onDown) window.removeEventListener('pointerdown', onDown)
      try { engine.stop?.() } catch { /* ignore */ }
    }
  }, [shader])

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          touchAction: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: `rgba(251, 246, 233, ${scrim})`, // --paper-100 scrim
        }}
      />
    </>
  )
}
