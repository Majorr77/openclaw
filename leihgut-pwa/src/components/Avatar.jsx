const COLORS = ['#ff6b00','#007aff','#34c759','#ff2d55','#af52de','#ff9500','#5ac8fa']

function colorFor(name) {
  let h = 0; for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return COLORS[h % COLORS.length]
}

function initials(name) {
  return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
}

export default function Avatar({ name, size = 40 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.38 }}>
      {initials(name)}
    </div>
  )
}
