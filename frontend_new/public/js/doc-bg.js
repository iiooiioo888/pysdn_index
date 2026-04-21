/**
 * Same canvas background as main app (useCanvasBackground), for static doc pages.
 */
;(function () {
  function init() {
    var canvas = document.getElementById('bgCanvas')
    if (!canvas || !canvas.getContext) return
    var ctx = canvas.getContext('2d')
    if (!ctx) return

    var animId = 0
    var particles = []
    var orbs = []
    var lightning = []
    var frame = 0
    var mouse = { x: -9999, y: -9999 }
    var isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

    function createParticles(w, h) {
      var divisor = isMobile ? 16000 : 8000
      var maxCount = isMobile ? 120 : 250
      var count = Math.min(Math.floor((w * h) / divisor), maxCount)
      particles = []
      for (var i = 0; i < count; i++) {
        var isAccent = Math.random() > 0.7
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 0.4,
          hue: isAccent ? 270 : 190,
          alpha: Math.random() * 0.4 + 0.2,
          pulse: Math.random() * Math.PI * 2,
        })
      }
    }

    function createOrbs(w, h) {
      orbs = []
      var count = Math.min(5, Math.floor(w / 400))
      for (var i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 200 + 100,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          hue: Math.random() > 0.5 ? 190 : 270,
        })
      }
    }

    function generateBolt(sx, sy, ex, ey) {
      var points = []
      var steps = 6
      for (var i = 0; i <= steps; i++) {
        var t = i / steps
        var x = sx + (ex - sx) * t
        var y = sy + (ey - sy) * t
        if (i > 0 && i < steps) {
          x += (Math.random() - 0.5) * 50
          y += (Math.random() - 0.5) * 20
        }
        points.push(x, y)
      }
      var branches = []
      if (Math.random() < 0.5) {
        var mi = Math.floor(steps / 2) * 2
        var bx = points[mi] + (Math.random() - 0.5) * 80
        var by = points[mi + 1] + 30 + Math.random() * 50
        var bpts = []
        for (var j = 0; j <= 3; j++) {
          var t2 = j / 3
          bpts.push(
            points[mi] + (bx - points[mi]) * t2 + (Math.random() - 0.5) * 15,
            points[mi + 1] + (by - points[mi + 1]) * t2
          )
        }
        branches.push(bpts)
      }
      return { points: points, branches: branches, life: 6, maxLife: 6, hue: Math.random() > 0.5 ? 190 : 270 }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2)
      var w = window.innerWidth
      var h = window.innerHeight
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles(w, h)
      createOrbs(w, h)
    }

    function draw() {
      var w = window.innerWidth
      var h = window.innerHeight
      ctx.clearRect(0, 0, w, h)
      frame++

      var horizon = h * 0.45
      var gridLines = isMobile ? 15 : 30
      var vertLines = isMobile ? 10 : 20
      var scrollOffset = (frame * 0.3) % (h / gridLines)
      ctx.save()
      ctx.globalAlpha = 0.035
      var i, j, y, spread, baseX
      for (i = 0; i < gridLines; i++) {
        var rawY = horizon + (i * (h - horizon)) / gridLines + scrollOffset
        y = horizon + ((rawY - horizon) % (h - horizon))
        spread = (y - horizon) / (h - horizon)
        ctx.strokeStyle = spread > 0.5 ? 'rgba(139,92,246,' + spread * 0.5 + ')' : 'rgba(6,182,212,' + spread * 0.5 + ')'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      var vanishX = w / 2
      for (i = -vertLines; i <= vertLines; i++) {
        baseX = vanishX + i * (w / vertLines)
        ctx.strokeStyle = 'rgba(6,182,212,0.03)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(vanishX, horizon)
        ctx.lineTo(baseX, h)
        ctx.stroke()
      }
      ctx.restore()

      for (i = 0; i < orbs.length; i++) {
        var orb = orbs[i]
        orb.x += orb.vx
        orb.y += orb.vy
        if (orb.x < -orb.r) orb.x = w + orb.r
        if (orb.x > w + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = h + orb.r
        if (orb.y > h + orb.r) orb.y = -orb.r
        var grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r)
        if (orb.hue === 190) {
          grad.addColorStop(0, 'rgba(6,182,212,0.06)')
          grad.addColorStop(0.5, 'rgba(6,182,212,0.02)')
        } else {
          grad.addColorStop(0, 'rgba(139,92,246,0.06)')
          grad.addColorStop(0.5, 'rgba(139,92,246,0.02)')
        }
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      var lightningInterval = isMobile ? 300 : 180
      if (frame % lightningInterval === 0 && lightning.length < (isMobile ? 1 : 2)) {
        var sx = Math.random() * w * 0.7 + w * 0.15
        var sy = Math.random() * h * 0.1
        var ex = sx + (Math.random() - 0.5) * 250
        var ey = h * (0.35 + Math.random() * 0.4)
        lightning.push(generateBolt(sx, sy, ex, ey))
      }
      for (i = lightning.length - 1; i >= 0; i--) {
        var b = lightning[i]
        b.life--
        if (b.life <= 0) {
          lightning.splice(i, 1)
          continue
        }
        var a = b.life / b.maxLife
        var pts = b.points
        ctx.beginPath()
        ctx.moveTo(pts[0], pts[1])
        for (j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1])
        ctx.strokeStyle = 'hsla(' + b.hue + ',80%,60%,' + a * 0.15 + ')'
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(pts[0], pts[1])
        for (j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1])
        ctx.strokeStyle = 'hsla(' + b.hue + ',90%,75%,' + a * 0.7 + ')'
        ctx.lineWidth = 1.5
        ctx.stroke()
        for (var bi = 0; bi < b.branches.length; bi++) {
          var br = b.branches[bi]
          ctx.beginPath()
          ctx.moveTo(br[0], br[1])
          for (j = 2; j < br.length; j += 2) ctx.lineTo(br[j], br[j + 1])
          ctx.strokeStyle = 'hsla(' + b.hue + ',80%,60%,' + a * 0.1 + ')'
          ctx.lineWidth = 5
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(br[0], br[1])
          for (j = 2; j < br.length; j += 2) ctx.lineTo(br[j], br[j + 1])
          ctx.strokeStyle = 'hsla(' + b.hue + ',90%,75%,' + a * 0.5 + ')'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      var maxDist = 160
      var maxDistSq = maxDist * maxDist
      var cellSize = maxDist
      var grid
      var p
      for (i = 0; i < particles.length; i++) {
        p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        var glow = 0.5 + Math.sin(p.pulse) * 0.3
        var r = p.r * (1 + Math.sin(p.pulse) * 0.3)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = 'hsla(' + p.hue + ', 90%, 65%, ' + p.alpha * glow + ')'
        ctx.fill()
        if (!isMobile && p.r > 1.2) {
          var halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
          halo.addColorStop(0, 'hsla(' + p.hue + ', 90%, 65%, ' + 0.12 * glow + ')')
          halo.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
          ctx.fillStyle = halo
          ctx.fill()
        }
      }

      grid = new Map()
      for (i = 0; i < particles.length; i++) {
        p = particles[i]
        var cx = Math.floor(p.x / cellSize)
        var cy = Math.floor(p.y / cellSize)
        var k = cx + ',' + cy
        if (!grid.has(k)) grid.set(k, [])
        grid.get(k).push(i)
      }

      ctx.lineWidth = 0.5
      ctx.lineCap = 'round'
      grid.forEach(function (indices, k) {
        var parts = k.split(',')
        var gcx = Number(parts[0])
        var gcy = Number(parts[1])
        for (var dcx = -1; dcx <= 1; dcx++) {
          for (var dcy = -1; dcy <= 1; dcy++) {
            var others = grid.get(gcx + dcx + ',' + (gcy + dcy))
            if (!others) continue
            for (var ii = 0; ii < indices.length; ii++) {
              var pi = particles[indices[ii]]
              for (var jj = 0; jj < others.length; jj++) {
                if (others[jj] <= indices[ii]) continue
                var pj = particles[others[jj]]
                var dx = pi.x - pj.x
                var dy = pi.y - pj.y
                var distSq = dx * dx + dy * dy
                if (distSq < maxDistSq) {
                  var dist = Math.sqrt(distSq)
                  var alpha = 0.06 * (1 - dist / maxDist)
                  var mixedHue = (pi.hue + pj.hue) / 2
                  ctx.beginPath()
                  ctx.moveTo(pi.x, pi.y)
                  ctx.lineTo(pj.x, pj.y)
                  ctx.strokeStyle = 'hsla(' + mixedHue + ', 80%, 60%, ' + alpha + ')'
                  ctx.stroke()
                }
              }
            }
          }
        }
      })

      var mouseRadiusSq = 180 * 180
      for (i = 0; i < particles.length; i++) {
        p = particles[i]
        var mdx = p.x - mouse.x
        var mdy = p.y - mouse.y
        var mDistSq = mdx * mdx + mdy * mdy
        if (mDistSq < mouseRadiusSq) {
          var force = 1 - mDistSq / mouseRadiusSq
          p.vx += mdx * force * 0.0003
          p.vy += mdy * force * 0.0003
        }
        p.vx *= 0.999
        p.vy *= 0.999
      }

      if (mouse.x > 0 && mouse.y > 0) {
        var mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120)
        mouseGlow.addColorStop(0, 'rgba(139, 92, 246, 0.04)')
        mouseGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.02)')
        mouseGlow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2)
        ctx.fillStyle = mouseGlow
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMouseMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(animId)
      } else {
        animId = requestAnimationFrame(draw)
      }
    }

    resize()
    animId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return function cleanup() {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
