document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.createElement("canvas");
  canvas.id = "cursor-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;";
  document.body.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var smoothMouse = { x: mouse.x, y: mouse.y };
  var nodes = [];
  var nodeCount = 90;
  var connectDist = 160;
  var cursorDist = 200;
  var accentHue = 180;
  var lerpSpeed = 0.03;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Create floating nodes
  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth follow cursor
    smoothMouse.x += (mouse.x - smoothMouse.x) * lerpSpeed;
    smoothMouse.y += (mouse.y - smoothMouse.y) * lerpSpeed;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      // Slow drift
      n.x += n.vx;
      n.y += n.vy;

      // Bounce off edges
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

      // Repel from smooth cursor
      var dxMouse = n.x - smoothMouse.x;
      var dyMouse = n.y - smoothMouse.y;
      var distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distMouse < cursorDist && distMouse > 0) {
        var force = (1 - distMouse / cursorDist) * 0.008;
        n.vx += dxMouse * force;
        n.vy += dyMouse * force;
      }

      // Clamp speed
      var speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > 0.6) {
        n.vx = (n.vx / speed) * 0.6;
        n.vy = (n.vy / speed) * 0.6;
      }

      // Draw node
      var alpha = distMouse < cursorDist ? 0.25 + (1 - distMouse / cursorDist) * 0.3 : 0.15;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(" + accentHue + ", 80%, 55%, " + alpha + ")";
      ctx.fill();

      // Connect nearby nodes
      for (var j = i + 1; j < nodes.length; j++) {
        var n2 = nodes[j];
        var dx = n.x - n2.x;
        var dy = n.y - n2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectDist) {
          var lineAlpha = (1 - dist / connectDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = "hsla(" + accentHue + ", 80%, 55%, " + lineAlpha + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
