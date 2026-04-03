const GRADIENTS = [
  ['#FF6B00','#FF3B30'],
  ['#0A84FF','#BF5AF2'],
  ['#00C853','#0A84FF'],
  ['#FF9500','#FF6B00'],
  ['#BF5AF2','#FF2D55'],
  ['#32D74B','#00C853'],
  ['#FF2D55','#FF6B00'],
]

function gradientFor(name) {
  let h = 0
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return GRADIENTS[h % GRADIENTS.length]
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function Avatar({ name, size = 44 }) {
  const [c1, c2] = gradientFor(name)
  return (
    <div className="avatar" style={{
      width: size, height: size,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      fontSize: size * 0.36,
      boxShadow: `0 4px 12px ${c1}55`,
    }}>
      {initials(name)}
    </div>
  )
}
