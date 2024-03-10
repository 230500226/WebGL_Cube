# WebGL_Cube and matrix rotation

# Rotation Formulas

## Rotation around the Z-axis (Yaw)

The new coordinates `(x', y', z')` after rotation are given by:

- `x' = cos(θ) * x - sin(θ) * y`
- `y' = sin(θ) * x + cos(θ) * y`
- `z' = z`

## Rotation around the X-axis (Pitch)

The new coordinates `(x', y', z')` after rotation are given by:

- `x' = x`
- `y' = cos(θ) * y - sin(θ) * z`
- `z' = sin(θ) * y + cos(θ) * z`

## Rotation around the Y-axis (Roll)

The new coordinates `(x', y', z')` after rotation are given by:

- `x' = cos(θ) * x + sin(θ) * z`
- `y' = y`
- `z' = -sin(θ) * x + cos(θ) * z`
