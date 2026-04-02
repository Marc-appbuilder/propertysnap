#!/usr/bin/env python3
"""Generate placeholder PWA icons: gold background with white 'P'."""
import struct, zlib, pathlib

GOLD  = (201, 168, 76)
WHITE = (255, 255, 255)

# Bold 5-wide × 7-tall pixel 'P' (1 = white pixel)
P = [
    [1,1,1,1,0],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
]
P_W, P_H = 5, 7

def make_png(size: int) -> bytes:
    pixels = [GOLD] * (size * size)

    scale = size // 8                        # stroke thickness
    draw_w, draw_h = P_W * scale, P_H * scale
    ox = (size - draw_w) // 2
    oy = (size - draw_h) // 2

    for row in range(P_H):
        for col in range(P_W):
            if P[row][col]:
                for dy in range(scale):
                    for dx in range(scale):
                        px, py = ox + col * scale + dx, oy + row * scale + dy
                        if 0 <= px < size and 0 <= py < size:
                            pixels[py * size + px] = WHITE

    # Build raw scanlines (filter byte 0 = None, then RGB triples)
    raw = bytearray()
    for y in range(size):
        raw += b'\x00'
        for x in range(size):
            raw += bytes(pixels[y * size + x])

    def png_chunk(tag: bytes, data: bytes) -> bytes:
        payload = tag + data
        return (struct.pack('>I', len(data)) + payload +
                struct.pack('>I', zlib.crc32(payload) & 0xffffffff))

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)  # RGB, 8-bit

    return (
        b'\x89PNG\r\n\x1a\n' +
        png_chunk(b'IHDR', ihdr) +
        png_chunk(b'IDAT', zlib.compress(bytes(raw), 9)) +
        png_chunk(b'IEND', b'')
    )

out = pathlib.Path(__file__).parent.parent / 'public'
out.mkdir(exist_ok=True)

for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png')]:
    (out / name).write_bytes(make_png(size))
    print(f'  Created {name} ({size}×{size})')
